# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: owner.spec.ts >> Owner login page >> Sign in button is disabled while request is in-flight
- Location: tests\e2e\owner.spec.ts:13:7

# Error details

```
Error: expect(locator).toBeDisabled() failed

Locator:  getByRole('button', { name: /sign in/i })
Expected: disabled
Received: enabled
Timeout:  5000ms

Call log:
  - Expect "toBeDisabled" with timeout 5000ms
  - waiting for getByRole('button', { name: /sign in/i })
    4 × locator resolved to <button type="submit" class="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium tracking-wide transition-colors duration-200 disabled:opacity-50 disabled:pointer-events-none bg-forest text-cream hover:bg-forest-light w-full">Sign in</button>
      - unexpected value "enabled"

```

```yaml
- button "Sign in"
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | test.describe("Owner login page", () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     await page.goto("/owner/login");
  6  |     await page.waitForLoadState("networkidle");
  7  |   });
  8  | 
  9  |   test("Sign in button is visible", async ({ page }) => {
  10 |     await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible();
  11 |   });
  12 | 
  13 |   test("Sign in button is disabled while request is in-flight", async ({ page }) => {
  14 |     // Hold the login request open long enough to assert the disabled state.
  15 |     await page.route(/\/api\/owner\/auth\/login$/, async (route) => {
  16 |       await new Promise((r) => setTimeout(r, 3000));
  17 |       await route.continue();
  18 |     });
  19 |     await page.getByLabel(/email or phone/i).fill("nobody@example.com");
  20 |     await page.getByLabel(/password/i).fill("wrongpass");
  21 |     const btn = page.getByRole("button", { name: /sign in/i });
  22 |     // waitForRequest resolves once the fetch fires (after setSubmitting(true) + React re-render).
  23 |     const requestPromise = page.waitForRequest(/\/api\/owner\/auth\/login$/);
  24 |     await btn.click();
  25 |     await requestPromise;
> 26 |     await expect(btn).toBeDisabled();
     |                       ^ Error: expect(locator).toBeDisabled() failed
  27 |   });
  28 | 
  29 |   test("Shows error on invalid owner credentials", async ({ page }) => {
  30 |     await page.getByLabel(/email or phone/i).fill("nobody@example.com");
  31 |     await page.getByLabel(/password/i).fill("wrongpassword");
  32 |     await page.getByRole("button", { name: /sign in/i }).click();
  33 |     await expect(page.getByText(/invalid|login failed/i)).toBeVisible();
  34 |   });
  35 | });
  36 | 
```