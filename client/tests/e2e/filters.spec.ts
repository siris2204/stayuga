import { test, expect } from "@playwright/test";

test.describe("Property filters", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/properties");
    await page.waitForLoadState("networkidle");
  });

  test("Villa radio button filters to villas", async ({ page }) => {
    await page.getByRole("radio", { name: "Villa" }).first().click();
    await page.getByRole("button", { name: /apply filters/i }).first().click();
    await expect(page).toHaveURL(/type=villa/);
  });

  test("Farmhouse radio button filters to farmhouses", async ({ page }) => {
    await page.getByRole("radio", { name: "Farmhouse" }).first().click();
    await page.getByRole("button", { name: /apply filters/i }).first().click();
    await expect(page).toHaveURL(/type=farmhouse/);
  });

  test("All types radio clears type filter", async ({ page }) => {
    await page.goto("/properties?type=villa");
    await page.waitForLoadState("networkidle");
    await page.getByRole("radio", { name: "All types" }).first().click();
    await page.getByRole("button", { name: /apply filters/i }).first().click();
    await expect(page).not.toHaveURL(/type=/);
  });

  test("City input filters by location", async ({ page }) => {
    await page.getByPlaceholder(/kasauli/i).first().fill("Goa");
    await page.getByRole("button", { name: /apply filters/i }).first().click();
    await expect(page).toHaveURL(/city=Goa/);
  });

  test("Min guests input filters by capacity", async ({ page }) => {
    await page.getByPlaceholder(/e\.g\. 10/i).first().fill("8");
    await page.getByRole("button", { name: /apply filters/i }).first().click();
    await expect(page).toHaveURL(/minGuests=8/);
  });

  test("Apply filters button with no selection navigates to /properties", async ({ page }) => {
    await page.getByRole("button", { name: /apply filters/i }).first().click();
    await expect(page).toHaveURL("/properties");
  });

  test("Clear all button removes all filters", async ({ page }) => {
    await page.goto("/properties?type=villa&city=Goa&minGuests=4");
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: /clear all/i }).first().click();
    await expect(page).toHaveURL("/properties");
  });

  test("Previous month button is disabled on current month", async ({ page }) => {
    const prevBtn = page.getByRole("button", { name: "Previous month" }).first();
    await expect(prevBtn).toBeDisabled();
  });

  test("Next month button advances the calendar", async ({ page }) => {
    // Capture the month label before clicking
    const monthLabel = page.locator("span.text-sm.font-semibold.text-ink").first();
    const before = await monthLabel.textContent();
    await page.getByRole("button", { name: "Next month" }).first().click();
    const after = await monthLabel.textContent();
    expect(after).not.toBe(before);
  });

  test("Clicking a future day highlights it as check-in", async ({ page }) => {
    const dayBtn = page.locator(".grid.grid-cols-7 button:not([disabled])").first();
    await dayBtn.click();
    await expect(dayBtn).toHaveClass(/bg-forest/);
  });

  test("Selecting check-in then check-out adds both to URL on Apply", async ({ page }) => {
    const days = page.locator(".grid.grid-cols-7 button:not([disabled])");
    await days.nth(0).click();
    await days.nth(3).click();
    await page.getByRole("button", { name: /apply filters/i }).first().click();
    await expect(page).toHaveURL(/checkIn=/);
    await expect(page).toHaveURL(/checkOut=/);
  });

  test("Combined filters all appear in URL", async ({ page }) => {
    await page.getByRole("radio", { name: "Villa" }).first().click();
    await page.getByPlaceholder(/kasauli/i).first().fill("Shimla");
    await page.getByPlaceholder(/e\.g\. 10/i).first().fill("6");
    await page.getByRole("button", { name: /apply filters/i }).first().click();
    const url = page.url();
    expect(url).toContain("type=villa");
    expect(url).toContain("city=Shimla");
    expect(url).toContain("minGuests=6");
  });
});
