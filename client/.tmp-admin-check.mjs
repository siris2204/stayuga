import { chromium } from "playwright";

const outDir = process.argv[2];
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });

const netErrors = [];
const consoleErrors = [];

page.on("console", (msg) => {
  if (msg.type() === "error") consoleErrors.push(`[${page.url()}] ${msg.text()}`);
});
page.on("pageerror", (err) => {
  consoleErrors.push(`[${page.url()}] PAGEERROR: ${err.message}`);
});
page.on("response", (res) => {
  if (res.status() >= 400) netErrors.push(`${res.status()} ${res.url()}`);
});

async function shot(name) {
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${outDir}/${name}.png`, fullPage: true });
  console.log(`shot: ${name}`);
}

// --- ADMIN FLOW ---
await page.goto("http://localhost:3000/admin/login", { waitUntil: "networkidle" });
await shot("admin-login");

await page.fill('input[type="email"]', "admin@stayuga.com");
await page.fill('input[type="password"]', "Stayuga@123");
await page.click('button[type="submit"]');

try {
  await page.waitForURL("**/admin/dashboard", { timeout: 8000 });
  console.log("Admin login: navigated to dashboard OK");
} catch (e) {
  console.log("Admin login: FAILED to navigate to dashboard - " + e.message);
}
await shot("admin-dashboard");

// visit a few admin subpages
for (const path of ["/admin/properties", "/admin/bookings", "/admin/leads", "/admin/owners", "/admin/content"]) {
  await page.goto(`http://localhost:3000${path}`, { waitUntil: "networkidle" });
  await shot("admin-" + path.split("/").pop());
}

// --- OWNER FLOW ---
await page.goto("http://localhost:3000/owner/login", { waitUntil: "networkidle" });
await shot("owner-login");

await browser.close();

console.log("\n=== NETWORK ERRORS (4xx/5xx) ===");
console.log(netErrors.join("\n") || "(none)");
console.log("\n=== CONSOLE ERRORS ===");
console.log(consoleErrors.join("\n") || "(none)");
