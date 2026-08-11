# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin.spec.ts >> Admin properties >> Add property button navigates to new property form
- Location: tests\e2e\admin.spec.ts:85:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('link', { name: /add property/i })

```

# Page snapshot

```yaml
- generic [active] [ref=f1e1]:
  - main [ref=f1e2]:
    - generic [ref=f1e3]:
      - complementary [ref=f1e4]:
        - generic [ref=f1e5]:
          - paragraph [ref=f1e6]: Stayuga
          - paragraph [ref=f1e7]: Admin panel
        - navigation [ref=f1e8]:
          - link "Dashboard" [ref=f1e9] [cursor=pointer]:
            - /url: /admin/dashboard
          - link "Properties" [ref=f1e15] [cursor=pointer]:
            - /url: /admin/properties
          - link "Bookings" [ref=f1e19] [cursor=pointer]:
            - /url: /admin/bookings
          - link "Leads" [ref=f1e23] [cursor=pointer]:
            - /url: /admin/leads
          - link "Owners" [ref=f1e29] [cursor=pointer]:
            - /url: /admin/owners
          - link "Content" [ref=f1e42] [cursor=pointer]:
            - /url: /admin/content
        - generic [ref=f1e46]:
          - paragraph [ref=f1e47]: admin@stayuga.com
          - button "Log out" [ref=f1e48]
      - generic [ref=f1e53]:
        - generic [ref=f1e54]:
          - generic [ref=f1e55]:
            - heading "Properties" [level=1] [ref=f1e56]
            - paragraph [ref=f1e57]: Manage your villa & farmhouse listings.
          - link "New property" [ref=f1e58] [cursor=pointer]:
            - /url: /admin/properties/new
        - table [ref=f1e61]:
          - rowgroup [ref=f1e62]:
            - row [ref=f1e63]:
              - columnheader "Title" [ref=f1e64]
              - columnheader "Type" [ref=f1e65]
              - columnheader "City" [ref=f1e66]
              - columnheader "Price / night" [ref=f1e67]
              - columnheader "Status" [ref=f1e68]
              - columnheader "Featured on homepage" [ref=f1e69]
              - columnheader "Actions" [ref=f1e72]
          - rowgroup [ref=f1e73]:
            - row [ref=f1e74]:
              - cell "Meadow House Farmstay" [ref=f1e75]
              - cell "farmhouse" [ref=f1e76]
              - cell "Karjat" [ref=f1e77]
              - cell "₹18,000" [ref=f1e78]
              - cell "published" [ref=f1e79]
              - cell [ref=f1e80]:
                - button "Remove from homepage" [ref=f1e81]
              - cell [ref=f1e84]:
                - generic [ref=f1e85]:
                  - link [ref=f1e86] [cursor=pointer]:
                    - /url: /admin/properties/6a74a2af08a1d0329c4303b7/edit
                  - button [ref=f1e90]
            - row [ref=f1e94]:
              - cell "Blue Lagoon Farmhouse" [ref=f1e95]
              - cell "farmhouse" [ref=f1e96]
              - cell "Sonipat" [ref=f1e97]
              - cell "₹32,000" [ref=f1e98]
              - cell "published" [ref=f1e99]
              - cell [ref=f1e100]:
                - button "Feature on homepage" [ref=f1e101]
              - cell [ref=f1e104]:
                - generic [ref=f1e105]:
                  - link [ref=f1e106] [cursor=pointer]:
                    - /url: /admin/properties/6a74a2af08a1d0329c4303b8/edit
                  - button [ref=f1e110]
            - row [ref=f1e114]:
              - cell "Ananta Villa" [ref=f1e115]
              - cell "villa" [ref=f1e116]
              - cell "Kasauli" [ref=f1e117]
              - cell "₹28,000" [ref=f1e118]
              - cell "published" [ref=f1e119]
              - cell [ref=f1e120]:
                - button "Remove from homepage" [ref=f1e121]
              - cell [ref=f1e124]:
                - generic [ref=f1e125]:
                  - link [ref=f1e126] [cursor=pointer]:
                    - /url: /admin/properties/6a74a2af08a1d0329c4303b6/edit
                  - button [ref=f1e130]
  - button "Open Next.js Dev Tools" [ref=f1e139] [cursor=pointer]
  - alert [ref=f1e143]
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
  30  |     await expect(btn).toBeDisabled();
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
> 86  |     await page.getByRole("link", { name: /add property/i }).click();
      |                                                             ^ Error: locator.click: Test timeout of 30000ms exceeded.
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
  131 |     await expect(aboutSection.getByRole("button", { name: /save/i })).toBeVisible();
  132 |   });
  133 | 
  134 |   test("Add review button is visible", async ({ page }) => {
  135 |     await expect(page.getByRole("button", { name: /add review/i })).toBeVisible();
  136 |   });
  137 | 
  138 |   test("Add FAQ button is visible", async ({ page }) => {
  139 |     await expect(page.getByRole("button", { name: /add faq/i })).toBeVisible();
  140 |   });
  141 | 
  142 |   test("Policy page Save buttons are visible", async ({ page }) => {
  143 |     const policySection = page.locator("section").filter({ hasText: /policy pages/i });
  144 |     const saveBtns = policySection.getByRole("button", { name: /save/i });
  145 |     await expect(saveBtns.first()).toBeVisible();
  146 |   });
  147 | });
  148 | 
  149 | test.describe("Admin owners", () => {
  150 |   test.beforeEach(async ({ page }) => {
  151 |     await loginAsAdmin(page);
  152 |     await page.goto("/admin/owners");
  153 |     await page.waitForLoadState("networkidle");
  154 |   });
  155 | 
  156 |   test("Add owner button opens the create form", async ({ page }) => {
  157 |     await page.getByRole("button", { name: /add owner/i }).click();
  158 |     await expect(page.getByText(/new owner account/i)).toBeVisible();
  159 |   });
  160 | 
  161 |   test("X button on create form closes it", async ({ page }) => {
  162 |     await page.getByRole("button", { name: /add owner/i }).click();
  163 |     await expect(page.getByText(/new owner account/i)).toBeVisible();
  164 |     // The X close button is inside the form header
  165 |     await page.locator("button[onClick]").filter({ hasText: "" }).last().click();
  166 |     // Or target by finding button next to "New owner account" heading
  167 |     const formHeader = page.getByText(/new owner account/i).locator("..");
  168 |     await formHeader.getByRole("button").click();
  169 |     await expect(page.getByText(/new owner account/i)).not.toBeVisible();
  170 |   });
  171 | });
  172 | 
```