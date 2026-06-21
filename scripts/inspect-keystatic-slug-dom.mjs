import { chromium } from "playwright";

const url =
  "http://127.0.0.1:4324/keystatic/collection/events/item/mitkavim-laor";

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(5000);

const result = await page.evaluate(() => {
  const labels = [...document.querySelectorAll("label")];
  const slugLabel = labels.find((l) => l.textContent?.includes("מזהה"));
  if (!slugLabel) return { error: "NO SLUG LABEL", labels: labels.map((l) => l.textContent?.trim()) };

  const regen = document.querySelector('button[aria-label="regenerate"]');

  let fieldRoot = slugLabel.parentElement;
  for (let i = 0; i < 12 && fieldRoot; i++) {
    if (regen && fieldRoot.contains(regen)) break;
    fieldRoot = fieldRoot.parentElement;
  }

  let row = regen?.parentElement ?? null;
  while (row) {
    const prev = row.previousElementSibling;
    if (prev?.querySelector("label") && !prev.querySelector('button[aria-label="regenerate"]')) {
      break;
    }
    row = row.parentElement;
  }

  const slugInput = slugLabel.closest("div")?.querySelector("input");
  const slugFieldWrap = slugLabel.closest(".css-1ftav57") ?? slugLabel.parentElement?.parentElement;
  const slugGroup = slugFieldWrap?.parentElement;
  const slugFieldColumn = slugGroup?.parentElement;

  const chain = (el) => {
    const out = [];
    let n = el;
    for (let i = 0; i < 10 && n; i++) {
      out.push({
        tag: n.tagName,
        class: typeof n.className === "string" ? n.className.slice(0, 120) : "",
        id: n.id,
        role: n.getAttribute("role"),
        data: [...n.attributes].filter(a => a.name.startsWith('data-')).map(a => `${a.name}=${a.value}`),
      });
      n = n.parentElement;
    }
    return out;
  };

  return {
    slugLabelText: slugLabel.textContent?.trim(),
    slugLabelFor: slugLabel.getAttribute("for"),
    regenFound: !!regen,
    rowTag: row?.tagName,
    rowClass: typeof row?.className === "string" ? row.className : "",
    slugLabelChain: chain(slugLabel),
    rowChain: row ? chain(row) : [],
    slugFieldWrapClass: slugFieldWrap?.className,
    slugGroupClass: slugGroup?.className,
    slugGroupHTML: slugGroup?.outerHTML?.slice(0, 2500),
    slugFieldColumnClass: slugFieldColumn?.className,
    slugFieldColumnHTML: slugFieldColumn?.outerHTML?.slice(0, 3500),
    slugInputId: slugInput?.id,
    rowHTML: row?.outerHTML?.slice(0, 1500),
  };
});

console.log(JSON.stringify(result, null, 2));
await browser.close();
