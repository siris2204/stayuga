import { defineConfig, devices } from "@playwright/test";

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  retries: 1,
  reporter: "list",
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
  // Servers must be running before tests:
  //   npm run dev          (from stayuga/ monorepo root — starts both client + server)
  //   npx playwright test  (from stayuga/client/)
  // To test against production:
  //   $env:PLAYWRIGHT_BASE_URL="https://your-vercel-url.vercel.app"; npx playwright test
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        command: "npm run dev",
        port: 3000,
        reuseExistingServer: true,
        timeout: 120_000,
      },
});
