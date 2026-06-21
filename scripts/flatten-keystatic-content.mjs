/**
 * Aplana carpetas slug/index.mdoc → slug.mdoc
 * Uso: node scripts/flatten-keystatic-content.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const dirs = [
  "services",
  "products",
  "events",
  "reviews",
  "customer-videos",
  "podcast",
];

for (const dirName of dirs) {
  const dir = path.join(root, "src", "content", dirName);
  if (!fs.existsSync(dir)) continue;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;

    const slug = entry.name;
    const nested = path.join(dir, slug, "index.mdoc");
    const flat = path.join(dir, `${slug}.mdoc`);

    if (!fs.existsSync(nested)) continue;

    fs.renameSync(nested, flat);
    fs.rmdirSync(path.join(dir, slug));
    console.log(`  ${dirName}/${slug}/index.mdoc → ${dirName}/${slug}.mdoc`);
  }
}

console.log("Listo.");
