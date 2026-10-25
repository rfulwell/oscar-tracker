#!/usr/bin/env python3
"""Copy the files the site publishes into <out_dir>.

The files and folders to publish are listed in .github/site-files.txt; nothing
else in the repo reaches the site. Fails if a listed path doesn't exist, so a
typo can't quietly drop a file from the live site.

Usage:
    build_site.py <src_dir> <out_dir> [<list_file>]

list_file defaults to <src_dir>/.github/site-files.txt.
"""

import os
import shutil
import sys

LIST_PATH = os.path.join('.github', 'site-files.txt')


def parse_site_files(text):
    """Return the list's entries: repo-relative paths, folders ending in '/'."""
    entries = []
    for line in text.splitlines():
        entry = line.split('#', 1)[0].strip()
        if not entry:
            continue
        parts = entry.rstrip('/').split('/')
        if entry.startswith('/') or '\\' in entry or any(p in ('', '.', '..') for p in parts):
            raise ValueError(f'invalid entry in site files list: {entry!r}')
        entries.append(entry)
    return entries


def is_published(path, entries):
    """Whether a repo-relative file path is covered by the list's entries."""
    return any(path.startswith(e) if e.endswith('/') else path == e for e in entries)


def build_site(src_dir, out_dir, entries):
    shutil.rmtree(out_dir, ignore_errors=True)
    os.makedirs(out_dir)
    for entry in entries:
        name = entry.rstrip('/')
        source = os.path.join(src_dir, name)
        target = os.path.join(out_dir, name)
        if entry.endswith('/'):
            if not os.path.isdir(source):
                raise FileNotFoundError(f'listed folder not found: {entry}')
            shutil.copytree(source, target)
        else:
            if not os.path.isfile(source):
                raise FileNotFoundError(f'listed file not found: {entry}')
            os.makedirs(os.path.dirname(target) or out_dir, exist_ok=True)
            shutil.copy2(source, target)


def main():
    if len(sys.argv) not in (3, 4):
        sys.exit(__doc__)
    src_dir, out_dir = sys.argv[1], sys.argv[2]
    list_file = sys.argv[3] if len(sys.argv) == 4 else os.path.join(src_dir, LIST_PATH)
    with open(list_file, encoding='utf-8') as f:
        entries = parse_site_files(f.read())
    try:
        build_site(src_dir, out_dir, entries)
    except (FileNotFoundError, ValueError) as e:
        sys.exit(f'build_site.py: {e}')
    print(f'Published {len(entries)} entries to {out_dir}')


if __name__ == '__main__':
    main()
