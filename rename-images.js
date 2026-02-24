#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

// ===== CONFIG =====
const SOURCE_DIR = "/Users/happy/Downloads/waifu-to-upload";

// ===== GET ARGUMENT =====
const input = process.argv[2];

if (!input) {
  console.error("❌ Bạn phải truyền prefix. Ví dụ:");
  console.error("   node rename-images.js waifu_94_pre");
  process.exit(1);
}

// ===== PARSE PREFIX & START NUMBER =====
const match = input.match(/^(.*?)(\d+)(.*?)$/);

if (!match) {
  console.error("❌ Prefix phải chứa số. Ví dụ: waifu_94_pre hoặc waifu_38");
  process.exit(1);
}

const prefixBefore = match[1];   // waifu_
let counter = parseInt(match[2]); // 94
const prefixAfter = match[3];    // _pre (có thể rỗng)

// ===== CREATE OUTPUT FOLDER =====
const OUTPUT_DIR = path.join(SOURCE_DIR, "renamed");

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR);
}

// ===== READ FILES =====
const files = fs.readdirSync(SOURCE_DIR)
  .filter(file => /\.(jpe?g)$/i.test(file))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

if (files.length === 0) {
  console.log("⚠ Không tìm thấy file JPG/JPEG nào.");
  process.exit(0);
}

// ===== PROCESS RENAME =====
files.forEach((file) => {
  const ext = path.extname(file).toLowerCase(); // giữ nguyên jpg/jpeg
  const newName = `${prefixBefore}${counter}${prefixAfter}${ext}`;

  const oldPath = path.join(SOURCE_DIR, file);
  const newPath = path.join(OUTPUT_DIR, newName);

  fs.copyFileSync(oldPath, newPath);

  console.log(`✔ ${file} → ${newName}`);

  counter++;
});

console.log("\n🎉 Hoàn tất rename!");
console.log(`📂 File mới nằm tại: ${OUTPUT_DIR}`);