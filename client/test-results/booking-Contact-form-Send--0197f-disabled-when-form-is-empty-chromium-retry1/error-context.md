# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: booking.spec.ts >> Contact form >> Send message button is disabled when form is empty
- Location: tests\e2e\booking.spec.ts:8:7

# Error details

```
Error: expect(locator).toBeDisabled() failed

Locator: getByRole('button', { name: /send message/i })
Expected: disabled
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeDisabled" with timeout 5000ms
  - waiting for getByRole('button', { name: /send message/i })

```

```yaml
- img
- heading "This page couldn’t load" [level=1]
- paragraph: A server error occurred. Reload to try again.
- button "Reload"
- paragraph: ERROR 4170523826
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
> 10 |     await expect(submit).toBeDisabled();
     |                          ^ Error: expect(locator).toBeDisabled() failed
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
  31 |     await expect(page.getByRole("button", { name: /send enquiry/i })).toBeVisible();
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