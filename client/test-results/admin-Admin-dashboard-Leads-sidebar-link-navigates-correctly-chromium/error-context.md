# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin.spec.ts >> Admin dashboard >> Leads sidebar link navigates correctly
- Location: tests\e2e\admin.spec.ts:64:7

# Error details

```
Test timeout of 30000ms exceeded while running "beforeEach" hook.
```

```
Error: page.waitForURL: Test timeout of 30000ms exceeded.
=========================== logs ===========================
waiting for navigation to "/admin/dashboard" until "load"
============================================================
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - main [ref=e2]:
    - generic [ref=e4]:
      - paragraph [ref=e5]: Stayuga Admin
      - paragraph [ref=e6]: Sign in to manage properties & bookings.
      - generic [ref=e7]:
        - generic [ref=e8]:
          - generic [ref=e9]: Email
          - textbox "Email" [ref=e10]: admin@stayuga.com
        - generic [ref=e11]:
          - generic [ref=e12]: Password
          - textbox "Password" [ref=e13]: Stayuga@123
        - paragraph [ref=e14]: Login failed
        - button "Sign in" [ref=e15]
  - button "Open Next.js Dev Tools" [ref=e21] [cursor=pointer]
  - alert [ref=e25]
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
  8   |   await page.getByLabel(/email/i).fill(ADMIN_EMAIL);
  9   |   await page.getByLabel(/password/i).fill(ADMIN_PASSWORD);
  10  |   await page.getByRole("button", { name: /sign in/i }).click();
> 11  |   await page.waitForURL("/admin/dashboard");
      |              ^ Error: page.waitForURL: Test timeout of 30000ms exceeded.
  12  | }
  13  | 
  14  | test.describe("Admin login", () => {
  15  |   test("Sign in button is disabled while submitting", async ({ page }) => {
  16  |     await page.goto("/admin/login");
  17  |     await page.getByLabel(/email/i).fill("admin@stayuga.com");
  18  |     await page.getByLabel(/password/i).fill("wrongpassword");
  19  |     const btn = page.getByRole("button", { name: /sign in/i });
  20  |     await btn.click();
  21  |     // Brief disabled state while submitting
  22  |     await expect(btn).toBeDisabled();
  23  |   });
  24  | 
  25  |   test("Shows error on invalid credentials", async ({ page }) => {
  26  |     await page.goto("/admin/login");
  27  |     await page.getByLabel(/email/i).fill("wrong@example.com");
  28  |     await page.getByLabel(/password/i).fill("wrongpassword");
  29  |     await page.getByRole("button", { name: /sign in/i }).click();
  30  |     await expect(page.getByText(/invalid|login failed/i)).toBeVisible();
  31  |   });
  32  | 
  33  |   test("Valid credentials redirect to dashboard", async ({ page }) => {
  34  |     await loginAsAdmin(page);
  35  |     await expect(page).toHaveURL("/admin/dashboard");
  36  |   });
  37  | });
  38  | 
  39  | test.describe("Admin dashboard", () => {
  40  |   test.beforeEach(async ({ page }) => {
  41  |     await loginAsAdmin(page);
  42  |   });
  43  | 
  44  |   test("Properties sidebar link navigates correctly", async ({ page }) => {
  45  |     await page.getByRole("link", { name: /properties/i }).first().click();
  46  |     await expect(page).toHaveURL("/admin/properties");
  47  |   });
  48  | 
  49  |   test("Bookings sidebar link navigates correctly", async ({ page }) => {
  50  |     await page.getByRole("link", { name: /bookings/i }).click();
  51  |     await expect(page).toHaveURL("/admin/bookings");
  52  |   });
  53  | 
  54  |   test("Owners sidebar link navigates correctly", async ({ page }) => {
  55  |     await page.getByRole("link", { name: /owners/i }).click();
  56  |     await expect(page).toHaveURL("/admin/owners");
  57  |   });
  58  | 
  59  |   test("Content sidebar link navigates correctly", async ({ page }) => {
  60  |     await page.getByRole("link", { name: /content/i }).click();
  61  |     await expect(page).toHaveURL("/admin/content");
  62  |   });
  63  | 
  64  |   test("Leads sidebar link navigates correctly", async ({ page }) => {
  65  |     await page.getByRole("link", { name: /leads/i }).click();
  66  |     await expect(page).toHaveURL("/admin/leads");
  67  |   });
  68  | });
  69  | 
  70  | test.describe("Admin properties", () => {
  71  |   test.beforeEach(async ({ page }) => {
  72  |     await loginAsAdmin(page);
  73  |     await page.goto("/admin/properties");
  74  |   });
  75  | 
  76  |   test("Add property button navigates to new property form", async ({ page }) => {
  77  |     await page.getByRole("link", { name: /add property/i }).click();
  78  |     await expect(page).toHaveURL("/admin/properties/new");
  79  |   });
  80  | 
  81  |   test("New property form has Save draft and Publish buttons", async ({ page }) => {
  82  |     await page.goto("/admin/properties/new");
  83  |     await expect(page.getByRole("button", { name: /save draft/i })).toBeVisible();
  84  |     await expect(page.getByRole("button", { name: /publish/i })).toBeVisible();
  85  |   });
  86  | 
  87  |   test("Edit button opens inline edit for a property", async ({ page }) => {
  88  |     const editBtn = page.locator("button[title='Edit property'], a[href*='/edit']").first();
  89  |     if (await editBtn.count() > 0) {
  90  |       await editBtn.click();
  91  |       // Should open edit form or navigate
  92  |       await expect(page.locator("form, [data-testid='edit-panel']")).toBeTruthy();
  93  |     }
  94  |   });
  95  | 
  96  |   test("Star featured toggle button is visible", async ({ page }) => {
  97  |     const starBtn = page.locator("button[title*='featured'], button[title*='Feature']").first();
  98  |     if (await starBtn.count() > 0) {
  99  |       await expect(starBtn).toBeVisible();
  100 |     }
  101 |   });
  102 | });
  103 | 
  104 | test.describe("Admin content", () => {
  105 |   test.beforeEach(async ({ page }) => {
  106 |     await loginAsAdmin(page);
  107 |     await page.goto("/admin/content");
  108 |   });
  109 | 
  110 |   test("Homepage hero Save button is visible", async ({ page }) => {
  111 |     await expect(page.getByRole("button", { name: /save/i }).first()).toBeVisible();
```