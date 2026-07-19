import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  workers: 2,
  retries: process.env.CI ? 2 : 0,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:3005",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "desktop", testMatch: /arjun-os\.spec\.ts/, use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "mobile", testMatch: /arjun-os\.spec\.ts/, use: { ...devices["iPhone 14"], browserName: "chromium" } },
    { name: "phone-small", testMatch: /adaptive-responsive\.spec\.ts/, use: { browserName: "chromium", viewport: { width: 375, height: 667 }, isMobile: true, hasTouch: true } },
    { name: "phone-large", testMatch: /adaptive-responsive\.spec\.ts/, use: { browserName: "webkit", viewport: { width: 430, height: 932 }, isMobile: true, hasTouch: true } },
    { name: "ipad-portrait", testMatch: /adaptive-responsive\.spec\.ts/, use: { browserName: "webkit", viewport: { width: 820, height: 1180 }, hasTouch: true } },
    { name: "ipad-landscape", testMatch: /adaptive-responsive\.spec\.ts/, use: { browserName: "webkit", viewport: { width: 1180, height: 820 }, hasTouch: true } },
    { name: "ipad-pro-portrait", testMatch: /adaptive-responsive\.spec\.ts/, use: { browserName: "webkit", viewport: { width: 1024, height: 1366 }, hasTouch: true } },
    { name: "ipad-pro-landscape", testMatch: /adaptive-responsive\.spec\.ts/, use: { browserName: "webkit", viewport: { width: 1366, height: 1024 }, hasTouch: true } },
  ],
  webServer: {
    command: "npm run dev -- --port 3005",
    url: "http://127.0.0.1:3005",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
