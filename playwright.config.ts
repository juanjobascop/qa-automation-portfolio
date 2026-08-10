import { defineConfig, devices } from '@playwright/test';

/**
 * Central Playwright configuration.
 *
 * Two projects are defined:
 *  - "ui"  runs the browser-based E2E tests against SauceDemo.
 *  - "api" runs the headless HTTP tests against the restful-booker API.
 *
 * Base URLs are overridable via environment variables so the same suite can be
 * pointed at a staging or local environment without code changes.
 */
export default defineConfig({
  testDir: './tests',
  /* Fail the build on CI if test.only is accidentally left in the source. */
  forbidOnly: !!process.env.CI,
  /* Retry flaky tests on CI only; run clean locally to surface real failures. */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel file execution on CI for more deterministic runs. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporters: readable list in the terminal + a rich HTML report. */
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
  ],
  /* Shared settings applied to every project. */
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'ui',
      testDir: './tests/ui',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: process.env.UI_BASE_URL ?? 'https://www.saucedemo.com',
      },
    },
    {
      name: 'api',
      testDir: './tests/api',
      use: {
        baseURL:
          process.env.API_BASE_URL ?? 'https://restful-booker.herokuapp.com',
        extraHTTPHeaders: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      },
    },
  ],
});
