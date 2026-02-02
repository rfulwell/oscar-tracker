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

test.describe('Favorites Mode', () => {

    test.describe('Mode Switching', () => {

        test('should show favorites option in mode dropdown', async ({ page }) => {
            await completeOnboarding(page);

            const modeSelect = page.locator('#mode-select');
            const options = await modeSelect.locator('option').allTextContents();

            expect(options).toContain('Favorites');
        });

        test('should switch to favorites mode via dropdown', async ({ page }) => {
            await completeOnboarding(page);

            await page.locator('#mode-select').selectOption('favorites');

            await expect(page.locator('#mode-select')).toHaveValue('favorites');
        });

        test('favorites should appear between watched and predictions', async ({ page }) => {
            await completeOnboarding(page);

            const options = await page.locator('#mode-select option').allTextContents();
            const watchedIndex = options.indexOf('Watched');
            const favoritesIndex = options.indexOf('Favorites');
            const predictionsIndex = options.indexOf('Predictions');

            expect(favoritesIndex).toBeGreaterThan(watchedIndex);
            expect(favoritesIndex).toBeLessThan(predictionsIndex);
        });

        test('should persist favorites mode across page reload', async ({ page }) => {
            await completeOnboarding(page);

            await page.locator('#mode-select').selectOption('favorites');
            await page.reload();

            await expect(page.locator('#mode-select')).toHaveValue('favorites');
        });

    });

    test.describe('Single-Select Behavior', () => {

        test('should select a favorite when clicked', async ({ page }) => {
            await completeOnboarding(page);
            await page.locator('#mode-select').selectOption('favorites');

            await page.locator('#films-list .film:first-child').click();

            await expect(page.locator('#films-list .film:first-child')).toHaveClass(/favorited/);
        });

        test('should deselect when clicking the same nominee again', async ({ page }) => {
            await completeOnboarding(page);
            await page.locator('#mode-select').selectOption('favorites');

            const film = page.locator('#films-list .film:first-child');
            await film.click();
            await expect(film).toHaveClass(/favorited/);

            await film.click();
            await expect(film).not.toHaveClass(/favorited/);
        });

        test('should only allow one favorite per category', async ({ page }) => {
            await completeOnboarding(page);
            await page.locator('#mode-select').selectOption('favorites');

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
            await page.locator('#mode-select').selectOption('favorites');

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
            await page.locator('#mode-select').selectOption('predictions');
            await page.locator('#films-list .film:first-child').click();

            // Make a different favorite (decline copy)
            await page.locator('#mode-select').selectOption('favorites');
            const copyModal = page.locator('#copy-modal');
            if (await copyModal.isVisible()) {
                await page.locator('#copy-no').click();
            }
            await page.locator('#films-list .film:nth-child(2)').click();

            // Verify prediction is still first film
            await page.locator('#mode-select').selectOption('predictions');
            await expect(page.locator('#films-list .film:first-child')).toHaveClass(/predicted/);
            await expect(page.locator('#films-list .film:nth-child(2)')).not.toHaveClass(/predicted/);

            // Verify favorite is second film
            await page.locator('#mode-select').selectOption('favorites');
            await expect(page.locator('#films-list .film:first-child')).not.toHaveClass(/favorited/);
            await expect(page.locator('#films-list .film:nth-child(2)')).toHaveClass(/favorited/);
        });

    });

    test.describe('Progress Display', () => {

        test('should show heart progress indicator', async ({ page }) => {
            await completeOnboarding(page);
            await page.locator('#mode-select').selectOption('favorites');

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

            await page.locator('#mode-select').selectOption('favorites');

            await expect(page.locator('#share-btn')).not.toBeVisible();
        });

    });

});

test.describe('Copy Modal', () => {

    test.describe('Favorites from Predictions', () => {

        test('should show copy modal when entering favorites with existing predictions', async ({ page }) => {
            await completeOnboarding(page);

            // Make predictions first
            await page.locator('#mode-select').selectOption('predictions');
            await page.locator('#films-list .film:first-child').click();

            // Switch to favorites
            await page.locator('#mode-select').selectOption('favorites');

            // Modal should appear
            await expect(page.locator('#copy-modal')).toBeVisible();
            await expect(page.locator('#copy-title')).toContainText('predictions');
        });

        test('should show reassurance text in copy modal', async ({ page }) => {
            await completeOnboarding(page);

            await page.locator('#mode-select').selectOption('predictions');
            await page.locator('#films-list .film:first-child').click();

            await page.locator('#mode-select').selectOption('favorites');

            await expect(page.locator('.copy-subtitle')).toContainText('change them later');
        });

        test('should copy predictions to favorites when clicking Yes', async ({ page }) => {
            await completeOnboarding(page);

            // Make prediction
            await page.locator('#mode-select').selectOption('predictions');
            await page.locator('#films-list .film:first-child').click();

            // Switch to favorites and accept copy
            await page.locator('#mode-select').selectOption('favorites');
            await page.locator('#copy-yes').click();

            // First film should be favorited
            await expect(page.locator('#films-list .film:first-child')).toHaveClass(/favorited/);
        });

        test('should not copy predictions when clicking No', async ({ page }) => {
            await completeOnboarding(page);

            // Make prediction
            await page.locator('#mode-select').selectOption('predictions');
            await page.locator('#films-list .film:first-child').click();

            // Switch to favorites and decline copy
            await page.locator('#mode-select').selectOption('favorites');
            await page.locator('#copy-no').click();

            // No film should be favorited
            await expect(page.locator('#films-list .film:first-child')).not.toHaveClass(/favorited/);
        });

        test('should not show modal again after dismissal', async ({ page }) => {
            await completeOnboarding(page);

            // Make prediction
            await page.locator('#mode-select').selectOption('predictions');
            await page.locator('#films-list .film:first-child').click();

            // Switch to favorites and decline
            await page.locator('#mode-select').selectOption('favorites');
            await page.locator('#copy-no').click();

            // Switch away and back
            await page.locator('#mode-select').selectOption('watched');
            await page.locator('#mode-select').selectOption('favorites');

            // Modal should NOT appear
            await expect(page.locator('#copy-modal')).not.toBeVisible();
        });

        test('should not show modal when no predictions exist', async ({ page }) => {
            await completeOnboarding(page);

            // Switch to favorites without making predictions
            await page.locator('#mode-select').selectOption('favorites');

            // Modal should NOT appear
            await expect(page.locator('#copy-modal')).not.toBeVisible();
        });

    });

    test.describe('Predictions from Favorites', () => {

        test('should show copy modal when entering predictions with existing favorites', async ({ page }) => {
            await completeOnboarding(page);

            // Make favorites first (no modal since no predictions)
            await page.locator('#mode-select').selectOption('favorites');
            await page.locator('#films-list .film:first-child').click();

            // Switch to predictions
            await page.locator('#mode-select').selectOption('predictions');

            // Modal should appear
            await expect(page.locator('#copy-modal')).toBeVisible();
            await expect(page.locator('#copy-title')).toContainText('favorites');
        });

        test('should copy favorites to predictions when clicking Yes', async ({ page }) => {
            await completeOnboarding(page);

            // Make favorite
            await page.locator('#mode-select').selectOption('favorites');
            await page.locator('#films-list .film:first-child').click();

            // Switch to predictions and accept copy
            await page.locator('#mode-select').selectOption('predictions');
            await page.locator('#copy-yes').click();

            // First film should be predicted
            await expect(page.locator('#films-list .film:first-child')).toHaveClass(/predicted/);
        });

        test('should not copy favorites when clicking No', async ({ page }) => {
            await completeOnboarding(page);

            // Make favorite
            await page.locator('#mode-select').selectOption('favorites');
            await page.locator('#films-list .film:first-child').click();

            // Switch to predictions and decline copy
            await page.locator('#mode-select').selectOption('predictions');
            await page.locator('#copy-no').click();

            // No film should be predicted
            await expect(page.locator('#films-list .film:first-child')).not.toHaveClass(/predicted/);
        });

    });

    test.describe('Edge Cases', () => {

        test('should not show modal when favorites already have selections', async ({ page }) => {
            await completeOnboarding(page);

            // Make prediction
            await page.locator('#mode-select').selectOption('predictions');
            await page.locator('#films-list .film:first-child').click();

            // Make favorite (decline copy)
            await page.locator('#mode-select').selectOption('favorites');
            await page.locator('#copy-no').click();
            await page.locator('#films-list .film:nth-child(2)').click();

            // Make another prediction
            await page.locator('#mode-select').selectOption('predictions');
            await page.locator('#next-category').click();
            await page.locator('#films-list .film:first-child').click();

            // Go back to favorites - should NOT show modal (favorites already has data)
            await page.locator('#mode-select').selectOption('favorites');
            await expect(page.locator('#copy-modal')).not.toBeVisible();
        });

        test('should close modal on X button click', async ({ page }) => {
            await completeOnboarding(page);

            // Make prediction
            await page.locator('#mode-select').selectOption('predictions');
            await page.locator('#films-list .film:first-child').click();

            // Switch to favorites
            await page.locator('#mode-select').selectOption('favorites');
            await expect(page.locator('#copy-modal')).toBeVisible();

            // Close via X button
            await page.locator('#copy-close').click();

            // Modal should close, should switch to favorites mode
            await expect(page.locator('#copy-modal')).not.toBeVisible();
            await expect(page.locator('#mode-select')).toHaveValue('favorites');
        });

        test('should close modal on backdrop click', async ({ page }) => {
            await completeOnboarding(page);

            // Make prediction
            await page.locator('#mode-select').selectOption('predictions');
            await page.locator('#films-list .film:first-child').click();

            // Switch to favorites
            await page.locator('#mode-select').selectOption('favorites');
            await expect(page.locator('#copy-modal')).toBeVisible();

            // Close via backdrop click (click at edge of screen to avoid modal content)
            await page.locator('#copy-modal .modal-backdrop').click({ position: { x: 10, y: 10 } });

            // Modal should close
            await expect(page.locator('#copy-modal')).not.toBeVisible();
        });

    });

});
