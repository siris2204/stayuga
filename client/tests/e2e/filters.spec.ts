import { test, expect } from "@playwright/test";

test.describe("Property filters", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/properties");
  });

  test("Villa radio button filters to villas", async ({ page }) => {
    await page.getByRole("radio", { name: "Villa" }).click();
    await page.getByRole("button", { name: /apply filters/i }).click();
    await expect(page).toHaveURL(/type=villa/);
  });

  test("Farmhouse radio button filters to farmhouses", async ({ page }) => {
    await page.getByRole("radio", { name: "Farmhouse" }).click();
    await page.getByRole("button", { name: /apply filters/i }).click();
    await expect(page).toHaveURL(/type=farmhouse/);
  });

  test("All types radio clears type filter", async ({ page }) => {
    // First set a type
    await page.goto("/properties?type=villa");
    await page.getByRole("radio", { name: "All types" }).click();
    await page.getByRole("button", { name: /apply filters/i }).click();
    await expect(page).not.toHaveURL(/type=/);
  });

  test("City input filters by location", async ({ page }) => {
    await page.getByPlaceholder(/kasauli/i).fill("Goa");
    await page.getByRole("button", { name: /apply filters/i }).click();
    await expect(page).toHaveURL(/city=Goa/);
  });

  test("Min guests input filters by capacity", async ({ page }) => {
    await page.getByPlaceholder(/e\.g\. 10/i).fill("8");
    await page.getByRole("button", { name: /apply filters/i }).click();
    await expect(page).toHaveURL(/minGuests=8/);
  });

  test("Apply filters button with no selection navigates to /properties", async ({ page }) => {
    await page.getByRole("button", { name: /apply filters/i }).click();
    await expect(page).toHaveURL("/properties");
  });

  test("Clear all button removes all filters", async ({ page }) => {
    await page.goto("/properties?type=villa&city=Goa&minGuests=4");
    await page.getByRole("button", { name: /clear all/i }).click();
    await expect(page).toHaveURL("/properties");
  });

  test("Calendar previous month button is disabled on current month", async ({ page }) => {
    const prevBtn = page.locator("button[disabled]").filter({ has: page.locator("svg") }).first();
    await expect(prevBtn).toBeDisabled();
  });

  test("Calendar next month button navigates forward", async ({ page }) => {
    const monthLabel = page.locator("span.text-sm.font-semibold.text-ink").first();
    const initialMonth = await monthLabel.textContent();
    await page.locator("button").filter({ has: page.locator("svg.lucide-chevron-right") }).first().click();
    const newMonth = await monthLabel.textContent();
    expect(newMonth).not.toBe(initialMonth);
  });

  test("Selecting a check-in date highlights it", async ({ page }) => {
    // Click a future day in the calendar (a non-disabled button in the grid)
    const futureDay = page.locator(".grid.grid-cols-7 button:not([disabled])").first();
    await futureDay.click();
    // The selected day should have the forest background class
    await expect(futureDay).toHaveClass(/bg-forest/);
  });

  test("Selecting check-in then check-out adds both to URL on Apply", async ({ page }) => {
    const days = page.locator(".grid.grid-cols-7 button:not([disabled])");
    await days.nth(0).click(); // check-in
    await days.nth(3).click(); // check-out (3 days later)
    await page.getByRole("button", { name: /apply filters/i }).click();
    await expect(page).toHaveURL(/checkIn=/);
    await expect(page).toHaveURL(/checkOut=/);
  });

  test("Combined filters all appear in URL", async ({ page }) => {
    await page.getByRole("radio", { name: "Villa" }).click();
    await page.getByPlaceholder(/kasauli/i).fill("Shimla");
    await page.getByPlaceholder(/e\.g\. 10/i).fill("6");
    await page.getByRole("button", { name: /apply filters/i }).click();
    const url = page.url();
    expect(url).toContain("type=villa");
    expect(url).toContain("city=Shimla");
    expect(url).toContain("minGuests=6");
  });
});
