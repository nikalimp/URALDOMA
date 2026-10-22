import fs from "node:fs";
import path from "node:path";
import { typograf } from "./typograf.mjs";

// Статьи: content/blog/<slug>.md (раскладка «Публикация — стандарт»; адрес на сайте — /articles/<slug>/).
// Frontmatter: title, description, date (YYYY-MM-DD), опционально seoTitle, updated, legacy и фото:
//   • статьи контент-завода v2 — cover: /blog/<slug>/cover.jpg (обложка media.mjs для Telegram, Max и og:image)
//     + photo: "объект/NN" (кадр из src/content/photos.ts над статьёй на сайте);
//   • статьи до 22.10.2026 — cover: "/images/objects/объект/NN.webp" или ключ "объект/NN" — он же фото на сайте.
export type Post = { slug: string; title: string; seoTitle?: string; description: string; date: string; updated?: string; cover?: string; coverImage?: string; body: string };
// cover — ключ фото сайта «объект/NN»; coverImage — готовая обложка контент-завода, если есть

const dir = path.join(process.cwd(), "content/blog");

// "/images/objects/garinsky/01.webp" → "garinsky/01" (ключ src/content/photos.ts)
const coverKey = (v?: string) => (v ? v.replace(/^\/images\/objects\//, "").replace(/\.(webp|jpe?g|png)$/, "").replace(/-wide$/, "") : undefined);

function parse(file: string): Post {
  const raw = fs.readFileSync(path.join(dir, file), "utf8");
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) throw new Error(`Нет frontmatter: ${file}`);
  const meta: Record<string, string> = {};
  for (const line of m[1].split("\n")) {
    const i = line.indexOf(":");
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^"|"$/g, "");
  }
  // Типограф при сборке: файлы статей не меняются
  return { slug: file.replace(/\.md$/, ""), title: typograf(meta.title), seoTitle: meta.seoTitle, description: typograf(meta.description), date: meta.date, updated: meta.updated, cover: coverKey(meta.photo) ?? (meta.cover?.startsWith("/blog/") ? undefined : coverKey(meta.cover)), coverImage: meta.cover?.startsWith("/blog/") ? meta.cover : undefined, body: typograf(m[2].trim()) };
}

export function getPosts(): Post[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
    .map(parse)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPost(slug: string): Post | undefined {
  return getPosts().find((p) => p.slug === slug);
}

export function formatDate(d: string) {
  return new Date(d).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
}
