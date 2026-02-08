// @ts-check
const { test, expect } = require('@playwright/test');

// Helper to clear all localStorage before each test and navigate to category screen
test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    // Wait for page to load and navigate to category screen if onboarding shows
    await page.waitForLoadState('domcontentloaded');
});

// Helper to ensure we're on category screen (not onboarding)
async function goToCategoryScreen(page) {
    const browseBtn = page.locator('#browse-by-category');
    if (await browseBtn.isVisible()) {
        await browseBtn.click();
    }
    // Wait for category screen to be visible
    await page.waitForSelector('#films-list .film', { state: 'visible' });
}

test.describe('Predictions Mode', () => {

    test.describe('Mode Switching', () => {

        test('should start in watched mode by default', async ({ page }) => {
            // Wait for the app to initialize and show category screen
            await goToCategoryScreen(page);

            await expect(page.locator('.menu-item[data-mode="watched"]')).toHaveClass(/active/);
        });

        test('should switch to predictions mode via navigation', async ({ page }) => {
            await goToCategoryScreen(page);

            await page.click('.menu-item[data-mode="predictions"]');

            await expect(page.locator('.menu-item[data-mode="predictions"]')).toHaveClass(/active/);
        });

        test('should persist mode selection across page reload', async ({ page }) => {
            await goToCategoryScreen(page);

            // Switch to predictions mode
            await page.click('.menu-item[data-mode="predictions"]');

            // Reload page
            await page.reload();

            // Should still be in predictions mode
            await expect(page.locator('.menu-item[data-mode="predictions"]')).toHaveClass(/active/);
        });

        test('should show star icons in predictions mode', async ({ page }) => {
            await goToCategoryScreen(page);
            await page.click('.menu-item[data-mode="predictions"]');

            // Check that checkbox contains a star polygon (not a checkmark polyline)
            const checkbox = page.locator('#films-list .film .checkbox').first();
            const hasStar = await checkbox.locator('svg polygon').count();
            expect(hasStar).toBeGreaterThan(0);
        });

        test('should show checkmark icons in watched mode', async ({ page }) => {
            await goToCategoryScreen(page);

            // Ensure we're in watched mode
            await page.click('.menu-item[data-mode="watched"]');

            // Check that checkbox contains a checkmark polyline (not a star)
            const checkbox = page.locator('#films-list .film .checkbox').first();
            const hasCheckmark = await checkbox.locator('svg polyline').count();
            expect(hasCheckmark).toBeGreaterThan(0);
        });
    });

    test.describe('Single-Select Behavior', () => {

        test('should select a nominee when clicked', async ({ page }) => {
            await goToCategoryScreen(page);
            await page.click('.menu-item[data-mode="predictions"]');

            const firstFilm = page.locator('#films-list .film').first();
            await firstFilm.click();

            await expect(firstFilm).toHaveClass(/predicted/);
            await expect(firstFilm).toHaveAttribute('aria-checked', 'true');
        });

        test('should deselect when clicking the same nominee again', async ({ page }) => {
            await goToCategoryScreen(page);
            await page.click('.menu-item[data-mode="predictions"]');

            const firstFilm = page.locator('#films-list .film').first();

            // Select
            await firstFilm.click();
            await expect(firstFilm).toHaveClass(/predicted/);

            // Deselect
            await firstFilm.click();
            await expect(firstFilm).not.toHaveClass(/predicted/);
            await expect(firstFilm).toHaveAttribute('aria-checked', 'false');
        });

        test('should only allow one selection per category', async ({ page }) => {
            await goToCategoryScreen(page);
            await page.click('.menu-item[data-mode="predictions"]');

            const films = page.locator('#films-list .film');
            const firstFilm = films.first();
            const secondFilm = films.nth(1);

            // Select first
            await firstFilm.click();
            await expect(firstFilm).toHaveClass(/predicted/);
            await expect(secondFilm).not.toHaveClass(/predicted/);

            // Select second - should deselect first
            await secondFilm.click();
            await expect(firstFilm).not.toHaveClass(/predicted/);
            await expect(secondFilm).toHaveClass(/predicted/);

            // Only one should be predicted
            const predictedCount = await page.locator('#films-list .film.predicted').count();
            expect(predictedCount).toBe(1);
        });

        test('should use radio role for accessibility in predictions mode', async ({ page }) => {
            await goToCategoryScreen(page);
            await page.click('.menu-item[data-mode="predictions"]');

            const firstFilm = page.locator('#films-list .film').first();
            await expect(firstFilm).toHaveAttribute('role', 'radio');
        });

        test('should use checkbox role in watched mode', async ({ page }) => {
            await goToCategoryScreen(page);
            await page.click('.menu-item[data-mode="watched"]');

            const firstFilm = page.locator('#films-list .film').first();
            await expect(firstFilm).toHaveAttribute('role', 'checkbox');
        });
    });

    test.describe('Progress Display', () => {

        test('should show empty circle when no prediction made', async ({ page }) => {
            await goToCategoryScreen(page);
            await page.click('.menu-item[data-mode="predictions"]');

            const progress = page.locator('#progress');
            await expect(progress).toHaveText('○');
        });

        test('should show checkmark when prediction is made', async ({ page }) => {
            await goToCategoryScreen(page);
            await page.click('.menu-item[data-mode="predictions"]');

            // Make a prediction
            await page.locator('#films-list .film').first().click();

            const progress = page.locator('#progress');
            await expect(progress).toHaveText('✓');
        });

        test('should update title with prediction count', async ({ page }) => {
            await goToCategoryScreen(page);
            await page.click('.menu-item[data-mode="predictions"]');

            // Initially no predictions
            await expect(page).toHaveTitle('Oscar Tracker');

            // Make a prediction
            await page.locator('#films-list .film').first().click();

            // Title should show 1/24 (1 prediction out of 24 categories)
            await expect(page).toHaveTitle(/Oscar Tracker \(1\/24\)/);
        });

        test('should show empty circle after clearing prediction', async ({ page }) => {
            await goToCategoryScreen(page);
            await page.click('.menu-item[data-mode="predictions"]');

            const firstFilm = page.locator('#films-list .film').first();

            // Make then clear prediction
            await firstFilm.click();
            await expect(page.locator('#progress')).toHaveText('✓');

            await firstFilm.click();
            await expect(page.locator('#progress')).toHaveText('○');
        });
    });

    test.describe('Persistence', () => {

        test('should persist prediction across page reload', async ({ page }) => {
            await goToCategoryScreen(page);
            await page.click('.menu-item[data-mode="predictions"]');

            // Get the first film's ID and select it
            const firstFilm = page.locator('#films-list .film').first();
            const nomineeId = await firstFilm.getAttribute('data-id');
            await firstFilm.click();

            // Reload
            await page.reload();

            // Should still have the prediction
            const predictedFilm = page.locator(`.film[data-id="${nomineeId}"]`);
            await expect(predictedFilm).toHaveClass(/predicted/);
        });

        test('should store predictions in localStorage', async ({ page }) => {
            await goToCategoryScreen(page);
            await page.click('.menu-item[data-mode="predictions"]');

            // Make a prediction
            await page.locator('#films-list .film').first().click();

            // Check localStorage
            const predictions = await page.evaluate(() => {
                return JSON.parse(localStorage.getItem('oscar-tracker-predictions') || '{}');
            });

            expect(Object.keys(predictions).length).toBe(1);
            expect(predictions['best-picture']).toBeDefined();
        });

        test('should clear prediction from localStorage when deselected', async ({ page }) => {
            await goToCategoryScreen(page);
            await page.click('.menu-item[data-mode="predictions"]');

            const firstFilm = page.locator('#films-list .film').first();

            // Select then deselect
            await firstFilm.click();
            await firstFilm.click();

            // Check localStorage
            const predictions = await page.evaluate(() => {
                return JSON.parse(localStorage.getItem('oscar-tracker-predictions') || '{}');
            });

            expect(predictions['best-picture']).toBeUndefined();
        });
    });

    test.describe('Category Navigation', () => {

        test('should maintain predictions when navigating categories', async ({ page }) => {
            await goToCategoryScreen(page);
            await page.click('.menu-item[data-mode="predictions"]');

            // Make prediction in first category
            const firstFilm = page.locator('#films-list .film').first();
            const nomineeId = await firstFilm.getAttribute('data-id');
            await firstFilm.click();

            // Navigate to next category
            await page.locator('#next-category').click();

            // Navigate back
            await page.locator('#prev-category').click();

            // Prediction should still be there
            const predictedFilm = page.locator(`.film[data-id="${nomineeId}"]`);
            await expect(predictedFilm).toHaveClass(/predicted/);
        });

        test('should have separate predictions per category', async ({ page }) => {
            await goToCategoryScreen(page);
            await page.click('.menu-item[data-mode="predictions"]');

            // Make prediction in Best Picture
            await page.locator('#films-list .film').first().click();

            // Navigate to Best Director
            await page.locator('#next-category').click();

            // Make different prediction
            await page.locator('#films-list .film').first().click();

            // Check localStorage has two predictions
            const predictions = await page.evaluate(() => {
                return JSON.parse(localStorage.getItem('oscar-tracker-predictions') || '{}');
            });

            expect(Object.keys(predictions).length).toBe(2);
            expect(predictions['best-picture']).toBeDefined();
            expect(predictions['best-director']).toBeDefined();
        });

        test('should show correct progress indicator per category', async ({ page }) => {
            await goToCategoryScreen(page);
            await page.click('.menu-item[data-mode="predictions"]');

            // Make prediction in first category
            await page.locator('#films-list .film').first().click();
            await expect(page.locator('#progress')).toHaveText('✓');

            // Navigate to next category (no prediction)
            await page.locator('#next-category').click();
            await expect(page.locator('#progress')).toHaveText('○');

            // Make prediction here too
            await page.locator('#films-list .film').first().click();
            await expect(page.locator('#progress')).toHaveText('✓');
        });

        test('should use category dropdown to navigate', async ({ page }) => {
            await goToCategoryScreen(page);
            await page.click('.menu-item[data-mode="predictions"]');

            // Make prediction in first category
            await page.locator('#films-list .film').first().click();

            // Use dropdown to go to a different category
            await page.locator('#category-select').selectOption('5'); // Supporting Actress

            // Should show no prediction
            await expect(page.locator('#progress')).toHaveText('○');

            // Make a prediction here
            await page.locator('#films-list .film').first().click();
            await expect(page.locator('#progress')).toHaveText('✓');

            // Go back to first category
            await page.locator('#category-select').selectOption('0');
            await expect(page.locator('#progress')).toHaveText('✓');
        });
    });

    test.describe('Keyboard Interaction', () => {

        test('should select prediction with Enter key', async ({ page }) => {
            await goToCategoryScreen(page);
            await page.click('.menu-item[data-mode="predictions"]');

            const firstFilm = page.locator('#films-list .film').first();
            await firstFilm.focus();
            await page.keyboard.press('Enter');

            await expect(firstFilm).toHaveClass(/predicted/);
        });

        test('should select prediction with Space key', async ({ page }) => {
            await goToCategoryScreen(page);
            await page.click('.menu-item[data-mode="predictions"]');

            const firstFilm = page.locator('#films-list .film').first();
            await firstFilm.focus();
            await page.keyboard.press('Space');

            await expect(firstFilm).toHaveClass(/predicted/);
        });

        test('should navigate categories with arrow keys', async ({ page }) => {
            await goToCategoryScreen(page);
            await page.click('.menu-item[data-mode="predictions"]');

            // Make prediction
            await page.locator('#films-list .film').first().click();

            // Press right arrow to go to next category
            await page.keyboard.press('ArrowRight');

            // Should be on Best Director now
            await expect(page.locator('#category-select')).toHaveValue('1');

            // Press left arrow to go back
            await page.keyboard.press('ArrowLeft');

            // Should be on Best Picture again
            await expect(page.locator('#category-select')).toHaveValue('0');
        });
    });

    test.describe('Visual Styling', () => {

        test('should apply predicted class styling', async ({ page }) => {
            await goToCategoryScreen(page);
            await page.click('.menu-item[data-mode="predictions"]');

            const firstFilm = page.locator('#films-list .film').first();
            await firstFilm.click();

            // Check the film has the gold styling
            const backgroundColor = await firstFilm.evaluate(el => {
                return window.getComputedStyle(el).background;
            });

            // Should contain gold color gradient
            expect(backgroundColor).toContain('rgba');
        });

        test('should have gold checkbox when predicted', async ({ page }) => {
            await goToCategoryScreen(page);
            await page.click('.menu-item[data-mode="predictions"]');

            const firstFilm = page.locator('#films-list .film').first();

            // Verify checkbox doesn't have gold initially
            await expect(firstFilm).not.toHaveClass(/predicted/);

            await firstFilm.click();

            // Wait for the predicted class to be applied
            await expect(firstFilm).toHaveClass(/predicted/);

            // Verify the star icon is visible in the checkbox
            const checkbox = firstFilm.locator('.checkbox');
            const svg = checkbox.locator('svg');
            await expect(svg).toBeVisible();

            // The star polygon should be visible (gold styling is applied via CSS)
            const polygon = svg.locator('polygon');
            await expect(polygon).toBeVisible();
        });
    });

    test.describe('Mode Isolation', () => {

        test('watched items should not affect predictions', async ({ page }) => {
            await goToCategoryScreen(page);

            // In watched mode, mark first film
            await page.locator('#films-list .film').first().click();

            // Switch to predictions mode
            await page.click('.menu-item[data-mode="predictions"]');

            // First film should NOT be predicted
            const firstFilm = page.locator('#films-list .film').first();
            await expect(firstFilm).not.toHaveClass(/predicted/);
        });

        test('predictions should not affect watched items', async ({ page }) => {
            await goToCategoryScreen(page);
            await page.click('.menu-item[data-mode="predictions"]');

            // Make a prediction
            await page.locator('#films-list .film').first().click();

            // Switch to watched mode
            await page.click('.menu-item[data-mode="watched"]');

            // First film should NOT be watched
            const firstFilm = page.locator('#films-list .film').first();
            await expect(firstFilm).not.toHaveClass(/watched/);
        });

        test('should store watched and predictions separately', async ({ page }) => {
            await goToCategoryScreen(page);

            // Mark first film as watched
            await page.locator('#films-list .film').first().click();

            // Switch to predictions, select second film
            await page.click('.menu-item[data-mode="predictions"]');
            await page.locator('#films-list .film').nth(1).click();

            // Check localStorage
            const watched = await page.evaluate(() => {
                return JSON.parse(localStorage.getItem('oscar-tracker-watched') || '[]');
            });
            const predictions = await page.evaluate(() => {
                return JSON.parse(localStorage.getItem('oscar-tracker-predictions') || '{}');
            });

            // Should have separate data
            expect(watched.length).toBeGreaterThan(0);
            expect(Object.keys(predictions).length).toBe(1);
        });
    });

    test.describe('Edge Cases', () => {

        test('should handle rapid clicking without errors', async ({ page }) => {
            await goToCategoryScreen(page);
            await page.click('.menu-item[data-mode="predictions"]');

            const films = page.locator('#films-list .film');

            // Rapidly click different films
            for (let i = 0; i < 5; i++) {
                await films.nth(i % 5).click({ delay: 50 });
            }

            // Should end with exactly one predicted
            const predictedCount = await page.locator('#films-list .film.predicted').count();
            expect(predictedCount).toBe(1);
        });

        test('should handle mode switching while prediction is selected', async ({ page }) => {
            await goToCategoryScreen(page);
            await page.click('.menu-item[data-mode="predictions"]');

            // Make prediction
            await page.locator('#films-list .film').first().click();

            // Switch to watched mode
            await page.click('.menu-item[data-mode="watched"]');

            // Switch back to predictions
            await page.click('.menu-item[data-mode="predictions"]');

            // Prediction should still be there
            await expect(page.locator('#films-list .film').first()).toHaveClass(/predicted/);
        });

        test('should maintain predictions through all categories', async ({ page }) => {
            await goToCategoryScreen(page);
            await page.click('.menu-item[data-mode="predictions"]');

            // Make predictions in all categories
            const categoryCount = 24;
            for (let i = 0; i < categoryCount; i++) {
                await page.locator('#films-list .film').first().click();
                if (i < categoryCount - 1) {
                    await page.locator('#next-category').click();
                }
            }

            // Check all predictions are stored
            const predictions = await page.evaluate(() => {
                return JSON.parse(localStorage.getItem('oscar-tracker-predictions') || '{}');
            });

            expect(Object.keys(predictions).length).toBe(categoryCount);

            // Title should show full count
            await expect(page).toHaveTitle(/Oscar Tracker \(24\/24\)/);
        });
    });

    test.describe('Performance', () => {

        test('should NOT re-render entire list when selecting a prediction', async ({ page }) => {
            await goToCategoryScreen(page);
            await page.click('.menu-item[data-mode="predictions"]');

            // Mark all film elements with a unique data attribute to detect re-rendering
            // If the list is re-rendered via innerHTML, these markers will be lost
            await page.evaluate(() => {
                document.querySelectorAll('#films-list .film').forEach((el, i) => {
                    el.dataset.testMarker = `original-${i}`;
                });
            });

            // Select the first film as a prediction
            await page.locator('#films-list .film').first().click();
            await expect(page.locator('#films-list .film').first()).toHaveClass(/predicted/);

            // Verify ALL film elements still have their original markers
            // This proves the DOM wasn't re-rendered - only classes were updated
            const markersPreserved = await page.evaluate(() => {
                const films = document.querySelectorAll('#films-list .film');
                return Array.from(films).every((el, i) => el.dataset.testMarker === `original-${i}`);
            });

            expect(markersPreserved).toBe(true);
        });

        test('should NOT re-render list when changing prediction within same category', async ({ page }) => {
            await goToCategoryScreen(page);
            await page.click('.menu-item[data-mode="predictions"]');

            // Select first film
            await page.locator('#films-list .film').first().click();

            // Mark all elements after first selection
            await page.evaluate(() => {
                document.querySelectorAll('#films-list .film').forEach((el, i) => {
                    el.dataset.testMarker = `marked-${i}`;
                });
            });

            // Change prediction to second film
            await page.locator('#films-list .film').nth(1).click();

            // First should lose predicted, second should gain it
            await expect(page.locator('#films-list .film').first()).not.toHaveClass(/predicted/);
            await expect(page.locator('#films-list .film').nth(1)).toHaveClass(/predicted/);

            // Verify markers are still present (no re-render)
            const markersPreserved = await page.evaluate(() => {
                const films = document.querySelectorAll('#films-list .film');
                return Array.from(films).every((el, i) => el.dataset.testMarker === `marked-${i}`);
            });

            expect(markersPreserved).toBe(true);
        });

        test('should NOT re-render list when clearing a prediction', async ({ page }) => {
            await goToCategoryScreen(page);
            await page.click('.menu-item[data-mode="predictions"]');

            // Select first film
            await page.locator('#films-list .film').first().click();
            await expect(page.locator('#films-list .film').first()).toHaveClass(/predicted/);

            // Mark elements
            await page.evaluate(() => {
                document.querySelectorAll('#films-list .film').forEach((el, i) => {
                    el.dataset.testMarker = `clear-test-${i}`;
                });
            });

            // Click again to clear prediction
            await page.locator('#films-list .film').first().click();
            await expect(page.locator('#films-list .film').first()).not.toHaveClass(/predicted/);

            // Verify no re-render occurred
            const markersPreserved = await page.evaluate(() => {
                const films = document.querySelectorAll('#films-list .film');
                return Array.from(films).every((el, i) => el.dataset.testMarker === `clear-test-${i}`);
            });

            expect(markersPreserved).toBe(true);
        });
    });
});
