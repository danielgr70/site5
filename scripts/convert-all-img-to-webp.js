const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const IMG_DIR = "assets/img";

// Quality balance. You can tune later if needed.
const DEFAULT_QUALITY = 82;

function isRasterExt(ext) {
  return [".png", ".jpg", ".jpeg"].includes(ext.toLowerCase());
}

function toWebpPath(inputPath) {
  const dir = path.dirname(inputPath);
  const base = path.basename(inputPath, path.extname(inputPath));
  return path.join(dir, `${base}.webp`);
}

async function convertFile(inputPath) {
  const outputPath = toWebpPath(inputPath);
  if (fs.existsSync(outputPath)) return { inputPath, outputPath, skipped: true };

  const inputBuffer = fs.readFileSync(inputPath);
  await sharp(inputBuffer).webp({ quality: DEFAULT_QUALITY }).toFile(outputPath);
  return { inputPath, outputPath, skipped: false };
}

async function run() {
  const entries = fs.readdirSync(IMG_DIR);
  const files = entries.map((name) => path.join(IMG_DIR, name));

  const targets = files.filter((p) => {
    try {
      const st = fs.statSync(p);
      if (!st.isFile()) return false;
      return isRasterExt(path.extname(p));
    } catch {
      return false;
    }
  });

  if (!targets.length) {
    console.log("No raster images found to convert.");
    return;
  }

  for (const inputPath of targets) {
    const out = toWebpPath(inputPath);
    console.log(`→ ${path.basename(inputPath)} -> ${path.basename(out)}`);
    try {
      const res = await convertFile(inputPath);
      if (res.skipped) console.log("  SKIP (already exists)");
    } catch (e) {
      console.error("  ERROR converting:", inputPath, e?.message || e);
    }
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});

