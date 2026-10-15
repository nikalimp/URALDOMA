import Link from "next/link";
import { formatDate, getPosts } from "@/lib/posts";
import { site } from "@/content/site";
import { Container, Section } from "@/components/container";
import { PageHead } from "@/components/page-head";
import { CtaSection } from "@/components/cta";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbs, graph, orgId } from "@/lib/schema";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta({
  title: "Статьи о ремонте квартир в Екатеринбурге — URALDOMA",
  description: "Сколько стоит ремонт, с чего начать, как выбрать компанию, что входит в черновой ремонт и как согласовать перепланировку в Екатеринбурге — разборы от URALDOMA.",
  path: "/articles/",
});

const answer = "Разбираем ремонт квартиры по шагам: сколько он стоит в Екатеринбурге, с чего начать, как выбрать подрядчика, что входит в черновые работы и как согласовать перепланировку. Пишет команда URALDOMA по опыту своих объектов.";

export default function Articles() {
  const posts = getPosts();
  return (
    <>
      <JsonLd data={graph({ "@type": "Blog", name: `Статьи ${site.name}`, url: `${site.url}/articles/`, publisher: { "@id": orgId }, blogPost: posts.map((p) => ({ "@type": "BlogPosting", headline: p.title, url: `${site.url}/articles/${p.slug}/`, datePublished: p.date })) }, breadcrumbs([{ name: "Главная", path: "/" }, { name: "Статьи", path: "/articles/" }]))} />
      <PageHead crumbs={[{ name: "Главная", path: "/" }, { name: "Статьи" }]} h1="Статьи о ремонте квартир" answer={answer} />
      <Section className="pt-0 md:pt-0">
        <Container>
          <ul className="border-t border-foreground">
            {posts.map((p) => (
              <li key={p.slug} className="border-b border-border">
                <Link href={`/articles/${p.slug}/`} className="group grid grid-cols-1 gap-x-6 gap-y-2 py-8 md:grid-cols-12">
                  <time dateTime={p.date} className="label-mono text-muted-foreground md:col-span-2">{formatDate(p.date)}</time>
                  <h2 className="text-[24px] leading-snug font-medium tracking-[-0.015em] group-hover:text-brand md:col-span-6 md:text-[28px]">{p.title}</h2>
                  <p className="text-[16px] text-earth md:col-span-4">{p.description}</p>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Section>
      <CtaSection source="articles" />
    </>
  );
}
