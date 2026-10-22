// Контент-завод, стек «Next.js + GitHub»: дублирование новых статей блога в Telegram-канал и в канал Max.
// Оригинал — NikitOS/.claude/toolkit/site-channels/channels.mjs (копия в проекте — scripts/channels.mjs).
// Сайт, автор и финальный призыв — из brand.json проекта (--brand или MEDIA_BRAND).
// Пути (папка статей, спецификации медиа, реестр) и rhash Instant View — из content.config.json
// (--config, CONTENT_CONFIG или content/factory/content.config.json); без конфига — content/blog, content/media.
// Запускается в GitHub Actions после выкладки сайта. Каналы включаются секретами репозитория:
//   Telegram: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID (бот — администратор публичного канала, id или @канал)
//   Max:      MAX_BOT_TOKEN, MAX_CHAT_ID (id канала, бот — администратор)
// Instant View: если задан channels.iv_rhash (или ivRhash в brand.json) — ссылка t.me/iv?url=<статья>&rhash=<шаблон>,
// Telegram строит IV прямо со страницы сайта по шаблону instantview.telegram.org. Пусто — запасной путь: копия на telegra.ph
// (TELEGRAPH_TOKEN по желанию — только для запасного пути).
// Нет секретов — канал выключен: статья отмечается "off" и потом не догоняется (чтобы не было лавины постов).
// Реестр — paths.channels_registry (по умолчанию content/media/channels.json; коммитится обратно в репозиторий).
// Итоги пишутся аннотациями ::notice:: / ::warning:: и в $GITHUB_STEP_SUMMARY — их видно без доступа к логам.
//
//   node scripts/channels.mjs            — опубликовать новые статьи (date за последние 3 дня, ещё нет в реестре)
//   node scripts/channels.mjs <slug> --force — опубликовать/переопубликовать конкретную
//   node scripts/channels.mjs --dry      — показать, что ушло бы (и ссылку IV), без отправки
//   node scripts/channels.mjs <slug> --nodes — показать узлы telegra.ph (отладка запасного пути)
import fs from "node:fs";
import path from "node:path";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import { typograf } from "../src/lib/typograf.mjs";

const argv = process.argv.slice(2);
const bi = argv.indexOf("--brand");
const BRAND_FILE = bi >= 0 ? argv[bi + 1] : process.env.MEDIA_BRAND;
const B = BRAND_FILE ? JSON.parse(fs.readFileSync(BRAND_FILE, "utf8")) : {};
const ci = argv.indexOf("--config");
const CFG_FILE = ci >= 0 ? argv[ci + 1] : process.env.CONTENT_CONFIG || (fs.existsSync("content/factory/content.config.json") ? "content/factory/content.config.json" : "");
const C = CFG_FILE ? JSON.parse(fs.readFileSync(CFG_FILE, "utf8")) : {};
const ROOT = CFG_FILE ? path.resolve(path.dirname(CFG_FILE), C.root || ".") : process.cwd();
const P = C.paths || {};
const dirOf = (tpl, def) => path.join(ROOT, tpl ? path.dirname(tpl) : def);
const SITE = (B.site || C.site || "").replace(/\/$/, "");
if (!SITE) { console.error("channels: нет site в brand.json (--brand) или content.config.json"); process.exit(1); }
const AUTHOR = B.author || B.name || C.author || "";
const CTA = B.cta || null;
const BLOG = (B.blogPath || C.links?.blog_prefix || "/blog/").replace(/^\/?/, "/").replace(/\/?$/, "/");
const BLOG_DIR = dirOf(P.article, "content/blog/x.md");
const MEDIA = dirOf(P.media_spec, "content/media/x.json");
const REG = path.join(ROOT, P.channels_registry || "content/media/channels.json");
const RHASH = (C.channels?.iv_rhash || B.ivRhash || "").trim();
// адрес статьи без UTM: article.url из конфига ({slug}) или сайт + путь блога
const articleUrl = (slug) => (C.article?.url ? C.article.url.replace("{slug}", slug) : `${SITE}${BLOG}${slug}/`);
const ivLink = (slug) => `https://t.me/iv?url=${encodeURIComponent(articleUrl(slug))}&rhash=${RHASH}`;
// итоги — аннотациями и в сводку запуска: журналы Actions из облачной сессии не читаются
const GH = !!process.env.GITHUB_ACTIONS;
const report = (level, msg) => {
  console.log(GH ? `::${level}::channels: ${msg}` : `  ${level === "warning" ? "!" : "·"} ${msg}`);
  if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `- ${level === "warning" ? "⚠️" : "✓"} channels: ${msg}\n`);
};
const args = argv.filter((a, i) => !["--brand", "--config"].includes(a) && !["--brand", "--config"].includes(argv[i - 1]));
const dry = args.includes("--dry");
const force = args.includes("--force");
const only = args.find((a) => !a.startsWith("--"));
const env = process.env;
const TG = env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID;
const MAX = env.MAX_BOT_TOKEN && env.MAX_CHAT_ID;

function parsePost(file) {
  const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf8");
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  const meta = {};
  for (const line of m[1].split("\n")) {
    const i = line.indexOf(":");
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^"|"$/g, "");
  }
  return { slug: file.replace(/\.md$/, ""), ...meta, body: m[2].trim() };
}

const loadReg = () => (fs.existsSync(REG) ? JSON.parse(fs.readFileSync(REG, "utf8")) : null);
const saveReg = (r) => { fs.mkdirSync(path.dirname(REG), { recursive: true }); fs.writeFileSync(REG, JSON.stringify(r, null, 1) + "\n"); };
const utm = (url, medium, slug) => {
  if (!url.startsWith(SITE) || url.includes("utm_")) return url;
  const [base, frag] = url.split("#");
  return `${base}${base.includes("?") ? "&" : "?"}utm_source=${medium === "max" ? "max" : "telegram"}&utm_medium=${medium}&utm_campaign=${slug}${frag ? "#" + frag : ""}`;
};
const abs = (u) => (u.startsWith("/") ? SITE + u : u);
const escHtml = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

async function post(url, body, headers = {}) {
  const r = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json", ...headers }, body: JSON.stringify(body) });
  const j = await r.json().catch(() => ({}));
  return { ok: r.ok, j };
}

// ---------- Markdown → узлы Telegraph ----------
function toNodes(md, slug, reg) {
  const tree = unified().use(remarkParse).use(remarkGfm).parse(typograf(md));
  const link = (u) => {
    const a = abs(u);
    const m = a.startsWith(SITE + BLOG) ? [null, a.slice((SITE + BLOG).length).replace(/\/$/, "")] : null;
    if (m && reg.posts[m[1]]?.iv) return reg.posts[m[1]].iv; // читатель остаётся в Telegram
    return utm(a, "instant_view", slug);
  };
  const inline = (n) => {
    switch (n.type) {
      case "text": return n.value;
      case "strong": return { tag: "b", children: n.children.map(inline) };
      case "emphasis": return { tag: "i", children: n.children.map(inline) };
      case "delete": return { tag: "s", children: n.children.map(inline) };
      case "inlineCode": return { tag: "code", children: [n.value] };
      case "break": return { tag: "br" };
      case "link": return { tag: "a", attrs: { href: link(n.url) }, children: n.children.map(inline) };
      case "image": return { tag: "img", attrs: { src: abs(n.url) } };
      default: return n.children ? { tag: "span", children: n.children.map(inline) }.children : n.value || "";
    }
  };
  const flat = (arr) => arr.flat(Infinity);
  const block = (n) => {
    switch (n.type) {
      case "heading": return { tag: n.depth <= 2 ? "h3" : "h4", children: flat(n.children.map(inline)) };
      case "paragraph": {
        if (n.children.length === 1 && n.children[0].type === "image") {
          const im = n.children[0];
          return { tag: "figure", children: [{ tag: "img", attrs: { src: abs(im.url) } }, ...(im.alt ? [{ tag: "figcaption", children: [im.alt] }] : [])] };
        }
        return { tag: "p", children: flat(n.children.map(inline)) };
      }
      case "list": return { tag: n.ordered ? "ol" : "ul", children: n.children.map((li) => ({ tag: "li", children: flat(li.children.map((c) => (c.type === "paragraph" ? flat(c.children.map(inline)) : block(c)))) })) };
      case "blockquote": return { tag: "blockquote", children: flat(n.children.map((c) => (c.type === "paragraph" ? flat(c.children.map(inline)) : block(c)))) };
      case "code": return { tag: "pre", children: [n.value] };
      case "thematicBreak": return { tag: "hr" };
      case "table": {
        // В Telegraph нет таблиц: каждая строка — абзац «Заголовок: значение; …»
        const [head, ...rows] = n.children.map((r) => r.children.map((c) => flat(c.children.map(inline))));
        return rows.map((r) => ({ tag: "p", children: [{ tag: "b", children: r[0] }, ...r.slice(1).flatMap((c, i) => ["\n", `${(head[i + 1] || []).filter((x) => typeof x === "string").join("")}: `, ...c])] }));
      }
      default: return [];
    }
  };
  return flat(tree.children.map(block));
}

async function telegraphToken(reg) {
  if (env.TELEGRAPH_TOKEN) return env.TELEGRAPH_TOKEN;
  if (reg.telegraph_token) return reg.telegraph_token;
  const r = await fetch(`https://api.telegra.ph/createAccount?short_name=${encodeURIComponent((B.name || "Blog").slice(0, 32))}&author_name=${encodeURIComponent(AUTHOR)}&author_url=${SITE}`).then((x) => x.json());
  if (!r.ok) throw new Error("Telegraph: " + JSON.stringify(r));
  reg.telegraph_token = r.result.access_token; // репозиторий приватный; можно перенести в секрет TELEGRAPH_TOKEN
  return reg.telegraph_token;
}

async function instantView(p, reg) {
  const tok = await telegraphToken(reg);
  const ut = `utm_source=telegram&utm_medium=instant_view&utm_campaign=${p.slug}`;
  const nodes = [
    ...(p.cover ? [{ tag: "figure", children: [{ tag: "img", attrs: { src: abs(p.cover) } }] }] : []),
    ...toNodes(p.body, p.slug, reg),
    { tag: "hr" },
    ...(CTA ? [
      { tag: "h4", children: [CTA.title] },
      ...(CTA.text ? [{ tag: "p", children: [CTA.text] }] : []),
      { tag: "p", children: [{ tag: "a", attrs: { href: `${CTA.url}${CTA.url.includes("?") ? "&" : "?"}${ut}` }, children: [{ tag: "b", children: [CTA.label] }] }] },
    ] : []),
    { tag: "p", children: [{ tag: "i", children: ["Оригинал статьи: "] }, { tag: "a", attrs: { href: `${SITE}${BLOG}${p.slug}/?${ut}` }, children: [new URL(SITE).host] }] },
  ];
  const data = { access_token: tok, title: p.title.slice(0, 256), author_name: AUTHOR, author_url: SITE, content: nodes, return_content: false };
  const prev = reg.posts[p.slug]?.iv_path;
  const r = await post(prev ? `https://api.telegra.ph/editPage/${prev}` : "https://api.telegra.ph/createPage", data);
  if (!r.j.ok) throw new Error("Telegraph: " + JSON.stringify(r.j));
  return { iv: r.j.result.url, iv_path: r.j.result.path };
}

function caption(p, medium) {
  const spec = path.join(MEDIA, `${p.slug}.json`);
  const t = fs.existsSync(spec) ? JSON.parse(fs.readFileSync(spec, "utf8")).telegram?.text : "";
  return (t && t.trim()) || `<b>${escHtml(p.title)}</b>\n\n${escHtml(p.description || "")}`;
}

async function sendTelegram(p, iv) {
  const url = `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`;
  const site = utm(articleUrl(p.slug), "channel", p.slug);
  const text = `${caption(p, "tg")}\n\n<a href="${iv}">Читать в Telegram →</a>`;
  const r = await post(url, {
    chat_id: env.TELEGRAM_CHAT_ID, text, parse_mode: "HTML",
    link_preview_options: { url: iv, prefer_large_media: true, show_above_text: true },
    reply_markup: { inline_keyboard: [[{ text: "📖 Читать статью", url: iv }], [{ text: "Открыть на сайте", url: site }]] },
  });
  if (!r.j.ok) throw new Error("Telegram: " + JSON.stringify(r.j));
  const chat = r.j.result.chat;
  return chat.username ? `https://t.me/${chat.username}/${r.j.result.message_id}` : String(r.j.result.message_id);
}

async function sendMax(p) {
  const site = utm(articleUrl(p.slug), "max", p.slug);
  const attachments = [];
  if (p.cover) attachments.push({ type: "image", payload: { url: abs(p.cover) } });
  attachments.push({ type: "inline_keyboard", payload: { buttons: [[{ type: "link", text: "Читать статью", url: site }]] } });
  const text = `${caption(p, "max")}\n\n<a href="${site}">Читать на ${new URL(SITE).host} →</a>`.slice(0, 3990);
  const r = await post(`https://platform-api2.max.ru/messages?chat_id=${env.MAX_CHAT_ID}`, { text, format: "html", attachments, notify: true },
    { Authorization: env.MAX_BOT_TOKEN });
  if (!r.ok || r.j.code) throw new Error("Max: " + JSON.stringify(r.j));
  return r.j.message?.url || r.j.message?.body?.mid || "ok";
}

async function main() {
  const posts = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md")).map(parsePost);
  if (args.includes("--nodes")) { // отладка: узлы Instant View для статьи
    const p = posts.find((x) => x.slug === only);
    console.log(JSON.stringify(toNodes(p.body, p.slug, loadReg() || { posts: {} }), null, 1)); return;
  }
  let reg = loadReg();
  if (!reg) { // первый запуск: всё, что уже есть, не публикуем
    reg = { posts: Object.fromEntries(posts.map((p) => [p.slug, { tg: "skip", max: "skip" }])) };
    saveReg(reg); console.log(`channels: реестр создан, ${posts.length} старых статей пропущено`);
    if (!only) return;
  }
  const today = new Date().toISOString().slice(0, 10);
  const since = new Date(Date.now() - 3 * 864e5).toISOString().slice(0, 10);
  console.log(`channels: Telegram ${TG ? "вкл" : "выкл"}, Max ${MAX ? "вкл" : "выкл"}, Instant View ${RHASH ? "t.me/iv" : "telegra.ph"}, реестр ${path.relative(ROOT, REG)}`);
  if (!TG) report("notice", "Telegram выключен — нет TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID");
  for (const p of posts) {
    if (only && p.slug !== only) continue;
    if (!only && (p.date > today || p.date < since)) continue;
    if (p.channels === "no") continue;
    const r = (reg.posts[p.slug] ||= {});
    const want = (k) => force || !r[k] || r[k] === "error";
    if (dry) { console.log(`  ${p.slug}: tg=${r.tg ?? "—"} max=${r.max ?? "—"} iv=${RHASH ? ivLink(p.slug) : "telegra.ph (нет iv_rhash)"}`); continue; }
    if (want("tg")) {
      if (!TG) r.tg = "off";
      else try {
        if (RHASH) r.iv = ivLink(p.slug); // IV Telegram по шаблону — со страницы сайта
        else Object.assign(r, await instantView(p, reg)); // запасной путь — копия на telegra.ph
        r.tg = await sendTelegram(p, r.iv); report("notice", `Telegram ${p.slug} → ${r.tg} (${RHASH ? "t.me/iv" : "telegra.ph"})`);
      } catch (e) { r.tg = "error"; r.tg_error = e.message.slice(0, 300); report("warning", `Telegram ${p.slug}: ${e.message.slice(0, 200)}`); }
    }
    if (want("max")) {
      if (!MAX) r.max = "off";
      else try { r.max = await sendMax(p); report("notice", `Max ${p.slug} → ${r.max}`); }
      catch (e) { r.max = "error"; r.max_error = e.message.slice(0, 300); report("warning", `Max ${p.slug}: ${e.message.slice(0, 200)}`); }
    }
    saveReg(reg);
    report("notice", `реестр сохранён: ${path.relative(ROOT, REG)}`);
  }
}

main().catch((e) => { report("warning", `упал: ${e.message}`); process.exit(1); });
