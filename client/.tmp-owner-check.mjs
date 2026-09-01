import { chromium } from "playwright";

const outDir = process.argv[2];
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });

const netErrors = [];
const consoleErrors = [];
page.on("console", (msg) => {
  if (msg.type() === "error") consoleErrors.push(`[${page.url()}] ${msg.text()}`);
});
page.on("pageerror", (err) => consoleErrors.push(`[${page.url()}] PAGEERROR: ${err.message}`));
page.on("response", async (res) => {
  if (res.status() >= 400) {
    let body = "";
    try { body = (await res.text()).slice(0, 300); } catch {}
    netErrors.push(`${res.status()} ${res.url()} :: ${body}`);
  }
});

async function shot(name) {
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${outDir}/${name}.png`, fullPage: true });
  console.log(`shot: ${name}`);
}

// login as admin
await page.goto("http://localhost:3000/admin/login", { waitUntil: "networkidle" });
await page.fill('input[type="email"]', "admin@stayuga.com");
await page.fill('input[type="password"]', "Stayuga@123");
await page.click('button[type="submit"]');
await page.waitForURL("**/admin/dashboard", { timeout: 8000 });

// go to owners, create one
await page.goto("http://localhost:3000/admin/owners", { waitUntil: "networkidle" });
await page.click('button:has-text("Add owner")');
await page.waitForTimeout(300);
await page.fill('input[placeholder=""]', "").catch(() => {});
const inputs = page.locator('div.mt-6 input');
await page.getByRole("textbox").nth(0).fill("Test Owner"); // Name
await page.getByPlaceholder("owner@example.com").fill("testowner@stayuga.com");
await page.getByPlaceholder("+91 98765 43210").fill("9999999999");
// Password field has no placeholder - find by label text proximity
const pwInput = page.locator('label:has-text("Password") + input, label:has-text("Password") ~ input').first();
// fallback: get all password-type inputs
const pwInputs = page.locator('input[type="password"]');
await pwInputs.first().fill("TestOwner@123");
// assign first available property if any
const propButtons = page.locator('div.mt-4 button.rounded-full');
const propCount = await propButtons.count();
if (propCount > 0) await propButtons.first().click();

await shot("owner-create-form-filled");
await page.click('button:has-text("Create owner")');
await page.waitForTimeout(1000);
await shot("owner-created");

// logout admin
await page.click('button:has-text("Log out")').catch(async () => {
  await page.getByText("Log out").click().catch(() => {});
});
await page.waitForTimeout(500);

// login as owner
await page.goto("http://localhost:3000/owner/login", { waitUntil: "networkidle" });
await page.getByPlaceholder("you@example.com or +91 98765 43210").fill("testowner@stayuga.com");
await page.locator('input[type="password"]').fill("TestOwner@123");
await page.click('button:has-text("Sign in")');
try {
  await page.waitForURL("**/owner/dashboard", { timeout: 8000 });
  console.log("Owner login: navigated to dashboard OK");
} catch (e) {
  console.log("Owner login: FAILED - " + e.message);
}
await shot("owner-dashboard");

for (const path of ["/owner/properties", "/owner/bookings"]) {
  await page.goto(`http://localhost:3000${path}`, { waitUntil: "networkidle" });
  await shot("owner-" + path.split("/").pop());
}

// try calendar if a property link exists
const calLink = page.locator('a[href*="/owner/properties/"][href*="/calendar"]').first();
if (await calLink.count() > 0) {
  const href = await calLink.getAttribute("href");
  await page.goto(`http://localhost:3000${href}`, { waitUntil: "networkidle" });
  await shot("owner-calendar");
} else {
  await page.goto("http://localhost:3000/owner/properties", { waitUntil: "networkidle" });
  const anyPropLink = page.locator('a[href^="/owner/properties/"]').first();
  if (await anyPropLink.count() > 0) {
    const href = await anyPropLink.getAttribute("href");
    await page.goto(`http://localhost:3000${href}`, { waitUntil: "networkidle" });
    await shot("owner-calendar-direct");
  } else {
    console.log("No owner property link found to test calendar page");
  }
}

await browser.close();

console.log("\n=== NETWORK ERRORS (4xx/5xx) ===");
console.log(netErrors.join("\n") || "(none)");
console.log("\n=== CONSOLE ERRORS ===");
console.log(consoleErrors.join("\n") || "(none)");
