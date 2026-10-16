// Проверка перед запуском (стандарт AI-Ready сайта, §11). Запуск: npm run check — сначала собирает сайт, потом проверяет out/.
//  1. В готовом сайте нет TODO и домена-заглушки example.ru.
//  2. geo-check: robots.txt, sitemap, llms.txt, мета-теги, JSON-LD, текст без JS. Балл ≥ 8 и ни одной проблемы P1.
//  3. Индексация (стандарт §2 «Индексация» и §3): страницы из sitemap без noindex, с canonical на себя и title от 40 символов —
//     и не короче 250 слов в <main> — иначе ошибка; title длиннее 65, description вне 120–160, lastmod = дата сборки, нет ключа IndexNow — предупреждения.
// Отчёт geo-check сохраняется в specs/reports/geo-check-<дата>.md — история для клиента.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const ROOT = path.resolve(import.meta.dirname, "..");
const OUT = path.join(ROOT, "out");
const MIN_SCORE = 8;
let failed = false;
const fail = (msg) => { failed = true; console.log(`✗ ${msg}`); };
const ok = (msg) => console.log(`✓ ${msg}`);

if (!fs.existsSync(OUT)) { console.error("Нет out/ — сначала npm run build"); process.exit(1); }

// 1. TODO и заглушки в готовом сайте
const files = (function walk(d) {
  return fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(d, e.name);
    return e.isDirectory() ? (e.name === "_next" ? [] : walk(p)) : /\.(html|txt|xml)$/.test(e.name) ? [p] : [];
  });
})(OUT);
const todos = [];
for (const f of files) {
  const text = fs.readFileSync(f, "utf8");
  const n = (text.match(/TODO/g) || []).length;
  if (n) todos.push(`${path.relative(OUT, f)} (${n})`);
}
if (todos.length) fail(`TODO в ${todos.length} файлах: ${todos.slice(0, 8).join(", ")}${todos.length > 8 ? " …" : ""}`);
else ok("TODO нет");

const robots = fs.readFileSync(path.join(OUT, "robots.txt"), "utf8");
const base = (robots.match(/^Host:\s*(\S+)/m) || [])[1] || "";
if (!base || base.includes("example.ru")) fail(`Домен не задан: site.url = ${base || "пусто"}`);
else ok(`Домен: ${base}`);

// 2. geo-check по локальной сборке
const date = new Date().toISOString().slice(0, 10);
const reports = path.join(ROOT, "specs", "reports");
fs.mkdirSync(reports, { recursive: true });
const json = path.join(reports, `.geo-check-${date}.json`);
let md = "";
try {
  md = execFileSync("python3", [path.join(ROOT, "scripts", "geo-check.py"), OUT, "--base", base || "https://example.ru", "--max", "200", "--json", json], { encoding: "utf8" });
} catch (e) {
  fail(`geo-check не запустился: ${e.message.split("\n")[0]} (нужен python3)`);
}
if (md) {
  fs.writeFileSync(path.join(reports, `geo-check-${date}.md`), md);
  const R = JSON.parse(fs.readFileSync(json, "utf8"));
  fs.rmSync(json, { force: true });
  const p1 = R.issues.filter(([s]) => s === "P1").map(([, m]) => m);
  if (R.tech_score < MIN_SCORE) fail(`geo-check: балл ${R.tech_score}/10, нужно ≥ ${MIN_SCORE}`);
  else ok(`geo-check: балл ${R.tech_score}/10`);
  if (p1.length) fail(`geo-check: проблемы P1 — ${p1.join("; ")}`);
  const other = R.issues.filter(([s]) => s !== "P1");
  if (other.length) console.log(`  ещё ${other.length} замечаний P2/P3 — см. specs/reports/geo-check-${date}.md`);
}

// 3. Индексация
const MIN_WORDS = 250; // минимум слов в <main> для каждой страницы из sitemap (стандарт §2 «Индексация»)
const THIN_OK = ["/contacts/"]; // служебные страницы, где объём не важен; добавлять сюда только с причиной в specs/02-spec.md, §9
const sitemapXml = fs.readFileSync(path.join(OUT, "sitemap.xml"), "utf8");
const entries = [...sitemapXml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(([, u]) => ({
  loc: (u.match(/<loc>([^<]+)<\/loc>/) || [])[1], lastmod: (u.match(/<lastmod>([^<]+)<\/lastmod>/) || [])[1],
}));
const TITLE_MIN = 40, TITLE_MAX = 65, DESC_MIN = 120, DESC_MAX = 160; // длина вместе с названием бренда
const unesc = (t) => t.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ");
const idx = { noindex: [], canonical: [], thin: [], shortTitle: [], longTitle: [], desc: [] };
for (const { loc } of entries) {
  const file = path.join(OUT, decodeURI(new URL(loc).pathname), "index.html");
  if (!fs.existsSync(file)) { fail(`В sitemap есть ${loc}, а страницы нет`); continue; }
  const html = fs.readFileSync(file, "utf8");
  if (/<meta name="robots" content="[^"]*noindex/.test(html)) idx.noindex.push(loc);
  const canon = (html.match(/<link rel="canonical" href="([^"]+)"/) || [])[1];
  if (canon !== loc) idx.canonical.push(`${loc} → ${canon ?? "нет"}`);
  const p = new URL(loc).pathname;
  const title = unesc((html.match(/<title>([^<]*)<\/title>/) || [])[1] ?? "");
  if (title.length < TITLE_MIN) idx.shortTitle.push(`${p} «${title}» (${title.length})`);
  if (title.length > TITLE_MAX) idx.longTitle.push(`${p} (${title.length})`);
  const desc = unesc((html.match(/<meta name="description" content="([^"]*)"/) || [])[1] ?? "");
  if (desc.length < DESC_MIN || desc.length > DESC_MAX) idx.desc.push(`${p} (${desc.length})`);
  const main = (html.match(/<main[\s\S]*?<\/main>/) || [html])[0]
    .replace(/<script[\s\S]*?<\/script>/g, " ").replace(/<style[\s\S]*?<\/style>/g, " ").replace(/<[^>]+>/g, " ");
  const words = main.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
  if (words < MIN_WORDS && !THIN_OK.includes(new URL(loc).pathname)) idx.thin.push(`${new URL(loc).pathname} (${words})`);
}
if (idx.noindex.length) fail(`В sitemap страницы с noindex: ${idx.noindex.join(", ")}`);
if (idx.canonical.length) fail(`canonical не указывает на саму страницу: ${idx.canonical.slice(0, 5).join("; ")}`);
if (idx.shortTitle.length) fail(`title короче ${TITLE_MIN} символов — добавь расшифровку или уточнение (стандарт §3): ${idx.shortTitle.join("; ")}`);
if (idx.longTitle.length) console.log(`  ⚠ title длиннее ${TITLE_MAX} символов, Google обрежет: ${idx.longTitle.join(", ")}`);
if (idx.desc.length) console.log(`  ⚠ description вне ${DESC_MIN}–${DESC_MAX} символов: ${idx.desc.join(", ")}`);
if (!idx.noindex.length && !idx.canonical.length && !idx.shortTitle.length) ok(`Индексация: ${entries.length} страниц в sitemap, noindex и чужих canonical нет`);
if (idx.thin.length) fail(`Страницы короче ${MIN_WORDS} слов в <main> — дописать (история, применение, рекомендации, FAQ): ${idx.thin.join(", ")}`);
const today = new Date().toISOString().slice(0, 10);
const buildDated = entries.filter((e) => e.lastmod?.startsWith(today)).length;
if (entries.length > 3 && buildDated / entries.length > 0.5) console.log(`  ⚠ lastmod = сегодня у ${buildDated} из ${entries.length} URL — похоже на дату сборки, ставь только реальные даты изменений`);
if (!fs.readdirSync(path.join(ROOT, "public")).some((f) => /^[a-f0-9]{32}\.txt$/.test(f))) console.log("  ⚠ Нет ключа IndexNow — npm run indexnow:key");

// 4. Дизайн-система: tokens.css собран из design-system/tokens.json, цвета в вёрстке — только через токены
try {
  execFileSync("node", [path.join(ROOT, "scripts", "tokens.mjs"), "--check"], { stdio: "pipe" });
} catch (e) {
  fail(`Дизайн-система: ${String(e.stderr || e.message).trim().replace(/^✗ /, "")}`);
}
const SRC_DIR = path.join(ROOT, "src");
const srcFiles = (function walk(d) {
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
for (const f of srcFiles) {
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

console.log(failed ? "\nПроверка НЕ пройдена — к запуску рано." : "\nПроверка пройдена. Дальше — ручной чеклист specs/06-launch-checklist.md.");
process.exit(failed ? 1 : 0);
