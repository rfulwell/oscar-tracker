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

test.describe('Sticky Header', () => {

    test('ceremony-info should contain air date, mode label, and hamburger (mobile)', async ({ page }) => {
        // Use mobile viewport where mode label and hamburger are visible
        await page.setViewportSize({ width: 390, height: 844 });
        await completeOnboarding(page);

        const ceremonyInfo = page.locator('.ceremony-info');

        // Check air date text
        await expect(ceremonyInfo).toContainText('March 15 on ABC');

        // Check mode label exists and is visible on mobile
        await expect(ceremonyInfo.locator('#current-mode-label')).toBeVisible();

        // Check hamburger button exists and is visible on mobile
        await expect(ceremonyInfo.locator('#hamburger-btn')).toBeVisible();
    });

    test('ceremony-info should stay visible at top when scrolling (mobile)', async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        await completeOnboarding(page);

        const ceremonyInfo = page.locator('.ceremony-info');

        // Scroll down significantly
        await page.evaluate(() => window.scrollBy(0, 500));
        await page.waitForTimeout(300);

        // Take screenshot after scroll
        await page.screenshot({ path: 'test-results/mobile-after-scroll.png' });

        // Check ceremony-info is still visible and near top
        const afterBox = await ceremonyInfo.boundingBox();

        // The element should be at or near the top (y should be close to 0)
        expect(afterBox).not.toBeNull();
        expect(afterBox.y).toBeLessThanOrEqual(50); // Should be near top of viewport
    });

    test('ceremony-info should stay visible at top when scrolling (desktop)', async ({ page }) => {
        await page.setViewportSize({ width: 1200, height: 800 });
        await completeOnboarding(page);

        const ceremonyInfo = page.locator('.ceremony-info');

        // Scroll down significantly
        await page.evaluate(() => window.scrollBy(0, 500));
        await page.waitForTimeout(300);

        // Take screenshot after scroll
        await page.screenshot({ path: 'test-results/desktop-after-scroll.png' });

        // Check ceremony-info is still visible and near top
        const afterBox = await ceremonyInfo.boundingBox();

        // The element should be at or near the top
        expect(afterBox).not.toBeNull();
        expect(afterBox.y).toBeLessThanOrEqual(50);
    });

    test('title and subtitle should scroll away while ceremony-info stays (mobile)', async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        await completeOnboarding(page);

        const title = page.locator('.title');
        const ceremonyInfo = page.locator('.ceremony-info');

        // Both should be visible initially
        await expect(title).toBeVisible();
        await expect(ceremonyInfo).toBeVisible();

        // Scroll down
        await page.evaluate(() => window.scrollBy(0, 300));
        await page.waitForTimeout(300);

        // Title should be scrolled out of view
        const titleBox = await title.boundingBox();
        const ceremonyBox = await ceremonyInfo.boundingBox();

        // Title should be above viewport (negative y)
        expect(titleBox.y).toBeLessThan(0);

        // Ceremony info should still be visible near top
        expect(ceremonyBox.y).toBeGreaterThanOrEqual(0);
        expect(ceremonyBox.y).toBeLessThanOrEqual(50);
    });

});
