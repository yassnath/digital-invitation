/**
 * Optimize & convert images to WebP + AVIF
 * - Resolution tetap sama
 * - File size jauh lebih kecil
 * - PNG tetap disimpan sebagai fallback
 */

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const ROOT = path.join(__dirname, "..");
const IMG_DIR = path.join(ROOT, "images");

// format yang akan diproses
const ALLOWED = [".png", ".jpg", ".jpeg"];

async function walk(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);

    if (stat.isDirectory()) {
      await walk(full);
    } else {
      const ext = path.extname(file).toLowerCase();
      if (!ALLOWED.includes(ext)) continue;

      const baseName = full.replace(ext, "");

      const webpPath = baseName + ".webp";
      const avifPath = baseName + ".avif";

      console.log("Optimizing:", full);

      // WEBP
      await sharp(full)
        .webp({ quality: 75, effort: 6 })
        .toFile(webpPath);

      // AVIF (lebih kecil, tapi lebih berat proses)
      await sharp(full)
        .avif({ quality: 55, effort: 7 })
        .toFile(avifPath);

      console.log("✅ Saved:", webpPath);
      console.log("✅ Saved:", avifPath);
    }
  }
}

(async () => {
  if (!fs.existsSync(IMG_DIR)) {
    console.error("❌ images folder not found!");
    process.exit(1);
  }

  console.log("🚀 Start optimizing images...");
  await walk(IMG_DIR);
  console.log("🎉 All images optimized!");
})();
