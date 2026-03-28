import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  // PeopleSoft pages can be slow — give them time
  timeout: 30_000,
  expect: { timeout: 10_000 },

  // Retry once on CI, never locally
  retries: process.env.CI ? 1 : 0,

  // Run tests sequentially (safer for PeopleSoft session state)
  workers: 1,

  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
  ],

  use: {
    // Replace with your PeopleSoft instance URL
    baseURL: 'https://your-peoplesoft-instance.example.com',

    // Show browser window while you learn (set true to hide)
    headless: false,

    // Record traces on test failure for debugging
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
