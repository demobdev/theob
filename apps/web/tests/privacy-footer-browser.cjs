// Reusable Playwright page check for footer-privacy-fixture.html.
// Render the real footer with privacy-hardening.test.cjs before serving locally.
module.exports = async function verifyFooterPrivacy(page) {
  const marker = "privacy-fixture@example.invalid";
  const outbound = [];
  const logs = [];
  const context = page.context();
  await context.route("https://**/*", async (route) => {
    outbound.push({ url: route.request().url(), body: route.request().postData() });
    await route.fulfill({ status: 200, contentType: "text/html", body: "Mock destination" });
  });
  page.on("console", (message) => logs.push(message.text()));
  await page.evaluate(() => {
    window.__privacyEvents = [];
    window.posthog = {
      capture: (...args) => window.__privacyEvents.push(args),
      identify: (...args) => window.__privacyEvents.push(args),
    };
    window.gtag = (...args) => window.__privacyEvents.push(args);
  });
  const updates = page.getByRole("region", { name: "Stay updated" });
  if (await updates.locator("input, textarea, form").count()) {
    throw new Error("Newsletter still has a data entry or submission path");
  }
  if (!(await updates.innerText()).includes("Email signup is not available yet")) {
    throw new Error("Unavailable signup is not disclosed");
  }
  let rejected = false;
  try {
    await updates.fill(marker, { timeout: 1000 });
  } catch {
    rejected = true;
  }
  if (!rejected) throw new Error("Unavailable signup accepted text");
  const initialUrl = page.url();
  await updates.evaluate((element) => { element.tabIndex = 0; element.focus(); });
  await page.keyboard.press("Enter");
  if (page.url() !== initialUrl || page.url().includes(marker)) {
    throw new Error("Newsletter changed URL or leaked attempted input");
  }
  const payloads = await page.evaluate(() => JSON.stringify(window.__privacyEvents));
  if (payloads !== "[]" || payloads.includes(marker) || logs.some((line) => line.includes(marker))) {
    throw new Error("Attempted input appeared in tracking or logs");
  }
  if (/subscribed|thank you|signup complete/i.test(await updates.innerText())) {
    throw new Error("Newsletter falsely claimed success");
  }
  if ((await updates.getByRole("link", { name: "Follow on Instagram" }).getAttribute("href")) !== "https://www.instagram.com/ownersbox.gvl/") {
    throw new Error("Unexpected social destination");
  }
  const popupPromise = context.waitForEvent("page");
  await updates.getByRole("link", { name: "Follow on Instagram" }).click();
  const popup = await popupPromise;
  await popup.waitForLoadState("domcontentloaded");
  if (outbound.length !== 1 || outbound[0].url !== "https://www.instagram.com/ownersbox.gvl/" || outbound[0].body) {
    throw new Error("Unexpected outbound request or submitted data");
  }
  await popup.close();
  await page.setViewportSize({ width: 390, height: 844 });
  if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)) {
    throw new Error("Footer overflows mobile width");
  }
  await page.screenshot({ path: "output/playwright/mobile-footer-privacy.png" });
  return "PASS: attempted PII rejected; URL, mocked tracking and logs clean; no false success; social link mocked without submitted data";
};
