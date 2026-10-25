// @ts-check
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

/**
 * Season data tests.
 *
 * Everything season-specific comes from the season file index.html loads
 * (seasons/<year>.js): nominees, the ceremony date and the text and links on
 * the page. Starting a new season should only need a new season file.
 */

const ROOT = path.join(__dirname, '..');
const SEASON_SOURCE = fs.readFileSync(path.join(ROOT, 'seasons', '2026.js'), 'utf8');

// Serve the 2026 season file with details changed, as if it were next year's
async function useNextSeason(context) {
    const source = SEASON_SOURCE
        .replace("season: '2026',", "season: '2027',")
        .replace('ceremonyNumber: 98,', 'ceremonyNumber: 99,')
        .replace("ceremonyDate: '2026-03-15T19:00:00-05:00',", "ceremonyDate: '2027-03-14T19:00:00-04:00',")
        .replace("broadcaster: 'ABC',", "broadcaster: 'Hulu',")
        .replace("sourceUrl: 'https://www.oscars.org/oscars/ceremonies/2026',", "sourceUrl: 'https://www.oscars.org/oscars/ceremonies/2027',")
        // Drop the last category, so the category count changes too
        .replace(/,\s*\{\s*id: 'best-live-action-short',[\s\S]*?\]\s*\}\s*\]\s*\};\s*$/, '\n    ]\n};\n');
    for (const changed of ["season: '2027'", 'ceremonyNumber: 99', "'2027-03-14", "broadcaster: 'Hulu'", 'ceremonies/2027']) {
        expect(source).toContain(changed);
    }
    expect(source).not.toContain('best-live-action-short');
    await context.route('**/seasons/2026.js', (route) => route.fulfill({
        body: source,
        contentType: 'application/javascript'
    }));
}

async function readSeasonText(page) {
    return page.evaluate(() => ({
        subtitle: document.querySelector('.subtitle').textContent.replace(/\s+/g, ' ').trim(),
        airing: document.querySelector('.ceremony-info [data-season="airing"]').textContent,
        about: document.querySelector('.about-description').textContent.replace(/\s+/g, ' ').trim(),
        countdownDate: document.querySelector('.countdown-date').textContent,
        shareCount: document.querySelector('[data-season="categoryCount"]').textContent,
        sourceLinks: [...document.querySelectorAll('[data-season-href]')].map((a) => a.getAttribute('href'))
    }));
}

test.describe('Season Data', () => {
    test.beforeEach(async ({ page }) => {
        await page.setViewportSize({ width: 1200, height: 800 });
    });

    test('should fill in the 2026 season text and links', async ({ page }) => {
        await page.goto('/');

        const text = await readSeasonText(page);
        expect(text.subtitle).toBe('98th Academy Awards® · 2026');
        expect(text.airing).toBe('March 15 on ABC');
        expect(text.about).toContain('predictions for the 98th Academy Awards.');
        expect(text.countdownDate).toBe('March 15, 2026');
        expect(text.shareCount).toBe('24');
        expect(text.sourceLinks).toEqual(Array(3).fill('https://www.oscars.org/oscars/ceremonies/2026'));
    });

    test('a new season file should change all season text, links and counts', async ({ page, context }) => {
        await useNextSeason(context);
        await page.goto('/');

        const text = await readSeasonText(page);
        expect(text.subtitle).toBe('99th Academy Awards® · 2027');
        expect(text.airing).toBe('March 14 on Hulu');
        expect(text.about).toContain('predictions for the 99th Academy Awards.');
        expect(text.countdownDate).toBe('March 14, 2027');
        expect(text.shareCount).toBe('23');
        expect(text.sourceLinks).toEqual(Array(3).fill('https://www.oscars.org/oscars/ceremonies/2027'));
        await expect(page.locator('#nav-count-predictions')).toHaveText('0/23');
        expect(await page.evaluate(() => CATEGORIES.length)).toBe(23);
    });

    test('should number ceremonies correctly', async ({ page }) => {
        await page.goto('/');
        const ordinals = await page.evaluate(() => [98, 99, 100, 101, 102, 103, 104, 111, 112, 113, 121].map(ordinal));
        expect(ordinals).toEqual(['98th', '99th', '100th', '101st', '102nd', '103rd', '104th', '111th', '112th', '113th', '121st']);
    });

    test('should count each film\'s nominations from the nominees linked to it', async ({ page }) => {
        await page.goto('/');
        const films = await page.evaluate(() => ALL_FILMS.map((f) => [f.key, f.nominations]));
        const linked = await page.evaluate(() => {
            const counts = {};
            for (const c of AWARDS_SEASON.categories) {
                for (const n of c.nominees) {
                    if (n.film) counts[n.film] = (counts[n.film] || 0) + 1;
                }
            }
            return counts;
        });
        for (const [key, nominations] of films) {
            expect(nominations, key).toBe(linked[key]);
        }
        // Most nominated first
        expect(films[0]).toEqual(['sinners', 16]);
        expect(films.map(([, n]) => n)).toEqual([...films.map(([, n]) => n)].sort((a, b) => b - a));
    });

    test('the service worker should precache the season file index.html loads', () => {
        const indexHtml = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
        const swSource = fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8');

        const seasonScripts = [...indexHtml.matchAll(/<script src="(seasons\/[^"]+\.js)"><\/script>/g)].map((m) => m[1]);
        expect(seasonScripts).toHaveLength(1);
        expect(swSource).toContain(`'${seasonScripts[0]}'`);
        expect(fs.existsSync(path.join(ROOT, seasonScripts[0]))).toBe(true);
    });
});
