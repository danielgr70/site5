/**
 * Sincroniza imágenes al formato que Keystatic usa para preview:
 *   public/assets/img/{slug}/{fieldKey}.ext
 *   /assets/img/{slug}/{fieldKey}.ext en el frontmatter
 *
 * Uso: node scripts/sync-keystatic-images.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const contentRoot = path.join(root, "src", "content");
const imgRoot = path.join(root, "public", "assets", "img");

const IMAGE_KEYS = ["imageUrl", "iconUrl"];

function parseMdoc(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return null;
  return { yaml: match[1], body: match[2], filePath };
}

function getYamlString(yaml, key) {
  const m = yaml.match(new RegExp(`^${key}:\\s*("(?:[^"\\\\]|\\\\.)*")\\s*$`, "m"));
  if (!m) return null;
  return JSON.parse(m[1]);
}

function setYamlValue(yaml, key, value) {
  const line = `${key}: ${JSON.stringify(value)}`;
  if (new RegExp(`^${key}:`, "m").test(yaml)) {
    return yaml.replace(new RegExp(`^${key}:.*$`, "m"), line);
  }
  return `${yaml}\n${line}`;
}

function keystaticPath(slug, fieldKey, ext) {
  return `/assets/img/${slug}/${fieldKey}.${ext.replace(/^\./, "")}`;
}

function resolveSourceFile(slug, fieldKey, ext, currentPath) {
  const nested = path.join(imgRoot, slug, `${fieldKey}.${ext}`);
  if (fs.existsSync(nested)) return nested;
  if (currentPath) {
    const fromPath = path.join(
      root,
      "public",
      currentPath.replace(/^\//, "").replace(/\//g, path.sep)
    );
    if (fs.existsSync(fromPath)) return fromPath;
  }
  return null;
}

function syncMdoc(filePath) {
  const slug = path.basename(filePath, ".mdoc");
  const parsed = parseMdoc(filePath);
  if (!parsed) return false;

  let yaml = parsed.yaml;
  let changed = false;

  for (const fieldKey of IMAGE_KEYS) {
    const current = getYamlString(yaml, fieldKey);
    if (!current) continue;

    const ext = path.extname(current).slice(1);
    if (!ext) continue;

    const targetPath = keystaticPath(slug, fieldKey, ext);
    const sourceFile = resolveSourceFile(slug, fieldKey, ext, current);
    if (!sourceFile) {
      console.warn(`  skip ${slug}: no se encontró imagen para ${current}`);
      continue;
    }

    const destDir = path.join(imgRoot, slug);
    const destFile = path.join(destDir, `${fieldKey}.${ext}`);
    fs.mkdirSync(destDir, { recursive: true });
    fs.copyFileSync(sourceFile, destFile);

    if (current === targetPath) continue;

    yaml = setYamlValue(yaml, fieldKey, targetPath);
    changed = true;
    console.log(`  ${path.relative(root, filePath)}: ${current} → ${targetPath}`);
  }

  if (!changed) return false;

  const out = `---\n${yaml}\n---\n\n${parsed.body}`.replace(/\n{3,}$/, "\n");
  fs.writeFileSync(filePath, out.endsWith("\n") ? out : out + "\n", "utf8");
  return true;
}

console.log("Sincronizando imágenes para preview de Keystatic...\n");

let count = 0;
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
      continue;
    }
    if (entry.name.endsWith(".mdoc") && syncMdoc(full)) count++;
  }
}
walk(contentRoot);

console.log(`\nListo. ${count} archivo(s) .mdoc actualizado(s).`);
