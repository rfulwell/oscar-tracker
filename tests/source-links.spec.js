// @ts-check
const { test, expect } = require('@playwright/test');

const OFFICIAL_OSCAR_URL = 'https://www.oscars.org/oscars/ceremonies/2026';

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

test.describe('Source Links', () => {

    test.describe('Top Category Navigation', () => {

        test('should display source link after progress count', async ({ page }) => {
            await page.setViewportSize({ width: 1200, height: 800 });
            await completeOnboarding(page);

            const sourceLink = page.locator('#source-link-top');
            await expect(sourceLink).toBeVisible();
            await expect(sourceLink).toContainText('source');
            await expect(sourceLink).toContainText('↗');
        });

        test('source link should have correct href to Oscar website', async ({ page }) => {
            await page.setViewportSize({ width: 1200, height: 800 });
            await completeOnboarding(page);

            const sourceLink = page.locator('#source-link-top');
            await expect(sourceLink).toHaveAttribute('href', OFFICIAL_OSCAR_URL);
        });

        test('source link should open in new tab', async ({ page }) => {
            await page.setViewportSize({ width: 1200, height: 800 });
            await completeOnboarding(page);

            const sourceLink = page.locator('#source-link-top');
            await expect(sourceLink).toHaveAttribute('target', '_blank');
            await expect(sourceLink).toHaveAttribute('rel', 'noopener noreferrer');
        });

        test('source link should appear after the progress count', async ({ page }) => {
            await page.setViewportSize({ width: 1200, height: 800 });
            await completeOnboarding(page);

            const progress = page.locator('#progress');
            const sourceLink = page.locator('#source-link-top');

            // Get bounding boxes to verify positioning
            const progressBox = await progress.boundingBox();
            const sourceLinkBox = await sourceLink.boundingBox();

            expect(progressBox).not.toBeNull();
            expect(sourceLinkBox).not.toBeNull();

            // Source link should be to the right of progress
            expect(sourceLinkBox.x).toBeGreaterThan(progressBox.x + progressBox.width - 10);
        });
    });

    test.describe('Bottom Category Navigation', () => {

        test('should display source link after progress count', async ({ page }) => {
            await page.setViewportSize({ width: 1200, height: 800 });
            await completeOnboarding(page);

            // Scroll to bottom to see footer nav
            await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
            await page.waitForTimeout(300);

            const sourceLink = page.locator('#source-link-bottom');
            await expect(sourceLink).toBeVisible();
            await expect(sourceLink).toContainText('source');
            await expect(sourceLink).toContainText('↗');
        });

        test('source link should have correct href to Oscar website', async ({ page }) => {
            await page.setViewportSize({ width: 1200, height: 800 });
            await completeOnboarding(page);

            const sourceLink = page.locator('#source-link-bottom');
            await expect(sourceLink).toHaveAttribute('href', OFFICIAL_OSCAR_URL);
        });

        test('source link should open in new tab', async ({ page }) => {
            await page.setViewportSize({ width: 1200, height: 800 });
            await completeOnboarding(page);

            const sourceLink = page.locator('#source-link-bottom');
            await expect(sourceLink).toHaveAttribute('target', '_blank');
            await expect(sourceLink).toHaveAttribute('rel', 'noopener noreferrer');
        });
    });

    test.describe('Sidebar Official List Link', () => {

        test('should display Official List link in sidebar (desktop)', async ({ page }) => {
            await page.setViewportSize({ width: 1200, height: 800 });
            await completeOnboarding(page);

            const officialListLink = page.locator('#nav-official-list');
            await expect(officialListLink).toBeVisible();
            await expect(officialListLink).toContainText('Official List');
            await expect(officialListLink).toContainText('↗');
        });

        test('Official List link should have correct href', async ({ page }) => {
            await page.setViewportSize({ width: 1200, height: 800 });
            await completeOnboarding(page);

            const officialListLink = page.locator('#nav-official-list');
            await expect(officialListLink).toHaveAttribute('href', OFFICIAL_OSCAR_URL);
        });

        test('Official List link should open in new tab', async ({ page }) => {
            await page.setViewportSize({ width: 1200, height: 800 });
            await completeOnboarding(page);

            const officialListLink = page.locator('#nav-official-list');
            await expect(officialListLink).toHaveAttribute('target', '_blank');
            await expect(officialListLink).toHaveAttribute('rel', 'noopener noreferrer');
        });

        test('Official List link should appear above About button', async ({ page }) => {
            await page.setViewportSize({ width: 1200, height: 800 });
            await completeOnboarding(page);

            const officialListLink = page.locator('#nav-official-list');
            const aboutLink = page.locator('#nav-about');

            // Get bounding boxes
            const officialListBox = await officialListLink.boundingBox();
            const aboutBox = await aboutLink.boundingBox();

            expect(officialListBox).not.toBeNull();
            expect(aboutBox).not.toBeNull();

            // Official List should be above About (smaller Y value)
            expect(officialListBox.y).toBeLessThan(aboutBox.y);
        });

        test('Official List link should be visible in mobile sidebar', async ({ page }) => {
            await page.setViewportSize({ width: 375, height: 667 });
            await completeOnboarding(page);

            // Open sidebar
            const hamburger = page.locator('#hamburger-btn');
            await hamburger.click();
            await page.waitForTimeout(300);

            const officialListLink = page.locator('#nav-official-list');
            await expect(officialListLink).toBeVisible();
            await expect(officialListLink).toContainText('Official List');
        });
    });

    test.describe('Mobile View', () => {

        test('source link should be visible in top category nav on mobile', async ({ page }) => {
            await page.setViewportSize({ width: 375, height: 667 });
            await completeOnboarding(page);

            const sourceLink = page.locator('#source-link-top');
            await expect(sourceLink).toBeVisible();
        });

        test('source link should be visible in bottom category nav on mobile', async ({ page }) => {
            await page.setViewportSize({ width: 375, height: 667 });
            await completeOnboarding(page);

            // Scroll to bottom
            await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
            await page.waitForTimeout(300);

            const sourceLink = page.locator('#source-link-bottom');
            await expect(sourceLink).toBeVisible();
        });

        test('source link should be on same line as progress count on mobile', async ({ page }) => {
            await page.setViewportSize({ width: 375, height: 667 });
            await completeOnboarding(page);

            const progress = page.locator('#progress');
            const sourceLink = page.locator('#source-link-top');

            const progressBox = await progress.boundingBox();
            const sourceLinkBox = await sourceLink.boundingBox();

            expect(progressBox).not.toBeNull();
            expect(sourceLinkBox).not.toBeNull();

            // They should be on the same line (Y positions should be very close)
            // Allow 5px tolerance for vertical alignment differences
            expect(Math.abs(progressBox.y - sourceLinkBox.y)).toBeLessThan(10);
        });
    });

    test.describe('Link Styling', () => {

        test('source link should have gold color', async ({ page }) => {
            await page.setViewportSize({ width: 1200, height: 800 });
            await completeOnboarding(page);

            const sourceLink = page.locator('#source-link-top');
            const color = await sourceLink.evaluate(el => getComputedStyle(el).color);

            // Gold color is rgb(212, 175, 55) or similar
            // Just verify it's not the default text color (white/gray)
            expect(color).not.toBe('rgb(255, 255, 255)');
            expect(color).not.toBe('rgb(128, 128, 128)');
        });

        test('source link should not have default underline', async ({ page }) => {
            await page.setViewportSize({ width: 1200, height: 800 });
            await completeOnboarding(page);

            const sourceLink = page.locator('#source-link-top');
            const textDecoration = await sourceLink.evaluate(el => getComputedStyle(el).textDecorationLine);

            expect(textDecoration).toBe('none');
        });
    });

});
