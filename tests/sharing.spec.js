// @ts-check
const { test, expect } = require('@playwright/test');

// Helper to clear all localStorage before each test
test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
});

// Helper to complete onboarding by clicking browse button
async function completeOnboarding(page) {
    const browseBtn = page.locator('#browse-by-category');
    if (await browseBtn.isVisible()) {
        await browseBtn.click();
    }
    await page.waitForSelector('#films-list .film', { state: 'visible' });
}

// Helper to wait for category screen
async function waitForCategoryScreen(page) {
    await page.waitForSelector('#films-list .film', { state: 'visible' });
}

test.describe('Sharing Predictions', () => {

    test.describe('First-Time Visitor with Shared Link', () => {

        test('should save shared list during first-time onboarding flow', async ({ page }) => {
            // Simulate a first-time visitor opening a shared link
            // They have never been to the site, so localStorage is empty
            await page.goto('/?p=8--------------------&name=Sarah');

            // First-time visitor sees onboarding screen
            const browseBtn = page.locator('#browse-by-category');

            // If onboarding is showing, complete it
            if (await browseBtn.isVisible()) {
                await browseBtn.click();
            }

            await waitForCategoryScreen(page);

            // After onboarding, Sarah's list should be in the dropdown
            const modeSelect = page.locator('#mode-select');
            const options = await modeSelect.locator('option').allTextContents();

            expect(options.some(opt => opt.includes("Sarah"))).toBeTruthy();
        });

        test('should auto-switch to shared view after first-time onboarding', async ({ page }) => {
            await page.goto('/?p=8--------------------&name=Sarah');

            // Complete onboarding if showing
            await completeOnboarding(page);

            // Should be viewing Sarah's predictions
            const modeSelect = page.locator('#mode-select');
            const selectedValue = await modeSelect.inputValue();

            expect(selectedValue).toContain('shared:');
        });

        test('should show shared banner after first-time onboarding', async ({ page }) => {
            await page.goto('/?p=8--------------------&name=Sarah');

            await completeOnboarding(page);

            // Should show the shared banner
            const banner = page.locator('#shared-banner');
            await expect(banner).toBeVisible();
            await expect(banner).toContainText("Sarah");
        });

        test('should persist shared list after first-time visitor reloads', async ({ page }) => {
            // First visit with shared link
            await page.goto('/?p=8--------------------&name=Sarah');
            await completeOnboarding(page);

            // Reload without URL params (simulating normal return visit)
            await page.goto('/');

            // Complete onboarding again if needed (shouldn't be needed since they've visited)
            const browseBtn = page.locator('#browse-by-category');
            if (await browseBtn.isVisible()) {
                await browseBtn.click();
            }
            await waitForCategoryScreen(page);

            // Sarah's list should still be available
            const modeSelect = page.locator('#mode-select');
            const options = await modeSelect.locator('option').allTextContents();

            expect(options.some(opt => opt.includes("Sarah"))).toBeTruthy();
        });

        test('should display correct predictions from shared link after onboarding', async ({ page }) => {
            // Share link with Best Picture = index 8 (Sinners)
            await page.goto('/?p=8--------------------&name=Sarah');
            await completeOnboarding(page);

            // Best Picture is the default category
            // The 9th film (index 8) should be marked as predicted
            const films = page.locator('#films-list .film');
            const ninthFilm = films.nth(8);

            await expect(ninthFilm).toHaveClass(/predicted/);
        });

    });

    test.describe('Returning Visitor with Shared Link', () => {

        test('should add new shared list for returning visitor', async ({ page }) => {
            // First, establish as returning visitor (complete onboarding)
            await page.goto('/');
            await completeOnboarding(page);

            // Now visit with a shared link
            await page.goto('/?p=8--------------------&name=Mike');
            await waitForCategoryScreen(page);

            // Mike's list should be in the dropdown
            const modeSelect = page.locator('#mode-select');
            const options = await modeSelect.locator('option').allTextContents();

            expect(options.some(opt => opt.includes("Mike"))).toBeTruthy();
        });

        test('should preserve own predictions when receiving shared link', async ({ page }) => {
            // Set up as returning visitor with own predictions
            await page.goto('/');
            await completeOnboarding(page);

            // Make a prediction
            await page.locator('#mode-select').selectOption('predictions');
            await page.locator('#films-list .film').first().click();

            // Get the first film's predicted state
            await expect(page.locator('#films-list .film').first()).toHaveClass(/predicted/);

            // Now receive a shared link
            await page.goto('/?p=8--------------------&name=Sarah');
            await waitForCategoryScreen(page);

            // Switch back to own predictions
            await page.locator('#mode-select').selectOption('predictions');

            // Own prediction should still be there
            await expect(page.locator('#films-list .film').first()).toHaveClass(/predicted/);
        });

    });

    test.describe('Shared List Management', () => {

        test('should show delete button when viewing shared list', async ({ page }) => {
            await page.goto('/?p=8--------------------&name=Sarah');
            await completeOnboarding(page);

            // Should show delete button, not share button
            await expect(page.locator('#delete-btn')).toBeVisible();
            await expect(page.locator('#share-btn')).not.toBeVisible();
        });

        test('should show share button in predictions mode', async ({ page }) => {
            await page.goto('/');
            await completeOnboarding(page);

            await page.locator('#mode-select').selectOption('predictions');

            // Should show share button
            await expect(page.locator('#share-btn')).toBeVisible();
            await expect(page.locator('#delete-btn')).not.toBeVisible();
        });

        test('should remove shared list when delete confirmed', async ({ page }) => {
            await page.goto('/?p=8--------------------&name=Sarah');
            await completeOnboarding(page);

            // Click delete
            await page.locator('#delete-btn').click();

            // Confirm deletion
            await page.locator('#delete-confirm').click();

            // Should switch to watched mode
            const modeSelect = page.locator('#mode-select');
            await expect(modeSelect).toHaveValue('watched');

            // Sarah should no longer be in dropdown
            const options = await modeSelect.locator('option').allTextContents();
            expect(options.some(opt => opt.includes("Sarah"))).toBeFalsy();
        });

        test('should keep shared list when delete cancelled', async ({ page }) => {
            await page.goto('/?p=8--------------------&name=Sarah');
            await completeOnboarding(page);

            // Click delete
            await page.locator('#delete-btn').click();

            // Cancel deletion
            await page.locator('#delete-cancel').click();

            // Should still be viewing Sarah's list
            const modeSelect = page.locator('#mode-select');
            const selectedValue = await modeSelect.inputValue();
            expect(selectedValue).toContain('shared:');
        });

    });

    test.describe('Multiple Shared Lists', () => {

        test('should support multiple shared lists from different people', async ({ page }) => {
            // Receive first shared list
            await page.goto('/?p=8--------------------&name=Sarah');
            await completeOnboarding(page);

            // Receive second shared list
            await page.goto('/?p=0--------------------&name=Mike');
            await waitForCategoryScreen(page);

            // Both should be in dropdown
            const modeSelect = page.locator('#mode-select');
            const options = await modeSelect.locator('option').allTextContents();

            expect(options.some(opt => opt.includes("Sarah"))).toBeTruthy();
            expect(options.some(opt => opt.includes("Mike"))).toBeTruthy();
        });

        test('should load correct predictions when switching between shared lists', async ({ page }) => {
            // Set up two shared lists with different predictions
            // Sarah: Best Picture index 8
            await page.goto('/?p=8--------------------&name=Sarah');
            await completeOnboarding(page);

            // Mike: Best Picture index 0
            await page.goto('/?p=0--------------------&name=Mike');
            await waitForCategoryScreen(page);

            // Currently viewing Mike's - first film should be predicted
            await expect(page.locator('#films-list .film').first()).toHaveClass(/predicted/);

            // Get Sarah's shared list value
            const modeSelect = page.locator('#mode-select');
            const options = await modeSelect.locator('option');
            const count = await options.count();

            let sarahValue = null;
            for (let i = 0; i < count; i++) {
                const text = await options.nth(i).textContent();
                if (text && text.includes('Sarah')) {
                    sarahValue = await options.nth(i).getAttribute('value');
                    break;
                }
            }

            if (sarahValue) {
                await modeSelect.selectOption(sarahValue);

                // Sarah's prediction is index 8 (9th film)
                const films = page.locator('#films-list .film');
                await expect(films.nth(8)).toHaveClass(/predicted/);
                await expect(films.first()).not.toHaveClass(/predicted/);
            }
        });

    });

    test.describe('Name Sanitization', () => {

        test('should handle names with special URL characters', async ({ page }) => {
            await page.goto('/?p=8--------------------&name=Sarah%20%26%20John');
            await completeOnboarding(page);

            const modeSelect = page.locator('#mode-select');
            const options = await modeSelect.locator('option').allTextContents();

            expect(options.some(opt => opt.includes("Sarah & John"))).toBeTruthy();
        });

        test('should trim whitespace from names', async ({ page }) => {
            await page.goto('/?p=8--------------------&name=%20Sarah%20');
            await completeOnboarding(page);

            const banner = page.locator('#shared-banner');
            const text = await banner.textContent();

            // Should not have extra whitespace around the name
            expect(text).toContain("Sarah's");
            expect(text).not.toContain("  Sarah");
        });

        test('should default to Friend when no name provided', async ({ page }) => {
            await page.goto('/?p=8--------------------');
            await completeOnboarding(page);

            const banner = page.locator('#shared-banner');
            await expect(banner).toContainText("Friend");
        });

    });

    test.describe('Invalid Share Links', () => {

        test('should ignore invalid prediction string', async ({ page }) => {
            await page.goto('/?p=invalid&name=Sarah');
            await completeOnboarding(page);

            // Should be in watched mode (ignored invalid link)
            const modeSelect = page.locator('#mode-select');
            await expect(modeSelect).toHaveValue('watched');
        });

        test('should ignore too-short prediction string', async ({ page }) => {
            await page.goto('/?p=123&name=Sarah');
            await completeOnboarding(page);

            // Should be in watched mode
            const modeSelect = page.locator('#mode-select');
            await expect(modeSelect).toHaveValue('watched');
        });

    });

});
