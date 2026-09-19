import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  retries: 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: { baseURL: 'http://127.0.0.1:5173', trace: 'retain-on-failure', screenshot: 'only-on-failure', launchOptions: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH } : {} },
  webServer: { command: 'pnpm dev', url: 'http://127.0.0.1:5173', reuseExistingServer: !process.env.CI, timeout: 30_000 },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 1000 } }, testIgnore: /visual\.spec/ },
    { name: 'mobile', use: { ...devices['iPhone 13'], defaultBrowserType: 'chromium' }, testMatch: /mobile\.spec/ },
    { name: 'visual', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 1000 } }, testMatch: /visual\.spec/ },
  ],
});
