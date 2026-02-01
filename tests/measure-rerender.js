// @ts-check
/**
 * Measures the performance difference between:
 * - Full list re-render (the bug)
 * - In-place DOM update (the fix)
 */

const { chromium } = require('playwright');
const { spawn } = require('child_process');

async function measureRerenderPerformance() {
    const browser = await chromium.launch({
        executablePath: '/root/.cache/ms-playwright/chromium-1194/chrome-linux/chrome',
    });

    const context = await browser.newContext();
    const page = await context.newPage();
    const client = await context.newCDPSession(page);

    await client.send('Performance.enable');

    console.log('🔬 Measuring Prediction Toggle Performance\n');
    console.log('='.repeat(60));

    // Navigate and setup
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    const browseBtn = page.locator('#browse-by-category');
    if (await browseBtn.isVisible()) {
        await browseBtn.click();
        await page.waitForSelector('#films-list .film', { state: 'visible' });
    }

    await page.locator('#mode-select').selectOption('predictions');

    // Warm up JIT
    console.log('\n⏳ Warming up JIT compiler...');
    for (let i = 0; i < 3; i++) {
        await page.locator('#films-list .film').nth(i).click();
        await page.waitForTimeout(10);
    }

    // Get baseline metrics
    const baseMetrics = await client.send('Performance.getMetrics');
    const baseLayoutCount = baseMetrics.metrics.find(m => m.name === 'LayoutCount').value;
    const baseRecalcCount = baseMetrics.metrics.find(m => m.name === 'RecalcStyleCount').value;

    console.log('\n📊 Testing CURRENT implementation (optimized in-place updates)...\n');

    // Measure current implementation (10 toggles)
    const currentTimes = [];
    for (let i = 0; i < 10; i++) {
        const filmIndex = i % 5;

        const startMetrics = await client.send('Performance.getMetrics');
        const startTime = performance.now();

        await page.locator('#films-list .film').nth(filmIndex).click();

        const endTime = performance.now();
        const endMetrics = await client.send('Performance.getMetrics');

        currentTimes.push({
            time: endTime - startTime,
            layouts: endMetrics.metrics.find(m => m.name === 'LayoutCount').value -
                    startMetrics.metrics.find(m => m.name === 'LayoutCount').value,
            recalcs: endMetrics.metrics.find(m => m.name === 'RecalcStyleCount').value -
                    startMetrics.metrics.find(m => m.name === 'RecalcStyleCount').value
        });

        await page.waitForTimeout(50);
    }

    // Display results
    console.log('   Click  |  Time (ms)  |  Layouts  |  Style Recalcs');
    console.log('   -------|-------------|-----------|----------------');
    currentTimes.forEach((t, i) => {
        console.log(`     ${i + 1}    |    ${t.time.toFixed(1).padStart(5)}    |     ${t.layouts}     |       ${t.recalcs}`);
    });

    const avgTime = currentTimes.reduce((a, b) => a + b.time, 0) / currentTimes.length;
    const avgLayouts = currentTimes.reduce((a, b) => a + b.layouts, 0) / currentTimes.length;
    const avgRecalcs = currentTimes.reduce((a, b) => a + b.recalcs, 0) / currentTimes.length;

    console.log('   -------|-------------|-----------|----------------');
    console.log(`   AVG    |    ${avgTime.toFixed(1).padStart(5)}    |    ${avgLayouts.toFixed(1)}    |      ${avgRecalcs.toFixed(1)}`);

    // Now inject the buggy version and measure
    console.log('\n📊 Testing BUGGY implementation (full re-render)...\n');

    // Inject buggy togglePrediction that calls renderNominees
    await page.evaluate(() => {
        // Store original
        window._originalTogglePrediction = window.togglePrediction;

        // Override with buggy version
        window.togglePrediction = function(nomineeId) {
            const category = window.getCurrentCategory();
            const currentPrediction = window.predictions[category.id];

            if (currentPrediction === nomineeId) {
                delete window.predictions[category.id];
            } else {
                window.predictions[category.id] = nomineeId;
            }

            window.savePredictions();
            window.renderNominees(); // BUG: Full re-render!
            window.updateProgress();
        };
    });

    // Measure buggy implementation
    const buggyTimes = [];
    for (let i = 0; i < 10; i++) {
        const filmIndex = i % 5;

        const startMetrics = await client.send('Performance.getMetrics');
        const startTime = performance.now();

        await page.locator('#films-list .film').nth(filmIndex).click();

        const endTime = performance.now();
        const endMetrics = await client.send('Performance.getMetrics');

        buggyTimes.push({
            time: endTime - startTime,
            layouts: endMetrics.metrics.find(m => m.name === 'LayoutCount').value -
                    startMetrics.metrics.find(m => m.name === 'LayoutCount').value,
            recalcs: endMetrics.metrics.find(m => m.name === 'RecalcStyleCount').value -
                    startMetrics.metrics.find(m => m.name === 'RecalcStyleCount').value
        });

        await page.waitForTimeout(50);
    }

    console.log('   Click  |  Time (ms)  |  Layouts  |  Style Recalcs');
    console.log('   -------|-------------|-----------|----------------');
    buggyTimes.forEach((t, i) => {
        console.log(`     ${i + 1}    |    ${t.time.toFixed(1).padStart(5)}    |     ${t.layouts}     |       ${t.recalcs}`);
    });

    const buggyAvgTime = buggyTimes.reduce((a, b) => a + b.time, 0) / buggyTimes.length;
    const buggyAvgLayouts = buggyTimes.reduce((a, b) => a + b.layouts, 0) / buggyTimes.length;
    const buggyAvgRecalcs = buggyTimes.reduce((a, b) => a + b.recalcs, 0) / buggyTimes.length;

    console.log('   -------|-------------|-----------|----------------');
    console.log(`   AVG    |    ${buggyAvgTime.toFixed(1).padStart(5)}    |    ${buggyAvgLayouts.toFixed(1)}    |      ${buggyAvgRecalcs.toFixed(1)}`);

    // Comparison
    console.log('\n' + '='.repeat(60));
    console.log('\n📈 COMPARISON SUMMARY:\n');
    console.log('                    |  Optimized  |   Buggy   |  Difference');
    console.log('   -----------------|-------------|-----------|-------------');
    console.log(`   Avg Time (ms)    |    ${avgTime.toFixed(1).padStart(5)}    |   ${buggyAvgTime.toFixed(1).padStart(5)}   |    ${((buggyAvgTime - avgTime)).toFixed(1)}ms`);
    console.log(`   Avg Layouts      |     ${avgLayouts.toFixed(1).padStart(4)}    |    ${buggyAvgLayouts.toFixed(1).padStart(4)}   |    +${(buggyAvgLayouts - avgLayouts).toFixed(1)}`);
    console.log(`   Avg Recalcs      |     ${avgRecalcs.toFixed(1).padStart(4)}    |    ${buggyAvgRecalcs.toFixed(1).padStart(4)}   |    +${(buggyAvgRecalcs - avgRecalcs).toFixed(1)}`);

    const timeImprovement = ((buggyAvgTime - avgTime) / buggyAvgTime * 100).toFixed(0);
    const layoutImprovement = ((buggyAvgLayouts - avgLayouts) / buggyAvgLayouts * 100).toFixed(0);

    console.log('\n   ✅ Optimization saves:');
    if (buggyAvgTime > avgTime) {
        console.log(`      - ${timeImprovement}% execution time`);
    }
    if (buggyAvgLayouts > avgLayouts) {
        console.log(`      - ${layoutImprovement}% fewer layout operations`);
    }
    console.log(`      - ${(buggyAvgRecalcs - avgRecalcs).toFixed(0)} fewer style recalculations per click`);

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
        await measureRerenderPerformance();
    } catch (error) {
        console.error('Error:', error);
    } finally {
        server.kill();
        process.exit(0);
    }
}, 1000);
