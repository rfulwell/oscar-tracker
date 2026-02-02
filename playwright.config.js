// @ts-check
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
    testDir: './tests',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: 'list',
    use: {
        baseURL: 'http://localhost:3000',
        trace: 'on-first-retry',
    },
    projects: [
        {
            name: 'chromium',
            use: {
                ...devices['Desktop Chrome'],
                launchOptions: {
                    executablePath: '/root/.cache/ms-playwright/chromium-1194/chrome-linux/chrome',
                },
            },
        },
    ],
    webServer: {
        command: 'python3 -m http.server 3000',
        url: 'http://localhost:3000',
        reuseExistingServer: !process.env.CI,
    },
});
