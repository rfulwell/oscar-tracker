// @ts-check
/**
 * Measures DOM element creation/destruction - the key metric for re-render performance
 * Uses innerHTML replacement simulation to compare approaches
 */

const { chromium } = require('playwright');
const { spawn } = require('child_process');

async function measureDOMChurn() {
    const browser = await chromium.launch({
        executablePath: '/root/.cache/ms-playwright/chromium-1194/chrome-linux/chrome',
    });

    const context = await browser.newContext();
    const page = await context.newPage();

    console.log('🔬 Measuring DOM Element Churn\n');
    console.log('='.repeat(60));
    console.log('\nThis test measures how many DOM elements are created/destroyed');
    console.log('when toggling predictions. Fewer is better.\n');

    // Navigate and setup
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    const browseBtn = page.locator('#browse-by-category');
    if (await browseBtn.isVisible()) {
        await browseBtn.click();
        await page.waitForSelector('#films-list .film', { state: 'visible' });
    }

    await page.locator('#mode-select').selectOption('predictions');

    // Get count of film elements
    const filmCount = await page.locator('#films-list .film').count();
    console.log(`📊 Film list contains ${filmCount} elements\n`);

    console.log('📊 Testing OPTIMIZED implementation (current code)...\n');

    // Inject MutationObserver
    await page.evaluate(() => {
        window._mutations = [];
        window._observer = new MutationObserver((records) => {
            records.forEach(r => {
                if (r.type === 'childList') {
                    window._mutations.push({
                        type: 'childList',
                        added: r.addedNodes.length,
                        removed: r.removedNodes.length
                    });
                } else if (r.type === 'attributes') {
                    window._mutations.push({
                        type: 'attributes',
                        attr: r.attributeName
                    });
                }
            });
        });
        window._observer.observe(document.getElementById('films-list'), {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class', 'aria-checked']
        });
    });

    // Do 5 prediction clicks
    for (let i = 0; i < 5; i++) {
        await page.locator('#films-list .film').nth(i).click();
        await page.waitForTimeout(50);
    }

    const optimizedMutations = await page.evaluate(() => {
        window._observer.disconnect();
        return window._mutations;
    });

    const optChildListCount = optimizedMutations.filter(m => m.type === 'childList').length;
    const optNodesAdded = optimizedMutations.filter(m => m.type === 'childList').reduce((sum, m) => sum + m.added, 0);
    const optNodesRemoved = optimizedMutations.filter(m => m.type === 'childList').reduce((sum, m) => sum + m.removed, 0);
    const optAttrChanges = optimizedMutations.filter(m => m.type === 'attributes').length;

    console.log(`   childList mutations: ${optChildListCount}`);
    console.log(`   Nodes added: ${optNodesAdded}`);
    console.log(`   Nodes removed: ${optNodesRemoved}`);
    console.log(`   Attribute changes: ${optAttrChanges}`);

    console.log('\n📊 Simulating BUGGY implementation (innerHTML re-render)...\n');

    // Reload to reset state
    await page.reload();
    await page.waitForLoadState('networkidle');

    if (await page.locator('#browse-by-category').isVisible()) {
        await page.locator('#browse-by-category').click();
        await page.waitForSelector('#films-list .film', { state: 'visible' });
    }
    await page.locator('#mode-select').selectOption('predictions');

    // Set up observer again
    await page.evaluate(() => {
        window._mutations = [];
        window._observer = new MutationObserver((records) => {
            records.forEach(r => {
                if (r.type === 'childList') {
                    window._mutations.push({
                        type: 'childList',
                        added: r.addedNodes.length,
                        removed: r.removedNodes.length
                    });
                } else if (r.type === 'attributes') {
                    window._mutations.push({
                        type: 'attributes',
                        attr: r.attributeName
                    });
                }
            });
        });
        window._observer.observe(document.getElementById('films-list'), {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class', 'aria-checked']
        });
    });

    // Simulate what WOULD happen with innerHTML re-render (5 times)
    // Each re-render removes all children and adds them back
    await page.evaluate((count) => {
        const filmsList = document.getElementById('films-list');

        for (let i = 0; i < 5; i++) {
            // Simulate full re-render by getting and setting innerHTML
            const currentHTML = filmsList.innerHTML;
            filmsList.innerHTML = currentHTML;
        }
    }, filmCount);

    const buggyMutations = await page.evaluate(() => {
        window._observer.disconnect();
        return window._mutations;
    });

    const buggyChildListCount = buggyMutations.filter(m => m.type === 'childList').length;
    const buggyNodesAdded = buggyMutations.filter(m => m.type === 'childList').reduce((sum, m) => sum + m.added, 0);
    const buggyNodesRemoved = buggyMutations.filter(m => m.type === 'childList').reduce((sum, m) => sum + m.removed, 0);
    const buggyAttrChanges = buggyMutations.filter(m => m.type === 'attributes').length;

    console.log(`   childList mutations: ${buggyChildListCount}`);
    console.log(`   Nodes added: ${buggyNodesAdded}`);
    console.log(`   Nodes removed: ${buggyNodesRemoved}`);
    console.log(`   Attribute changes: ${buggyAttrChanges}`);

    // Comparison
    console.log('\n' + '='.repeat(60));
    console.log('\n📈 COMPARISON (5 prediction clicks):\n');
    console.log('                       |  Optimized  |   Buggy   ');
    console.log('   --------------------|-------------|------------');
    console.log(`   Nodes added         |     ${optNodesAdded.toString().padStart(5)}   |    ${buggyNodesAdded.toString().padStart(5)}`);
    console.log(`   Nodes removed       |     ${optNodesRemoved.toString().padStart(5)}   |    ${buggyNodesRemoved.toString().padStart(5)}`);
    console.log(`   Total DOM churn     |     ${(optNodesAdded + optNodesRemoved).toString().padStart(5)}   |    ${(buggyNodesAdded + buggyNodesRemoved).toString().padStart(5)}`);
    console.log(`   Attribute changes   |     ${optAttrChanges.toString().padStart(5)}   |    ${buggyAttrChanges.toString().padStart(5)}`);

    const churnReduction = (buggyNodesAdded + buggyNodesRemoved) - (optNodesAdded + optNodesRemoved);
    const churnPercent = ((churnReduction / (buggyNodesAdded + buggyNodesRemoved)) * 100).toFixed(0);

    console.log('\n   ✅ Optimization eliminates:');
    console.log(`      - ${churnReduction} unnecessary DOM node operations`);
    console.log(`      - ${churnPercent}% of DOM churn`);
    console.log(`      - Uses only ${optAttrChanges} attribute updates instead`);

    console.log('\n   Why this matters for UX:');
    console.log('      - Event listeners stay attached (no re-binding needed)');
    console.log('      - Focus state preserved (better keyboard navigation)');
    console.log('      - Smoother transitions and animations');
    console.log('      - Less garbage collection = fewer jank frames');
    console.log('      - Screen readers don\'t lose their place');

    console.log('\n' + '='.repeat(60));

    await browser.close();
}

// Start HTTP server and run
console.log('Starting local server...');
const server = spawn('python3', ['-m', 'http.server', '3000'], {
    cwd: '/home/user/oscar-tracker',
    stdio: ['ignore', 'pipe', 'pipe']
});

setTimeout(async () => {
    try {
        await measureDOMChurn();
    } catch (error) {
        console.error('Error:', error);
    } finally {
        server.kill();
        process.exit(0);
    }
}, 1000);
