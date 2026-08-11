# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin.spec.ts >> Admin properties >> New property form has Save draft and Publish buttons
- Location: tests\e2e\admin.spec.ts:90:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('button', { name: /save draft/i })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('button', { name: /save draft/i })

```

```yaml
- main:
  - complementary:
    - paragraph: Stayuga
    - paragraph: Admin panel
    - navigation:
      - link "Dashboard":
        - /url: /admin/dashboard
      - link "Properties":
        - /url: /admin/properties
      - link "Bookings":
        - /url: /admin/bookings
      - link "Leads":
        - /url: /admin/leads
      - link "Owners":
        - /url: /admin/owners
      - link "Content":
        - /url: /admin/content
    - paragraph: admin@stayuga.com
    - button "Log out"
  - heading "New property" [level=1]
  - paragraph: Add a new villa or farmhouse listing.
  - heading "Property details" [level=3]
  - text: Title
  - textbox "Title"
  - text: Slug (optional — auto-generated from title)
  - textbox "Slug (optional — auto-generated from title)"
  - text: Type
  - combobox "Type":
    - option "Villa" [selected]
    - option "Farmhouse"
  - text: Status
  - combobox "Status":
    - option "Published" [selected]
    - option "Draft"
  - text: Tagline
  - textbox "Tagline"
  - text: Description
  - textbox "Description"
  - text: Amenities (comma separated)
  - textbox "Amenities (comma separated)":
    - /placeholder: Private pool, Wi-Fi, Bonfire deck
  - checkbox "Feature on homepage"
  - text: Feature on homepage
  - heading "Images" [level=3]
  - button "Choose File"
  - heading "Location" [level=3]
  - text: Address
  - textbox "Address"
  - text: City
  - textbox "City"
  - text: State
  - textbox "State"
  - text: Google Maps embed URL (optional)
  - textbox "Google Maps embed URL (optional)":
    - /placeholder: https://www.google.com/maps?q=...&output=embed
  - heading "Pricing" [level=3]
  - text: Base price / night
  - spinbutton "Base price / night"
  - text: Weekend price (optional)
  - spinbutton "Weekend price (optional)"
  - text: Currency
  - combobox "Currency":
    - option "INR — Indian Rupee" [selected]
    - option "USD — US Dollar"
    - option "EUR — Euro"
  - heading "Capacity" [level=3]
  - text: Max guests
  - spinbutton "Max guests"
  - text: Bedrooms
  - spinbutton "Bedrooms"
  - text: Bathrooms
  - spinbutton "Bathrooms"
  - button "Create property"
- alert
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
  86  |     await page.getByRole("link", { name: /add property/i }).click();
  87  |     await expect(page).toHaveURL("/admin/properties/new");
  88  |   });
  89  | 
  90  |   test("New property form has Save draft and Publish buttons", async ({ page }) => {
  91  |     await page.goto("/admin/properties/new");
> 92  |     await expect(page.getByRole("button", { name: /save draft/i })).toBeVisible();
      |                                                                     ^ Error: expect(locator).toBeVisible() failed
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