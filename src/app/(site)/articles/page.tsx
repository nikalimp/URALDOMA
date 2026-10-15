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
          <ul className="grid grid-cols-1 gap-x-5 gap-y-16 md:grid-cols-12">
            {posts.map((p, i) => {
              const lead = i === 0;
              return (
                <li key={p.slug} className={lead ? "md:col-span-12" : "md:col-span-4"}>
                  <Link href={`/articles/${p.slug}/`} className={`group grid grid-cols-1 gap-x-5 gap-y-4 ${lead ? "md:grid-cols-12 md:items-end" : ""}`}>
                    {p.cover && (
                      <div className={`overflow-hidden bg-secondary ${lead ? "aspect-[16/10] md:col-span-8" : "aspect-[4/3]"}`}>
                        <Img p={pic(p.cover)} wide={lead} sizes={lead ? "(min-width: 768px) 66vw, 100vw" : "(min-width: 768px) 33vw, 100vw"} className="transition-transform duration-[1.2s] group-hover:scale-[1.04]" />
                      </div>
                    )}
                    <div className={lead ? "md:col-span-4" : ""}>
                      <time dateTime={p.date} className="label-tech text-muted-foreground">{formatDate(p.date)}</time>
                      <h2 className={`mt-3 border-t border-border pt-3 leading-snug tracking-[-0.02em] group-hover:text-brand ${lead ? "text-[30px] md:text-[44px] md:leading-[1.05]" : "text-[24px]"}`}>{p.title}</h2>
                      <p className="mt-3 text-[16px] text-earth">{p.description}</p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Container>
      </Section>
      <CtaSection source="articles" />
    </>
  );
}
