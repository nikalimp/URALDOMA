import { warranty as W } from "@/content/pages";
import { site } from "@/content/site";
import { Container, Grid, Section, Label, H2 } from "@/components/container";
import { PageHead } from "@/components/page-head";
import { FaqList } from "@/components/faq";
import { CtaSection } from "@/components/cta";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbs, faqSchema, graph, orgId } from "@/lib/schema";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta({ title: W.metaTitle, description: W.metaDescription, path: "/warranty/" });

export default function Warranty() {
  return (
    <>
      <JsonLd data={graph({ "@type": "WebPage", name: W.h1, url: `${site.url}/warranty/`, description: W.answer, about: { "@id": orgId } }, faqSchema(W.faq), breadcrumbs([{ name: "Главная", path: "/" }, { name: "Гарантия и договор", path: "/warranty/" }]))} />
      <PageHead crumbs={[{ name: "Главная", path: "/" }, { name: "Гарантия и договор" }]} h1={W.h1} answer={W.answer} />
      <Section className="bg-secondary">
        <Container>
          <div className="grid grid-cols-1 border-t border-l border-foreground/15 sm:grid-cols-2 lg:grid-cols-3">
            {W.items.map((it, i) => (
              <div key={it.title} className="border-r border-b border-foreground/15 p-6 md:p-8">
                <span className="font-mono text-[13px] text-brand">{String(i + 1).padStart(2, "0")}</span>
                <h2 className="mt-4 text-[26px] tracking-[-0.015em]">{it.title}</h2>
                <p className="mt-3 text-[16px] text-earth">{it.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>
      <Section>
        <Container>
          <Grid>
            <div className="md:col-span-4"><Label n="02">Приёмка</Label><H2>Как вы принимаете работы</H2></div>
            <ol className="border-t border-foreground md:col-span-7 md:col-start-6">
              {W.acceptance.map((a, i) => (
                <li key={a.title} className="grid grid-cols-[48px_1fr] gap-x-6 border-b border-border py-6">
                  <span className="font-mono text-[14px] text-brand">{String(i + 1).padStart(2, "0")}</span>
                  <div><h3 className="text-[22px]">{a.title}</h3><p className="mt-2 text-[16px] text-earth">{a.text}</p></div>
                </li>
              ))}
            </ol>
          </Grid>
        </Container>
      </Section>
      <Section className="border-t border-border">
        <Container>
          <Grid>
            <div className="md:col-span-4"><Label n="03">Вопросы</Label><H2>Частые вопросы о гарантии</H2></div>
            <FaqList items={W.faq} className="md:col-span-7 md:col-start-6" />
          </Grid>
        </Container>
      </Section>
      <CtaSection source="warranty" />
    </>
  );
}
