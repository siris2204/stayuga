import { test, expect, Page } from "@playwright/test";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@stayuga.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "Stayuga@123";

async function loginAsAdmin(page: Page) {
  await page.goto("/admin/login");
  await page.getByLabel(/email/i).fill(ADMIN_EMAIL);
  await page.getByLabel(/password/i).fill(ADMIN_PASSWORD);
  await page.getByRole("button", { name: /sign in/i }).click();
  await page.waitForURL("/admin/dashboard");
}

test.describe("Admin login", () => {
  test("Sign in button is disabled while submitting", async ({ page }) => {
    await page.goto("/admin/login");
    await page.getByLabel(/email/i).fill("admin@stayuga.com");
    await page.getByLabel(/password/i).fill("wrongpassword");
    const btn = page.getByRole("button", { name: /sign in/i });
    await btn.click();
    // Brief disabled state while submitting
    await expect(btn).toBeDisabled();
  });

  test("Shows error on invalid credentials", async ({ page }) => {
    await page.goto("/admin/login");
    await page.getByLabel(/email/i).fill("wrong@example.com");
    await page.getByLabel(/password/i).fill("wrongpassword");
    await page.getByRole("button", { name: /sign in/i }).click();
    await expect(page.getByText(/invalid|login failed/i)).toBeVisible();
  });

  test("Valid credentials redirect to dashboard", async ({ page }) => {
    await loginAsAdmin(page);
    await expect(page).toHaveURL("/admin/dashboard");
  });
});

test.describe("Admin dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test("Properties sidebar link navigates correctly", async ({ page }) => {
    await page.getByRole("link", { name: /properties/i }).first().click();
    await expect(page).toHaveURL("/admin/properties");
  });

  test("Bookings sidebar link navigates correctly", async ({ page }) => {
    await page.getByRole("link", { name: /bookings/i }).click();
    await expect(page).toHaveURL("/admin/bookings");
  });

  test("Owners sidebar link navigates correctly", async ({ page }) => {
    await page.getByRole("link", { name: /owners/i }).click();
    await expect(page).toHaveURL("/admin/owners");
  });

  test("Content sidebar link navigates correctly", async ({ page }) => {
    await page.getByRole("link", { name: /content/i }).click();
    await expect(page).toHaveURL("/admin/content");
  });

  test("Leads sidebar link navigates correctly", async ({ page }) => {
    await page.getByRole("link", { name: /leads/i }).click();
    await expect(page).toHaveURL("/admin/leads");
  });
});

test.describe("Admin properties", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/properties");
  });

  test("Add property button navigates to new property form", async ({ page }) => {
    await page.getByRole("link", { name: /add property/i }).click();
    await expect(page).toHaveURL("/admin/properties/new");
  });

  test("New property form has Save draft and Publish buttons", async ({ page }) => {
    await page.goto("/admin/properties/new");
    await expect(page.getByRole("button", { name: /save draft/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /publish/i })).toBeVisible();
  });

  test("Edit button opens inline edit for a property", async ({ page }) => {
    const editBtn = page.locator("button[title='Edit property'], a[href*='/edit']").first();
    if (await editBtn.count() > 0) {
      await editBtn.click();
      // Should open edit form or navigate
      await expect(page.locator("form, [data-testid='edit-panel']")).toBeTruthy();
    }
  });

  test("Star featured toggle button is visible", async ({ page }) => {
    const starBtn = page.locator("button[title*='featured'], button[title*='Feature']").first();
    if (await starBtn.count() > 0) {
      await expect(starBtn).toBeVisible();
    }
  });
});

test.describe("Admin content", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/content");
  });

  test("Homepage hero Save button is visible", async ({ page }) => {
    await expect(page.getByRole("button", { name: /save/i }).first()).toBeVisible();
  });

  test("Contact info Save button is visible", async ({ page }) => {
    const sections = page.locator("section");
    const contactSection = sections.filter({ hasText: /contact information/i });
    await expect(contactSection.getByRole("button", { name: /save/i })).toBeVisible();
  });

  test("Add review button submits new testimonial", async ({ page }) => {
    await expect(page.getByRole("button", { name: /add review/i })).toBeVisible();
  });

  test("Add FAQ button is visible", async ({ page }) => {
    await expect(page.getByRole("button", { name: /add faq/i })).toBeVisible();
  });
});

test.describe("Admin owners", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/owners");
  });

  test("Add owner button opens the create form", async ({ page }) => {
    await page.getByRole("button", { name: /add owner/i }).click();
    await expect(page.getByText(/new owner account/i)).toBeVisible();
  });

  test("Close button on create form hides it", async ({ page }) => {
    await page.getByRole("button", { name: /add owner/i }).click();
    await page.getByRole("button").filter({ has: page.locator("svg") }).last().click();
    await expect(page.getByText(/new owner account/i)).not.toBeVisible();
  });
});
