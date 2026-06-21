/**
 * OBSOLETO: no ejecutar tras migrar a fields.slug en keystatic.config.ts.
 * Corrige slug fields mal migrados: { name, slug } → string
 * Uso: node scripts/fix-keystatic-slug-fields.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const contentRoot = path.join(root, "src", "content");

const SLUG_KEYS = new Set(["title", "name"]);

function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return null;
  return { yaml: match[1], body: match[2] };
}

function fixYamlBlock(yaml) {
  const lines = yaml.split(/\r?\n/);
  const out = [];
  let i = 0;
  let changed = false;

  while (i < lines.length) {
    const line = lines[i];
    const keyMatch = line.match(/^([\w-]+):\s*$/);

    if (keyMatch && SLUG_KEYS.has(keyMatch[1]) && i + 2 < lines.length) {
      const nameLine = lines[i + 1];
      const slugLine = lines[i + 2];
      const nameMatch = nameLine?.match(/^\s+name:\s*(.+)$/);
      const slugMatch = slugLine?.match(/^\s+slug:\s*(.+)$/);

      if (nameMatch && slugMatch) {
        out.push(`${keyMatch[1]}: ${nameMatch[1]}`);
        i += 3;
        changed = true;
        continue;
      }
    }

    out.push(line);
    i++;
  }

  return { yaml: out.join("\n"), changed };
}

function walk(dir) {
  let fixed = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      fixed += walk(full);
      continue;
    }
    if (!entry.name.endsWith(".mdoc")) continue;

    const raw = fs.readFileSync(full, "utf8");
    const parsed = parseFrontmatter(raw);
    if (!parsed) continue;

    const { yaml, changed } = fixYamlBlock(parsed.yaml);
    if (!changed) continue;

    const next = `---\n${yaml}\n---\n\n${parsed.body}`.replace(/\n{3,}$/, "\n");
    fs.writeFileSync(full, next.endsWith("\n") ? next : next + "\n", "utf8");
    console.log(`  fixed ${path.relative(root, full)}`);
    fixed++;
  }
  return fixed;
}

console.log("Corrigiendo slug fields en .mdoc...\n");
const count = walk(contentRoot);
console.log(`\nListo. ${count} archivo(s) actualizado(s).`);
