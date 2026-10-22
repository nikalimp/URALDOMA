import Link from "next/link";
import { notFound } from "next/navigation";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { formatDate, getPost, getPosts } from "@/lib/posts";
import { site } from "@/content/site";
import { services } from "@/content/services";
import { Container, Grid, Section, Label } from "@/components/container";
import { Crumbs } from "@/components/crumbs";
import { CtaSection } from "@/components/cta";
import { JsonLd } from "@/components/json-ld";
import { articleSchema, breadcrumbs, graph } from "@/lib/schema";
import { pageMeta } from "@/lib/meta";
import { pic } from "@/content/photos";
import { Img } from "@/components/photo";

export const dynamicParams = false;

export function generateStaticParams() {
  const posts = getPosts();
  return posts.length ? posts.map((p) => ({ slug: p.slug })) : [{ slug: "_" }];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const p = getPost((await params).slug);
  if (!p) return { robots: { index: false } };
  return pageMeta({ title: p.seoTitle || p.title, description: p.description, path: `/articles/${p.slug}/`, image: p.coverImage ?? (p.cover ? `${pic(p.cover).base}.webp` : undefined) });
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = getPost((await params).slug);
  if (!p) notFound();
  const related = services.filter((s) => s.articles.includes(p.slug));
  const more = getPosts().filter((x) => x.slug !== p.slug).slice(0, 3);
  return (
    <>
      {/* Instant View: канал проекта в шапке IV-страницы (стандарт §6 «Статьи блога»). React поднимает meta в <head>; metadata.other дал бы name=, а Telegram читает property= */}
      <meta property="telegram:channel" content={site.contacts.telegramChannel} />
      <JsonLd data={graph(articleSchema(p), breadcrumbs([{ name: "Главная", path: "/" }, { name: "Статьи", path: "/articles/" }, { name: p.title, path: `/articles/${p.slug}/` }]))} />
      <Container className="pt-10 md:pt-14">
        <Crumbs items={[{ name: "Главная", path: "/" }, { name: "Статьи", path: "/articles/" }, { name: p.title }]} />
        <p className="caps mb-6 text-muted-foreground">Статья · <time dateTime={p.date}>{formatDate(p.date)}</time></p>
        <h1 className="t-statement max-w-[20ch]">{p.title}</h1>
      </Container>
      {p.cover && (
        <figure className="mt-12 md:mt-16">
          <div className="relative h-[56svh] min-h-[340px] overflow-hidden bg-secondary md:h-[78svh]"><Img p={pic(p.cover)} eager wide sizes="100vw" className="parallax" /></div>
          <Container><figcaption className="caps mt-3 flex justify-between gap-6 text-muted-foreground"><span>{pic(p.cover).caption}</span><span>{pic(p.cover).place}</span></figcaption></Container>
        </figure>
      )}
      <Section className="pt-10 md:pt-14">
        <Container>
          <Grid>
            <aside className="md:col-span-3">
              <div className="text-small border-t border-border pt-4 md:sticky md:top-28">
                <p className="font-medium">{site.person.name}</p>
                <p className="text-muted-foreground">директор URALDOMA</p>
                <p className="label-mono mt-4 text-muted-foreground"><time dateTime={p.date}>{formatDate(p.date)}</time></p>
                {p.updated && p.updated !== p.date && <p className="label-mono mt-1 text-muted-foreground">обновлено <time dateTime={p.updated}>{formatDate(p.updated)}</time></p>}
                {related.length > 0 && (
                  <div className="mt-8">
                    <p className="label-mono mb-2 text-muted-foreground">Услуги по теме</p>
                    <ul>{related.map((s) => <li key={s.slug}><Link href={`/services/${s.slug}/`} className="block border-t border-border py-2 hover:text-brand">{s.title} →</Link></li>)}</ul>
                  </div>
                )}
              </div>
            </aside>
            <article className="prose-site md:col-span-8 md:col-start-5">
              <Markdown remarkPlugins={[remarkGfm]}>{p.body}</Markdown>
            </article>
          </Grid>
        </Container>
      </Section>
      {more.length > 0 && (
        <Section>
          <Container>
            <Label>Ещё статьи</Label>
            <ul className="grid grid-cols-1 gap-x-5 gap-y-12 md:grid-cols-3">
              {more.map((m) => (
                <li key={m.slug}>
                  <Link href={`/articles/${m.slug}/`} className="group block">
                    {m.cover && <div className="aspect-[4/3] overflow-hidden bg-secondary"><Img p={pic(m.cover)} sizes="(min-width: 768px) 33vw, 100vw" className="transition-transform duration-[1.2s] group-hover:scale-[1.04]" /></div>}
                    <h3 className="t-lead mt-4 border-t border-border pt-3 group-hover:text-brand">{m.title}</h3>
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      )}
      <CtaSection source={`article:${p.slug}`} />
    </>
  );
}
