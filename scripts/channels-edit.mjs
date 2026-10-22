// Разовая правка уже опубликованных постов Telegram-канала под формат 22.10.2026:
// без Instant View и ссылки в тексте — только кнопка «Читать полностью на сайте» и превью страницы на сайте.
//
// Какие посты: старые (telegra.ph) — content/factory/telegram-edit-map.json (номер поста → путь на сайте),
// новые — content/media/channels.json (ссылка t.me/<канал>/<номер> у статьи).
// Текст поста берётся с публичной страницы канала t.me/s/<канал>: из него убирается последняя ссылка
// «Читать статью» / «Читать полностью», хэштеги становятся обычным текстом (Telegram распознает их сам).
// Править может только бот-администратор канала с правом редактировать сообщения.
//
//   TELEGRAM_BOT_TOKEN=… TELEGRAM_CHAT_ID=@канал node scripts/channels-edit.mjs          — показать, что изменится
//   TELEGRAM_BOT_TOKEN=… TELEGRAM_CHAT_ID=@канал node scripts/channels-edit.mjs --apply  — отредактировать
// Запуск — вручную: Actions → «Channels edit».
import fs from "node:fs";

const apply = process.argv.includes("--apply");
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

const utm = (url, slug) => `${url}?utm_source=telegram&utm_medium=channel&utm_campaign=${slug}`;
const targets = new Map(); // номер поста → адрес на сайте
const old = JSON.parse(fs.readFileSync("content/factory/telegram-edit-map.json", "utf8")).posts;
for (const [id, p] of Object.entries(old)) targets.set(Number(id), utm(SITE + p, p.split("/").filter(Boolean).pop()));
const reg = fs.existsSync("content/media/channels.json") ? JSON.parse(fs.readFileSync("content/media/channels.json", "utf8")).posts : {};
for (const [slug, r] of Object.entries(reg)) {
  const m = String(r.tg || "").match(new RegExp(`t\\.me/${CHANNEL}/(\\d+)$`));
  if (m) targets.set(Number(m[1]), utm(`${SITE}${BLOG}${slug}/`, slug));
}

// HTML виджета t.me/s → HTML для Bot API (b, i, u, s, a, переводы строк)
const decode = (s) => s.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, " ");
function toBotHtml(html) {
  let s = html
    .replace(/<br\s*\/?>/g, "\n")
    .replace(/<i class="emoji"[^>]*><b>([^<]*)<\/b><\/i>/g, "$1")
    .replace(/<a href="\?q=[^"]*"[^>]*>([^<]*)<\/a>/g, "$1") // хэштеги
    .replace(/<span[^>]*>|<\/span>/g, "")
    .replace(/<a [^>]*href="([^"]+)"[^>]*>/g, '<a href="$1">')
    .replace(/<(\/?)(strong|em)>/g, (_, c, t) => `<${c}${t === "strong" ? "b" : "i"}>`)
    .replace(/<(?!\/?(b|i|u|s|a|code|pre)[ >])[^>]+>/g, "");
  // последняя ссылка «Читать …» (telegra.ph или сайт) — убираем вместе с пустыми строками перед ней
  s = s.replace(/\s*<a href="[^"]+">[^<]*Читать[^<]*<\/a>\s*$/, "");
  return decode(s).trim();
}

async function channelPage(before) {
  const r = await fetch(`https://t.me/s/${CHANNEL}${before ? `?before=${before}` : ""}`);
  return r.text();
}
function parsePosts(html) {
  const out = new Map();
  const re = new RegExp(`data-post="${CHANNEL}/(\\d+)"[\\s\\S]*?<div class="tgme_widget_message_text[^"]*"[^>]*>([\\s\\S]*?)</div>\\s*(?:<div class="tgme_widget_message_(?:link_preview|footer|reply_markup)|<a class="tgme_widget_message_link_preview)`, "g");
  for (const m of html.matchAll(re)) out.set(Number(m[1]), m[2]);
  return out;
}

async function tg(method, body) {
  const r = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/${method}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  return r.json();
}

const ids = [...targets.keys()].sort((a, b) => a - b);
const posts = new Map();
for (let before = Math.max(...ids) + 1; before > Math.min(...ids); ) {
  const page = parsePosts(await channelPage(before));
  if (!page.size) break;
  for (const [k, v] of page) posts.set(k, v);
  before = Math.min(...page.keys());
}

let ok = 0;
for (const id of ids) {
  const url = targets.get(id);
  const raw = posts.get(id);
  if (!raw) { report("warning", `пост ${id}: не нашёл текст на t.me/s/${CHANNEL}`); continue; }
  const text = toBotHtml(raw);
  const first = text.split("\n")[0].replace(/<[^>]+>/g, "").slice(0, 60);
  if (!apply) { report("notice", `пост ${id} (${text.length} симв.) «${first}» → кнопка ${url.split("?")[0]}`); continue; }
  const j = await tg("editMessageText", {
    chat_id: `@${CHANNEL}`, message_id: id, text, parse_mode: "HTML",
    link_preview_options: { url, prefer_large_media: true, show_above_text: true },
    reply_markup: { inline_keyboard: [[{ text: "Читать полностью на сайте", url }]] },
  });
  if (j.ok || /message is not modified/.test(j.description || "")) { ok++; report("notice", `пост ${id} отредактирован`); }
  else report("warning", `пост ${id}: ${j.description}`);
  await new Promise((r) => setTimeout(r, 1200)); // лимит Telegram на правки в канале
}
report("notice", apply ? `отредактировано ${ok} из ${ids.length}` : `проверка: ${ids.length} постов, запустите с apply`);
