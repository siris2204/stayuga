# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: owner.spec.ts >> Owner login page >> Sign in button is disabled while submitting with wrong credentials
- Location: tests\e2e\owner.spec.ts:12:7

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
    5 × locator resolved to <button type="submit" class="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium tracking-wide transition-colors duration-200 disabled:opacity-50 disabled:pointer-events-none bg-forest text-cream hover:bg-forest-light w-full">Sign in</button>
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
  6  |   });
  7  | 
  8  |   test("Sign in button is visible", async ({ page }) => {
  9  |     await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible();
  10 |   });
  11 | 
  12 |   test("Sign in button is disabled while submitting with wrong credentials", async ({ page }) => {
  13 |     await page.getByLabel(/email or phone/i).fill("nobody@example.com");
  14 |     await page.getByLabel(/password/i).fill("wrongpass");
  15 |     const btn = page.getByRole("button", { name: /sign in/i });
  16 |     await btn.click();
> 17 |     await expect(btn).toBeDisabled();
     |                       ^ Error: expect(locator).toBeDisabled() failed
  18 |   });
  19 | 
  20 |   test("Shows error on invalid owner credentials", async ({ page }) => {
  21 |     await page.getByLabel(/email or phone/i).fill("nobody@example.com");
  22 |     await page.getByLabel(/password/i).fill("wrongpassword");
  23 |     await page.getByRole("button", { name: /sign in/i }).click();
  24 |     await expect(page.getByText(/invalid|login failed/i)).toBeVisible();
  25 |   });
  26 | });
  27 | 
```