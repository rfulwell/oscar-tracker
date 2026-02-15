// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Viewport Layout Tests
 *
 * These tests ensure the app layout displays correctly across different
 * viewport sizes, particularly mobile devices. They catch issues like:
 * - Content being clipped on screen edges
 * - Safe area insets not being handled properly
 * - Layout overflow causing horizontal scrolling
 */

// Test with iPhone-like viewport sizes
const mobileViewport = { width: 390, height: 844 }; // iPhone 14
const smallMobileViewport = { width: 375, height: 667 }; // iPhone SE
const largeMobileViewport = { width: 430, height: 932 }; // iPhone 14 Pro Max

test.describe('Viewport Layout - Mobile', () => {
    test.beforeEach(async ({ page }) => {
        await page.setViewportSize(mobileViewport);
        await page.goto('/');
        await page.evaluate(() => localStorage.clear());
        await page.reload();
        await page.waitForLoadState('domcontentloaded');
    });

    // Helper to get to category screen
    async function goToCategoryScreen(page) {
        const browseBtn = page.locator('#browse-by-category');
        if (await browseBtn.isVisible()) {
            await browseBtn.click();
        }
        await page.waitForSelector('#films-list .film', { state: 'visible' });
    }

    test.describe('Content Visibility', () => {

        test('app container should not extend beyond viewport left edge', async ({ page }) => {
            await goToCategoryScreen(page);

            const app = page.locator('.app');
            const box = await app.boundingBox();

            expect(box).not.toBeNull();
            // App should start at x=0 or slightly right (not negative/clipped)
            expect(box.x).toBeGreaterThanOrEqual(0);
        });

        test('header title should be fully visible within viewport', async ({ page }) => {
            await goToCategoryScreen(page);

            const title = page.locator('.title');
            const box = await title.boundingBox();
            const viewport = page.viewportSize();

            expect(box).not.toBeNull();
            // Title should start within viewport (left edge >= 0)
            expect(box.x).toBeGreaterThanOrEqual(0);
            // Title should end within viewport (right edge <= viewport width)
            expect(box.x + box.width).toBeLessThanOrEqual(viewport.width);
        });

        test('header subtitle should be fully visible within viewport', async ({ page }) => {
            await goToCategoryScreen(page);

            const subtitle = page.locator('.subtitle');
            const box = await subtitle.boundingBox();
            const viewport = page.viewportSize();

            expect(box).not.toBeNull();
            expect(box.x).toBeGreaterThanOrEqual(0);
            expect(box.x + box.width).toBeLessThanOrEqual(viewport.width);
        });

        test('ceremony info bar should be fully visible', async ({ page }) => {
            await goToCategoryScreen(page);

            const ceremonyInfo = page.locator('.ceremony-info');
            const box = await ceremonyInfo.boundingBox();
            const viewport = page.viewportSize();

            expect(box).not.toBeNull();
            expect(box.x).toBeGreaterThanOrEqual(0);
            expect(box.x + box.width).toBeLessThanOrEqual(viewport.width);
        });

        test('film checkboxes should not be clipped on left edge', async ({ page }) => {
            await goToCategoryScreen(page);

            // Check all visible film checkboxes
            const checkboxes = page.locator('#films-list .film .checkbox');
            const count = await checkboxes.count();

            for (let i = 0; i < Math.min(count, 5); i++) {
                const checkbox = checkboxes.nth(i);
                const box = await checkbox.boundingBox();

                expect(box).not.toBeNull();
                // Checkbox should be fully visible (not clipped on left)
                expect(box.x).toBeGreaterThanOrEqual(0);
            }
        });

        test('film items should fit within viewport width', async ({ page }) => {
            await goToCategoryScreen(page);

            const films = page.locator('#films-list .film');
            const viewport = page.viewportSize();
            const count = await films.count();

            for (let i = 0; i < Math.min(count, 5); i++) {
                const film = films.nth(i);
                const box = await film.boundingBox();

                expect(box).not.toBeNull();
                // Film should start within viewport
                expect(box.x).toBeGreaterThanOrEqual(0);
                // Film should end within viewport (with small tolerance for borders)
                expect(box.x + box.width).toBeLessThanOrEqual(viewport.width + 2);
            }
        });

        test('category navigation buttons should be visible', async ({ page }) => {
            await goToCategoryScreen(page);

            const prevBtn = page.locator('#prev-category');
            const nextBtn = page.locator('#next-category');
            const viewport = page.viewportSize();

            const prevBox = await prevBtn.boundingBox();
            const nextBox = await nextBtn.boundingBox();

            expect(prevBox).not.toBeNull();
            expect(nextBox).not.toBeNull();

            // Prev button should be fully visible
            expect(prevBox.x).toBeGreaterThanOrEqual(0);

            // Next button should be within viewport
            expect(nextBox.x + nextBox.width).toBeLessThanOrEqual(viewport.width);
        });
    });

    test.describe('No Horizontal Overflow', () => {

        test('page should not have horizontal scroll on mobile', async ({ page }) => {
            await goToCategoryScreen(page);

            // Check if horizontal scrolling is possible
            const hasHorizontalScroll = await page.evaluate(() => {
                return document.documentElement.scrollWidth > document.documentElement.clientWidth;
            });

            expect(hasHorizontalScroll).toBe(false);
        });

        test('body should not overflow horizontally', async ({ page }) => {
            await goToCategoryScreen(page);

            const bodyOverflow = await page.evaluate(() => {
                const body = document.body;
                const html = document.documentElement;
                return {
                    bodyScrollWidth: body.scrollWidth,
                    bodyClientWidth: body.clientWidth,
                    htmlScrollWidth: html.scrollWidth,
                    htmlClientWidth: html.clientWidth
                };
            });

            // Body/html scroll width should not exceed client width
            expect(bodyOverflow.bodyScrollWidth).toBeLessThanOrEqual(bodyOverflow.bodyClientWidth + 1);
            expect(bodyOverflow.htmlScrollWidth).toBeLessThanOrEqual(bodyOverflow.htmlClientWidth + 1);
        });

        test('main content should stay within viewport bounds', async ({ page }) => {
            await goToCategoryScreen(page);

            const main = page.locator('#category-screen');
            const box = await main.boundingBox();
            const viewport = page.viewportSize();

            expect(box).not.toBeNull();
            expect(box.x).toBeGreaterThanOrEqual(0);
            expect(box.x + box.width).toBeLessThanOrEqual(viewport.width);
        });
    });

    test.describe('App Container Margins', () => {

        test('app container should have no left margin on mobile', async ({ page }) => {
            await goToCategoryScreen(page);

            const marginLeft = await page.evaluate(() => {
                const app = document.querySelector('.app');
                return window.getComputedStyle(app).marginLeft;
            });

            // On mobile, margin-left should be 0px (no sidebar offset)
            expect(marginLeft).toBe('0px');
        });

        test('app container should not have transform offset', async ({ page }) => {
            await goToCategoryScreen(page);

            const transform = await page.evaluate(() => {
                const app = document.querySelector('.app');
                return window.getComputedStyle(app).transform;
            });

            // Transform should be 'none' or not include a negative X translation
            if (transform !== 'none') {
                // If there's a transform, it shouldn't have negative X
                const match = transform.match(/matrix\([^,]+,[^,]+,[^,]+,[^,]+,([^,]+)/);
                if (match) {
                    const translateX = parseFloat(match[1]);
                    expect(translateX).toBeGreaterThanOrEqual(0);
                }
            }
        });
    });
});

test.describe('Viewport Layout - Different Mobile Sizes', () => {

    test('should display correctly on iPhone SE (small)', async ({ page }) => {
        await page.setViewportSize(smallMobileViewport);
        await page.goto('/');
        await page.evaluate(() => localStorage.clear());
        await page.reload();

        const browseBtn = page.locator('#browse-by-category');
        if (await browseBtn.isVisible()) {
            await browseBtn.click();
        }
        await page.waitForSelector('#films-list .film', { state: 'visible' });

        // Verify no horizontal overflow
        const hasHorizontalScroll = await page.evaluate(() => {
            return document.documentElement.scrollWidth > document.documentElement.clientWidth;
        });
        expect(hasHorizontalScroll).toBe(false);

        // Verify checkboxes visible
        const checkbox = page.locator('#films-list .film .checkbox').first();
        const box = await checkbox.boundingBox();
        expect(box).not.toBeNull();
        expect(box.x).toBeGreaterThanOrEqual(0);
    });

    test('should display correctly on iPhone 14 Pro Max (large)', async ({ page }) => {
        await page.setViewportSize(largeMobileViewport);
        await page.goto('/');
        await page.evaluate(() => localStorage.clear());
        await page.reload();

        const browseBtn = page.locator('#browse-by-category');
        if (await browseBtn.isVisible()) {
            await browseBtn.click();
        }
        await page.waitForSelector('#films-list .film', { state: 'visible' });

        // Verify no horizontal overflow
        const hasHorizontalScroll = await page.evaluate(() => {
            return document.documentElement.scrollWidth > document.documentElement.clientWidth;
        });
        expect(hasHorizontalScroll).toBe(false);

        // Verify title visible
        const title = page.locator('.title');
        const box = await title.boundingBox();
        const viewport = page.viewportSize();
        expect(box).not.toBeNull();
        expect(box.x).toBeGreaterThanOrEqual(0);
        expect(box.x + box.width).toBeLessThanOrEqual(viewport.width);
    });
});

test.describe('Viewport Layout - Safe Area Simulation', () => {

    test('app should handle safe-area CSS variables gracefully', async ({ page }) => {
        await page.setViewportSize(mobileViewport);
        await page.goto('/');
        await page.evaluate(() => localStorage.clear());
        await page.reload();

        const browseBtn = page.locator('#browse-by-category');
        if (await browseBtn.isVisible()) {
            await browseBtn.click();
        }
        await page.waitForSelector('#films-list .film', { state: 'visible' });

        // Verify safe-area variables don't cause layout issues
        const layoutInfo = await page.evaluate(() => {
            const root = document.documentElement;
            const style = getComputedStyle(root);
            const app = document.querySelector('.app');
            const appStyle = getComputedStyle(app);

            return {
                safeAreaTop: style.getPropertyValue('--safe-area-top'),
                safeAreaBottom: style.getPropertyValue('--safe-area-bottom'),
                appPaddingTop: appStyle.paddingTop,
                appPaddingBottom: appStyle.paddingBottom,
                appMarginLeft: appStyle.marginLeft
            };
        });

        // App should not have unexpected left margin from safe areas
        expect(layoutInfo.appMarginLeft).toBe('0px');
    });

    test('app content should be fully visible when simulating safe area insets', async ({ page }) => {
        await page.setViewportSize(mobileViewport);
        await page.goto('/');
        await page.evaluate(() => localStorage.clear());

        // Inject CSS to simulate safe area insets (like iOS device)
        await page.addStyleTag({
            content: `
                :root {
                    --safe-area-top: 47px;
                    --safe-area-bottom: 34px;
                    --safe-area-left: 0px;
                    --safe-area-right: 0px;
                }
            `
        });

        await page.reload();

        const browseBtn = page.locator('#browse-by-category');
        if (await browseBtn.isVisible()) {
            await browseBtn.click();
        }
        await page.waitForSelector('#films-list .film', { state: 'visible' });

        // Verify no horizontal overflow
        const hasHorizontalScroll = await page.evaluate(() => {
            return document.documentElement.scrollWidth > document.documentElement.clientWidth;
        });
        expect(hasHorizontalScroll).toBe(false);

        // Verify content is visible
        const title = page.locator('.title');
        const box = await title.boundingBox();
        const viewport = page.viewportSize();

        expect(box).not.toBeNull();
        expect(box.x).toBeGreaterThanOrEqual(0);
        expect(box.x + box.width).toBeLessThanOrEqual(viewport.width);
    });
});

test.describe('All Sides Visibility', () => {

    test.beforeEach(async ({ page }) => {
        await page.setViewportSize(mobileViewport);
        await page.goto('/');
        await page.evaluate(() => localStorage.clear());
        await page.reload();
        await page.waitForLoadState('domcontentloaded');
    });

    async function goToCategoryScreen(page) {
        const browseBtn = page.locator('#browse-by-category');
        if (await browseBtn.isVisible()) {
            await browseBtn.click();
        }
        await page.waitForSelector('#films-list .film', { state: 'visible' });
    }

    test('trophy icon should be fully visible when scrolled to top', async ({ page }) => {
        await goToCategoryScreen(page);

        // Scroll to top to ensure trophy is in view
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.waitForTimeout(100);

        const trophy = page.locator('.trophy-icon');
        const box = await trophy.boundingBox();
        const viewport = page.viewportSize();

        expect(box).not.toBeNull();
        // Check horizontal bounds (left/right should always be within viewport)
        expect(box.x).toBeGreaterThanOrEqual(0); // left
        expect(box.x + box.width).toBeLessThanOrEqual(viewport.width); // right
        // Check vertical bounds when scrolled to top
        expect(box.y).toBeGreaterThanOrEqual(0); // top
        expect(box.y + box.height).toBeLessThanOrEqual(viewport.height); // bottom (within initial view)
    });

    test('subtitle (Academy Awards) should be fully visible', async ({ page }) => {
        await goToCategoryScreen(page);

        const subtitle = page.locator('.subtitle');
        const box = await subtitle.boundingBox();
        const viewport = page.viewportSize();

        expect(box).not.toBeNull();
        expect(box.x).toBeGreaterThanOrEqual(0);
        expect(box.y).toBeGreaterThanOrEqual(0);
        expect(box.x + box.width).toBeLessThanOrEqual(viewport.width);
    });

    test('ceremony date text should be fully visible', async ({ page }) => {
        await goToCategoryScreen(page);

        // Check the date text in ceremony-info
        const dateSpan = page.locator('.ceremony-info span').first();
        const box = await dateSpan.boundingBox();
        const viewport = page.viewportSize();

        expect(box).not.toBeNull();
        expect(box.x).toBeGreaterThanOrEqual(0);
        expect(box.x + box.width).toBeLessThanOrEqual(viewport.width);
    });

    test('footer should be within viewport bounds', async ({ page }) => {
        await goToCategoryScreen(page);

        // Scroll to bottom to see footer
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await page.waitForTimeout(100);

        const footer = page.locator('.footer');
        const box = await footer.boundingBox();
        const viewport = page.viewportSize();

        expect(box).not.toBeNull();
        // Footer should be within horizontal bounds
        expect(box.x).toBeGreaterThanOrEqual(0);
        expect(box.x + box.width).toBeLessThanOrEqual(viewport.width);
    });

    test('app container should exactly fit viewport width (no overflow)', async ({ page }) => {
        await goToCategoryScreen(page);

        const layoutMetrics = await page.evaluate(() => {
            const app = document.querySelector('.app');
            const rect = app.getBoundingClientRect();
            return {
                appLeft: rect.left,
                appRight: rect.right,
                appWidth: rect.width,
                viewportWidth: window.innerWidth,
                bodyScrollWidth: document.body.scrollWidth,
                hasOverflow: document.body.scrollWidth > window.innerWidth
            };
        });

        // App should start at left edge (0 or with safe area padding)
        expect(layoutMetrics.appLeft).toBeGreaterThanOrEqual(0);
        // App should not cause horizontal overflow
        expect(layoutMetrics.hasOverflow).toBe(false);
    });
});

test.describe('Search View Layout', () => {

    test.beforeEach(async ({ page }) => {
        await page.setViewportSize(mobileViewport);
        await page.goto('/');
        await page.evaluate(() => localStorage.clear());
        await page.reload();
        await page.waitForLoadState('domcontentloaded');

        const browseBtn = page.locator('#browse-by-category');
        if (await browseBtn.isVisible()) {
            await browseBtn.click();
        }
        await page.waitForSelector('#films-list .film', { state: 'visible' });
    });

    test('search view should fill viewport without clipping', async ({ page }) => {
        // Open search
        await page.click('#search-btn');
        await page.waitForSelector('.search-view.active', { state: 'visible' });

        const searchView = page.locator('.search-view');
        const box = await searchView.boundingBox();
        const viewport = page.viewportSize();

        expect(box).not.toBeNull();
        // Should start at left edge
        expect(box.x).toBe(0);
        // Should span full width
        expect(box.width).toBe(viewport.width);
    });

    test('search header should be fully visible on mobile', async ({ page }) => {
        await page.click('#search-btn');
        await page.waitForSelector('.search-view.active', { state: 'visible' });

        const searchHeader = page.locator('.search-header');
        const box = await searchHeader.boundingBox();
        const viewport = page.viewportSize();

        expect(box).not.toBeNull();
        expect(box.x).toBeGreaterThanOrEqual(0);
        expect(box.x + box.width).toBeLessThanOrEqual(viewport.width);
    });

    test('search back button should be visible and clickable', async ({ page }) => {
        await page.click('#search-btn');
        await page.waitForSelector('.search-view.active', { state: 'visible' });

        const backBtn = page.locator('#search-back');
        const box = await backBtn.boundingBox();

        expect(box).not.toBeNull();
        // Back button should be fully within viewport
        expect(box.x).toBeGreaterThanOrEqual(0);

        // Should be clickable
        await expect(backBtn).toBeVisible();
        await expect(backBtn).toBeEnabled();
    });

    test('search input should be fully visible', async ({ page }) => {
        await page.click('#search-btn');
        await page.waitForSelector('.search-view.active', { state: 'visible' });

        const searchInput = page.locator('#search-input');
        const box = await searchInput.boundingBox();
        const viewport = page.viewportSize();

        expect(box).not.toBeNull();
        expect(box.x).toBeGreaterThanOrEqual(0);
        expect(box.x + box.width).toBeLessThanOrEqual(viewport.width);
    });
});
