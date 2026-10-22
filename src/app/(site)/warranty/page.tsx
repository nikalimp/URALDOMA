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
      <PageHead crumbs={[{ name: "Главная", path: "/" }, { name: "Гарантия и договор" }]} h1={W.h1} answer={W.answer} photo="garinsky-21/01" />
      <Section>
        <Container>
          <div className="grid grid-cols-1 gap-x-gutter sm:grid-cols-2 md:grid-cols-4">
            {W.items.map((it, i) => (
              <div key={it.title} className="reveal border-t border-border pt-5 pb-12">
                <span className="caps text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                <h2 className="t-lead mt-4">{it.title}</h2>
                <p className="text-small mt-3 text-earth">{it.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>
      <Section>
        <Container>
          <Grid>
            <p className="caps pt-[0.6em] text-muted-foreground md:col-span-3">Приёмка</p>
              <H2 className="md:col-span-9 md:col-start-4">Как вы принимаете <em>работы</em></H2>
            <ol className="border-t border-border md:col-span-9 md:col-start-4 md:mt-16">
              {W.acceptance.map((a, i) => (
                <li key={a.title} className="grid grid-cols-[56px_1fr] gap-x-gutter border-b border-border py-6 md:grid-cols-9">
                  <span className="caps text-muted-foreground md:col-span-3">{String(i + 1).padStart(2, "0")}</span>
                  <div className="md:col-span-6"><h3 className="t-lead">{a.title}</h3><p className="text-small mt-2 text-earth">{a.text}</p></div>
                </li>
              ))}
            </ol>
          </Grid>
        </Container>
      </Section>
      <Section>
        <Container>
          <Grid>
            <p className="caps pt-[0.6em] text-muted-foreground md:col-span-3">Вопросы</p>
              <H2 className="md:col-span-9 md:col-start-4">Частые вопросы <em>о гарантии</em></H2>
            <FaqList items={W.faq} className="md:col-span-9 md:col-start-4 md:mt-16" />
          </Grid>
        </Container>
      </Section>
      <CtaSection source="warranty" />
    </>
  );
}
