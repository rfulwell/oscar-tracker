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

// Helper to switch mode via sidebar navigation
async function switchMode(page, mode) {
    await page.click(`.menu-item[data-mode="${mode}"]`);
}

// Helper to switch to streamable mode
async function switchToStreamable(page) {
    await switchMode(page, 'streamable');
    await page.waitForSelector('#streamable-header', { state: 'visible' });
}

test.describe('Streamable Mode', () => {

    test.describe('Mode Switching', () => {

        test('should show streamable option in navigation menu', async ({ page }) => {
            await completeOnboarding(page);

            await expect(page.locator('.menu-item[data-mode="streamable"]')).toBeVisible();
            await expect(page.locator('.menu-item[data-mode="streamable"] .menu-text')).toHaveText('Streamable');
        });

        test('should switch to streamable mode via navigation', async ({ page }) => {
            await completeOnboarding(page);

            await switchToStreamable(page);
            await expect(page.locator('.menu-item[data-mode="streamable"]')).toHaveClass(/active/);
        });

        test('should persist streamable mode across reloads', async ({ page }) => {
            await completeOnboarding(page);
            await switchToStreamable(page);

            await page.reload();
            await completeOnboarding(page);

            await expect(page.locator('.menu-item[data-mode="streamable"]')).toHaveClass(/active/);
            await expect(page.locator('#streamable-header')).toBeVisible();
        });

        test('should restore category navigation when switching away', async ({ page }) => {
            await completeOnboarding(page);

            // Watch a film first so watched mode shows category screen
            await page.locator('#films-list .film').first().click();
            await page.waitForTimeout(200);

            await switchToStreamable(page);

            // Category nav should be hidden
            await expect(page.locator('.category-header')).toBeHidden();

            // Switch back to watched
            await switchMode(page, 'watched');
            await page.waitForTimeout(200);

            // Category nav should be visible again
            await expect(page.locator('.category-header')).toBeVisible();
            await expect(page.locator('#streamable-header')).toBeHidden();
        });
    });

    test.describe('Flat List Layout', () => {

        test('should show all streamable films in one list', async ({ page }) => {
            await completeOnboarding(page);
            await switchToStreamable(page);

            const films = page.locator('#films-list .film');
            const count = await films.count();

            // Should show exactly the number of films in FILM_STREAMING (currently 16)
            expect(count).toBe(16);
        });

        test('should show each streamable film by title', async ({ page }) => {
            await completeOnboarding(page);
            await switchToStreamable(page);

            const titles = await page.locator('#films-list .film-title').allTextContents();

            expect(titles).toContain('Sinners');
            expect(titles).toContain('One Battle After Another');
            expect(titles).toContain('Frankenstein');
            expect(titles).toContain('Train Dreams');
            expect(titles).toContain('KPop Demon Hunters');
            expect(titles).toContain('F1');
        });

        test('should hide category navigation', async ({ page }) => {
            await completeOnboarding(page);
            await switchToStreamable(page);

            await expect(page.locator('.category-header')).toBeHidden();
            await expect(page.locator('.category-footer')).toBeHidden();
        });

        test('should show "Now Streaming" header', async ({ page }) => {
            await completeOnboarding(page);
            await switchToStreamable(page);

            const header = page.locator('#streamable-header');
            await expect(header).toBeVisible();
            await expect(header.locator('.streamable-title')).toHaveText('Now Streaming');
        });

        test('all films should have streamable class', async ({ page }) => {
            await completeOnboarding(page);
            await switchToStreamable(page);

            const films = page.locator('#films-list .film');
            const count = await films.count();

            for (let i = 0; i < count; i++) {
                await expect(films.nth(i)).toHaveClass(/streamable/);
            }
        });
    });

    test.describe('Read-Only Behavior', () => {

        test('films should not be selectable', async ({ page }) => {
            await completeOnboarding(page);
            await switchToStreamable(page);

            const films = page.locator('#films-list .film');
            const count = await films.count();

            for (let i = 0; i < count; i++) {
                const tabindex = await films.nth(i).getAttribute('tabindex');
                expect(tabindex).toBe('-1');
            }
        });

        test('clicking a film should not change its state', async ({ page }) => {
            await completeOnboarding(page);
            await switchToStreamable(page);

            const firstFilm = page.locator('#films-list .film').first();
            const classesBefore = await firstFilm.getAttribute('class');

            await firstFilm.click({ force: true });
            await page.waitForTimeout(200);

            const classesAfter = await firstFilm.getAttribute('class');
            expect(classesAfter).toBe(classesBefore);
        });
    });

    test.describe('Streaming Icons', () => {

        test('every film should have a streaming icon', async ({ page }) => {
            await completeOnboarding(page);
            await switchToStreamable(page);

            const films = page.locator('#films-list .film');
            const icons = page.locator('#films-list .streaming-icon');

            const filmCount = await films.count();
            const iconCount = await icons.count();

            // Every film in the streamable list should have a streaming icon
            expect(iconCount).toBe(filmCount);
        });

        test('streaming icons should have valid links', async ({ page }) => {
            await completeOnboarding(page);
            await switchToStreamable(page);

            const icons = page.locator('#films-list .streaming-icon');
            const count = await icons.count();

            for (let i = 0; i < count; i++) {
                const href = await icons.nth(i).getAttribute('href');
                expect(href).toBeTruthy();
                expect(href).toMatch(/^https:\/\//);
            }
        });
    });

    test.describe('Watched Status Display', () => {

        test('should show "Not yet watched" for all films initially', async ({ page }) => {
            await completeOnboarding(page);
            await switchToStreamable(page);

            const subtitles = page.locator('#films-list .film-studio');
            const count = await subtitles.count();

            for (let i = 0; i < count; i++) {
                await expect(subtitles.nth(i)).toHaveText('Not yet watched');
                await expect(subtitles.nth(i)).toHaveClass(/streamable-unwatched/);
            }
        });

        test('should reflect watched status from watched list', async ({ page }) => {
            await completeOnboarding(page);

            // Watch Sinners in watched mode (it's in Best Picture) - already in watched mode after onboarding
            await page.locator('#films-list .film[data-id="sinners"]').click();
            await page.waitForTimeout(200);

            // Switch to streamable
            await switchToStreamable(page);

            // Find Sinners in the streamable list and check its subtitle
            const films = page.locator('#films-list .film');
            const count = await films.count();
            let sinnersWatched = false;

            for (let i = 0; i < count; i++) {
                const title = await films.nth(i).locator('.film-title').textContent();
                const subtitle = await films.nth(i).locator('.film-studio').textContent();
                if (title === 'Sinners') {
                    expect(subtitle).toContain('Watched');
                    sinnersWatched = true;
                }
            }
            expect(sinnersWatched).toBe(true);
        });

        test('watched films should have streamable-watched class', async ({ page }) => {
            await completeOnboarding(page);

            // Watch Sinners - already in watched mode after onboarding
            await page.locator('#films-list .film[data-id="sinners"]').click();
            await page.waitForTimeout(200);

            await switchToStreamable(page);

            // At least one subtitle should have the watched class
            const watchedSubtitles = page.locator('#films-list .streamable-watched');
            expect(await watchedSubtitles.count()).toBeGreaterThan(0);
        });
    });

    test.describe('Progress Display', () => {

        test('should show watched count in streamable header', async ({ page }) => {
            await completeOnboarding(page);
            await switchToStreamable(page);

            const progress = await page.locator('.streamable-progress').textContent();
            // Should show "0 / 16 watched" initially
            expect(progress).toMatch(/\d+ \/ \d+ watched/);
            expect(progress).toContain('0 / 16');
        });

        test('should update count when films are watched', async ({ page }) => {
            await completeOnboarding(page);

            // Watch Sinners in Best Picture - already in watched mode after onboarding
            await page.locator('#films-list .film[data-id="sinners"]').click();
            await page.waitForTimeout(200);

            await switchToStreamable(page);

            const progress = await page.locator('.streamable-progress').textContent();
            expect(progress).toContain('1 / 16');
        });

        test('should update document title with progress', async ({ page }) => {
            await completeOnboarding(page);
            await switchToStreamable(page);

            const title = await page.title();
            expect(title).toContain('0/16');
        });
    });

    test.describe('Play Icon', () => {

        test('should show play icon in checkbox area', async ({ page }) => {
            await completeOnboarding(page);
            await switchToStreamable(page);

            const playIcons = page.locator('#films-list .film .checkbox svg polygon');
            const count = await playIcons.count();
            expect(count).toBeGreaterThan(0);
        });
    });
});
