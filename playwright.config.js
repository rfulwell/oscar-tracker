// @ts-check
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
    testDir: './tests',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    reporter: process.env.CI ? [['github'], ['list']] : 'list',
    use: {
        baseURL: 'http://localhost:3000',
        trace: 'on-first-retry',
    },
    projects: [
        {
            name: 'chromium',
            use: {
                ...devices['Desktop Chrome'],
                // Set CHROMIUM_PATH to use a preinstalled browser instead of Playwright's own
                ...(process.env.CHROMIUM_PATH && {
                    launchOptions: { executablePath: process.env.CHROMIUM_PATH },
                }),
            },
        },
    ],
    webServer: {
        command: 'python3 -m http.server 3000',
        url: 'http://localhost:3000',
        reuseExistingServer: !process.env.CI,
    },
});
