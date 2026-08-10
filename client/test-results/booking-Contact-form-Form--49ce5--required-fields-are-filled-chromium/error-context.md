# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: booking.spec.ts >> Contact form >> Form enables submit once required fields are filled
- Location: tests\e2e\booking.spec.ts:13:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByLabel(/name/i)

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [active]:
    - generic [ref=e4]:
      - generic [ref=e5]:
        - navigation [ref=e7]:
          - button [disabled] [ref=e8]:
            - img "previous" [ref=e9]
          - generic [ref=e11]:
            - generic [ref=e12]: 1/
            - text: "1"
          - button [disabled] [ref=e13]:
            - img "next" [ref=e14]
        - link "Next.js 16.2.10 (stale) Turbopack" [ref=e17] [cursor=pointer]:
          - /url: https://nextjs.org/docs/messages/version-staleness
          - generic "There is a newer version (16.3.0) available, upgrade recommended!" [ref=e20]: Next.js 16.2.10 (stale)
          - generic [ref=e21]: Turbopack
      - dialog "Runtime TypeError" [ref=e23]:
        - generic [ref=e26]:
          - generic [ref=e27]:
            - generic [ref=e28]:
              - generic [ref=e29]:
                - generic [ref=e30]: Runtime TypeError
                - generic [ref=e31]: Server
              - generic [ref=e32]:
                - button "Copy Error Info" [ref=e33] [cursor=pointer]
                - button "No related documentation found" [disabled] [ref=e36]
                - button "Attach Node.js inspector" [ref=e39] [cursor=pointer]
            - generic [ref=e48]: fetch failed
          - generic [ref=e50]:
            - generic [ref=e51]:
              - paragraph [ref=e53]:
                - generic [ref=e59]: src\lib\api.ts (20:15) @ apiFetch
                - button "Open in editor" [ref=e60] [cursor=pointer]
              - generic [ref=e65]:
                - generic [ref=e66]: "18 | const { token, headers, ...rest } = options;"
                - generic [ref=e67]: 19 |
                - generic [ref=e68]: "> 20 | const res = await fetch(`${API_URL}${path}`, {"
                - generic [ref=e69]: "| ^"
                - generic [ref=e70]: 21 | ...rest,
                - generic [ref=e71]: "22 | headers: {"
                - generic [ref=e72]: "23 | ...(rest.body ? { \"Content-Type\": \"application/json\" } : {}),"
            - generic [ref=e73]:
              - generic [ref=e74]:
                - paragraph [ref=e75]:
                  - text: Call Stack
                  - generic [ref=e76]: "7"
                - button "Show 5 ignore-listed frame(s)" [ref=e77] [cursor=pointer]
              - generic [ref=e80]:
                - generic [ref=e81]:
                  - text: apiFetch
                  - button "Open apiFetch in editor" [ref=e82] [cursor=pointer]
                - text: src\lib\api.ts (20:15)
              - generic [ref=e85]:
                - generic [ref=e86]:
                  - text: ContactPage
                  - button "Open ContactPage in editor" [ref=e87] [cursor=pointer]
                - text: src\app\contact\page.tsx (14:22)
            - generic [ref=e90]:
              - generic [ref=e91]: "Caused by: AggregateError"
              - paragraph [ref=e93]: An error occurred in the Server Components render but no message was provided
              - generic [ref=e95]:
                - paragraph [ref=e96]:
                  - text: Call Stack
                  - generic [ref=e97]: "14"
                - button "Show 14 ignore-listed frame(s)" [ref=e98] [cursor=pointer]
        - generic [ref=e101]: "1"
        - generic [ref=e102]: "2"
    - generic [ref=e107] [cursor=pointer]:
      - button "Open Next.js Dev Tools" [ref=e108]
      - generic [ref=e112]:
        - button "Open issues overlay" [ref=e113]:
          - generic [ref=e114]:
            - generic [ref=e115]: "0"
            - generic [ref=e116]: "1"
          - generic [ref=e117]: Issue
        - button "Collapse issues badge" [ref=e118]
  - generic [ref=e122]:
    - heading "This page couldn’t load" [level=1] [ref=e125]
    - paragraph [ref=e126]: A server error occurred. Reload to try again.
    - button "Reload" [ref=e129] [cursor=pointer]
  - paragraph [ref=e130]: ERROR 4170523826
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
> 14 |     await page.getByLabel(/name/i).fill("Test User");
     |                                    ^ Error: locator.fill: Test timeout of 30000ms exceeded.
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