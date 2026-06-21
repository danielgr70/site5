import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto("http://127.0.0.1:4326/keystatic/collection/reviews/create", {
  waitUntil: "networkidle",
  timeout: 60000,
});
await page.waitForTimeout(3000);

const nameInput = page.locator("#item-create-form input").first();
await nameInput.fill("רונית טסט");
await page.waitForTimeout(500);

const slugValue = await page.evaluate(() => {
  const slugInput = document.querySelector(
    '#item-create-form input[aria-required="true"]'
  );
  return slugInput?.value ?? null;
});

console.log({ slugValue, slugVisible: false });
await browser.close();
