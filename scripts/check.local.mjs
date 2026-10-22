// Проектные проверки URALDOMA — вызывает scripts/check.mjs стартера в конце (раздел 9).
// Переживает обновление check.mjs из стартера. Перенесено из прежнего check.mjs 2026-10-22 (web:update).
//  - Дизайн-система (CLAUDE.md): tokens.css собран из design-system/tokens.json;
//  - HEX, rgb(), text-white и палитра Tailwind в src/ — ошибка (строже общей проверки стартера).
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

export default async ({ ROOT, fail, ok }) => {
  try {
    execFileSync("node", [path.join(ROOT, "scripts", "tokens.mjs"), "--check"], { stdio: "pipe" });
  } catch (e) {
    fail(`Дизайн-система: ${String(e.stderr || e.message).trim().replace(/^✗ /, "")}`);
  }
  const SRC_DIR = path.join(ROOT, "src");
  const files = (function walk(d) {
    return fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => {
      const p = path.join(d, e.name);
      return e.isDirectory() ? walk(p) : /\.(tsx?|css)$/.test(e.name) && e.name !== "tokens.css" ? [p] : [];
    });
  })(SRC_DIR);
  const PALETTE = "white|black|(?:red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|slate|gray|zinc|neutral|stone)-\\d{2,3}";
  const RAW_COLOR = [
    /\[#[0-9a-fA-F]{3,8}\]/, // text-[#111110]
    /["'`]#[0-9a-fA-F]{3,8}["'`]/, // "#f5f4f0" в строке
    new RegExp(`\\b(?:text|bg|border|from|via|to|fill|stroke|ring|outline|decoration|shadow|divide|placeholder|accent|caret)-(?:${PALETTE})\\b`), // text-white, bg-stone-100
  ];
  const offToken = [];
  for (const f of files) {
    const css = f.endsWith(".css");
    let text = fs.readFileSync(f, "utf8");
    if (css) text = text.replace(/\/\*[\s\S]*?\*\//g, (c) => c.replace(/[^\n]/g, " ")); // комментарии не считаем, номера строк сохраняем
    text.split("\n").forEach((line, i) => {
      const hit = css
        ? /#[0-9a-fA-F]{3,8}\b|rgba?\(/.test(line) && !/mask/.test(line) // #000 в масках — не цвет, а прозрачность
        : RAW_COLOR.some((re) => re.test(line)) || /rgba?\(\s*\d/.test(line);
      if (hit) offToken.push(`${path.relative(ROOT, f)}:${i + 1}`);
    });
  }
  if (offToken.length) fail(`Цвета в обход дизайн-системы (нужен токен из design-system/tokens.json): ${offToken.slice(0, 10).join(", ")}${offToken.length > 10 ? " …" : ""}`);
  else ok("Дизайн-система: tokens.css актуален, цвета в вёрстке — только токены");
};
