// @ts-check
/**
 * Playwright's `test`, with every page served the 2026 season's data no matter
 * which season index.html loads.
 *
 * The browser tests use 2026's nominees, counts and share links as fixtures, so
 * pinning them keeps them meaningful when a new season becomes current. The new
 * season's own data is checked by season-files.spec.js, which uses the real one.
 *
 * Tests can still serve other season data with their own context.route():
 * the route registered last wins.
 */
const path = require('path');
const base = require('@playwright/test');

const TEST_SEASON_FILE = path.join(__dirname, '..', '..', 'seasons', '2026.js');
const SEASON_FILE_URL = /\/seasons\/\d{4}\.js$/;

const test = base.test.extend({
    context: async ({ context }, use) => {
        await context.route(SEASON_FILE_URL, (route) => route.fulfill({
            path: TEST_SEASON_FILE,
            contentType: 'application/javascript'
        }));
        await use(context);
    }
});

module.exports = { ...base, test };
