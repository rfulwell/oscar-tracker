// @ts-check
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

/**
 * Per-season storage tests.
 *
 * The 2026 season keeps the original localStorage keys so existing users'
 * data loads unchanged. Later seasons use their own keys and must never
 * overwrite earlier seasons' data.
 */

const APP_SOURCE = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');

// Data saved by the 2026 builds, in the original keys and format
const LEGACY_DATA = {
    'oscar-tracker-watched': JSON.stringify(['sinners', 'dir-coogler']),
    'oscar-tracker-predictions': JSON.stringify({ 'best-picture': 'sinners' }),
    'oscar-tracker-favorites': JSON.stringify({ 'best-picture': 'hamnet' }),
    'oscar-tracker-shared-lists': JSON.stringify([{
        id: 'sarah-1770000000000',
        name: 'Sarah',
        predictions: { 'best-picture': 'sinners' },
        receivedAt: '2026-02-10T00:00:00.000Z'
    }])
};

async function seedStorage(page, data) {
    await page.goto('/');
    await page.evaluate((entries) => {
        localStorage.clear();
        for (const [key, value] of Object.entries(entries)) {
            localStorage.setItem(key, value);
        }
    }, data);
}

async function readStorage(page) {
    return page.evaluate(() => {
        const entries = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            entries[key] = localStorage.getItem(key);
        }
        return entries;
    });
}

// Serve app.js as if this build tracked a different season
async function useSeason(context, season) {
    const source = APP_SOURCE.replace("const SEASON = '2026';", `const SEASON = '${season}';`);
    expect(source).not.toBe(APP_SOURCE);
    await context.route('**/app.js', (route) => route.fulfill({
        body: source,
        contentType: 'application/javascript'
    }));
}

test.describe('Season Storage', () => {
    test.beforeEach(async ({ page }) => {
        await page.setViewportSize({ width: 1200, height: 800 });
    });

    test('2026 should load data saved in the original keys', async ({ page }) => {
        await seedStorage(page, LEGACY_DATA);
        await page.reload();

        await expect(page.locator('#nav-count-watched')).toHaveText(/^1\//);
        await expect(page.locator('#nav-count-predictions')).toHaveText('1/24');
        await expect(page.locator('#nav-count-favorites')).toHaveText('1/24');
        await expect(page.locator('#nav-shared-lists')).toContainText('Sarah');
    });

    test('should not count picks for nominees no longer in the data', async ({ page }) => {
        // Gwyneth Paltrow was in an early version of the data and later corrected out
        await seedStorage(page, {
            'oscar-tracker-watched': JSON.stringify(['sinners']),
            'oscar-tracker-predictions': JSON.stringify({
                'best-picture': 'sinners',
                'best-supporting-actress': 'supp-actress-paltrow'
            }),
            'oscar-tracker-favorites': JSON.stringify({
                'best-supporting-actress': 'supp-actress-paltrow'
            })
        });
        await page.reload();

        await expect(page.locator('#nav-count-predictions')).toHaveText('1/24');
        await expect(page.locator('#nav-count-favorites')).toHaveText('0/24');
    });

    test('should not drop stored picks for nominees no longer in the data', async ({ page }) => {
        const stored = JSON.stringify({ 'best-supporting-actress': 'supp-actress-paltrow' });
        await seedStorage(page, {
            'oscar-tracker-watched': JSON.stringify(['sinners']),
            'oscar-tracker-predictions': stored
        });
        await page.reload();
        await expect(page.locator('#category-screen')).toBeVisible();

        expect((await readStorage(page))['oscar-tracker-predictions']).toBe(stored);
    });

    test('a new season should start fresh', async ({ page, context }) => {
        await seedStorage(page, LEGACY_DATA);
        await useSeason(context, '2027');
        await page.reload();

        await expect(page.locator('#onboarding-screen')).toBeVisible();
        await expect(page.locator('#nav-count-watched')).toHaveText(/^0\//);
        await expect(page.locator('#nav-count-predictions')).toHaveText('0/24');
        await expect(page.locator('#nav-count-favorites')).toHaveText('0/24');
        await expect(page.locator('#nav-shared-lists')).not.toContainText('Sarah');
    });

    test('a new season should save to its own keys and leave 2026 data untouched', async ({ page, context }) => {
        await seedStorage(page, LEGACY_DATA);
        await useSeason(context, '2027');
        await page.reload();

        await page.locator('#all-films-list .film').first().click();

        const stored = await readStorage(page);
        expect(JSON.parse(stored['oscar-tracker-watched-2027']).length).toBeGreaterThan(0);
        for (const [key, value] of Object.entries(LEGACY_DATA)) {
            expect(stored[key]).toBe(value);
        }
    });

    test('2026 data should load again when a build tracks 2026', async ({ page, context }) => {
        await seedStorage(page, LEGACY_DATA);
        await useSeason(context, '2027');
        await page.reload();
        await page.locator('#all-films-list .film').first().click();

        await context.unroute('**/app.js');
        await page.reload();

        await expect(page.locator('#nav-count-predictions')).toHaveText('1/24');
        await expect(page.locator('#nav-shared-lists')).toContainText('Sarah');
    });
});
