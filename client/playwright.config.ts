import path from "path";
import { defineConfig, devices } from "@playwright/test";

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";
const isCI = !!process.env.PLAYWRIGHT_BASE_URL;

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
  // When PLAYWRIGHT_BASE_URL is set (e.g. Vercel), skip local server startup.
  // Otherwise start the full monorepo dev stack (client + server) from the root.
  webServer: isCI
    ? undefined
    : {
        command: "npm run dev",
        cwd: path.resolve(__dirname, ".."),
        port: 3000,
        reuseExistingServer: true,
        timeout: 120_000,
      },
});
