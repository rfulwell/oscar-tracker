// @ts-check
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

// The service worker installed on clients before automatic versioning (SW v9)
const SW_V9_SOURCE = fs.readFileSync(path.join(__dirname, 'fixtures', 'sw-v9.js'), 'utf8');

/**
 * Service worker caching tests.
 *
 * Installed clients must pick up new deploys without a hard refresh (app files
 * are network-first) and keep working offline (cached copies are the fallback).
 */

// Load the app and wait until the service worker controls the page
async function loadControlledPage(page) {
    await page.goto('/');
    await page.evaluate(async () => {
        await navigator.serviceWorker.ready;
        if (!navigator.serviceWorker.controller) {
            await new Promise((resolve) => {
                navigator.serviceWorker.addEventListener('controllerchange', resolve, { once: true });
            });
        }
    });
}

// Replace the cached app.js with a copy that sets a marker, so tests can tell
// whether a page load used the cache or the network
async function plantMarkedAppJs(page) {
    await page.evaluate(async () => {
        const cacheName = (await caches.keys()).find((name) => name.startsWith('awards-tracker-v'));
        const cache = await caches.open(cacheName);
        const source = await (await fetch('/app.js')).text();
        await cache.put('/app.js', new Response(source + '\nwindow.__servedFromCache = true;', {
            headers: { 'Content-Type': 'application/javascript' }
        }));
    });
}

test.describe('Service Worker', () => {
    test('should precache the app shell on install', async ({ page }) => {
        await loadControlledPage(page);

        const cached = await page.evaluate(async () => {
            const cacheName = (await caches.keys()).find((name) => name.startsWith('awards-tracker-v'));
            const cache = await caches.open(cacheName);
            const keys = await cache.keys();
            return keys.map((request) => new URL(request.url).pathname);
        });

        for (const path of ['/', '/index.html', '/app.js', '/style.css', '/manifest.json']) {
            expect(cached).toContain(path);
        }
    });

    test('should load app files from the network when online', async ({ page }) => {
        await loadControlledPage(page);
        await plantMarkedAppJs(page);

        await page.reload();

        // A cache-first worker would have served the planted copy
        expect(await page.evaluate(() => window.__servedFromCache)).toBeUndefined();
        await expect(page.locator('#onboarding-screen')).toBeVisible();
    });

    test('should fall back to cached files when offline', async ({ page, context }) => {
        await loadControlledPage(page);
        await plantMarkedAppJs(page);

        await context.setOffline(true);
        await page.reload();

        expect(await page.evaluate(() => window.__servedFromCache)).toBe(true);
        await expect(page.locator('#onboarding-screen')).toBeVisible();
    });

    test('should fall back to cached files when the network is slow', async ({ page, context }) => {
        await loadControlledPage(page);
        await plantMarkedAppJs(page);

        // Hold app.js well past the service worker's network timeout
        await context.route('**/app.js', async (route) => {
            await new Promise((resolve) => setTimeout(resolve, 6000));
            await route.continue().catch(() => {});
        });
        await page.reload();

        expect(await page.evaluate(() => window.__servedFromCache)).toBe(true);
        await expect(page.locator('#onboarding-screen')).toBeVisible();
    });

    test('should open shared links offline', async ({ page, context }) => {
        await loadControlledPage(page);

        await context.setOffline(true);
        await page.goto('/?p=8-----------------------&name=Sarah');

        await expect(page.locator('#category-screen')).toBeVisible();
        await expect(page.locator('#shared-banner')).toContainText('Sarah');
    });

    test('should not cache a separate copy for each shared link', async ({ page }) => {
        await loadControlledPage(page);

        await page.goto('/?p=8-----------------------&name=Sarah');
        await page.goto('/?p=7-----------------------&name=Alex');

        const cachedWithQuery = await page.evaluate(async () => {
            const cacheName = (await caches.keys()).find((name) => name.startsWith('awards-tracker-v'));
            const cache = await caches.open(cacheName);
            const keys = await cache.keys();
            return keys.filter((request) => new URL(request.url).search !== '').length;
        });

        expect(cachedWithQuery).toBe(0);
    });

    test('should upgrade clients running the v9 service worker and keep their data', async ({ page, context }) => {
        // Install the old worker, as on existing clients
        await context.route('**/sw.js', (route) => route.fulfill({
            body: SW_V9_SOURCE,
            contentType: 'application/javascript'
        }));
        await loadControlledPage(page);
        expect(await page.evaluate(() => caches.keys())).toEqual(['awards-tracker-v9']);

        await page.evaluate(() => {
            localStorage.setItem('oscar-tracker-watched', JSON.stringify(['sinners']));
            localStorage.setItem('oscar-tracker-predictions', JSON.stringify({ 'best-picture': 'sinners' }));
        });

        // Deploy the current worker and let the browser's update check find it
        await context.unroute('**/sw.js');
        await page.evaluate(async () => {
            const registration = await navigator.serviceWorker.getRegistration();
            await registration.update();
            const worker = registration.installing || registration.waiting;
            if (worker && worker.state !== 'activated') {
                await new Promise((resolve) => {
                    worker.addEventListener('statechange', () => {
                        if (worker.state === 'activated') resolve();
                    });
                });
            }
        });

        const cacheNames = await page.evaluate(() => caches.keys());
        expect(cacheNames).not.toContain('awards-tracker-v9');
        expect(cacheNames.some((name) => name.startsWith('awards-tracker-v'))).toBe(true);

        await page.reload();
        await expect(page.locator('#category-screen')).toBeVisible();
        const stored = await page.evaluate(() => ({
            watched: localStorage.getItem('oscar-tracker-watched'),
            predictions: localStorage.getItem('oscar-tracker-predictions')
        }));
        expect(JSON.parse(stored.watched)).toEqual(['sinners']);
        expect(JSON.parse(stored.predictions)).toEqual({ 'best-picture': 'sinners' });
    });
});
