// @ts-check
const { test, expect } = require('@playwright/test');

// Helper to complete onboarding
async function completeOnboarding(page) {
    await page.goto('http://localhost:3000/');
    await page.waitForLoadState('networkidle');

    // Click "Browse by Category" to skip onboarding if visible
    const browseBtn = page.locator('#browse-by-category');
    if (await browseBtn.isVisible()) {
        await browseBtn.click();
        await page.waitForTimeout(300);
    }
}

// Helper to switch to streamable mode
async function switchToStreamable(page) {
    await page.click('#hamburger-btn');
    await page.waitForTimeout(200);
    await page.click('[data-mode="streamable"]');
    await page.waitForTimeout(300);
}

test.describe('Search Feature', () => {
    test.beforeEach(async ({ page }) => {
        // Clear localStorage before each test
        await page.goto('http://localhost:3000/');
        await page.evaluate(() => localStorage.clear());
    });

    test('search icon opens search view', async ({ page }) => {
        await completeOnboarding(page);

        await page.click('#search-btn');
        await page.waitForTimeout(200);

        await expect(page.locator('#search-view')).toBeVisible();
        await expect(page.locator('#search-input')).toBeFocused();
    });

    test('typing filters films by title', async ({ page }) => {
        await completeOnboarding(page);
        await page.click('#search-btn');

        await page.fill('#search-input', 'sinners');
        await page.waitForTimeout(200);

        const results = page.locator('.search-result');
        await expect(results).toHaveCount(1);
        await expect(results.first()).toContainText('Sinners');
    });

    test('no match shows empty state', async ({ page }) => {
        await completeOnboarding(page);
        await page.click('#search-btn');

        await page.fill('#search-input', 'xylophone');
        await page.waitForTimeout(200);

        await expect(page.locator('#search-empty')).toBeVisible();
        await expect(page.locator('.search-empty-title')).toHaveText('No nominations found');
    });

    test('clicking film result shows categories', async ({ page }) => {
        await completeOnboarding(page);
        await page.click('#search-btn');

        await page.fill('#search-input', 'sinners');
        await page.waitForTimeout(200);
        await page.click('.search-result[data-film="sinners"]');
        await page.waitForTimeout(200);

        // Should show film header
        await expect(page.locator('#search-film-header')).toBeVisible();
        await expect(page.locator('#search-film-title')).toHaveText('Sinners');
        await expect(page.locator('#search-film-count')).toContainText('16 nominations');

        // Should show category results
        const categories = page.locator('.category-result');
        await expect(categories.first()).toContainText('Best Picture');
    });

    test('clicking category result navigates to correct category', async ({ page }) => {
        await completeOnboarding(page);
        await page.click('#search-btn');

        await page.fill('#search-input', 'sinners');
        await page.waitForTimeout(200);
        await page.click('.search-result[data-film="sinners"]');
        await page.waitForTimeout(200);

        // Click on "Best Director" which is category index 1
        await page.click('.category-result:has-text("Best Director")');
        await page.waitForTimeout(300);

        // Search should be closed
        await expect(page.locator('#search-view')).toBeHidden();

        // Should be on Best Director category
        const categorySelect = page.locator('#category-select');
        await expect(categorySelect).toHaveValue('1');

        // Should see director nominees
        await expect(page.locator('#films-list')).toContainText('Ryan Coogler');
    });

    test('clicking Best Picture navigates to category index 0', async ({ page }) => {
        await completeOnboarding(page);
        await page.click('#search-btn');

        await page.fill('#search-input', 'sinners');
        await page.waitForTimeout(200);
        await page.click('.search-result[data-film="sinners"]');
        await page.waitForTimeout(200);

        // Click on "Best Picture" which is category index 0
        await page.click('.category-result:has-text("Best Picture")');
        await page.waitForTimeout(300);

        // Should be on Best Picture category (index 0)
        const categorySelect = page.locator('#category-select');
        await expect(categorySelect).toHaveValue('0');

        // Should see Best Picture nominees
        await expect(page.locator('#films-list')).toContainText('Sinners');
        await expect(page.locator('#films-list')).toContainText('Warner Bros.');
    });

    test('clicking Best Cinematography navigates to correct category', async ({ page }) => {
        await completeOnboarding(page);
        await page.click('#search-btn');

        await page.fill('#search-input', 'sinners');
        await page.waitForTimeout(200);
        await page.click('.search-result[data-film="sinners"]');
        await page.waitForTimeout(200);

        // Click on "Best Cinematography"
        await page.click('.category-result:has-text("Best Cinematography")');
        await page.waitForTimeout(300);

        // Should be on Cinematography category (index 11)
        const categorySelect = page.locator('#category-select');
        await expect(categorySelect).toHaveValue('11');

        // Should see cinematography nominees including Sinners' cinematographer
        await expect(page.locator('#films-list')).toContainText('Autumn Durald Arkapaw');
    });

    test('Escape closes search', async ({ page }) => {
        await completeOnboarding(page);
        await page.click('#search-btn');
        await page.waitForTimeout(200);

        await page.keyboard.press('Escape');
        await page.waitForTimeout(200);

        await expect(page.locator('#search-view')).toBeHidden();
    });

    test('close button closes search', async ({ page }) => {
        await completeOnboarding(page);
        await page.click('#search-btn');
        await page.waitForTimeout(200);

        await page.click('#search-close');
        await page.waitForTimeout(200);

        await expect(page.locator('#search-view')).toBeHidden();
    });

    test('back button from film results returns to search input', async ({ page }) => {
        await completeOnboarding(page);
        await page.click('#search-btn');

        await page.fill('#search-input', 'sinners');
        await page.waitForTimeout(200);
        await page.click('.search-result[data-film="sinners"]');
        await page.waitForTimeout(200);

        // Now click back
        await page.click('#search-back');
        await page.waitForTimeout(200);

        // Should be back at search input view
        await expect(page.locator('#search-film-header')).toBeHidden();
        await expect(page.locator('.search-result[data-film="sinners"]')).toBeVisible();
    });

    test('tapping film in streamable list opens search for that film', async ({ page }) => {
        // Use mobile viewport since hamburger is hidden on desktop
        await page.setViewportSize({ width: 390, height: 844 });

        await completeOnboarding(page);

        // Switch to streamable mode via hamburger menu
        const hamburgerBtn = page.locator('#hamburger-btn');
        await expect(hamburgerBtn).toBeVisible({ timeout: 5000 });
        await hamburgerBtn.click();
        await page.waitForTimeout(200);

        await page.click('[data-mode="streamable"]');
        await page.waitForTimeout(500);

        // Should be in streamable mode - check for streamable films
        const sinnersFilm = page.locator('.film.streamable[data-film="sinners"]');
        await expect(sinnersFilm).toBeVisible({ timeout: 5000 });

        // Click on Sinners film title (avoid clicking on the streaming icon link)
        await sinnersFilm.locator('.film-title').click();
        await page.waitForTimeout(300);

        // Search should be open with Sinners' categories
        await expect(page.locator('#search-view')).toBeVisible();
        await expect(page.locator('#search-film-title')).toHaveText('Sinners');
    });
});
