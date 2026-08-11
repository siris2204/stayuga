import { test, expect } from "@playwright/test";

test.describe("Owner login page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/owner/login");
    await page.waitForLoadState("networkidle");
  });

  test("Sign in button is visible", async ({ page }) => {
    await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible();
  });

  test("Sign in button is disabled while request is in-flight", async ({ page }) => {
    // Hold the login request open long enough to assert the disabled state.
    await page.route(/\/api\/owner\/auth\/login$/, async (route) => {
      await new Promise((r) => setTimeout(r, 3000));
      await route.continue();
    });
    await page.getByLabel(/email or phone/i).fill("nobody@example.com");
    await page.getByLabel(/password/i).fill("wrongpass");
    const btn = page.getByRole("button", { name: /sign in/i });
    // waitForRequest resolves once the fetch fires (after setSubmitting(true) + React re-render).
    const requestPromise = page.waitForRequest(/\/api\/owner\/auth\/login$/);
    await btn.click();
    await requestPromise;
    await expect(btn).toBeDisabled();
  });

  test("Shows error on invalid owner credentials", async ({ page }) => {
    await page.getByLabel(/email or phone/i).fill("nobody@example.com");
    await page.getByLabel(/password/i).fill("wrongpassword");
    await page.getByRole("button", { name: /sign in/i }).click();
    await expect(page.getByText(/invalid|login failed/i)).toBeVisible();
  });
});
