// @ts-check
const { test, expect } = require('@playwright/test');

// Helper to clear all localStorage before each test
test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
});

// Helper to complete onboarding
async function completeOnboarding(page) {
    const browseBtn = page.locator('#browse-by-category');
    if (await browseBtn.isVisible()) {
        await browseBtn.click();
    }
    await page.waitForSelector('#films-list .film', { state: 'visible' });
}

test.describe('Streamable Mode', () => {

    test.describe('Mode Switching', () => {

        test('should show streamable option in mode dropdown', async ({ page }) => {
            await completeOnboarding(page);

            const options = await page.locator('#mode-select option').allTextContents();
            expect(options).toContain('Streamable');
        });

        test('should switch to streamable mode via dropdown', async ({ page }) => {
            await completeOnboarding(page);

            await page.locator('#mode-select').selectOption('streamable');
            await expect(page.locator('#mode-select')).toHaveValue('streamable');
        });

        test('streamable should appear after predictions in dropdown', async ({ page }) => {
            await completeOnboarding(page);

            const options = await page.locator('#mode-select option').allTextContents();
            const predictionsIndex = options.indexOf('Predictions');
            const streamableIndex = options.indexOf('Streamable');

            expect(streamableIndex).toBeGreaterThan(predictionsIndex);
        });

        test('should persist streamable mode across reloads', async ({ page }) => {
            await completeOnboarding(page);
            await page.locator('#mode-select').selectOption('streamable');

            await page.reload();
            await completeOnboarding(page);

            await expect(page.locator('#mode-select')).toHaveValue('streamable');
        });
    });

    test.describe('Read-Only Behavior', () => {

        test('films should not be selectable in streamable mode', async ({ page }) => {
            await completeOnboarding(page);
            await page.locator('#mode-select').selectOption('streamable');

            // All films should have tabindex -1
            const films = page.locator('#films-list .film');
            const count = await films.count();
            expect(count).toBeGreaterThan(0);

            for (let i = 0; i < count; i++) {
                const tabindex = await films.nth(i).getAttribute('tabindex');
                expect(tabindex).toBe('-1');
            }
        });

        test('clicking a film should not change its state', async ({ page }) => {
            await completeOnboarding(page);
            await page.locator('#mode-select').selectOption('streamable');

            const firstFilm = page.locator('#films-list .film').first();
            const classesBefore = await firstFilm.getAttribute('class');

            await firstFilm.click({ force: true });
            await page.waitForTimeout(200);

            const classesAfter = await firstFilm.getAttribute('class');
            expect(classesAfter).toBe(classesBefore);
        });

        test('all films should have streamable-view class', async ({ page }) => {
            await completeOnboarding(page);
            await page.locator('#mode-select').selectOption('streamable');

            const films = page.locator('#films-list .film');
            const count = await films.count();

            for (let i = 0; i < count; i++) {
                await expect(films.nth(i)).toHaveClass(/streamable-view/);
            }
        });
    });

    test.describe('Streaming Icons', () => {

        test('streaming icons should be visible and clickable', async ({ page }) => {
            await completeOnboarding(page);
            await page.locator('#mode-select').selectOption('streamable');

            // Navigate to Best Picture which has streamable films
            const streamingIcons = page.locator('#films-list .streaming-icon');
            const iconCount = await streamingIcons.count();

            // Best Picture should have some streaming icons
            if (iconCount > 0) {
                const href = await streamingIcons.first().getAttribute('href');
                expect(href).toBeTruthy();
                expect(href).toMatch(/^https:\/\//);
            }
        });

        test('films with streaming should have streamable class', async ({ page }) => {
            await completeOnboarding(page);
            await page.locator('#mode-select').selectOption('streamable');

            // Films with streaming icons should be highlighted
            const streamableFilms = page.locator('#films-list .film.streamable');
            const streamingIcons = page.locator('#films-list .streaming-icon');

            const streamableCount = await streamableFilms.count();
            const iconCount = await streamingIcons.count();

            // Each film with a streaming icon should have the streamable class
            expect(streamableCount).toBe(iconCount);
        });

        test('films without streaming should not have streamable class', async ({ page }) => {
            await completeOnboarding(page);
            await page.locator('#mode-select').selectOption('streamable');

            const allFilms = page.locator('#films-list .film');
            const streamableFilms = page.locator('#films-list .film.streamable');
            const allCount = await allFilms.count();
            const streamableCount = await streamableFilms.count();

            // Not all films should be streamable
            expect(streamableCount).toBeLessThan(allCount);
        });
    });

    test.describe('Watched Status Display', () => {

        test('should show "Not yet watched" for unwatched films', async ({ page }) => {
            await completeOnboarding(page);
            await page.locator('#mode-select').selectOption('streamable');

            const subtitles = page.locator('#films-list .film-studio');
            const count = await subtitles.count();

            for (let i = 0; i < count; i++) {
                const text = await subtitles.nth(i).textContent();
                expect(text).toBe('Not yet watched');
            }
        });

        test('should show watched status for watched films', async ({ page }) => {
            await completeOnboarding(page);

            // Watch the first film in watched mode
            await page.locator('#mode-select').selectOption('watched');
            await page.locator('#films-list .film').first().click();
            await page.waitForTimeout(200);

            // Switch to streamable
            await page.locator('#mode-select').selectOption('streamable');

            const firstSubtitle = await page.locator('#films-list .film-studio').first().textContent();
            expect(firstSubtitle).toContain('Watched');
        });

        test('watched films should have streamable-watched class on subtitle', async ({ page }) => {
            await completeOnboarding(page);

            // Watch the first film
            await page.locator('#mode-select').selectOption('watched');
            await page.locator('#films-list .film').first().click();
            await page.waitForTimeout(200);

            // Switch to streamable
            await page.locator('#mode-select').selectOption('streamable');

            await expect(page.locator('#films-list .film-studio').first()).toHaveClass(/streamable-watched/);
        });

        test('unwatched films should have streamable-unwatched class on subtitle', async ({ page }) => {
            await completeOnboarding(page);
            await page.locator('#mode-select').selectOption('streamable');

            // All should be unwatched initially
            const subtitles = page.locator('#films-list .film-studio');
            const count = await subtitles.count();

            for (let i = 0; i < count; i++) {
                await expect(subtitles.nth(i)).toHaveClass(/streamable-unwatched/);
            }
        });
    });

    test.describe('Progress Display', () => {

        test('should show streamable count in progress', async ({ page }) => {
            await completeOnboarding(page);
            await page.locator('#mode-select').selectOption('streamable');

            const progress = await page.locator('#progress').textContent();
            // Should show "X / Y" format
            expect(progress).toMatch(/\d+ \/ \d+/);
        });
    });

    test.describe('Play Icon', () => {

        test('should show play icon in checkbox area', async ({ page }) => {
            await completeOnboarding(page);
            await page.locator('#mode-select').selectOption('streamable');

            // Check that play icon SVG polygon is present
            const playIcons = page.locator('#films-list .film .checkbox svg polygon');
            const count = await playIcons.count();
            expect(count).toBeGreaterThan(0);
        });
    });
});
