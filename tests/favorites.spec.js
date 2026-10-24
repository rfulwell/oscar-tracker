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

test.describe('Favorites Mode', () => {

    test.describe('Mode Switching', () => {

        test('should show favorites option in navigation menu', async ({ page }) => {
            await completeOnboarding(page);

            await expect(page.locator('.menu-item[data-mode="favorites"]')).toBeVisible();
            await expect(page.locator('.menu-item[data-mode="favorites"] .menu-text')).toHaveText('Favorites');
        });

        test('should switch to favorites mode via navigation', async ({ page }) => {
            await completeOnboarding(page);

            await switchMode(page, 'favorites');

            await expect(page.locator('.menu-item[data-mode="favorites"]')).toHaveClass(/active/);
        });

        test('navigation should have correct menu order', async ({ page }) => {
            await completeOnboarding(page);

            const menuItems = page.locator('.nav-menu .menu-item[data-mode]');
            const modes = await menuItems.evaluateAll(items => items.map(item => item.dataset.mode));

            expect(modes).toEqual(['watched', 'predictions', 'favorites', 'streamable']);
        });

        test('should persist favorites mode across page reload', async ({ page }) => {
            await completeOnboarding(page);

            await switchMode(page, 'favorites');
            await page.reload();

            await expect(page.locator('.menu-item[data-mode="favorites"]')).toHaveClass(/active/);
        });

    });

    test.describe('Single-Select Behavior', () => {

        test('should select a favorite when clicked', async ({ page }) => {
            await completeOnboarding(page);
            await switchMode(page, 'favorites');

            await page.locator('#films-list .film:first-child').click();

            await expect(page.locator('#films-list .film:first-child')).toHaveClass(/favorited/);
        });

        test('should deselect when clicking the same nominee again', async ({ page }) => {
            await completeOnboarding(page);
            await switchMode(page, 'favorites');

            const film = page.locator('#films-list .film:first-child');
            await film.click();
            await expect(film).toHaveClass(/favorited/);

            await film.click();
            await expect(film).not.toHaveClass(/favorited/);
        });

        test('should only allow one favorite per category', async ({ page }) => {
            await completeOnboarding(page);
            await switchMode(page, 'favorites');

            // Select first film
            await page.locator('#films-list .film:first-child').click();
            await expect(page.locator('#films-list .film:first-child')).toHaveClass(/favorited/);

            // Select second film
            await page.locator('#films-list .film:nth-child(2)').click();

            // First should be deselected, second selected
            await expect(page.locator('#films-list .film:first-child')).not.toHaveClass(/favorited/);
            await expect(page.locator('#films-list .film:nth-child(2)')).toHaveClass(/favorited/);
        });

    });

    test.describe('Persistence', () => {

        test('should persist favorites across page reload', async ({ page }) => {
            await completeOnboarding(page);
            await switchMode(page, 'favorites');

            // Make a favorite
            await page.locator('#films-list .film:first-child').click();

            // Reload
            await page.reload();

            // Should still be favorited
            await expect(page.locator('#films-list .film:first-child')).toHaveClass(/favorited/);
        });

        test('should store favorites separately from predictions', async ({ page }) => {
            await completeOnboarding(page);

            // Make a prediction
            await switchMode(page, 'predictions');
            await page.locator('#films-list .film:first-child').click();

            // Make a different favorite (decline copy)
            await switchMode(page, 'favorites');
            const copyModal = page.locator('#copy-modal');
            if (await copyModal.isVisible()) {
                await page.locator('#copy-no').click();
            }
            await page.locator('#films-list .film:nth-child(2)').click();

            // Verify prediction is still first film
            await switchMode(page, 'predictions');
            await expect(page.locator('#films-list .film:first-child')).toHaveClass(/predicted/);
            await expect(page.locator('#films-list .film:nth-child(2)')).not.toHaveClass(/predicted/);

            // Verify favorite is second film
            await switchMode(page, 'favorites');
            await expect(page.locator('#films-list .film:first-child')).not.toHaveClass(/favorited/);
            await expect(page.locator('#films-list .film:nth-child(2)')).toHaveClass(/favorited/);
        });

    });

    test.describe('Progress Display', () => {

        test('should show heart progress indicator', async ({ page }) => {
            await completeOnboarding(page);
            await switchMode(page, 'favorites');

            // Before selecting - should show empty heart
            await expect(page.locator('#progress')).toContainText('♡');

            // Make a favorite
            await page.locator('#films-list .film:first-child').click();

            // Should show filled heart
            await expect(page.locator('#progress')).toContainText('♥');
        });

    });

    test.describe('Share Button', () => {

        test('should hide share button in favorites mode', async ({ page }) => {
            await completeOnboarding(page);

            await switchMode(page, 'favorites');

            await expect(page.locator('#share-btn')).not.toBeVisible();
        });

    });

});

test.describe('Copy Modal', () => {

    test.describe('Favorites from Predictions', () => {

        test('should show copy modal when entering favorites with existing predictions', async ({ page }) => {
            await completeOnboarding(page);

            // Make predictions first
            await switchMode(page, 'predictions');
            await page.locator('#films-list .film:first-child').click();

            // Switch to favorites
            await switchMode(page, 'favorites');

            // Modal should appear
            await expect(page.locator('#copy-modal')).toBeVisible();
            await expect(page.locator('#copy-title')).toContainText('predictions');
        });

        test('should show reassurance text in copy modal', async ({ page }) => {
            await completeOnboarding(page);

            await switchMode(page, 'predictions');
            await page.locator('#films-list .film:first-child').click();

            await switchMode(page, 'favorites');

            await expect(page.locator('.copy-subtitle')).toContainText('change them later');
        });

        test('should copy predictions to favorites when clicking Yes', async ({ page }) => {
            await completeOnboarding(page);

            // Make prediction
            await switchMode(page, 'predictions');
            await page.locator('#films-list .film:first-child').click();

            // Switch to favorites and accept copy
            await switchMode(page, 'favorites');
            await page.locator('#copy-yes').click();

            // First film should be favorited
            await expect(page.locator('#films-list .film:first-child')).toHaveClass(/favorited/);
        });

        test('should not copy predictions when clicking No', async ({ page }) => {
            await completeOnboarding(page);

            // Make prediction
            await switchMode(page, 'predictions');
            await page.locator('#films-list .film:first-child').click();

            // Switch to favorites and decline copy
            await switchMode(page, 'favorites');
            await page.locator('#copy-no').click();

            // No film should be favorited
            await expect(page.locator('#films-list .film:first-child')).not.toHaveClass(/favorited/);
        });

        test('should not show modal again after dismissal', async ({ page }) => {
            await completeOnboarding(page);

            // Make prediction
            await switchMode(page, 'predictions');
            await page.locator('#films-list .film:first-child').click();

            // Switch to favorites and decline
            await switchMode(page, 'favorites');
            await page.locator('#copy-no').click();

            // Switch away and back
            await switchMode(page, 'watched');
            await switchMode(page, 'favorites');

            // Modal should NOT appear
            await expect(page.locator('#copy-modal')).not.toBeVisible();
        });

        test('should not show modal when no predictions exist', async ({ page }) => {
            await completeOnboarding(page);

            // Switch to favorites without making predictions
            await switchMode(page, 'favorites');

            // Modal should NOT appear
            await expect(page.locator('#copy-modal')).not.toBeVisible();
        });

    });

    test.describe('Predictions from Favorites', () => {

        test('should show copy modal when entering predictions with existing favorites', async ({ page }) => {
            await completeOnboarding(page);

            // Make favorites first (no modal since no predictions)
            await switchMode(page, 'favorites');
            await page.locator('#films-list .film:first-child').click();

            // Switch to predictions
            await switchMode(page, 'predictions');

            // Modal should appear
            await expect(page.locator('#copy-modal')).toBeVisible();
            await expect(page.locator('#copy-title')).toContainText('favorites');
        });

        test('should copy favorites to predictions when clicking Yes', async ({ page }) => {
            await completeOnboarding(page);

            // Make favorite
            await switchMode(page, 'favorites');
            await page.locator('#films-list .film:first-child').click();

            // Switch to predictions and accept copy
            await switchMode(page, 'predictions');
            await page.locator('#copy-yes').click();

            // First film should be predicted
            await expect(page.locator('#films-list .film:first-child')).toHaveClass(/predicted/);
        });

        test('should not copy favorites when clicking No', async ({ page }) => {
            await completeOnboarding(page);

            // Make favorite
            await switchMode(page, 'favorites');
            await page.locator('#films-list .film:first-child').click();

            // Switch to predictions and decline copy
            await switchMode(page, 'predictions');
            await page.locator('#copy-no').click();

            // No film should be predicted
            await expect(page.locator('#films-list .film:first-child')).not.toHaveClass(/predicted/);
        });

    });

    test.describe('Edge Cases', () => {

        test('should not show modal when favorites already have selections', async ({ page }) => {
            await completeOnboarding(page);

            // Make prediction
            await switchMode(page, 'predictions');
            await page.locator('#films-list .film:first-child').click();

            // Make favorite (decline copy)
            await switchMode(page, 'favorites');
            await page.locator('#copy-no').click();
            await page.locator('#films-list .film:nth-child(2)').click();

            // Make another prediction
            await switchMode(page, 'predictions');
            await page.locator('#next-category').click();
            await page.locator('#films-list .film:first-child').click();

            // Go back to favorites - should NOT show modal (favorites already has data)
            await switchMode(page, 'favorites');
            await expect(page.locator('#copy-modal')).not.toBeVisible();
        });

        test('should close modal on X button click', async ({ page }) => {
            await completeOnboarding(page);

            // Make prediction
            await switchMode(page, 'predictions');
            await page.locator('#films-list .film:first-child').click();

            // Switch to favorites
            await switchMode(page, 'favorites');
            await expect(page.locator('#copy-modal')).toBeVisible();

            // Close via X button
            await page.locator('#copy-close').click();

            // Modal should close, should switch to favorites mode
            await expect(page.locator('#copy-modal')).not.toBeVisible();
            await expect(page.locator('.menu-item[data-mode="favorites"]')).toHaveClass(/active/);
        });

        test('should close modal on backdrop click', async ({ page }) => {
            await completeOnboarding(page);

            // Make prediction
            await switchMode(page, 'predictions');
            await page.locator('#films-list .film:first-child').click();

            // Switch to favorites
            await switchMode(page, 'favorites');
            await expect(page.locator('#copy-modal')).toBeVisible();

            // Close via backdrop click (click at edge of screen to avoid modal content)
            await page.locator('#copy-modal .modal-backdrop').click({ position: { x: 10, y: 10 } });

            // Modal should close
            await expect(page.locator('#copy-modal')).not.toBeVisible();
        });

    });

});
