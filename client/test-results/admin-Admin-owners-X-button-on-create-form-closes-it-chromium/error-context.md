# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin.spec.ts >> Admin owners >> X button on create form closes it
- Location: tests\e2e\admin.spec.ts:161:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('button[onClick]').last()

```

# Page snapshot

```yaml
- generic [ref=f1e1]:
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
            - heading "Property Owners" [level=1] [ref=f1e56]
            - paragraph [ref=f1e57]: Create owner accounts and assign properties to them.
          - button "Add owner" [active] [ref=f1e58]
        - generic [ref=f1e60]:
          - generic [ref=f1e61]:
            - heading "New owner account" [level=3] [ref=f1e62]
            - button [ref=f1e63]
          - generic [ref=f1e67]:
            - generic [ref=f1e68]:
              - generic [ref=f1e69]: Name
              - textbox "Name" [ref=f1e70]
            - generic [ref=f1e71]:
              - generic [ref=f1e72]: Email address
              - textbox "Email address" [ref=f1e73]:
                - /placeholder: owner@example.com
            - generic [ref=f1e74]:
              - generic [ref=f1e75]: Phone number
              - textbox "Phone number" [ref=f1e76]:
                - /placeholder: +91 98765 43210
            - generic [ref=f1e77]:
              - generic [ref=f1e78]: Password
              - textbox "Password" [ref=f1e79]
          - paragraph [ref=f1e80]: "* Provide at least an email or a phone number."
          - generic [ref=f1e81]:
            - paragraph [ref=f1e82]: Assign properties
            - generic [ref=f1e83]:
              - button "Meadow House Farmstay" [ref=f1e84]
              - button "Blue Lagoon Farmhouse" [ref=f1e85]
              - button "Ananta Villa" [ref=f1e86]
          - button "Create owner" [disabled] [ref=f1e87]
        - table [ref=f1e89]:
          - rowgroup [ref=f1e90]:
            - row [ref=f1e91]:
              - columnheader "Name" [ref=f1e92]
              - columnheader "Email" [ref=f1e93]
              - columnheader "Phone" [ref=f1e94]
              - columnheader "Properties" [ref=f1e95]
              - columnheader "Actions" [ref=f1e96]
          - rowgroup [ref=f1e97]:
            - row [ref=f1e98]:
              - cell "No owners yet." [ref=f1e99]
  - button "Open Next.js Dev Tools" [ref=f1e105] [cursor=pointer]
  - alert [ref=f1e109]
```

# Test source

```ts
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
> 165 |     await page.locator("button[onClick]").filter({ hasText: "" }).last().click();
      |                                                                          ^ Error: locator.click: Test timeout of 30000ms exceeded.
  166 |     // Or target by finding button next to "New owner account" heading
  167 |     const formHeader = page.getByText(/new owner account/i).locator("..");
  168 |     await formHeader.getByRole("button").click();
  169 |     await expect(page.getByText(/new owner account/i)).not.toBeVisible();
  170 |   });
  171 | });
  172 | 
```