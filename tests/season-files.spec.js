// @ts-check
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

/**
 * Checks for every season file in seasons/, so a new season's data is checked
 * as soon as it's added:
 * - its structure: required fields, unique ids, film links, share link limits
 * - its titles and credits, against the saved official nominations page
 * - for released seasons, that category and nominee ids never change
 * - that the season index.html loads actually runs in the app
 *
 * Other browser tests always run against the 2026 data (tests/fixtures/test.js),
 * so these are the only tests that load the current season's own data.
 */

const ROOT = path.join(__dirname, '..');
const SEASONS_DIR = path.join(ROOT, 'seasons');

// Share links store each pick as one digit (0-9)
const MAX_NOMINEES_PER_CATEGORY = 10;

const ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function loadSeason(file) {
    const source = fs.readFileSync(path.join(SEASONS_DIR, file), 'utf8');
    return vm.runInNewContext(source + '\n;AWARDS_SEASON', {}, { filename: file });
}

function ordinal(n) {
    const suffixes = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
}

// Saved copy of the official nominations page, named the way a browser saves it
function officialPagePath(season) {
    return path.join(ROOT, `The ${ordinal(season.ceremonyNumber)} Academy Awards _ ${season.season}.html`);
}

// Keys of STREAMING_SERVICES in app.js
function streamingServiceKeys() {
    const app = fs.readFileSync(path.join(ROOT, 'app.js'), 'utf8');
    const block = app.slice(app.indexOf('const STREAMING_SERVICES = {'));
    const body = block.slice(0, block.indexOf('\n};'));
    return [...body.matchAll(/^ {4}([a-z0-9]+): \{/gm)].map((m) => m[1]);
}

// Compare text the way people read it: ignore accents, curly quotes, case and spacing
function normalize(text) {
    return text
        .normalize('NFKD').replace(/[̀-ͯ]/g, '')
        .replace(/[‘’]/g, "'")
        .replace(/["“”]/g, '')
        .toLowerCase()
        .replace(/\s+/g, ' ')
        .trim();
}

function pageText(html) {
    return normalize(html
        .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, ' ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&#0?39;|&rsquo;|&lsquo;/g, "'")
        .replace(/&quot;|&ldquo;|&rdquo;/g, '"')
        .replace(/&nbsp;/g, ' '));
}

const seasonFiles = fs.readdirSync(SEASONS_DIR).filter((f) => f.endsWith('.js')).sort();

test('there is at least one season file', () => {
    expect(seasonFiles.length).toBeGreaterThan(0);
});

for (const file of seasonFiles) {
    test.describe(`seasons/${file}`, () => {
        const year = path.basename(file, '.js');

        test('has the required season details', () => {
            const season = loadSeason(file);

            expect(season.season, 'season must match the file name').toBe(year);
            expect(Number.isInteger(season.ceremonyNumber), 'ceremonyNumber').toBe(true);
            // The 1st ceremony was in 1929, so the 98th is in 2026
            expect(season.ceremonyNumber, 'ceremonyNumber for this year').toBe(Number(year) - 1928);

            expect(season.ceremonyDate, 'ceremonyDate needs a time and UTC offset')
                .toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}$/);
            expect(new Date(season.ceremonyDate).getUTCFullYear(), 'ceremonyDate year').toBe(Number(year));

            expect(typeof season.broadcaster === 'string' && season.broadcaster.length > 0, 'broadcaster').toBe(true);
            expect(season.sourceUrl, 'sourceUrl').toMatch(/^https:\/\//);
        });

        test('has well-formed films', () => {
            const season = loadSeason(file);
            const services = streamingServiceKeys();
            const films = Object.entries(season.films || {});
            expect(films.length, 'films').toBeGreaterThan(0);

            for (const [key, film] of films) {
                expect(key, `film key ${key}`).toMatch(ID_PATTERN);
                expect(typeof film.title === 'string' && film.title.length > 0, `title of film ${key}`).toBe(true);
                if (film.streaming !== undefined) {
                    expect(services, `streaming service of film ${key}`).toContain(film.streaming);
                }
            }
        });

        test('has well-formed categories and nominees', () => {
            const season = loadSeason(file);
            const categories = season.categories || [];
            expect(categories.length, 'categories').toBeGreaterThan(0);

            const categoryIds = categories.map((c) => c.id);
            expect(new Set(categoryIds).size, 'category ids must be unique').toBe(categoryIds.length);

            const nomineeIds = [];
            for (const category of categories) {
                expect(category.id, 'category id').toMatch(ID_PATTERN);
                expect(typeof category.name === 'string' && category.name.length > 0, `name of ${category.id}`).toBe(true);
                if (category.creditType !== undefined) {
                    expect(['studio'], `creditType of ${category.id}`).toContain(category.creditType);
                }

                const nominees = category.nominees || [];
                expect(nominees.length, `nominees in ${category.id}`).toBeGreaterThan(0);
                expect(nominees.length, `nominees in ${category.id} (share links hold one digit per category)`)
                    .toBeLessThanOrEqual(MAX_NOMINEES_PER_CATEGORY);

                for (const nominee of nominees) {
                    expect(nominee.id, `nominee id in ${category.id}`).toMatch(ID_PATTERN);
                    expect(typeof nominee.title === 'string' && nominee.title.length > 0, `title of ${nominee.id}`).toBe(true);
                    expect(typeof nominee.subtitle, `subtitle of ${nominee.id}`).toBe('string');
                    if (nominee.film !== undefined) {
                        expect(Object.keys(season.films), `film of ${nominee.id}`).toContain(nominee.film);
                    }
                    nomineeIds.push(nominee.id);
                }
            }

            const duplicates = nomineeIds.filter((id, i) => nomineeIds.indexOf(id) !== i);
            expect(duplicates, 'nominee ids must be unique across the season').toEqual([]);
        });

        test('links every film to at least one nominee', () => {
            const season = loadSeason(file);
            const linked = new Set(season.categories.flatMap((c) => c.nominees.map((n) => n.film)).filter(Boolean));
            const unlinked = Object.keys(season.films).filter((key) => !linked.has(key));
            expect(unlinked, 'films with no nominees would show 0 nominations').toEqual([]);
        });

        test('matches the official nominations page', () => {
            const season = loadSeason(file);
            const pagePath = officialPagePath(season);
            expect(fs.existsSync(pagePath),
                `Save the official nominations page (${season.sourceUrl}) as "${path.basename(pagePath)}" in the repo root`).toBe(true);

            const page = pageText(fs.readFileSync(pagePath, 'utf8'));
            const missing = [];
            for (const category of season.categories) {
                for (const nominee of category.nominees) {
                    if (!page.includes(normalize(nominee.title))) {
                        missing.push(`${category.id}: title "${nominee.title}"`);
                    }
                    if (category.creditType === 'studio') continue;
                    // Credits list people as "A, B & C"; the page uses "A, B and C"
                    for (const name of nominee.subtitle.split(/ & |, /)) {
                        if (!page.includes(normalize(name))) {
                            missing.push(`${category.id}: credit "${name}" for ${nominee.title}`);
                        }
                    }
                }
            }
            expect(missing, 'not found on the official page').toEqual([]);
        });

        const frozenPath = path.join(__dirname, 'fixtures', `season-${year}-ids.json`);
        if (fs.existsSync(frozenPath)) {
            test('keeps its released category and nominee ids in the same order', () => {
                const season = loadSeason(file);
                const current = season.categories.map((c) => ({ id: c.id, nominees: c.nominees.map((n) => n.id) }));
                const frozen = JSON.parse(fs.readFileSync(frozenPath, 'utf8'));
                // Share links store positions and saved data stores ids, so neither may change.
                // Fix the season file; never edit the frozen ids.
                expect(current).toEqual(frozen);
            });
        }
    });
}

test.describe('Current season', () => {
    test('index.html loads a season file that exists', () => {
        const indexHtml = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
        const scripts = [...indexHtml.matchAll(/<script src="seasons\/(\d{4}\.js)"><\/script>/g)].map((m) => m[1]);
        expect(scripts).toHaveLength(1);
        expect(seasonFiles).toContain(scripts[0]);
    });

    test('the app runs with the current season\'s data', async ({ page }) => {
        const errors = [];
        page.on('pageerror', (e) => errors.push(e.message));
        await page.goto('/');

        const state = await page.evaluate(() => ({
            season: SEASON,
            categories: CATEGORIES.length,
            films: ALL_FILMS.length,
            listedFilms: document.querySelectorAll('#all-films-list .film').length
        }));
        expect(errors).toEqual([]);
        expect(state.categories).toBeGreaterThan(0);
        expect(state.listedFilms).toBe(state.films);

        await page.locator('#browse-by-category').click();
        await expect(page.locator('#films-list .film').first()).toBeVisible();
        await expect(page.locator('#nav-count-predictions')).toHaveText(`0/${state.categories}`);
        expect(errors).toEqual([]);
    });
});
