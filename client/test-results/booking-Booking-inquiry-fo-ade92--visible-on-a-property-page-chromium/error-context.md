# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: booking.spec.ts >> Booking inquiry form >> Send enquiry button is visible on a property page
- Location: tests\e2e\booking.spec.ts:23:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('button', { name: /send enquiry/i })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('button', { name: /send enquiry/i })

```

```yaml
- banner:
  - link "Stayuga":
    - /url: /
  - navigation:
    - link "Properties":
      - /url: /properties
    - link "Experiences":
      - /url: /experiences
    - link "About":
      - /url: /about
    - link "FAQ":
      - /url: /faq
    - link "Contact":
      - /url: /contact
  - link "Book a stay":
    - /url: /properties
- main:
  - paragraph: Our collection
  - heading "Villas & farmhouses" [level=2]
  - paragraph: Every property is personally vetted for design, comfort, and setting.
  - complementary:
    - text: Filters Dates
    - paragraph: Check-in
    - paragraph: —
    - paragraph: Check-out
    - paragraph: —
    - button "Previous month" [disabled]
    - text: August 2026
    - button "Next month"
    - text: Su Mo Tu We Th Fr Sa
    - button "1" [disabled]
    - button "2" [disabled]
    - button "3" [disabled]
    - button "4" [disabled]
    - button "5" [disabled]
    - button "6" [disabled]
    - button "7" [disabled]
    - button "8" [disabled]
    - button "9" [disabled]
    - button "10" [disabled]
    - button "11"
    - button "12"
    - button "13"
    - button "14"
    - button "15"
    - button "16"
    - button "17"
    - button "18"
    - button "19"
    - button "20"
    - button "21"
    - button "22"
    - button "23"
    - button "24"
    - button "25"
    - button "26"
    - button "27"
    - button "28"
    - button "29"
    - button "30"
    - button "31"
    - separator
    - paragraph: Property type
    - radio "All types"
    - text: All types
    - radio "Villa"
    - text: Villa
    - radio "Farmhouse"
    - text: Farmhouse
    - separator
    - text: City / Location
    - textbox "e.g. Kasauli"
    - separator
    - text: Minimum guests
    - spinbutton "e.g. 10"
    - button "Apply filters"
  - paragraph: 3 properties found
  - link "Meadow House Farmstay farmhouse Karjat, Maharashtra Meadow House Farmstay Open meadows, mango orchards, and quiet mornings 16 guests 5 beds ₹18,000 per night":
    - /url: /properties/meadow-house-farmstay
    - img "Meadow House Farmstay"
    - text: farmhouse
    - paragraph: Karjat, Maharashtra
    - heading "Meadow House Farmstay" [level=3]
    - paragraph: Open meadows, mango orchards, and quiet mornings
    - text: 16 guests 5 beds ₹18,000 per night
  - link "Blue Lagoon Farmhouse farmhouse Sonipat, Haryana Blue Lagoon Farmhouse Lakeside farmhouse built for celebrations 24 guests 6 beds ₹32,000 per night":
    - /url: /properties/blue-lagoon-farmhouse
    - img "Blue Lagoon Farmhouse"
    - text: farmhouse
    - paragraph: Sonipat, Haryana
    - heading "Blue Lagoon Farmhouse" [level=3]
    - paragraph: Lakeside farmhouse built for celebrations
    - text: 24 guests 6 beds ₹32,000 per night
  - link "Ananta Villa villa Kasauli, Himachal Pradesh Ananta Villa A private hillside retreat above the valley 10 guests 4 beds ₹28,000 per night":
    - /url: /properties/ananta-villa
    - img "Ananta Villa"
    - text: villa
    - paragraph: Kasauli, Himachal Pradesh
    - heading "Ananta Villa" [level=3]
    - paragraph: A private hillside retreat above the valley
    - text: 10 guests 4 beds ₹28,000 per night
- contentinfo:
  - paragraph: Stayuga
  - paragraph: Curated stays where nature, comfort, and memories meet.
  - img
  - img
  - img
  - paragraph: Explore
  - list:
    - listitem:
      - link "Properties":
        - /url: /properties
    - listitem:
      - link "Experiences":
        - /url: /experiences
    - listitem:
      - link "About Us":
        - /url: /about
    - listitem:
      - link "Contact":
        - /url: /contact
  - paragraph: Support
  - list:
    - listitem:
      - link "FAQ":
        - /url: /faq
    - listitem:
      - link "Terms & Conditions":
        - /url: /policies/terms
    - listitem:
      - link "Privacy Policy":
        - /url: /policies/privacy
    - listitem:
      - link "Cancellation Policy":
        - /url: /policies/cancellation
  - paragraph: Get in touch
  - list:
    - listitem: hello@stayuga.com
    - listitem: +91 00000 00000
  - paragraph: © 2026 Stayuga. All rights reserved.
  - paragraph: Handpicked villas & farmhouses across India.
- link "Chat with us on WhatsApp":
  - /url: https://wa.me/?text=Hi%20Stayuga%2C%20I'd%20like%20to%20know%20more%20about%20your%20properties.
- alert
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | test.describe("Contact form", () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     await page.goto("/contact");
  6  |   });
  7  | 
  8  |   test("Send message button is disabled when form is empty", async ({ page }) => {
  9  |     const submit = page.getByRole("button", { name: /send message/i });
  10 |     await expect(submit).toBeDisabled();
  11 |   });
  12 | 
  13 |   test("Form enables submit once required fields are filled", async ({ page }) => {
  14 |     await page.getByLabel(/name/i).fill("Test User");
  15 |     await page.getByLabel(/email/i).fill("test@example.com");
  16 |     await page.getByLabel(/message/i).fill("Hello, I want to book a villa.");
  17 |     const submit = page.getByRole("button", { name: /send message/i });
  18 |     await expect(submit).toBeEnabled();
  19 |   });
  20 | });
  21 | 
  22 | test.describe("Booking inquiry form", () => {
  23 |   test("Send enquiry button is visible on a property page", async ({ page }) => {
  24 |     // Navigate to properties list and open the first property
  25 |     await page.goto("/properties");
  26 |     const firstCard = page.locator("a[href^='/properties/']").first();
  27 |     await firstCard.click();
  28 |     await page.waitForLoadState("networkidle");
  29 | 
  30 |     // Check enquiry form is present
> 31 |     await expect(page.getByRole("button", { name: /send enquiry/i })).toBeVisible();
     |                                                                       ^ Error: expect(locator).toBeVisible() failed
  32 |   });
  33 | 
  34 |   test("Send enquiry is disabled when required fields are empty", async ({ page }) => {
  35 |     await page.goto("/properties");
  36 |     const firstCard = page.locator("a[href^='/properties/']").first();
  37 |     await firstCard.click();
  38 |     await page.waitForLoadState("networkidle");
  39 | 
  40 |     await expect(page.getByRole("button", { name: /send enquiry/i })).toBeDisabled();
  41 |   });
  42 | 
  43 |   test("WhatsApp enquiry button is visible", async ({ page }) => {
  44 |     await page.goto("/properties");
  45 |     const firstCard = page.locator("a[href^='/properties/']").first();
  46 |     await firstCard.click();
  47 |     await page.waitForLoadState("networkidle");
  48 | 
  49 |     await expect(page.getByRole("link", { name: /whatsapp/i })).toBeVisible();
  50 |   });
  51 | });
  52 | 
  53 | test.describe("Homepage CTAs", () => {
  54 |   test.beforeEach(async ({ page }) => {
  55 |     await page.goto("/");
  56 |   });
  57 | 
  58 |   test("Browse properties button links to /properties", async ({ page }) => {
  59 |     await expect(page.getByRole("link", { name: /browse properties/i })).toHaveAttribute("href", "/properties");
  60 |   });
  61 | 
  62 |   test("View all properties link navigates correctly", async ({ page }) => {
  63 |     await page.getByRole("link", { name: /view all properties/i }).click();
  64 |     await expect(page).toHaveURL("/properties");
  65 |   });
  66 | 
  67 |   test("View all experiences link navigates correctly", async ({ page }) => {
  68 |     await page.getByRole("link", { name: /view all experiences/i }).click();
  69 |     await expect(page).toHaveURL("/experiences");
  70 |   });
  71 | });
  72 | 
```