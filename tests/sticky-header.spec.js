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

    test('ceremony-info should stay visible when scrolling up and down (mobile)', async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        await completeOnboarding(page);

        const ceremonyInfo = page.locator('.ceremony-info');

        // Scroll down
        await page.evaluate(() => window.scrollBy(0, 500));
        await page.waitForTimeout(300);

        // Check still visible at top
        let box = await ceremonyInfo.boundingBox();
        expect(box).not.toBeNull();
        expect(box.y).toBeLessThanOrEqual(50);

        // Scroll down more
        await page.evaluate(() => window.scrollBy(0, 300));
        await page.waitForTimeout(300);

        // Still at top
        box = await ceremonyInfo.boundingBox();
        expect(box.y).toBeLessThanOrEqual(50);

        // Scroll back up
        await page.evaluate(() => window.scrollBy(0, -400));
        await page.waitForTimeout(300);

        // Still visible
        box = await ceremonyInfo.boundingBox();
        expect(box.y).toBeGreaterThanOrEqual(0);
        expect(box.y).toBeLessThanOrEqual(100);
    });

    test('ceremony-info and category header should be visible after bottom nav auto-scroll (mobile)', async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        await completeOnboarding(page);

        // First scroll down manually to middle of page
        await page.evaluate(() => window.scrollBy(0, 300));
        await page.waitForTimeout(200);

        // Click next category button at bottom (which triggers auto-scroll)
        await page.click('#next-category-bottom');
        await page.waitForTimeout(500);

        // Take screenshot after auto-scroll
        await page.screenshot({ path: 'test-results/after-auto-scroll.png' });

        // Ceremony info should be visible at top
        const ceremonyInfo = page.locator('.ceremony-info');
        const ceremonyBox = await ceremonyInfo.boundingBox();
        expect(ceremonyBox).not.toBeNull();
        expect(ceremonyBox.y).toBeGreaterThanOrEqual(0);
        expect(ceremonyBox.y).toBeLessThanOrEqual(50);

        // Category header should also be visible
        const categoryHeader = page.locator('.category-header');
        const categoryBox = await categoryHeader.boundingBox();
        expect(categoryBox).not.toBeNull();
        expect(categoryBox.y).toBeGreaterThan(0); // Below the sticky header
    });

    test('ceremony-info should be visible after using bottom category dropdown (mobile)', async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        await completeOnboarding(page);

        // Use bottom dropdown to change category (triggers auto-scroll)
        await page.locator('.category-footer select').selectOption('5'); // Supporting Actress
        await page.waitForTimeout(500);

        // Take screenshot
        await page.screenshot({ path: 'test-results/after-dropdown-scroll.png' });

        // Ceremony info should be visible at top
        const ceremonyInfo = page.locator('.ceremony-info');
        const ceremonyBox = await ceremonyInfo.boundingBox();
        expect(ceremonyBox).not.toBeNull();
        expect(ceremonyBox.y).toBeGreaterThanOrEqual(0);
        expect(ceremonyBox.y).toBeLessThanOrEqual(50);
    });

});
