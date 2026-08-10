import { test, expect } from "@playwright/test";

test.describe("Header navigation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test("Properties nav link navigates correctly", async ({ page }) => {
    await page.getByRole("navigation").getByRole("link", { name: /^properties$/i }).click();
    await expect(page).toHaveURL("/properties");
  });

  test("Experiences nav link navigates correctly", async ({ page }) => {
    await page.getByRole("navigation").getByRole("link", { name: /^experiences$/i }).click();
    await expect(page).toHaveURL("/experiences");
  });

  test("About nav link navigates correctly", async ({ page }) => {
    await page.getByRole("navigation").getByRole("link", { name: /^about$/i }).click();
    await expect(page).toHaveURL("/about");
  });

  test("FAQ nav link navigates correctly", async ({ page }) => {
    await page.getByRole("navigation").getByRole("link", { name: /^faq$/i }).click();
    await expect(page).toHaveURL("/faq");
  });

  test("Contact nav link navigates correctly", async ({ page }) => {
    await page.getByRole("navigation").getByRole("link", { name: /^contact$/i }).click();
    await expect(page).toHaveURL("/contact");
  });

  test("Book a stay CTA button navigates to properties", async ({ page }) => {
    await page.getByRole("link", { name: /book a stay/i }).first().click();
    await expect(page).toHaveURL("/properties");
  });
});

test.describe("Footer links", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test("footer Properties link works", async ({ page }) => {
    await page.getByRole("contentinfo").getByRole("link", { name: /^properties$/i }).click();
    await expect(page).toHaveURL("/properties");
  });

  test("footer Experiences link works", async ({ page }) => {
    await page.getByRole("contentinfo").getByRole("link", { name: /^experiences$/i }).click();
    await expect(page).toHaveURL("/experiences");
  });

  test("footer FAQ link works", async ({ page }) => {
    await page.getByRole("contentinfo").getByRole("link", { name: /^faq$/i }).click();
    await expect(page).toHaveURL("/faq");
  });

  test("footer Terms link works", async ({ page }) => {
    await page.getByRole("contentinfo").getByRole("link", { name: /terms/i }).click();
    await expect(page).toHaveURL("/policies/terms");
  });

  test("footer Privacy link works", async ({ page }) => {
    await page.getByRole("contentinfo").getByRole("link", { name: /privacy/i }).click();
    await expect(page).toHaveURL("/policies/privacy");
  });

  test("footer Cancellation link works", async ({ page }) => {
    await page.getByRole("contentinfo").getByRole("link", { name: /cancellation/i }).click();
    await expect(page).toHaveURL("/policies/cancellation");
  });
});
