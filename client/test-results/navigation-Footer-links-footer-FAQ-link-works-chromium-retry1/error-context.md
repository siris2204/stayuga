# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: navigation.spec.ts >> Footer links >> footer FAQ link works
- Location: tests\e2e\navigation.spec.ts:59:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('contentinfo').getByRole('link', { name: 'FAQ' })

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
                  - generic [ref=e76]: "9"
                - button "Show 5 ignore-listed frame(s)" [ref=e77] [cursor=pointer]
              - generic [ref=e80]:
                - generic [ref=e81]:
                  - text: apiFetch
                  - button "Open apiFetch in editor" [ref=e82] [cursor=pointer]
                - text: src\lib\api.ts (20:15)
              - generic [ref=e85]:
                - generic [ref=e86]:
                  - text: getProperties
                  - button "Open getProperties in editor" [ref=e87] [cursor=pointer]
                - text: src\lib\data.ts (6:26)
              - generic [ref=e90]:
                - generic [ref=e91]: Promise.all
                - text: <anonymous>
              - generic [ref=e92]:
                - generic [ref=e93]:
                  - text: Home
                  - button "Open Home in editor" [ref=e94] [cursor=pointer]
                - text: src\app\page.tsx (10:46)
            - generic [ref=e97]:
              - generic [ref=e98]: "Caused by: AggregateError"
              - paragraph [ref=e100]: An error occurred in the Server Components render but no message was provided
              - generic [ref=e102]:
                - paragraph [ref=e103]:
                  - text: Call Stack
                  - generic [ref=e104]: "14"
                - button "Show 14 ignore-listed frame(s)" [ref=e105] [cursor=pointer]
        - generic [ref=e108]: "1"
        - generic [ref=e109]: "2"
    - generic [ref=e114] [cursor=pointer]:
      - button "Open Next.js Dev Tools" [ref=e115]
      - generic [ref=e119]:
        - button "Open issues overlay" [ref=e120]:
          - generic [ref=e121]:
            - generic [ref=e122]: "0"
            - generic [ref=e123]: "1"
          - generic [ref=e124]: Issue
        - button "Collapse issues badge" [ref=e125]
  - generic [ref=e129]:
    - heading "This page couldn’t load" [level=1] [ref=e132]
    - paragraph [ref=e133]: A server error occurred. Reload to try again.
    - button "Reload" [ref=e136] [cursor=pointer]
  - paragraph [ref=e137]: ERROR 2664063083
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | test.describe("Header navigation", () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     await page.goto("/");
  6  |   });
  7  | 
  8  |   test("logo links to homepage", async ({ page }) => {
  9  |     await page.getByRole("link", { name: /stayuga/i }).first().click();
  10 |     await expect(page).toHaveURL("/");
  11 |   });
  12 | 
  13 |   test("Properties nav link navigates correctly", async ({ page }) => {
  14 |     await page.getByRole("link", { name: "Properties" }).first().click();
  15 |     await expect(page).toHaveURL("/properties");
  16 |   });
  17 | 
  18 |   test("Experiences nav link navigates correctly", async ({ page }) => {
  19 |     await page.getByRole("link", { name: "Experiences" }).first().click();
  20 |     await expect(page).toHaveURL("/experiences");
  21 |   });
  22 | 
  23 |   test("About nav link navigates correctly", async ({ page }) => {
  24 |     await page.getByRole("link", { name: "About" }).first().click();
  25 |     await expect(page).toHaveURL("/about");
  26 |   });
  27 | 
  28 |   test("FAQ nav link navigates correctly", async ({ page }) => {
  29 |     await page.getByRole("link", { name: "FAQ" }).first().click();
  30 |     await expect(page).toHaveURL("/faq");
  31 |   });
  32 | 
  33 |   test("Contact nav link navigates correctly", async ({ page }) => {
  34 |     await page.getByRole("link", { name: "Contact" }).first().click();
  35 |     await expect(page).toHaveURL("/contact");
  36 |   });
  37 | 
  38 |   test("Book a stay CTA button navigates to properties", async ({ page }) => {
  39 |     await page.getByRole("link", { name: /book a stay/i }).first().click();
  40 |     await expect(page).toHaveURL("/properties");
  41 |   });
  42 | });
  43 | 
  44 | test.describe("Footer links", () => {
  45 |   test.beforeEach(async ({ page }) => {
  46 |     await page.goto("/");
  47 |   });
  48 | 
  49 |   test("footer Properties link works", async ({ page }) => {
  50 |     await page.getByRole("contentinfo").getByRole("link", { name: "Properties" }).click();
  51 |     await expect(page).toHaveURL("/properties");
  52 |   });
  53 | 
  54 |   test("footer Experiences link works", async ({ page }) => {
  55 |     await page.getByRole("contentinfo").getByRole("link", { name: "Experiences" }).click();
  56 |     await expect(page).toHaveURL("/experiences");
  57 |   });
  58 | 
  59 |   test("footer FAQ link works", async ({ page }) => {
> 60 |     await page.getByRole("contentinfo").getByRole("link", { name: "FAQ" }).click();
     |                                                                            ^ Error: locator.click: Test timeout of 30000ms exceeded.
  61 |     await expect(page).toHaveURL("/faq");
  62 |   });
  63 | 
  64 |   test("footer Terms link works", async ({ page }) => {
  65 |     await page.getByRole("contentinfo").getByRole("link", { name: /terms/i }).click();
  66 |     await expect(page).toHaveURL("/policies/terms");
  67 |   });
  68 | 
  69 |   test("footer Privacy link works", async ({ page }) => {
  70 |     await page.getByRole("contentinfo").getByRole("link", { name: /privacy/i }).click();
  71 |     await expect(page).toHaveURL("/policies/privacy");
  72 |   });
  73 | 
  74 |   test("footer Cancellation link works", async ({ page }) => {
  75 |     await page.getByRole("contentinfo").getByRole("link", { name: /cancellation/i }).click();
  76 |     await expect(page).toHaveURL("/policies/cancellation");
  77 |   });
  78 | });
  79 | 
```