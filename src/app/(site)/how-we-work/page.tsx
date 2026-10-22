import { howWeWork as H } from "@/content/pages";
import { stages } from "@/content/process";
import { site } from "@/content/site";
import { Container, Grid, Section, SectionHead, Label, H2 } from "@/components/container";
import { PageHead } from "@/components/page-head";
import { ProcessBlueprint } from "@/components/process-blueprint";
import { FaqList } from "@/components/faq";
import { CtaSection } from "@/components/cta";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbs, faqSchema, graph } from "@/lib/schema";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta({ title: H.metaTitle, description: H.metaDescription, path: "/how-we-work/" });

export default function HowWeWork() {
  const howTo = {
    "@type": "HowTo",
    name: "Как проходит ремонт квартиры под ключ в URALDOMA",
    description: H.answer,
    url: `${site.url}/how-we-work/`,
    step: stages.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.title, text: `${s.text} Срок: ${s.term}.` })),
  };
  return (
    <>
      <JsonLd data={graph(howTo, faqSchema(H.faq), breadcrumbs([{ name: "Главная", path: "/" }, { name: "Как мы работаем", path: "/how-we-work/" }]))} />
      <PageHead crumbs={[{ name: "Главная", path: "/" }, { name: "Как мы работаем" }]} h1={H.h1} answer={H.answer} photo="zapovednik/04" />

      <section aria-label="Чертёж стадий" className="bg-panel py-16 text-panel-muted md:py-24">
        <Container><ProcessBlueprint initial={1} /></Container>
      </section>

      <Section>
        <Container>
          <SectionHead n="01" label="Стадии" title={<>Шесть стадий <em>ремонта</em></>} />
          <ol className="border-t border-border">
            {stages.map((s, i) => (
              <li key={s.title} className="grid grid-cols-1 gap-x-5 gap-y-3 border-b border-border py-10 md:grid-cols-12">
                <div className="md:col-span-4">
                  <span className="flex items-baseline gap-4"><span className="caps text-muted-foreground">{String(i + 1).padStart(2, "0")}</span><span className="caps text-muted-foreground">{s.term}</span></span>
                  <h3 className="t-lead mt-3">{s.title}</h3>
                </div>
                <p className="text-body md:col-span-4">{s.text}</p>
                <div className="md:col-span-4">
                  <p className="label-mono text-muted-foreground">Что делаете вы</p>
                  <p className="text-small mt-2 text-earth">{s.client}</p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHead n="02" label="Контроль" title={<>Видно каждый этап — <em>даже из другого города</em></>} />
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2 md:grid-cols-4">
            {H.remote.map((r) => (
              <div key={r.title} className="reveal border-t border-border pt-5 pb-10">
                <h3 className="t-lead">{r.title}</h3>
                <p className="text-small mt-3 text-earth">{r.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <Grid>
            <p className="caps pt-[0.6em] text-muted-foreground md:col-span-3">Вопросы</p>
              <H2 className="md:col-span-9 md:col-start-4">Частые вопросы <em>о сроках</em></H2>
            <FaqList items={H.faq} className="md:col-span-9 md:col-start-4 md:mt-16" />
          </Grid>
        </Container>
      </Section>
      <CtaSection source="how-we-work" />
    </>
  );
}
