/**
 * Migra archivos .md (frontmatter + body) al formato Keystatic (.mdoc).
 * Colecciones: slug/index.mdoc | singletons: event.mdoc
 *
 * Uso: node scripts/migrate-to-keystatic.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const contentRoot = path.join(root, "src", "content");

const SLUG_FIELDS = {
  services: "title",
  products: "title",
  events: "title",
  reviews: "name",
  "customer-videos": "name",
  podcast: "title",
};

function parseMarkdownFile(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) {
    return { data: {}, body: raw.trimEnd() };
  }
  return { data: parseSimpleYaml(match[1]), body: match[2].trimEnd() };
}

function parseSimpleYaml(yaml) {
  const data = {};
  const lines = yaml.split(/\r?\n/);
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const m = line.match(/^([\w-]+):\s*(.*)$/);
    if (!m) {
      i++;
      continue;
    }

    const [, key, rest] = m;
    if (rest === "" || rest === "|" || rest === ">") {
      const block = [];
      i++;
      while (i < lines.length && (lines[i].startsWith("  ") || lines[i] === "")) {
        if (lines[i] !== "") block.push(lines[i].slice(2));
        else if (block.length) block.push("");
        i++;
      }
      data[key] = block.join("\n").trimEnd();
      continue;
    }

    data[key] = parseYamlValue(rest);
    i++;
  }

  return data;
}

function parseYamlValue(value) {
  if (value === "true") return true;
  if (value === "false") return false;
  if (value === "null" || value === "~") return null;
  if (/^-?\d+$/.test(value)) return Number(value);
  if (/^-?\d+\.\d+$/.test(value)) return Number(value);
  const quoted = value.match(/^['"](.*)['"]$/);
  if (quoted) return quoted[1];
  return value;
}

function yamlValue(value) {
  if (value === null || value === undefined) return '""';
  if (typeof value === "boolean") return value ? "true" : "false";
  if (typeof value === "number") return String(value);
  const str = String(value);
  if (str === "") return '""';
  if (/[:#\n\r]/.test(str) || str.startsWith(" ") || str.endsWith(" ")) {
    return JSON.stringify(str);
  }
  return JSON.stringify(str);
}

function slugValue(name, slug) {
  // Keystatic guarda fields.slug como string (el título/nombre), no como objeto.
  void slug;
  return String(name ?? "");
}

function serializeYaml(data) {
  return Object.entries(data)
    .map(([key, value]) => {
      if (value && typeof value === "object" && "name" in value && "slug" in value) {
        return `${key}: ${yamlValue(value.name)}`;
      }
      return `${key}: ${yamlValue(value)}`;
    })
    .join("\n");
}

function writeMdoc(targetPath, data, body) {
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  const content = `---\n${serializeYaml(data)}\n---\n\n${body}`.trimEnd() + "\n";
  fs.writeFileSync(targetPath, content, "utf8");
}

function migrateCollection(dirName) {
  const dir = path.join(contentRoot, dirName);
  if (!fs.existsSync(dir)) return;

  const slugKey = SLUG_FIELDS[dirName];
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));

  for (const file of files) {
    const slug = file.replace(/\.md$/, "");
    const { data, body } = parseMarkdownFile(path.join(dir, file));
    const next = { ...data };

    if (slugKey && next[slugKey] !== undefined) {
      next[slugKey] = slugValue(next[slugKey], slug);
    }

    const target = path.join(dir, `${slug}.mdoc`);
    writeMdoc(target, next, body);
    fs.unlinkSync(path.join(dir, file));
    console.log(`  ${dirName}/${file} → ${dirName}/${slug}.mdoc`);
  }
}

function migrateSingleton(dirName, baseName) {
  const source = path.join(contentRoot, dirName, `${baseName}.md`);
  if (!fs.existsSync(source)) return;

  const { data, body } = parseMarkdownFile(source);
  const target = path.join(contentRoot, dirName, `${baseName}.mdoc`);
  writeMdoc(target, data, body);
  fs.unlinkSync(source);
  console.log(`  ${dirName}/${baseName}.md → ${dirName}/${baseName}.mdoc`);
}

console.log("Migrando contenido a Keystatic (.mdoc)...\n");

migrateSingleton("hero-event", "event");
migrateSingleton("hero-popup", "popup");

for (const dir of Object.keys(SLUG_FIELDS)) {
  migrateCollection(dir);
}

console.log("\nListo.");
