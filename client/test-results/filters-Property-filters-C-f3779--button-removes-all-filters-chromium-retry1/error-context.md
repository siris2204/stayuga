# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: filters.spec.ts >> Property filters >> Clear all button removes all filters
- Location: tests\e2e\filters.spec.ts:45:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: /clear all/i })

```

# Page snapshot

```yaml
- generic [ref=f1e1]:
  - generic [active]:
    - generic [ref=f1e4]:
      - generic [ref=f1e5]:
        - navigation [ref=f1e7]:
          - button [disabled] [ref=f1e8]:
            - img "previous" [ref=f1e9]
          - generic [ref=f1e11]:
            - generic [ref=f1e12]: 1/
            - text: "1"
          - button [disabled] [ref=f1e13]:
            - img "next" [ref=f1e14]
        - link "Next.js 16.2.10 (stale) Turbopack" [ref=f1e17] [cursor=pointer]:
          - /url: https://nextjs.org/docs/messages/version-staleness
          - generic "There is a newer version (16.3.0) available, upgrade recommended!" [ref=f1e20]: Next.js 16.2.10 (stale)
          - generic [ref=f1e21]: Turbopack
      - dialog "Runtime TypeError" [ref=f1e23]:
        - generic [ref=f1e26]:
          - generic [ref=f1e27]:
            - generic [ref=f1e28]:
              - generic [ref=f1e29]:
                - generic [ref=f1e30]: Runtime TypeError
                - generic [ref=f1e31]: Server
              - generic [ref=f1e32]:
                - button "Copy Error Info" [ref=f1e33] [cursor=pointer]
                - button "No related documentation found" [disabled] [ref=f1e36]
                - button "Attach Node.js inspector" [ref=f1e39] [cursor=pointer]
            - generic [ref=f1e48]: fetch failed
          - generic [ref=f1e50]:
            - generic [ref=f1e51]:
              - paragraph [ref=f1e53]:
                - generic [ref=f1e59]: src\lib\api.ts (20:15) @ apiFetch
                - button "Open in editor" [ref=f1e60] [cursor=pointer]
              - generic [ref=f1e65]:
                - generic [ref=f1e66]: "18 | const { token, headers, ...rest } = options;"
                - generic [ref=f1e67]: 19 |
                - generic [ref=f1e68]: "> 20 | const res = await fetch(`${API_URL}${path}`, {"
                - generic [ref=f1e69]: "| ^"
                - generic [ref=f1e70]: 21 | ...rest,
                - generic [ref=f1e71]: "22 | headers: {"
                - generic [ref=f1e72]: "23 | ...(rest.body ? { \"Content-Type\": \"application/json\" } : {}),"
            - generic [ref=f1e73]:
              - generic [ref=f1e74]:
                - paragraph [ref=f1e75]:
                  - text: Call Stack
                  - generic [ref=f1e76]: "8"
                - button "Show 5 ignore-listed frame(s)" [ref=f1e77] [cursor=pointer]
              - generic [ref=f1e80]:
                - generic [ref=f1e81]:
                  - text: apiFetch
                  - button "Open apiFetch in editor" [ref=f1e82] [cursor=pointer]
                - text: src\lib\api.ts (20:15)
              - generic [ref=f1e85]:
                - generic [ref=f1e86]:
                  - text: getProperties
                  - button "Open getProperties in editor" [ref=f1e87] [cursor=pointer]
                - text: src\lib\data.ts (6:26)
              - generic [ref=f1e90]:
                - generic [ref=f1e91]:
                  - text: PropertiesPage
                  - button "Open PropertiesPage in editor" [ref=f1e92] [cursor=pointer]
                - text: src\app\properties\page.tsx (33:22)
            - generic [ref=f1e95]:
              - generic [ref=f1e96]: "Caused by: AggregateError"
              - paragraph [ref=f1e98]: An error occurred in the Server Components render but no message was provided
              - generic [ref=f1e100]:
                - paragraph [ref=f1e101]:
                  - text: Call Stack
                  - generic [ref=f1e102]: "14"
                - button "Show 14 ignore-listed frame(s)" [ref=f1e103] [cursor=pointer]
        - generic [ref=f1e106]: "1"
        - generic [ref=f1e107]: "2"
    - generic [ref=f1e112] [cursor=pointer]:
      - button "Open Next.js Dev Tools" [ref=f1e113]
      - generic [ref=f1e117]:
        - button "Open issues overlay" [ref=f1e118]:
          - generic [ref=f1e119]:
            - generic [ref=f1e120]: "0"
            - generic [ref=f1e121]: "1"
          - generic [ref=f1e122]: Issue
        - button "Collapse issues badge" [ref=f1e123]
  - generic [ref=f1e127]:
    - heading "This page couldn’t load" [level=1] [ref=f1e130]
    - paragraph [ref=f1e131]: A server error occurred. Reload to try again.
    - button "Reload" [ref=f1e134] [cursor=pointer]
  - paragraph [ref=f1e135]: ERROR 214032834
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | test.describe("Property filters", () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     await page.goto("/properties");
  6  |   });
  7  | 
  8  |   test("Villa radio button filters to villas", async ({ page }) => {
  9  |     await page.getByRole("radio", { name: "Villa" }).click();
  10 |     await page.getByRole("button", { name: /apply filters/i }).click();
  11 |     await expect(page).toHaveURL(/type=villa/);
  12 |   });
  13 | 
  14 |   test("Farmhouse radio button filters to farmhouses", async ({ page }) => {
  15 |     await page.getByRole("radio", { name: "Farmhouse" }).click();
  16 |     await page.getByRole("button", { name: /apply filters/i }).click();
  17 |     await expect(page).toHaveURL(/type=farmhouse/);
  18 |   });
  19 | 
  20 |   test("All types radio clears type filter", async ({ page }) => {
  21 |     // First set a type
  22 |     await page.goto("/properties?type=villa");
  23 |     await page.getByRole("radio", { name: "All types" }).click();
  24 |     await page.getByRole("button", { name: /apply filters/i }).click();
  25 |     await expect(page).not.toHaveURL(/type=/);
  26 |   });
  27 | 
  28 |   test("City input filters by location", async ({ page }) => {
  29 |     await page.getByPlaceholder(/kasauli/i).fill("Goa");
  30 |     await page.getByRole("button", { name: /apply filters/i }).click();
  31 |     await expect(page).toHaveURL(/city=Goa/);
  32 |   });
  33 | 
  34 |   test("Min guests input filters by capacity", async ({ page }) => {
  35 |     await page.getByPlaceholder(/e\.g\. 10/i).fill("8");
  36 |     await page.getByRole("button", { name: /apply filters/i }).click();
  37 |     await expect(page).toHaveURL(/minGuests=8/);
  38 |   });
  39 | 
  40 |   test("Apply filters button with no selection navigates to /properties", async ({ page }) => {
  41 |     await page.getByRole("button", { name: /apply filters/i }).click();
  42 |     await expect(page).toHaveURL("/properties");
  43 |   });
  44 | 
  45 |   test("Clear all button removes all filters", async ({ page }) => {
  46 |     await page.goto("/properties?type=villa&city=Goa&minGuests=4");
> 47 |     await page.getByRole("button", { name: /clear all/i }).click();
     |                                                            ^ Error: locator.click: Test timeout of 30000ms exceeded.
  48 |     await expect(page).toHaveURL("/properties");
  49 |   });
  50 | 
  51 |   test("Calendar previous month button is disabled on current month", async ({ page }) => {
  52 |     const prevBtn = page.locator("button[disabled]").filter({ has: page.locator("svg") }).first();
  53 |     await expect(prevBtn).toBeDisabled();
  54 |   });
  55 | 
  56 |   test("Calendar next month button navigates forward", async ({ page }) => {
  57 |     const monthLabel = page.locator("span.text-sm.font-semibold.text-ink").first();
  58 |     const initialMonth = await monthLabel.textContent();
  59 |     await page.locator("button").filter({ has: page.locator("svg.lucide-chevron-right") }).first().click();
  60 |     const newMonth = await monthLabel.textContent();
  61 |     expect(newMonth).not.toBe(initialMonth);
  62 |   });
  63 | 
  64 |   test("Selecting a check-in date highlights it", async ({ page }) => {
  65 |     // Click a future day in the calendar (a non-disabled button in the grid)
  66 |     const futureDay = page.locator(".grid.grid-cols-7 button:not([disabled])").first();
  67 |     await futureDay.click();
  68 |     // The selected day should have the forest background class
  69 |     await expect(futureDay).toHaveClass(/bg-forest/);
  70 |   });
  71 | 
  72 |   test("Selecting check-in then check-out adds both to URL on Apply", async ({ page }) => {
  73 |     const days = page.locator(".grid.grid-cols-7 button:not([disabled])");
  74 |     await days.nth(0).click(); // check-in
  75 |     await days.nth(3).click(); // check-out (3 days later)
  76 |     await page.getByRole("button", { name: /apply filters/i }).click();
  77 |     await expect(page).toHaveURL(/checkIn=/);
  78 |     await expect(page).toHaveURL(/checkOut=/);
  79 |   });
  80 | 
  81 |   test("Combined filters all appear in URL", async ({ page }) => {
  82 |     await page.getByRole("radio", { name: "Villa" }).click();
  83 |     await page.getByPlaceholder(/kasauli/i).fill("Shimla");
  84 |     await page.getByPlaceholder(/e\.g\. 10/i).fill("6");
  85 |     await page.getByRole("button", { name: /apply filters/i }).click();
  86 |     const url = page.url();
  87 |     expect(url).toContain("type=villa");
  88 |     expect(url).toContain("city=Shimla");
  89 |     expect(url).toContain("minGuests=6");
  90 |   });
  91 | });
  92 | 
```