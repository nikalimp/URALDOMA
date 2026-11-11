import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { services } from "@/content/services";
import { cases, caseReady } from "@/content/cases";
import { complexes } from "@/content/complexes";
import { getPosts } from "@/lib/posts";

export const dynamic = "force-static";

// Новая страница = новая строка здесь. Правила (стандарт AI-Ready сайта, §2 «Индексация»):
// - только страницы, открытые для индексации: политики и 404 здесь нет;
// - lastmod — только настоящая дата изменения (у статей — updated/date из frontmatter), дату сборки не ставим.
export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getPosts();
  const u = (path: string, priority: number, lastModified?: string) => ({ url: `${site.url}${path}`, priority, ...(lastModified && { lastModified }) });
  return [
    u("/", 1),
    u("/services/", 0.9),
    ...services.map((s) => u(`/services/${s.slug}/`, 0.8)),
    u("/prices/", 0.9),
    u("/how-we-work/", 0.7),
    u("/warranty/", 0.7),
    u("/portfolio/", 0.8),
    ...cases.filter(caseReady).map((c) => u(`/portfolio/${c.slug}/`, 0.6)),
    u("/complexes/", 0.7),
    ...complexes.map((c) => u(`/complexes/${c.slug}/`, 0.7)),
    u("/about/", 0.6),
    u("/contacts/", 0.6),
    u("/careers/", 0.4),
    u("/partners/", 0.4),
    ...(posts.length ? [u("/articles/", 0.7, posts.map((p) => p.updated ?? p.date).sort().at(-1))] : []),
    ...posts.map((p) => u(`/articles/${p.slug}/`, 0.7, p.updated ?? p.date)),
  ];
}
