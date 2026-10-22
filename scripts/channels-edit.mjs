// Синхронизация уже опубликованных постов Telegram-канала с текстами в репозитории.
// Решения Ника 22.10.2026: в посте нет ссылок и Instant View — только кнопка «Читать полностью на сайте»;
// посты индексируются отдельно, поэтому это развёрнутый конспект статьи (2 800–3 600 знаков).
//
// Какие посты: старые (до 22.10) — content/factory/telegram-edit-map.json (номер поста → путь на сайте),
// новые — content/media/channels.json (ссылка t.me/<канал>/<номер> у статьи).
// Текст поста: telegram.text из спецификации content/media/<slug>.json, а если её нет —
// content/media/telegram/<slug>.html (для страниц ЖК — complex-<slug>.html).
// Пост правится, когда текст или адрес поменялись: отпечаток хранится в реестре (synced).
// Бот правит только свои сообщения: чужие (MESSAGE_ID_INVALID) запоминаются с именем бота (edit_failed)
// и не пробуются снова, пока не поменяется бот или текст.
//
//   node scripts/channels-edit.mjs          — показать, что изменится
//   node scripts/channels-edit.mjs --apply  — отредактировать (нужны TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID)
// Запускается из scripts/channels.mjs при выкладке (deploy-kit), после публикации новых статей.
// --registry <файл> — писать реестр в другой файл (запуск с чужим ботом вне Actions).
import fs from "node:fs";
import crypto from "node:crypto";

const argv = process.argv.slice(2);
const apply = argv.includes("--apply");
const ri = argv.indexOf("--registry");
const REG_IN = "content/media/channels.json";
const REG_OUT = ri >= 0 ? argv[ri + 1] : REG_IN;
const regAll = fs.existsSync(REG_OUT) ? JSON.parse(fs.readFileSync(REG_OUT, "utf8")) : JSON.parse(fs.readFileSync(REG_IN, "utf8"));
const synced = (regAll.synced ||= {});
const failed = (regAll.edit_failed ||= {});
delete regAll.edited; // прежний формат (до синхронизации текстов)
const save = () => fs.writeFileSync(REG_OUT, JSON.stringify(regAll, null, 1) + "\n");
const env = process.env;
const GH = !!env.GITHUB_ACTIONS;
const report = (level, msg) => {
  console.log(GH ? `::${level}::channels-edit: ${msg}` : `  ${level === "warning" ? "!" : "·"} ${msg}`);
  if (env.GITHUB_STEP_SUMMARY) fs.appendFileSync(env.GITHUB_STEP_SUMMARY, `- ${level === "warning" ? "⚠️" : "✓"} ${msg}\n`);
};

const brand = JSON.parse(fs.readFileSync(env.MEDIA_BRAND || "content/factory/brand.json", "utf8"));
const cfg = JSON.parse(fs.readFileSync("content/factory/content.config.json", "utf8"));
const SITE = (brand.site || cfg.site).replace(/\/$/, "");
const BLOG = (brand.blogPath || cfg.links?.blog_prefix || "/blog/").replace(/^\/?/, "/").replace(/\/?$/, "/");
const CHANNEL = (env.TELEGRAM_CHAT_ID || cfg.channels?.telegram || "").replace(/^@/, "");
if (!CHANNEL || /^-?\d+$/.test(CHANNEL)) { report("warning", "нужен публичный канал (@имя) в TELEGRAM_CHAT_ID"); process.exit(1); }

// номер поста → { path, key }; key — имя текста: slug статьи или complex-<slug>
const targets = new Map();
const keyOf = (p) => { const parts = p.split("/").filter(Boolean); return parts[0] === "complexes" ? `complex-${parts[1]}` : parts[parts.length - 1]; };
const old = JSON.parse(fs.readFileSync("content/factory/telegram-edit-map.json", "utf8")).posts;
for (const [id, p] of Object.entries(old)) targets.set(Number(id), { path: p, key: keyOf(p) });
for (const [slug, r] of Object.entries(regAll.posts || {})) {
  const m = String(r.tg || "").match(new RegExp(`t\\.me/${CHANNEL}/(\\d+)$`));
  if (m) targets.set(Number(m[1]), { path: `${BLOG}${slug}/`, key: slug });
}

function textOf(key) {
  const spec = `content/media/${key}.json`;
  const t = fs.existsSync(spec) ? JSON.parse(fs.readFileSync(spec, "utf8")).telegram?.text : "";
  if (t && t.trim()) return t.trim();
  const f = `content/media/telegram/${key}.html`;
  return fs.existsSync(f) ? fs.readFileSync(f, "utf8").trim() : "";
}
const visible = (t) => t.replace(/<[^>]+>/g, "").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").length;

const me = apply && env.TELEGRAM_BOT_TOKEN ? (await (await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/getMe`)).json()).result?.username : "";
const tg = async (method, body) => (await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/${method}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })).json();

const todo = [];
for (const [id, t] of [...targets].sort((a, b) => a[0] - b[0])) {
  const text = textOf(t.key);
  if (!text) { report("warning", `пост ${id}: нет текста ${t.key}`); continue; }
  if (visible(text) > 4096) { report("warning", `пост ${id}: текст длиннее 4096 знаков (${visible(text)})`); continue; }
  const url = `${SITE}${t.path}?utm_source=telegram&utm_medium=channel&utm_campaign=${t.path.split("/").filter(Boolean).pop()}`;
  const hash = crypto.createHash("sha1").update(text + "\n" + url).digest("hex").slice(0, 12);
  if (synced[id] === hash) continue;
  if (me && failed[id] === `${me}:${hash}`) continue;
  todo.push({ id, text, url, hash });
}
if (!todo.length) process.exit(0);
if (!apply) { for (const p of todo) report("notice", `пост ${p.id}: ${visible(p.text)} знаков → ${p.url.split("?")[0]}`); process.exit(0); }
report("notice", `правит бот @${me || "?"}, постов к правке: ${todo.length}`);

let ok = 0;
for (const p of todo) {
  const body = {
    chat_id: `@${CHANNEL}`, message_id: p.id, text: p.text, parse_mode: "HTML",
    link_preview_options: { url: p.url, prefer_large_media: true, show_above_text: true },
    reply_markup: { inline_keyboard: [[{ text: "Читать полностью на сайте", url: p.url }]] },
  };
  let j = await tg("editMessageText", body);
  for (let n = 0; n < 3 && j.error_code === 429; n++) { // Telegram просит паузу — ждём и повторяем
    await new Promise((r) => setTimeout(r, ((j.parameters?.retry_after || 15) + 1) * 1000));
    j = await tg("editMessageText", body);
  }
  if (j.ok || /message is not modified/.test(j.description || "")) {
    ok++; synced[p.id] = p.hash; delete failed[p.id]; save();
  } else {
    if (/MESSAGE_ID_INVALID|message can't be edited/.test(j.description || "") && me) { failed[p.id] = `${me}:${p.hash}`; save(); }
    report("warning", `пост ${p.id}: ${j.description}${/MESSAGE_ID_INVALID/.test(j.description || "") ? ` (бот @${me} не автор поста)` : ""}`);
  }
  await new Promise((r) => setTimeout(r, 1500)); // лимит Telegram на правки в канале
}
report("notice", `отредактировано ${ok} из ${todo.length}`);
