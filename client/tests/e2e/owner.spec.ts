import { test, expect } from "@playwright/test";

test.describe("Owner login page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/owner/login");
  });

  test("Sign in button is visible", async ({ page }) => {
    await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible();
  });

  test("Sign in button is disabled while submitting with wrong credentials", async ({ page }) => {
    await page.getByLabel(/email or phone/i).fill("nobody@example.com");
    await page.getByLabel(/password/i).fill("wrongpass");
    const btn = page.getByRole("button", { name: /sign in/i });
    await btn.click();
    await expect(btn).toBeDisabled();
  });

  test("Shows error on invalid owner credentials", async ({ page }) => {
    await page.getByLabel(/email or phone/i).fill("nobody@example.com");
    await page.getByLabel(/password/i).fill("wrongpassword");
    await page.getByRole("button", { name: /sign in/i }).click();
    await expect(page.getByText(/invalid|login failed/i)).toBeVisible();
  });
});
