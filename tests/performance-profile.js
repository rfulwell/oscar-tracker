// @ts-check
/**
 * Performance profiling script using Chrome DevTools Protocol via Playwright
 * Analyzes JavaScript execution, rendering, and interaction performance
 */

const { chromium } = require('playwright');

async function runPerformanceAnalysis() {
    const browser = await chromium.launch({
        executablePath: '/root/.cache/ms-playwright/chromium-1194/chrome-linux/chrome',
    });

    const context = await browser.newContext();
    const page = await context.newPage();

    // Get CDP session for detailed profiling
    const client = await context.newCDPSession(page);

    console.log('🔍 Starting Performance Analysis for Oscar Tracker\n');
    console.log('='.repeat(60));

    // Enable performance domain
    await client.send('Performance.enable');

    // Start JavaScript profiling
    await client.send('Profiler.enable');
    await client.send('Profiler.start');

    // Start tracing for detailed timeline
    await client.send('Tracing.start', {
        categories: [
            'devtools.timeline',
            'v8.execute',
            'blink.user_timing',
            'loading',
            'devtools.timeline.frame'
        ].join(','),
        options: 'sampling-frequency=10000'
    });

    // Navigate to the app
    console.log('\n📱 Loading app...');
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    // Get initial metrics
    const initialMetrics = await client.send('Performance.getMetrics');
    console.log('\n📊 Initial Load Metrics:');
    printMetrics(initialMetrics.metrics);

    // Skip onboarding if present
    const browseBtn = page.locator('#browse-by-category');
    if (await browseBtn.isVisible()) {
        await browseBtn.click();
        await page.waitForSelector('#films-list .film', { state: 'visible' });
    }

    // Switch to predictions mode
    await page.locator('#mode-select').selectOption('predictions');

    console.log('\n🎯 Profiling prediction interactions...\n');

    // Profile prediction toggle operations
    const interactionTimes = [];

    for (let i = 0; i < 5; i++) {
        const startTime = Date.now();
        await page.locator('#films-list .film').nth(i).click();
        await page.waitForTimeout(50); // Small wait for DOM update
        const endTime = Date.now();
        interactionTimes.push(endTime - startTime);
    }

    console.log('⏱️  Prediction Toggle Times (ms):');
    interactionTimes.forEach((time, i) => {
        console.log(`   Click ${i + 1}: ${time}ms`);
    });
    console.log(`   Average: ${(interactionTimes.reduce((a, b) => a + b, 0) / interactionTimes.length).toFixed(1)}ms`);

    // Profile category navigation
    console.log('\n🔄 Profiling category navigation...\n');
    const navTimes = [];

    for (let i = 0; i < 5; i++) {
        const startTime = Date.now();
        await page.locator('#next-category').click();
        await page.waitForTimeout(50);
        const endTime = Date.now();
        navTimes.push(endTime - startTime);
    }

    console.log('⏱️  Category Navigation Times (ms):');
    navTimes.forEach((time, i) => {
        console.log(`   Navigate ${i + 1}: ${time}ms`);
    });
    console.log(`   Average: ${(navTimes.reduce((a, b) => a + b, 0) / navTimes.length).toFixed(1)}ms`);

    // Stop profiling and get results
    const profile = await client.send('Profiler.stop');

    // Analyze JS execution
    console.log('\n📈 JavaScript Execution Analysis:\n');
    analyzeProfile(profile.profile);

    // Get final metrics
    const finalMetrics = await client.send('Performance.getMetrics');
    console.log('\n📊 Final Metrics:');
    printMetrics(finalMetrics.metrics);

    // Calculate differences
    console.log('\n📉 Metric Changes During Session:');
    compareMetrics(initialMetrics.metrics, finalMetrics.metrics);

    // Stop tracing and analyze
    const tracingData = await new Promise((resolve) => {
        const chunks = [];
        client.on('Tracing.dataCollected', (data) => chunks.push(...data.value));
        client.on('Tracing.tracingComplete', () => resolve(chunks));
        client.send('Tracing.end');
    });

    console.log('\n🔬 Timeline Events Summary:');
    analyzeTracing(tracingData);

    // Memory analysis
    console.log('\n💾 Memory Analysis:');
    const heapInfo = await page.evaluate(() => {
        if (performance.memory) {
            return {
                usedJSHeapSize: performance.memory.usedJSHeapSize,
                totalJSHeapSize: performance.memory.totalJSHeapSize,
                jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
            };
        }
        return null;
    });

    if (heapInfo) {
        console.log(`   Used JS Heap: ${(heapInfo.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`);
        console.log(`   Total JS Heap: ${(heapInfo.totalJSHeapSize / 1024 / 1024).toFixed(2)} MB`);
        console.log(`   Heap Limit: ${(heapInfo.jsHeapSizeLimit / 1024 / 1024).toFixed(2)} MB`);
    } else {
        console.log('   (Memory API not available in this browser context)');
    }

    // DOM complexity analysis
    console.log('\n🌳 DOM Analysis:');
    const domStats = await page.evaluate(() => {
        const allElements = document.querySelectorAll('*');
        const filmElements = document.querySelectorAll('.film');
        const eventListeners = [];

        // Count inline event handlers
        let inlineHandlers = 0;
        allElements.forEach(el => {
            const attrs = el.attributes;
            for (let i = 0; i < attrs.length; i++) {
                if (attrs[i].name.startsWith('on')) inlineHandlers++;
            }
        });

        return {
            totalElements: allElements.length,
            filmElements: filmElements.length,
            maxDepth: getMaxDepth(document.body),
            inlineHandlers
        };

        function getMaxDepth(el, depth = 0) {
            let max = depth;
            for (const child of el.children) {
                max = Math.max(max, getMaxDepth(child, depth + 1));
            }
            return max;
        }
    });

    console.log(`   Total DOM Elements: ${domStats.totalElements}`);
    console.log(`   Film List Items: ${domStats.filmElements}`);
    console.log(`   Max DOM Depth: ${domStats.maxDepth}`);
    console.log(`   Inline Event Handlers: ${domStats.inlineHandlers}`);

    console.log('\n' + '='.repeat(60));
    console.log('✅ Performance Analysis Complete\n');

    await browser.close();
}

function printMetrics(metrics) {
    const important = [
        'JSHeapUsedSize',
        'JSHeapTotalSize',
        'Documents',
        'Nodes',
        'LayoutCount',
        'RecalcStyleCount',
        'ScriptDuration',
        'TaskDuration'
    ];

    metrics
        .filter(m => important.includes(m.name))
        .forEach(m => {
            let value = m.value;
            let unit = '';

            if (m.name.includes('HeapSize')) {
                value = (m.value / 1024 / 1024).toFixed(2);
                unit = ' MB';
            } else if (m.name.includes('Duration')) {
                value = (m.value * 1000).toFixed(2);
                unit = ' ms';
            }

            console.log(`   ${m.name}: ${value}${unit}`);
        });
}

function compareMetrics(initial, final) {
    const compare = ['LayoutCount', 'RecalcStyleCount', 'ScriptDuration', 'Nodes'];

    compare.forEach(name => {
        const i = initial.find(m => m.name === name)?.value || 0;
        const f = final.find(m => m.name === name)?.value || 0;
        const diff = f - i;

        let displayDiff = diff;
        let unit = '';

        if (name.includes('Duration')) {
            displayDiff = (diff * 1000).toFixed(2);
            unit = ' ms';
        }

        const sign = diff > 0 ? '+' : '';
        console.log(`   ${name}: ${sign}${displayDiff}${unit}`);
    });
}

function analyzeProfile(profile) {
    if (!profile || !profile.nodes) {
        console.log('   No profile data available');
        return;
    }

    // Find hotspots - functions with highest self time
    const functionTimes = {};

    profile.nodes.forEach(node => {
        if (node.callFrame && node.callFrame.functionName) {
            const name = node.callFrame.functionName || '(anonymous)';
            const url = node.callFrame.url || '';

            // Only track app.js functions
            if (url.includes('app.js')) {
                if (!functionTimes[name]) {
                    functionTimes[name] = { selfTime: 0, count: 0 };
                }
                functionTimes[name].count++;
            }
        }
    });

    const sorted = Object.entries(functionTimes)
        .filter(([name]) => name !== '(anonymous)' && name !== '(program)')
        .sort((a, b) => b[1].count - a[1].count)
        .slice(0, 10);

    if (sorted.length > 0) {
        console.log('   Top Functions Called (from app.js):');
        sorted.forEach(([name, data]) => {
            console.log(`     ${name}: ${data.count} calls`);
        });
    } else {
        console.log('   No significant function hotspots detected in app.js');
    }
}

function analyzeTracing(events) {
    const categories = {};

    events.forEach(event => {
        if (event.cat) {
            const cats = event.cat.split(',');
            cats.forEach(cat => {
                categories[cat] = (categories[cat] || 0) + 1;
            });
        }
    });

    // Count specific event types
    const eventTypes = {};
    events.forEach(event => {
        if (event.name) {
            eventTypes[event.name] = (eventTypes[event.name] || 0) + 1;
        }
    });

    // Report layout/style events (potential performance issues)
    const layoutEvents = ['Layout', 'UpdateLayoutTree', 'RecalculateStyles'];
    console.log('   Layout/Style Events:');
    layoutEvents.forEach(name => {
        if (eventTypes[name]) {
            console.log(`     ${name}: ${eventTypes[name]}`);
        }
    });

    // Report paint events
    const paintEvents = ['Paint', 'PaintImage', 'CompositeLayers'];
    console.log('   Paint Events:');
    paintEvents.forEach(name => {
        if (eventTypes[name]) {
            console.log(`     ${name}: ${eventTypes[name]}`);
        }
    });
}

// Start the HTTP server and run analysis
const { spawn } = require('child_process');

console.log('Starting local server...');
const server = spawn('python3', ['-m', 'http.server', '3000'], {
    cwd: '/home/user/oscar-tracker',
    stdio: ['ignore', 'pipe', 'pipe']
});

// Wait for server to start
setTimeout(async () => {
    try {
        await runPerformanceAnalysis();
    } catch (error) {
        console.error('Error during analysis:', error);
    } finally {
        server.kill();
        process.exit(0);
    }
}, 1000);
