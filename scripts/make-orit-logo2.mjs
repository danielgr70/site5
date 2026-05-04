import fs from "node:fs";
import { createCanvas, loadImage } from "@napi-rs/canvas";

const src = "assets/img/orit-logo.png";
const out = "assets/img/orit-logo2.png";

const img = await loadImage(src);
const w = img.width;
const h = img.height;

const canvas = createCanvas(w, h);
const ctx = canvas.getContext("2d");
ctx.drawImage(img, 0, 0, w, h);

// Vertical band where red name sits (from pixel scan on original)
const yTop = 555;
const yBottom = 910;
const bandH = yBottom - yTop;

ctx.fillStyle = "#000000";
ctx.fillRect(0, yTop, w, bandH);

// Match primary red used elsewhere on site
const red = "#e31e24";
ctx.fillStyle = red;
ctx.direction = "rtl";
ctx.textAlign = "center";
ctx.textBaseline = "middle";

// Scale font to fit width with padding
const text = "אינפיניטיZ";
let fontSize = Math.round(bandH * 0.58);
const maxW = w * 0.88;
ctx.font = `700 ${fontSize}px "Segoe UI", "Arial Hebrew", Arial, sans-serif`;
while (fontSize > 24 && ctx.measureText(text).width > maxW) {
    fontSize -= 4;
    ctx.font = `700 ${fontSize}px "Segoe UI", "Arial Hebrew", Arial, sans-serif`;
}

ctx.fillText(text, w / 2, yTop + bandH / 2);

const buf = canvas.toBuffer("image/png");
fs.writeFileSync(out, buf);
console.log("Wrote", out, `${w}x${h}`, "fontSize", fontSize);
