#!/usr/bin/env python3
"""Build a preview of every open pull request into <out_dir>/pr-<number>/.

Run by the deploy workflow from the default branch's checkout, after the live
site is ready. The deploy replaces the whole site, so every run rebuilds every
open preview, and a closed PR's preview disappears on the next deploy.

The PR's files are only copied out of git and lightly rewritten; nothing from
the PR is ever executed. Pull requests from forks are never previewed: the
previews are served from the live site's origin, so a fork's code could read
and change visitors' data there.

Each preview is adjusted so it can't affect the live site in the same browser:
- localStorage keys get a `preview-pr-<n>:` prefix (shim injected into each page)
- the service worker's caches get their own prefix
- the web app manifest gets its own id and name
- every page is marked noindex

Usage:
    build_previews.py <out_dir>

Open PRs are listed with `gh pr list` (needs GH_TOKEN and GITHUB_REPOSITORY).
For local testing, set PREVIEW_PRS_JSON to a file holding the same JSON.

Exits 0 even when previews fail, so a broken preview never blocks the live
deploy; failures are listed on the index page.
"""

import datetime
import html
import io
import json
import os
import re
import shutil
import subprocess
import sys
import tarfile

PR_FIELDS = 'number,title,url,headRefName,headRefOid,isCrossRepository'

# Top-level paths in a PR that are never published inside its preview
EXCLUDED_PATHS = {'.github', 'CNAME', 'preview', 'node_modules'}

NOINDEX = '<meta name="robots" content="noindex, nofollow">'

STORAGE_SHIM = """<script>
// PR preview: keep this preview's saved data separate from the live site's
(function () {
    var prefix = 'preview-pr-%(number)d:';
    var real = window.localStorage;
    function keys() {
        var out = [];
        for (var i = 0; i < real.length; i++) {
            var key = real.key(i);
            if (key.indexOf(prefix) === 0) out.push(key.slice(prefix.length));
        }
        return out;
    }
    var shim = {
        getItem: function (key) { return real.getItem(prefix + key); },
        setItem: function (key, value) { real.setItem(prefix + key, String(value)); },
        removeItem: function (key) { real.removeItem(prefix + key); },
        clear: function () { keys().forEach(function (key) { real.removeItem(prefix + key); }); },
        key: function (index) { var key = keys()[index]; return key === undefined ? null : key; },
        get length() { return keys().length; }
    };
    Object.defineProperty(window, 'localStorage', { value: shim, configurable: true });
})();
</script>"""

# Root-relative URLs ("/style.css") would load the live site's files instead
# of the preview's. Checked after the build and reported on the index page.
ROOT_RELATIVE_PATTERNS = {
    '.html': re.compile(r'''(?:href|src)\s*=\s*["']/(?![/"'])'''),
    '.css': re.compile(r'''url\(\s*["']?/(?!/)'''),
    '.js': re.compile(r'''["'`]/(?:icons|splash|index\.html|app\.js|style\.css|manifest\.json)'''),
    '.json': re.compile(r'''"(?:start_url|scope|url|src)"\s*:\s*"/(?!/)'''),
}


def run(args):
    return subprocess.run(args, check=True, capture_output=True, text=True).stdout


def describe_error(e):
    if isinstance(e, subprocess.CalledProcessError) and e.stderr:
        stderr = e.stderr.decode('utf-8', 'replace') if isinstance(e.stderr, bytes) else e.stderr
        return stderr.strip()
    return str(e) or type(e).__name__


def list_open_prs():
    local = os.environ.get('PREVIEW_PRS_JSON')
    if local:
        with open(local, encoding='utf-8') as f:
            return json.load(f)
    out = run(['gh', 'pr', 'list', '--repo', os.environ['GITHUB_REPOSITORY'],
               '--state', 'open', '--limit', '100', '--json', PR_FIELDS])
    return json.loads(out)


def fetch_pr(pr):
    """Fetch the PR's head commit into a local ref and return its SHA."""
    ref = f'refs/previews/pr-{pr["number"]}'
    for source in (f'refs/pull/{pr["number"]}/head', f'refs/heads/{pr["headRefName"]}'):
        try:
            run(['git', 'fetch', '--quiet', '--no-tags', '--depth=1', 'origin', f'+{source}:{ref}'])
            return run(['git', 'rev-parse', ref]).strip()
        except subprocess.CalledProcessError:
            continue
    raise RuntimeError('could not fetch the branch')


def extract(sha, dest):
    """Copy the commit's regular files into dest (no symlinks, no .git)."""
    archive = subprocess.run(['git', 'archive', '--format=tar', sha],
                             check=True, capture_output=True).stdout
    with tarfile.open(fileobj=io.BytesIO(archive)) as tar:
        for member in tar.getmembers():
            top = member.name.split('/', 1)[0]
            if top in EXCLUDED_PATHS or not member.isfile():
                continue
            target = os.path.abspath(os.path.join(dest, member.name))
            if not target.startswith(os.path.abspath(dest) + os.sep):
                continue
            os.makedirs(os.path.dirname(target), exist_ok=True)
            with tar.extractfile(member) as src, open(target, 'wb') as out:
                shutil.copyfileobj(src, out)


def rewrite(path, fn):
    with open(path, encoding='utf-8') as f:
        text = f.read()
    new = fn(text)
    if new != text:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(new)
    return new != text


def inject_head(text, snippet):
    match = re.search(r'<head[^>]*>', text, re.IGNORECASE)
    if match:
        return text[:match.end()] + '\n' + snippet + text[match.end():]
    return snippet + '\n' + text


def adjust_preview(dest, pr, sha):
    """Rewrite the copied files so the preview can't affect the live site.
    Returns a list of warnings."""
    number = pr['number']
    short_sha = sha[:7]
    warnings = []

    for root, _, files in os.walk(dest):
        for name in files:
            if name.endswith('.html'):
                rewrite(os.path.join(root, name), lambda t: inject_head(
                    t, NOINDEX + '\n' + STORAGE_SHIM % {'number': number}))

    sw = os.path.join(dest, 'sw.js')
    if os.path.exists(sw):
        if not rewrite(sw, lambda t: t.replace(
                "const CACHE_PREFIX = 'awards-tracker-';",
                f"const CACHE_PREFIX = 'awards-tracker-pr-{number}-';")):
            warnings.append('service worker has no CACHE_PREFIX; it may clear the live site\'s offline cache')
        rewrite(sw, lambda t: re.sub(r"const SW_VERSION = '[^']*';",
                                     f"const SW_VERSION = 'pr-{number}-{short_sha}';", t))

    app = os.path.join(dest, 'app.js')
    if os.path.exists(app):
        rewrite(app, lambda t: re.sub(r"const APP_VERSION = '[^']*';",
                                      f"const APP_VERSION = 'pr-{number} ({short_sha})';", t))

    manifest = os.path.join(dest, 'manifest.json')
    if os.path.exists(manifest):
        def adjust_manifest(text):
            data = json.loads(text)
            data['id'] = f'awardstracker-pr-{number}'
            data['name'] = f'PR #{number} · {data.get("name", "Preview")}'
            data['short_name'] = f'PR #{number}'
            return json.dumps(data, indent=4, ensure_ascii=False) + '\n'
        try:
            rewrite(manifest, adjust_manifest)
        except ValueError:
            warnings.append('manifest.json is not valid JSON')

    leaks = []
    for root, _, files in os.walk(dest):
        for name in files:
            pattern = ROOT_RELATIVE_PATTERNS.get(os.path.splitext(name)[1])
            if not pattern:
                continue
            path = os.path.join(root, name)
            with open(path, encoding='utf-8', errors='replace') as f:
                if pattern.search(f.read()):
                    leaks.append(os.path.relpath(path, dest))
    if leaks:
        warnings.append('root-relative paths load the live site\'s files: ' + ', '.join(sorted(leaks)))

    return warnings


def build(pr, out_dir):
    dest = os.path.join(out_dir, f'pr-{pr["number"]}')
    shutil.rmtree(dest, ignore_errors=True)
    os.makedirs(dest)
    try:
        sha = fetch_pr(pr)
        extract(sha, dest)
        if not os.path.exists(os.path.join(dest, 'index.html')):
            raise RuntimeError('the branch has no index.html')
        warnings = adjust_preview(dest, pr, sha)
        return {'status': 'built', 'sha': sha, 'warnings': warnings}
    except Exception as e:  # any failure only affects this preview
        shutil.rmtree(dest, ignore_errors=True)
        return {'status': 'failed', 'error': describe_error(e)}


def write_index(out_dir, rows, list_error):
    esc = html.escape
    items = []
    for pr, result in rows:
        number = pr['number']
        title = esc(pr.get('title') or f'PR #{number}')
        pr_link = f'<a href="{esc(pr["url"])}">#{number}</a>'
        if result['status'] == 'built':
            status = f'<a href="pr-{number}/">Open preview</a> <span class="sha">{esc(result["sha"][:7])}</span>'
            status += ''.join(f'<div class="warning">⚠ {esc(w)}</div>' for w in result['warnings'])
        elif result['status'] == 'fork':
            status = '<span class="muted">Not previewed: opened from a fork</span>'
        else:
            status = f'<span class="failed">Preview failed</span><div class="error">{esc(result["error"])}</div>'
        items.append(f'<tr><td>{pr_link}</td><td>{title}</td><td>{status}</td></tr>')

    if list_error:
        body = f'<p class="failed">Could not list open pull requests: {esc(list_error)}</p>'
    elif items:
        body = '<table><thead><tr><th>PR</th><th>Title</th><th>Preview</th></tr></thead><tbody>\n' + '\n'.join(items) + '\n</tbody></table>'
    else:
        body = '<p class="muted">No open pull requests.</p>'

    generated = datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%d %H:%M UTC')
    page = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
{NOINDEX}
<title>PR Previews · Awards Tracker</title>
<style>
    body {{ font-family: system-ui, sans-serif; background: #0a0a0a; color: #eee; margin: 0; padding: 24px 16px; }}
    main {{ max-width: 860px; margin: 0 auto; }}
    h1 {{ color: #d4af37; font-weight: 600; }}
    a {{ color: #d4af37; }}
    table {{ width: 100%; border-collapse: collapse; }}
    th, td {{ text-align: left; padding: 10px 8px; border-bottom: 1px solid #333; vertical-align: top; }}
    .sha, .muted {{ color: #999; }}
    .failed {{ color: #ff7b7b; }}
    .error, .warning {{ color: #bbb; font-size: 0.85em; margin-top: 4px; overflow-wrap: anywhere; }}
</style>
</head>
<body>
<main>
<h1>PR Previews</h1>
<p class="muted">One preview per open pull request, rebuilt on every deploy. <a href="../">Live site</a></p>
{body}
<p class="muted">Generated {generated}</p>
</main>
</body>
</html>
"""
    with open(os.path.join(out_dir, 'index.html'), 'w', encoding='utf-8') as f:
        f.write(page)


def main():
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    out_dir = sys.argv[1]
    shutil.rmtree(out_dir, ignore_errors=True)
    os.makedirs(out_dir)

    rows = []
    list_error = None
    try:
        prs = sorted(list_open_prs(), key=lambda pr: pr['number'])
    except Exception as e:
        prs = []
        list_error = describe_error(e)
        print(f'Could not list open pull requests: {list_error}', file=sys.stderr)

    for pr in prs:
        if pr.get('isCrossRepository', True):
            result = {'status': 'fork'}
        else:
            result = build(pr, out_dir)
        rows.append((pr, result))
        detail = result.get('error') or '; '.join(result.get('warnings', [])) or result.get('sha', '')[:7]
        print(f'PR #{pr["number"]}: {result["status"]} {detail}'.rstrip())

    write_index(out_dir, rows, list_error)


if __name__ == '__main__':
    main()
