# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: filters.spec.ts >> Property filters >> Combined filters all appear in URL
- Location: tests\e2e\filters.spec.ts:82:7

# Error details

```
Error: expect(received).toContain(expected) // indexOf

Expected substring: "type=villa"
Received string:    "http://localhost:3000/properties"
```

# Page snapshot

```yaml
- generic [ref=e1]:
  - banner [ref=e2]:
    - generic [ref=e3]:
      - link "Stayuga" [ref=e4] [cursor=pointer]:
        - /url: /
      - navigation [ref=e5]:
        - link "Properties" [ref=e6] [cursor=pointer]:
          - /url: /properties
        - link "Experiences" [ref=e7] [cursor=pointer]:
          - /url: /experiences
        - link "About" [ref=e8] [cursor=pointer]:
          - /url: /about
        - link "FAQ" [ref=e9] [cursor=pointer]:
          - /url: /faq
        - link "Contact" [ref=e10] [cursor=pointer]:
          - /url: /contact
      - link "Book a stay" [ref=e12] [cursor=pointer]:
        - /url: /properties
  - main [ref=e13]:
    - generic [ref=e15]:
      - generic [ref=e16]:
        - paragraph [ref=e17]: Our collection
        - heading "Villas & farmhouses" [level=2] [ref=e18]
        - paragraph [ref=e19]: Every property is personally vetted for design, comfort, and setting.
      - generic [ref=e20]:
        - complementary [ref=e22]:
          - generic [ref=e23]:
            - generic [ref=e24]: Filters
            - button "Clear all" [ref=e26]
          - generic [ref=e30]:
            - generic [ref=e31]: Dates
            - generic [ref=e35]:
              - generic [ref=e36]:
                - paragraph [ref=e37]: Check-in
                - paragraph [ref=e38]: —
              - generic [ref=e39]:
                - paragraph [ref=e40]: Check-out
                - paragraph [ref=e41]: —
            - generic [ref=e42]:
              - generic [ref=e43]:
                - button "Previous month" [disabled] [ref=e44]
                - generic [ref=e47]: August 2026
                - button "Next month" [ref=e48]
              - generic [ref=e51]:
                - generic [ref=e52]: Su
                - generic [ref=e53]: Mo
                - generic [ref=e54]: Tu
                - generic [ref=e55]: We
                - generic [ref=e56]: Th
                - generic [ref=e57]: Fr
                - generic [ref=e58]: Sa
              - generic [ref=e59]:
                - button "1" [disabled] [ref=e67]
                - button "2" [disabled] [ref=e69]
                - button "3" [disabled] [ref=e71]
                - button "4" [disabled] [ref=e73]
                - button "5" [disabled] [ref=e75]
                - button "6" [disabled] [ref=e77]
                - button "7" [disabled] [ref=e79]
                - button "8" [disabled] [ref=e81]
                - button "9" [disabled] [ref=e83]
                - button "10" [disabled] [ref=e85]
                - button "11" [ref=e87] [cursor=pointer]
                - button "12" [ref=e89] [cursor=pointer]
                - button "13" [ref=e91] [cursor=pointer]
                - button "14" [ref=e93] [cursor=pointer]
                - button "15" [ref=e95] [cursor=pointer]
                - button "16" [ref=e97] [cursor=pointer]
                - button "17" [ref=e99] [cursor=pointer]
                - button "18" [ref=e101] [cursor=pointer]
                - button "19" [ref=e103] [cursor=pointer]
                - button "20" [ref=e105] [cursor=pointer]
                - button "21" [ref=e107] [cursor=pointer]
                - button "22" [ref=e109] [cursor=pointer]
                - button "23" [ref=e111] [cursor=pointer]
                - button "24" [ref=e113] [cursor=pointer]
                - button "25" [ref=e115] [cursor=pointer]
                - button "26" [ref=e117] [cursor=pointer]
                - button "27" [ref=e119] [cursor=pointer]
                - button "28" [ref=e121] [cursor=pointer]
                - button "29" [ref=e123] [cursor=pointer]
                - button "30" [ref=e125] [cursor=pointer]
                - button "31" [ref=e127] [cursor=pointer]
          - separator [ref=e128]
          - generic [ref=e129]:
            - paragraph [ref=e130]: Property type
            - generic [ref=e131]:
              - generic [ref=e132] [cursor=pointer]:
                - radio "All types" [ref=e133]
                - generic [ref=e134]: All types
              - generic [ref=e135] [cursor=pointer]:
                - radio "Villa" [ref=e136]
                - generic [ref=e137]: Villa
              - generic [ref=e138] [cursor=pointer]:
                - radio "Farmhouse" [ref=e139]
                - generic [ref=e140]: Farmhouse
          - separator [ref=e141]
          - generic [ref=e142]:
            - generic [ref=e143]: City / Location
            - textbox "e.g. Kasauli" [ref=e144]: Shimla
          - separator [ref=e145]
          - generic [ref=e146]:
            - generic [ref=e147]: Minimum guests
            - spinbutton "e.g. 10" [ref=e148]: "6"
          - button "Apply filters" [active] [ref=e149]
        - paragraph [ref=e151]: No properties match those filters yet — try adjusting your search.
  - contentinfo [ref=e152]:
    - generic [ref=e153]:
      - generic [ref=e154]:
        - paragraph [ref=e155]: Stayuga
        - paragraph [ref=e156]: Curated stays where nature, comfort, and memories meet.
      - generic [ref=e167]:
        - paragraph [ref=e168]: Explore
        - list [ref=e169]:
          - listitem [ref=e170]:
            - link "Properties" [ref=e171] [cursor=pointer]:
              - /url: /properties
          - listitem [ref=e172]:
            - link "Experiences" [ref=e173] [cursor=pointer]:
              - /url: /experiences
          - listitem [ref=e174]:
            - link "About Us" [ref=e175] [cursor=pointer]:
              - /url: /about
          - listitem [ref=e176]:
            - link "Contact" [ref=e177] [cursor=pointer]:
              - /url: /contact
      - generic [ref=e178]:
        - paragraph [ref=e179]: Support
        - list [ref=e180]:
          - listitem [ref=e181]:
            - link "FAQ" [ref=e182] [cursor=pointer]:
              - /url: /faq
          - listitem [ref=e183]:
            - link "Terms & Conditions" [ref=e184] [cursor=pointer]:
              - /url: /policies/terms
          - listitem [ref=e185]:
            - link "Privacy Policy" [ref=e186] [cursor=pointer]:
              - /url: /policies/privacy
          - listitem [ref=e187]:
            - link "Cancellation Policy" [ref=e188] [cursor=pointer]:
              - /url: /policies/cancellation
      - generic [ref=e189]:
        - paragraph [ref=e190]: Get in touch
        - list [ref=e191]:
          - listitem [ref=e192]: hello@stayuga.com
          - listitem [ref=e196]: +91 00000 00000
    - generic [ref=e200]:
      - paragraph [ref=e201]: © 2026 Stayuga. All rights reserved.
      - paragraph [ref=e202]: Handpicked villas & farmhouses across India.
  - link "Chat with us on WhatsApp" [ref=e203] [cursor=pointer]:
    - /url: https://wa.me/?text=Hi%20Stayuga%2C%20I'd%20like%20to%20know%20more%20about%20your%20properties.
  - button "Open Next.js Dev Tools" [ref=e211] [cursor=pointer]
  - alert [ref=e215]
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | test.describe("Property filters", () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     await page.goto("/properties");
  6  |     await page.waitForLoadState("networkidle");
  7  |   });
  8  | 
  9  |   test("Villa radio button filters to villas", async ({ page }) => {
  10 |     await page.getByRole("radio", { name: "Villa" }).first().click();
  11 |     await page.getByRole("button", { name: /apply filters/i }).first().click();
  12 |     await expect(page).toHaveURL(/type=villa/);
  13 |   });
  14 | 
  15 |   test("Farmhouse radio button filters to farmhouses", async ({ page }) => {
  16 |     await page.getByRole("radio", { name: "Farmhouse" }).first().click();
  17 |     await page.getByRole("button", { name: /apply filters/i }).first().click();
  18 |     await expect(page).toHaveURL(/type=farmhouse/);
  19 |   });
  20 | 
  21 |   test("All types radio clears type filter", async ({ page }) => {
  22 |     await page.goto("/properties?type=villa");
  23 |     await page.waitForLoadState("networkidle");
  24 |     await page.getByRole("radio", { name: "All types" }).first().click();
  25 |     await page.getByRole("button", { name: /apply filters/i }).first().click();
  26 |     await expect(page).not.toHaveURL(/type=/);
  27 |   });
  28 | 
  29 |   test("City input filters by location", async ({ page }) => {
  30 |     await page.getByPlaceholder(/kasauli/i).first().fill("Goa");
  31 |     await page.getByRole("button", { name: /apply filters/i }).first().click();
  32 |     await expect(page).toHaveURL(/city=Goa/);
  33 |   });
  34 | 
  35 |   test("Min guests input filters by capacity", async ({ page }) => {
  36 |     await page.getByPlaceholder(/e\.g\. 10/i).first().fill("8");
  37 |     await page.getByRole("button", { name: /apply filters/i }).first().click();
  38 |     await expect(page).toHaveURL(/minGuests=8/);
  39 |   });
  40 | 
  41 |   test("Apply filters button with no selection navigates to /properties", async ({ page }) => {
  42 |     await page.getByRole("button", { name: /apply filters/i }).first().click();
  43 |     await expect(page).toHaveURL("/properties");
  44 |   });
  45 | 
  46 |   test("Clear all button removes all filters", async ({ page }) => {
  47 |     await page.goto("/properties?type=villa&city=Goa&minGuests=4");
  48 |     await page.waitForLoadState("networkidle");
  49 |     await page.getByRole("button", { name: /clear all/i }).first().click();
  50 |     await expect(page).toHaveURL("/properties");
  51 |   });
  52 | 
  53 |   test("Previous month button is disabled on current month", async ({ page }) => {
  54 |     const prevBtn = page.getByRole("button", { name: "Previous month" }).first();
  55 |     await expect(prevBtn).toBeDisabled();
  56 |   });
  57 | 
  58 |   test("Next month button advances the calendar", async ({ page }) => {
  59 |     // Capture the month label before clicking
  60 |     const monthLabel = page.locator("span.text-sm.font-semibold.text-ink").first();
  61 |     const before = await monthLabel.textContent();
  62 |     await page.getByRole("button", { name: "Next month" }).first().click();
  63 |     const after = await monthLabel.textContent();
  64 |     expect(after).not.toBe(before);
  65 |   });
  66 | 
  67 |   test("Clicking a future day highlights it as check-in", async ({ page }) => {
  68 |     const dayBtn = page.locator(".grid.grid-cols-7 button:not([disabled])").first();
  69 |     await dayBtn.click();
  70 |     await expect(dayBtn).toHaveClass(/bg-forest/);
  71 |   });
  72 | 
  73 |   test("Selecting check-in then check-out adds both to URL on Apply", async ({ page }) => {
  74 |     const days = page.locator(".grid.grid-cols-7 button:not([disabled])");
  75 |     await days.nth(0).click();
  76 |     await days.nth(3).click();
  77 |     await page.getByRole("button", { name: /apply filters/i }).first().click();
  78 |     await expect(page).toHaveURL(/checkIn=/);
  79 |     await expect(page).toHaveURL(/checkOut=/);
  80 |   });
  81 | 
  82 |   test("Combined filters all appear in URL", async ({ page }) => {
  83 |     await page.getByRole("radio", { name: "Villa" }).first().click();
  84 |     await page.getByPlaceholder(/kasauli/i).first().fill("Shimla");
  85 |     await page.getByPlaceholder(/e\.g\. 10/i).first().fill("6");
  86 |     await page.getByRole("button", { name: /apply filters/i }).first().click();
  87 |     const url = page.url();
> 88 |     expect(url).toContain("type=villa");
     |                 ^ Error: expect(received).toContain(expected) // indexOf
  89 |     expect(url).toContain("city=Shimla");
  90 |     expect(url).toContain("minGuests=6");
  91 |   });
  92 | });
  93 | 
```