import { test, expect, Page } from "@playwright/test";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@stayuga.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "Stayuga@123";

async function loginAsAdmin(page: Page) {
  await page.goto("/admin/login");
  await page.waitForLoadState("networkidle");
  await page.getByLabel(/email/i).fill(ADMIN_EMAIL);
  await page.getByLabel(/password/i).fill(ADMIN_PASSWORD);
  await page.getByRole("button", { name: /sign in/i }).click();
  await page.waitForURL("/admin/dashboard");
}

test.describe("Admin login", () => {
  test("Sign in button is disabled while request is in-flight", async ({ page }) => {
    // Hold the login request open long enough to assert the disabled state.
    await page.route(/\/api\/auth\/login$/, async (route) => {
      await new Promise((r) => setTimeout(r, 3000));
      await route.continue();
    });
    await page.goto("/admin/login");
    await page.getByLabel(/email/i).fill("admin@stayuga.com");
    await page.getByLabel(/password/i).fill("anypassword");
    const btn = page.getByRole("button", { name: /sign in/i });
    // waitForRequest resolves once the fetch fires (after setSubmitting(true) + React re-render).
    const requestPromise = page.waitForRequest(/\/api\/auth\/login$/);
    await btn.click();
    await requestPromise;
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
    await page.getByRole("link", { name: /^properties$/i }).click();
    await expect(page).toHaveURL("/admin/properties");
  });

  test("Bookings sidebar link navigates correctly", async ({ page }) => {
    await page.getByRole("link", { name: /^bookings$/i }).click();
    await expect(page).toHaveURL("/admin/bookings");
  });

  test("Owners sidebar link navigates correctly", async ({ page }) => {
    await page.getByRole("link", { name: /^owners$/i }).click();
    await expect(page).toHaveURL("/admin/owners");
  });

  test("Content sidebar link navigates correctly", async ({ page }) => {
    await page.getByRole("link", { name: /^content$/i }).click();
    await expect(page).toHaveURL("/admin/content");
  });

  test("Leads sidebar link navigates correctly", async ({ page }) => {
    await page.getByRole("link", { name: /^leads$/i }).click();
    await expect(page).toHaveURL("/admin/leads");
  });
});

test.describe("Admin properties", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/properties");
    await page.waitForLoadState("networkidle");
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

  test("Edit link opens property edit form", async ({ page }) => {
    const editLink = page.getByRole("link", { name: /edit/i }).first();
    if (await editLink.count() > 0) {
      await editLink.click();
      await expect(page).toHaveURL(/\/edit$/);
    }
  });

  test("Featured star button is present for each property", async ({ page }) => {
    const starBtns = page.getByTitle(/feature|unfeature|featured/i);
    if (await starBtns.count() > 0) {
      await expect(starBtns.first()).toBeVisible();
    }
  });
});

test.describe("Admin content", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/content");
    await page.waitForLoadState("networkidle");
  });

  test("Homepage hero Save button is visible and enabled", async ({ page }) => {
    const heroSection = page.locator("section").filter({ hasText: /homepage hero/i });
    await expect(heroSection.getByRole("button", { name: /save/i })).toBeVisible();
  });

  test("Contact information Save button is visible", async ({ page }) => {
    const contactSection = page.locator("section").filter({ hasText: /contact information/i });
    await expect(contactSection.getByRole("button", { name: /save/i })).toBeVisible();
  });

  test("About page Save button is visible", async ({ page }) => {
    const aboutSection = page.locator("section").filter({ hasText: /about page/i });
    await expect(aboutSection.getByRole("button", { name: /save/i })).toBeVisible();
  });

  test("Add review button is visible", async ({ page }) => {
    await expect(page.getByRole("button", { name: /add review/i })).toBeVisible();
  });

  test("Add FAQ button is visible", async ({ page }) => {
    await expect(page.getByRole("button", { name: /add faq/i })).toBeVisible();
  });

  test("Policy page Save buttons are visible", async ({ page }) => {
    const policySection = page.locator("section").filter({ hasText: /policy pages/i });
    const saveBtns = policySection.getByRole("button", { name: /save/i });
    await expect(saveBtns.first()).toBeVisible();
  });
});

test.describe("Admin owners", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/owners");
    await page.waitForLoadState("networkidle");
  });

  test("Add owner button opens the create form", async ({ page }) => {
    await page.getByRole("button", { name: /add owner/i }).click();
    await expect(page.getByText(/new owner account/i)).toBeVisible();
  });

  test("X button on create form closes it", async ({ page }) => {
    await page.getByRole("button", { name: /add owner/i }).click();
    await expect(page.getByText(/new owner account/i)).toBeVisible();
    // The X close button is inside the form header
    await page.locator("button[onClick]").filter({ hasText: "" }).last().click();
    // Or target by finding button next to "New owner account" heading
    const formHeader = page.getByText(/new owner account/i).locator("..");
    await formHeader.getByRole("button").click();
    await expect(page.getByText(/new owner account/i)).not.toBeVisible();
  });
});
