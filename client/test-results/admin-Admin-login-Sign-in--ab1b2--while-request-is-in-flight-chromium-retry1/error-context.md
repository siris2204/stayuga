# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin.spec.ts >> Admin login >> Sign in button is disabled while request is in-flight
- Location: tests\e2e\admin.spec.ts:16:7

# Error details

```
Error: expect(locator).toBeDisabled() failed

Locator:  getByRole('button', { name: /sign in/i })
Expected: disabled
Received: enabled
Timeout:  5000ms

Call log:
  - Expect "toBeDisabled" with timeout 5000ms
  - waiting for getByRole('button', { name: /sign in/i })
    3 × locator resolved to <button type="submit" class="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium tracking-wide transition-colors duration-200 disabled:opacity-50 disabled:pointer-events-none bg-forest text-cream hover:bg-forest-light w-full">Sign in</button>
      - unexpected value "enabled"

```

```yaml
- button "Sign in"
```

# Test source

```ts
  1   | import { test, expect, Page } from "@playwright/test";
  2   | 
  3   | const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@stayuga.com";
  4   | const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "Stayuga@123";
  5   | 
  6   | async function loginAsAdmin(page: Page) {
  7   |   await page.goto("/admin/login");
  8   |   await page.waitForLoadState("networkidle");
  9   |   await page.getByLabel(/email/i).fill(ADMIN_EMAIL);
  10  |   await page.getByLabel(/password/i).fill(ADMIN_PASSWORD);
  11  |   await page.getByRole("button", { name: /sign in/i }).click();
  12  |   await page.waitForURL("/admin/dashboard");
  13  | }
  14  | 
  15  | test.describe("Admin login", () => {
  16  |   test("Sign in button is disabled while request is in-flight", async ({ page }) => {
  17  |     // Hold the login request open long enough to assert the disabled state.
  18  |     await page.route(/\/api\/auth\/login$/, async (route) => {
  19  |       await new Promise((r) => setTimeout(r, 3000));
  20  |       await route.continue();
  21  |     });
  22  |     await page.goto("/admin/login");
  23  |     await page.getByLabel(/email/i).fill("admin@stayuga.com");
  24  |     await page.getByLabel(/password/i).fill("anypassword");
  25  |     const btn = page.getByRole("button", { name: /sign in/i });
  26  |     // waitForRequest resolves once the fetch fires (after setSubmitting(true) + React re-render).
  27  |     const requestPromise = page.waitForRequest(/\/api\/auth\/login$/);
  28  |     await btn.click();
  29  |     await requestPromise;
> 30  |     await expect(btn).toBeDisabled();
      |                       ^ Error: expect(locator).toBeDisabled() failed
  31  |   });
  32  | 
  33  |   test("Shows error on invalid credentials", async ({ page }) => {
  34  |     await page.goto("/admin/login");
  35  |     await page.getByLabel(/email/i).fill("wrong@example.com");
  36  |     await page.getByLabel(/password/i).fill("wrongpassword");
  37  |     await page.getByRole("button", { name: /sign in/i }).click();
  38  |     await expect(page.getByText(/invalid|login failed/i)).toBeVisible();
  39  |   });
  40  | 
  41  |   test("Valid credentials redirect to dashboard", async ({ page }) => {
  42  |     await loginAsAdmin(page);
  43  |     await expect(page).toHaveURL("/admin/dashboard");
  44  |   });
  45  | });
  46  | 
  47  | test.describe("Admin dashboard", () => {
  48  |   test.beforeEach(async ({ page }) => {
  49  |     await loginAsAdmin(page);
  50  |   });
  51  | 
  52  |   test("Properties sidebar link navigates correctly", async ({ page }) => {
  53  |     await page.getByRole("link", { name: /^properties$/i }).click();
  54  |     await expect(page).toHaveURL("/admin/properties");
  55  |   });
  56  | 
  57  |   test("Bookings sidebar link navigates correctly", async ({ page }) => {
  58  |     await page.getByRole("link", { name: /^bookings$/i }).click();
  59  |     await expect(page).toHaveURL("/admin/bookings");
  60  |   });
  61  | 
  62  |   test("Owners sidebar link navigates correctly", async ({ page }) => {
  63  |     await page.getByRole("link", { name: /^owners$/i }).click();
  64  |     await expect(page).toHaveURL("/admin/owners");
  65  |   });
  66  | 
  67  |   test("Content sidebar link navigates correctly", async ({ page }) => {
  68  |     await page.getByRole("link", { name: /^content$/i }).click();
  69  |     await expect(page).toHaveURL("/admin/content");
  70  |   });
  71  | 
  72  |   test("Leads sidebar link navigates correctly", async ({ page }) => {
  73  |     await page.getByRole("link", { name: /^leads$/i }).click();
  74  |     await expect(page).toHaveURL("/admin/leads");
  75  |   });
  76  | });
  77  | 
  78  | test.describe("Admin properties", () => {
  79  |   test.beforeEach(async ({ page }) => {
  80  |     await loginAsAdmin(page);
  81  |     await page.goto("/admin/properties");
  82  |     await page.waitForLoadState("networkidle");
  83  |   });
  84  | 
  85  |   test("Add property button navigates to new property form", async ({ page }) => {
  86  |     await page.getByRole("link", { name: /add property/i }).click();
  87  |     await expect(page).toHaveURL("/admin/properties/new");
  88  |   });
  89  | 
  90  |   test("New property form has Save draft and Publish buttons", async ({ page }) => {
  91  |     await page.goto("/admin/properties/new");
  92  |     await expect(page.getByRole("button", { name: /save draft/i })).toBeVisible();
  93  |     await expect(page.getByRole("button", { name: /publish/i })).toBeVisible();
  94  |   });
  95  | 
  96  |   test("Edit link opens property edit form", async ({ page }) => {
  97  |     const editLink = page.getByRole("link", { name: /edit/i }).first();
  98  |     if (await editLink.count() > 0) {
  99  |       await editLink.click();
  100 |       await expect(page).toHaveURL(/\/edit$/);
  101 |     }
  102 |   });
  103 | 
  104 |   test("Featured star button is present for each property", async ({ page }) => {
  105 |     const starBtns = page.getByTitle(/feature|unfeature|featured/i);
  106 |     if (await starBtns.count() > 0) {
  107 |       await expect(starBtns.first()).toBeVisible();
  108 |     }
  109 |   });
  110 | });
  111 | 
  112 | test.describe("Admin content", () => {
  113 |   test.beforeEach(async ({ page }) => {
  114 |     await loginAsAdmin(page);
  115 |     await page.goto("/admin/content");
  116 |     await page.waitForLoadState("networkidle");
  117 |   });
  118 | 
  119 |   test("Homepage hero Save button is visible and enabled", async ({ page }) => {
  120 |     const heroSection = page.locator("section").filter({ hasText: /homepage hero/i });
  121 |     await expect(heroSection.getByRole("button", { name: /save/i })).toBeVisible();
  122 |   });
  123 | 
  124 |   test("Contact information Save button is visible", async ({ page }) => {
  125 |     const contactSection = page.locator("section").filter({ hasText: /contact information/i });
  126 |     await expect(contactSection.getByRole("button", { name: /save/i })).toBeVisible();
  127 |   });
  128 | 
  129 |   test("About page Save button is visible", async ({ page }) => {
  130 |     const aboutSection = page.locator("section").filter({ hasText: /about page/i });
```