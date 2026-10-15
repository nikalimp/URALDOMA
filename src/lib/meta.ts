import type { Metadata } from "next";
import { site } from "@/content/site";

// Метаданные страницы: title целиком (бренд уже в тексте или добавляется), canonical на себя, OG.
export function pageMeta({ title, description, path, image, noindex }: { title: string; description: string; path: string; image?: string; noindex?: boolean }): Metadata {
  const withBrand = `${title} — ${site.name}`;
  // Бренд добавляем, только если title остаётся в пределах 65 символов (стандарт §3)
  const full = title.includes(site.name) || withBrand.length > 65 ? title : withBrand;
  return {
    title: { absolute: full },
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", locale: site.locale, siteName: site.name, title: full, description, url: `${site.url}${path}`, images: [image ?? "/og.png"] },
    ...(noindex && { robots: { index: false, follow: true } }),
  };
}
