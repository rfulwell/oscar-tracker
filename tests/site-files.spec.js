// @ts-check
const { test, expect } = require('@playwright/test');
const { execFileSync, spawnSync } = require('child_process');
const fs = require('fs');
const http = require('http');
const os = require('os');
const path = require('path');

/**
 * The deployed site holds only the files in .github/site-files.txt
 * (.github/scripts/build_site.py). These tests build that site and check it
 * has everything the app loads, and nothing that isn't part of the app.
 *
 * They use the real current season, not the 2026 test season.
 */

const ROOT = path.join(__dirname, '..');
const BUILD_SCRIPT = path.join(ROOT, '.github', 'scripts', 'build_site.py');

function buildSite() {
    const out = fs.mkdtempSync(path.join(os.tmpdir(), 'site-'));
    execFileSync('python3', [BUILD_SCRIPT, ROOT, out]);
    return out;
}

function listFiles(dir, prefix = '') {
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const rel = prefix + entry.name;
        return entry.isDirectory() ? listFiles(path.join(dir, entry.name), rel + '/') : [rel];
    });
}

// Every local file the app references: index.html, the manifest, the
// service worker's precache list and the streaming icons in app.js
function referencedFiles(site) {
    const read = (file) => fs.readFileSync(path.join(site, file), 'utf8');
    const refs = new Set();

    for (const m of read('index.html').matchAll(/\s(?:href|src)="([^"]+)"/g)) {
        if (!/^(?:[a-z]+:|#|\/\/)/i.test(m[1])) refs.add(m[1]);
    }
    const manifest = JSON.parse(read('manifest.json'));
    for (const icon of manifest.icons || []) refs.add(icon.src);

    const sw = read('sw.js');
    const assets = sw.slice(sw.indexOf('const ASSETS_TO_CACHE = ['), sw.indexOf('];', sw.indexOf('const ASSETS_TO_CACHE = [')))
        .replace(/\/\/.*$/gm, '');
    for (const m of assets.matchAll(/'([^']+)'/g)) {
        if (m[1] !== './') refs.add(m[1]);
    }

    for (const m of read('app.js').matchAll(/icon: '([^']+)'/g)) refs.add(m[1]);
    return [...refs].sort();
}

// A minimal static file server for the built site
function serve(dir) {
    const types = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml', '.txt': 'text/plain' };
    const server = http.createServer((req, res) => {
        let file = path.join(dir, decodeURIComponent(new URL(req.url, 'http://x').pathname));
        if (!file.startsWith(dir)) { res.writeHead(403); return res.end(); }
        if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
        if (!fs.existsSync(file)) { res.writeHead(404); return res.end(); }
        res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
        fs.createReadStream(file).pipe(res);
    });
    return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(server)));
}

test.describe('Published site', () => {
    let site;

    test.beforeAll(() => {
        site = buildSite();
    });

    test.afterAll(() => {
        fs.rmSync(site, { recursive: true, force: true });
    });

    test('contains every file the app references', () => {
        const missing = referencedFiles(site).filter((ref) => !fs.existsSync(path.join(site, ref)));
        expect(missing).toEqual([]);
    });

    test('leaves out everything that is not part of the app', () => {
        const files = listFiles(site);
        const unexpected = files.filter((f) =>
            /^(tests|docs|mockups|node_modules|\.github)\//.test(f) ||
            /\.(md|py)$/.test(f) ||
            /Academy Awards/.test(f) ||
            ['package.json', 'package-lock.json', 'playwright.config.js', '.gitignore'].includes(f));
        expect(unexpected).toEqual([]);
        for (const required of ['index.html', 'app.js', 'sw.js', 'style.css', 'manifest.json', 'robots.txt', 'CNAME']) {
            expect(files).toContain(required);
        }
    });

    test('loads and installs offline support without any missing files', async ({ browser }) => {
        const server = await serve(site);
        const base = `http://127.0.0.1:${server.address().port}`;
        const context = await browser.newContext();
        const failures = [];
        context.on('response', (r) => { if (r.url().startsWith(base) && r.status() >= 400) failures.push(`${r.status()} ${r.url()}`); });
        context.on('requestfailed', (r) => { if (r.url().startsWith(base)) failures.push(`failed ${r.url()}`); });
        const errors = [];

        try {
            const page = await context.newPage();
            page.on('pageerror', (e) => errors.push(e.message));
            await page.goto(base + '/');

            // The service worker only installs if every precached file loads
            const cached = await page.evaluate(async () => {
                await navigator.serviceWorker.ready;
                const name = (await caches.keys()).find((n) => n.startsWith('awards-tracker-v'));
                return (await (await caches.open(name)).keys()).length;
            });
            expect(cached).toBeGreaterThan(0);

            await page.locator('#browse-by-category').click();
            await expect(page.locator('#films-list .film').first()).toBeVisible();
            await page.evaluate(() => showAboutModal());
            await page.waitForLoadState('networkidle');

            expect(failures).toEqual([]);
            expect(errors).toEqual([]);
        } finally {
            await context.close();
            server.close();
        }
    });

    test('the build fails when a listed file is missing', () => {
        const list = path.join(os.tmpdir(), `site-files-${process.pid}.txt`);
        const out = fs.mkdtempSync(path.join(os.tmpdir(), 'site-'));
        fs.writeFileSync(list, 'index.html\nno-such-file.js\n');
        try {
            const result = spawnSync('python3', [BUILD_SCRIPT, ROOT, out, list], { encoding: 'utf8' });
            expect(result.status).not.toBe(0);
            expect(result.stderr).toContain('listed file not found: no-such-file.js');
        } finally {
            fs.rmSync(list, { force: true });
            fs.rmSync(out, { recursive: true, force: true });
        }
    });

    test('the build rejects paths outside the repo', () => {
        const list = path.join(os.tmpdir(), `site-files-bad-${process.pid}.txt`);
        const out = fs.mkdtempSync(path.join(os.tmpdir(), 'site-'));
        fs.writeFileSync(list, '../secrets.txt\n');
        try {
            const result = spawnSync('python3', [BUILD_SCRIPT, ROOT, out, list], { encoding: 'utf8' });
            expect(result.status).not.toBe(0);
            expect(result.stderr).toContain('invalid entry');
        } finally {
            fs.rmSync(list, { force: true });
            fs.rmSync(out, { recursive: true, force: true });
        }
    });
});
