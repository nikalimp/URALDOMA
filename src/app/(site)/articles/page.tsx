import Link from "next/link";
import { formatDate, getPosts } from "@/lib/posts";
import { site } from "@/content/site";
import { Container, Section } from "@/components/container";
import { PageHead } from "@/components/page-head";
import { CtaSection } from "@/components/cta";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbs, graph, orgId } from "@/lib/schema";
import { pageMeta } from "@/lib/meta";
import { pic } from "@/content/photos";
import { Img } from "@/components/photo";

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
      <PageHead crumbs={[{ name: "Главная", path: "/" }, { name: "Статьи" }]} h1={<>Статьи о ремонте <em>квартир</em></>} answer={answer} />
      <Section className="pt-0 md:pt-0">
        <Container>
          <ul className="grid grid-cols-1 gap-x-gutter gap-y-16 sm:grid-cols-2 lg:grid-cols-4">
            {posts.map((p) => (
              <li key={p.slug}>
                <Link href={`/articles/${p.slug}/`} className="group block">
                  {p.cover && (
                    <div className="aspect-[4/5] overflow-hidden bg-secondary">
                      <Img p={pic(p.cover)} sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className="transition-transform duration-[1.2s] group-hover:scale-[1.04]" />
                    </div>
                  )}
                  <time dateTime={p.date} className="caps mt-5 block text-muted-foreground">{formatDate(p.date)}</time>
                  <h2 className="t-lead mt-3 group-hover:text-brand">{p.title}</h2>
                  <p className="text-small mt-3 text-earth">{p.description}</p>
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
