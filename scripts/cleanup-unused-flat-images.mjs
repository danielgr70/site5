/**
 * Elimina imágenes planas en public/assets/img/ que no están referenciadas.
 * Uso: node scripts/cleanup-unused-flat-images.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const imgRoot = path.join(root, "public", "assets", "img");

/** Archivos planos que SÍ se usan en el sitio (fuera de comentarios / CMS anidado). */
const KEEP_FLAT = new Set([
  "bg-clouds-short.webp",
  "bg-field.webp",
  "bg-shape-bottom-right.webp",
  "bg-shape-top-left.webp",
  "bg-woman.webp",
  "favicon.webp",
  "img-woman-pointing.webp",
  "loading.svg",
  "orit-logo.webp",
  "orit-phone.webp",
  "pattern-topo.webp",
]);

const SCAN_DIRS = ["src", "public", "keystatic", "scripts"];
const SCAN_EXT = /\.(astro|mdoc|md|ts|js|css|html|json|mjs)$/i;

function collectReferencedFilenames() {
  const refs = new Set();
  const re = /\/assets\/img\/([a-zA-Z0-9._-]+\.(?:webp|svg|jpe?g|png|gif))/g;

  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name === "node_modules" || entry.name === "dist" || entry.name === ".git")
        continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
        continue;
      }
      if (!SCAN_EXT.test(entry.name)) continue;
      const text = fs.readFileSync(full, "utf8");
      // Ignorar bloques HTML comentados (código archivado)
      const active = text.replace(/<!--[\s\S]*?-->/g, "");
      let m;
      while ((m = re.exec(active)) !== null) {
        if (!m[1].includes("/")) refs.add(m[1]);
      }
    }
  }

  for (const dir of SCAN_DIRS) {
    const full = path.join(root, dir);
    if (fs.existsSync(full)) walk(full);
  }
  return refs;
}

const referenced = collectReferencedFilenames();
let removed = 0;

for (const entry of fs.readdirSync(imgRoot, { withFileTypes: true })) {
  if (!entry.isFile()) continue;
  const name = entry.name;
  if (KEEP_FLAT.has(name)) continue;
  if (referenced.has(name)) {
    console.log(`  keep (referenced): ${name}`);
    continue;
  }
  fs.unlinkSync(path.join(imgRoot, name));
  console.log(`  removed: ${name}`);
  removed++;
}

console.log(`\nListo. ${removed} archivo(s) plano(s) eliminado(s).`);
