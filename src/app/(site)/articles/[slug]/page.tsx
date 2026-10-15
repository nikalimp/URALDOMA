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

export const dynamicParams = false;

export function generateStaticParams() {
  const posts = getPosts();
  return posts.length ? posts.map((p) => ({ slug: p.slug })) : [{ slug: "_" }];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const p = getPost((await params).slug);
  if (!p) return { robots: { index: false } };
  return pageMeta({ title: p.seoTitle || p.title, description: p.description, path: `/articles/${p.slug}/` });
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = getPost((await params).slug);
  if (!p) notFound();
  const related = services.filter((s) => s.articles.includes(p.slug));
  const more = getPosts().filter((x) => x.slug !== p.slug).slice(0, 3);
  return (
    <>
      <JsonLd data={graph(articleSchema(p), breadcrumbs([{ name: "Главная", path: "/" }, { name: "Статьи", path: "/articles/" }, { name: p.title, path: `/articles/${p.slug}/` }]))} />
      <Container className="pt-10 md:pt-14">
        <Crumbs items={[{ name: "Главная", path: "/" }, { name: "Статьи", path: "/articles/" }, { name: p.title }]} />
        <h1 className="max-w-[22ch] text-[36px] leading-[1.05] font-medium tracking-[-0.03em] md:text-[60px]">{p.title}</h1>
      </Container>
      <Section className="pt-10 md:pt-14">
        <Container>
          <Grid>
            <aside className="md:col-span-3">
              <div className="border-t border-foreground pt-4 text-[15px] md:sticky md:top-28">
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
        <Section className="border-t border-border">
          <Container>
            <Label>Ещё статьи</Label>
            <ul className="grid grid-cols-1 border-t border-foreground md:grid-cols-3">
              {more.map((m) => (
                <li key={m.slug} className="border-b border-border md:border-r md:last:border-r-0">
                  <Link href={`/articles/${m.slug}/`} className="group block py-6 md:px-6 md:first:pl-0">
                    <h3 className="text-[20px] leading-snug font-medium group-hover:text-brand">{m.title}</h3>
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
