// @ts-check
const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
});

async function completeOnboarding(page) {
    const browseBtn = page.locator('#browse-by-category');
    if (await browseBtn.isVisible()) {
        await browseBtn.click();
    }
    await page.waitForSelector('#films-list .film', { state: 'visible' });
}

test.describe('Navigation Counts', () => {

    test('should display counts for all nav items (desktop)', async ({ page }) => {
        await page.setViewportSize({ width: 1200, height: 800 });
        await completeOnboarding(page);

        // Verify count elements exist
        await expect(page.locator('#nav-count-watched')).toBeVisible();
        await expect(page.locator('#nav-count-predictions')).toBeVisible();
        await expect(page.locator('#nav-count-favorites')).toBeVisible();
        await expect(page.locator('#nav-count-streamable')).toBeVisible();

        // Initial counts should show 0 for watched
        await expect(page.locator('#nav-count-watched')).toContainText('0/');
        await expect(page.locator('#nav-count-predictions')).toContainText('0/21');
        await expect(page.locator('#nav-count-favorites')).toContainText('0/21');

        // Take screenshot
        await page.screenshot({ path: 'test-results/nav-counts-initial.png' });
    });

    test('should update watched count when film is toggled', async ({ page }) => {
        await page.setViewportSize({ width: 1200, height: 800 });
        await completeOnboarding(page);

        // Get initial watched count
        const watchedCount = page.locator('#nav-count-watched');
        await expect(watchedCount).toContainText('0/');

        // Click a film to watch it
        await page.click('#films-list .film:first-child');
        await page.waitForTimeout(200);

        // Count should increase
        await expect(watchedCount).not.toContainText('0/');

        // Take screenshot
        await page.screenshot({ path: 'test-results/nav-counts-after-watch.png' });
    });

    test('should update predictions count when prediction is made', async ({ page }) => {
        await page.setViewportSize({ width: 1200, height: 800 });
        await completeOnboarding(page);

        // Switch to predictions mode
        await page.click('.menu-item[data-mode="predictions"]');
        await page.waitForTimeout(200);

        const predictionsCount = page.locator('#nav-count-predictions');
        await expect(predictionsCount).toContainText('0/21');

        // Make a prediction
        await page.click('#films-list .film:first-child');
        await page.waitForTimeout(200);

        // Count should increase
        await expect(predictionsCount).toContainText('1/21');
    });

    test('should update favorites count when favorite is selected', async ({ page }) => {
        await page.setViewportSize({ width: 1200, height: 800 });
        await completeOnboarding(page);

        // Switch to favorites mode
        await page.click('.menu-item[data-mode="favorites"]');
        await page.waitForTimeout(200);

        const favoritesCount = page.locator('#nav-count-favorites');
        await expect(favoritesCount).toContainText('0/21');

        // Select a favorite
        await page.click('#films-list .film:first-child');
        await page.waitForTimeout(200);

        // Count should increase
        await expect(favoritesCount).toContainText('1/21');
    });

    test('should update streamable count when streamable film is watched', async ({ page }) => {
        await page.setViewportSize({ width: 1200, height: 800 });
        await completeOnboarding(page);

        // Watch a film that's streamable (Sinners is on Max)
        await page.click('#films-list .film[data-id="sinners"]');
        await page.waitForTimeout(200);

        // Switch to streamable mode
        await page.click('.menu-item[data-mode="streamable"]');
        await page.waitForTimeout(200);

        // Streamable count should show at least 1
        const streamableCount = page.locator('#nav-count-streamable');
        const text = await streamableCount.textContent();
        expect(text).toMatch(/[1-9]\d*\/\d+/); // Should be non-zero
    });

});
