# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: navigation.spec.ts >> Footer links >> footer Terms link works
- Location: tests\e2e\navigation.spec.ts:61:7

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected: "http://localhost:3000/policies/terms"
Received: "http://localhost:3000/"
Timeout:  5000ms

Call log:
  - Expect "toHaveURL" with timeout 5000ms
    12 × locator resolved to <html lang="en" class="inter_98bb7a87-module__Nw7vRW__variable playfair_display_a2a8abc9-module__SQEMyG__variable h-full antialiased">…</html>
       - unexpected value "http://localhost:3000/"

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
  - img "A luxury villa surrounded by hills at golden hour"
  - paragraph: Handpicked villas & farmhouses
  - heading "Curated stays where nature, comfort, and memories meet" [level=1]
  - paragraph: Handpicked villas and farmhouses for the moments worth slowing down for.
  - link "Explore properties":
    - /url: /properties
  - link "View experiences":
    - /url: /experiences
  - paragraph: Why Stayuga
  - heading "Hospitality, considered" [level=2]
  - heading "Handpicked Premium Stays" [level=3]
  - paragraph: Every villa and farmhouse is personally visited and vetted before it joins our portfolio.
  - heading "Exceptional Guest Experience" [level=3]
  - paragraph: From the first enquiry to check-out, our team is on hand to make every detail effortless.
  - heading "Expertly Trained Staff" [level=3]
  - paragraph: On-ground caretakers and chefs trained to deliver warm, attentive hospitality.
  - heading "Memories, Not Just Stays" [level=3]
  - paragraph: Thoughtfully designed spaces and experiences built for the moments worth remembering.
  - paragraph: Featured
  - heading "A few of our favourite escapes" [level=2]
  - link "View all properties":
    - /url: /properties
  - link "Meadow House Farmstay farmhouse Karjat, Maharashtra Meadow House Farmstay Open meadows, mango orchards, and quiet mornings 16 guests 5 beds ₹18,000 per night":
    - /url: /properties/meadow-house-farmstay
    - img "Meadow House Farmstay"
    - text: farmhouse
    - paragraph: Karjat, Maharashtra
    - heading "Meadow House Farmstay" [level=3]
    - paragraph: Open meadows, mango orchards, and quiet mornings
    - text: 16 guests 5 beds ₹18,000 per night
  - link "Ananta Villa villa Kasauli, Himachal Pradesh Ananta Villa A private hillside retreat above the valley 10 guests 4 beds ₹28,000 per night":
    - /url: /properties/ananta-villa
    - img "Ananta Villa"
    - text: villa
    - paragraph: Kasauli, Himachal Pradesh
    - heading "Ananta Villa" [level=3]
    - paragraph: A private hillside retreat above the valley
    - text: 10 guests 4 beds ₹28,000 per night
  - paragraph: Experiences
  - heading "Retreats, events & celebrations" [level=2]
  - link "View all experiences":
    - /url: /experiences
  - img "Full Moon Wellness Retreat"
  - text: retreat
  - heading "Full Moon Wellness Retreat" [level=3]
  - paragraph: A guided two-day wellness retreat at Ananta Villa featuring sunrise yoga, sound healing, and a curated slow-food menu under the stars.
  - paragraph: Ananta Villa, Kasauli
  - paragraph: Monthly, on the weekend nearest the full moon
  - img "Harvest Table Dinner"
  - text: event
  - heading "Harvest Table Dinner" [level=3]
  - paragraph: A long-table farm dinner at Meadow House Farmstay, celebrating the orchard's seasonal harvest with a multi-course menu and live acoustic music.
  - paragraph: Meadow House Farmstay, Karjat
  - paragraph: Seasonal — announced quarterly
  - paragraph: Guest stories
  - heading "What our guests remember" [level=2]
  - figure "Ritika & Arjun — Ananta Villa, Kasauli":
    - blockquote: “Every detail felt considered — from the welcome hamper to the sunset views. It didn't feel like a rental, it felt like a home we'd always had.”
    - text: Ritika & Arjun — Ananta Villa, Kasauli
  - figure "Meera S. — Blue Lagoon Farmhouse":
    - blockquote: “We hosted our anniversary dinner at Blue Lagoon and the team handled everything effortlessly. Genuinely the most relaxed we've been planning an event.”
    - text: Meera S. — Blue Lagoon Farmhouse
  - figure "Kunal D. — Meadow House Farmstay":
    - blockquote: “The orchard breakfast alone was worth the trip. Beautifully kept property and a caretaker who anticipated everything we needed.”
    - text: Kunal D. — Meadow House Farmstay
  - heading "Ready to plan your escape?" [level=2]
  - paragraph: Tell us your dates and headcount — our team will help you find the right villa or farmhouse and take care of the rest.
  - link "Browse properties":
    - /url: /properties
  - link "Talk to our team":
    - /url: /contact
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
  3  | test.describe("Header navigation", () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     await page.goto("/");
  6  |     await page.waitForLoadState("networkidle");
  7  |   });
  8  | 
  9  |   test("Properties nav link navigates correctly", async ({ page }) => {
  10 |     await page.getByRole("navigation").getByRole("link", { name: /^properties$/i }).click();
  11 |     await expect(page).toHaveURL("/properties");
  12 |   });
  13 | 
  14 |   test("Experiences nav link navigates correctly", async ({ page }) => {
  15 |     await page.getByRole("navigation").getByRole("link", { name: /^experiences$/i }).click();
  16 |     await expect(page).toHaveURL("/experiences");
  17 |   });
  18 | 
  19 |   test("About nav link navigates correctly", async ({ page }) => {
  20 |     await page.getByRole("navigation").getByRole("link", { name: /^about$/i }).click();
  21 |     await expect(page).toHaveURL("/about");
  22 |   });
  23 | 
  24 |   test("FAQ nav link navigates correctly", async ({ page }) => {
  25 |     await page.getByRole("navigation").getByRole("link", { name: /^faq$/i }).click();
  26 |     await expect(page).toHaveURL("/faq");
  27 |   });
  28 | 
  29 |   test("Contact nav link navigates correctly", async ({ page }) => {
  30 |     await page.getByRole("navigation").getByRole("link", { name: /^contact$/i }).click();
  31 |     await expect(page).toHaveURL("/contact");
  32 |   });
  33 | 
  34 |   test("Book a stay CTA button navigates to properties", async ({ page }) => {
  35 |     await page.getByRole("link", { name: /book a stay/i }).first().click();
  36 |     await expect(page).toHaveURL("/properties");
  37 |   });
  38 | });
  39 | 
  40 | test.describe("Footer links", () => {
  41 |   test.beforeEach(async ({ page }) => {
  42 |     await page.goto("/");
  43 |     await page.waitForLoadState("networkidle");
  44 |   });
  45 | 
  46 |   test("footer Properties link works", async ({ page }) => {
  47 |     await page.getByRole("contentinfo").getByRole("link", { name: /^properties$/i }).click();
  48 |     await expect(page).toHaveURL("/properties");
  49 |   });
  50 | 
  51 |   test("footer Experiences link works", async ({ page }) => {
  52 |     await page.getByRole("contentinfo").getByRole("link", { name: /^experiences$/i }).click();
  53 |     await expect(page).toHaveURL("/experiences");
  54 |   });
  55 | 
  56 |   test("footer FAQ link works", async ({ page }) => {
  57 |     await page.getByRole("contentinfo").getByRole("link", { name: /^faq$/i }).click();
  58 |     await expect(page).toHaveURL("/faq");
  59 |   });
  60 | 
  61 |   test("footer Terms link works", async ({ page }) => {
  62 |     await page.getByRole("contentinfo").getByRole("link", { name: /terms/i }).click();
> 63 |     await expect(page).toHaveURL("/policies/terms");
     |                        ^ Error: expect(page).toHaveURL(expected) failed
  64 |   });
  65 | 
  66 |   test("footer Privacy link works", async ({ page }) => {
  67 |     await page.getByRole("contentinfo").getByRole("link", { name: /privacy/i }).click();
  68 |     await expect(page).toHaveURL("/policies/privacy");
  69 |   });
  70 | 
  71 |   test("footer Cancellation link works", async ({ page }) => {
  72 |     await page.getByRole("contentinfo").getByRole("link", { name: /cancellation/i }).click();
  73 |     await expect(page).toHaveURL("/policies/cancellation");
  74 |   });
  75 | });
  76 | 
```