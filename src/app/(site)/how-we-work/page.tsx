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
          <ol className="border-t border-foreground">
            {stages.map((s, i) => (
              <li key={s.title} className="grid grid-cols-1 gap-x-5 gap-y-3 border-b border-border py-10 md:grid-cols-12">
                <div className="md:col-span-4">
                  <span className="flex items-baseline gap-4"><span className="font-serif text-[40px] leading-none text-brand italic">{String(i + 1).padStart(2, "0")}</span><span className="label-tech text-muted-foreground">{s.term}</span></span>
                  <h3 className="mt-3 text-[26px] tracking-[-0.015em]">{s.title}</h3>
                </div>
                <p className="text-[17px] md:col-span-4">{s.text}</p>
                <div className="md:col-span-4">
                  <p className="label-mono text-muted-foreground">Что делаете вы</p>
                  <p className="mt-2 text-[16px] text-earth">{s.client}</p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section className="bg-secondary">
        <Container>
          <SectionHead n="02" label="Контроль" title={<>Видно каждый этап — <em>даже из другого города</em></>} />
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2 md:grid-cols-4">
            {H.remote.map((r) => (
              <div key={r.title} className="reveal border-t border-foreground pt-5 pb-10">
                <h3 className="text-[20px]">{r.title}</h3>
                <p className="mt-3 text-[15px] text-earth">{r.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <Grid>
            <div className="md:col-span-4"><Label n="03">Вопросы</Label><H2>Частые вопросы <em>о сроках</em></H2></div>
            <FaqList items={H.faq} className="md:col-span-7 md:col-start-6" />
          </Grid>
        </Container>
      </Section>
      <CtaSection source="how-we-work" />
    </>
  );
}
