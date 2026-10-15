import { notFound } from "next/navigation";
import { complexes, complexBySlug } from "@/content/complexes";
import { caseBySlug } from "@/content/cases";
import { tariffs, formatRub } from "@/content/tariffs";
import { Container, Grid, Section, SectionHead, Label, H2 } from "@/components/container";
import { PageHead } from "@/components/page-head";
import { PriceExamples } from "@/components/price-examples";
import { CaseCard } from "@/components/case-card";
import { FaqList } from "@/components/faq";
import { CtaSection } from "@/components/cta";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbs, complexServiceSchema, faqSchema, graph } from "@/lib/schema";
import { pageMeta } from "@/lib/meta";

export const dynamicParams = false;
export function generateStaticParams() {
  return complexes.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const c = complexBySlug((await params).slug);
  if (!c) return {};
  return pageMeta({ title: c.metaTitle, description: c.metaDescription, path: `/complexes/${c.slug}/` });
}

const areas = [50, 80, 120];

// Общий порядок старта — одинаковый для всех домов (process.ts, FAQ главной)
const start = (name: string) => [
  { title: "Замер", text: `Технолог приезжает в ${name} и делает обмер — это занимает около получаса.` },
  { title: "Правила дома", text: "Уточняем в управляющей компании часы шумных работ, график лифта, завоз материалов и вывоз мусора — это влияет на сроки и смету." },
  { title: "Смета и договор", text: "Готовим смету с перечнем, объёмом и ценой работ, фиксируем её и график в договоре." },
  { title: "Ремонт с отчётами", text: "Дважды в неделю присылаем фото и видео с объекта, скрытые работы вы принимаете до того, как их закроют." },
];

export default async function ComplexPage({ params }: { params: Promise<{ slug: string }> }) {
  const c = complexBySlug((await params).slug);
  if (!c) notFound();
  const cs = c.cases.map((s) => caseBySlug(s)).filter((x) => x !== undefined);
  const address = c.facts.find(([k]) => k === "Адрес")?.[1];
  const path = `/complexes/${c.slug}/`;
  return (
    <>
      <JsonLd data={graph(complexServiceSchema({ ...c, address }), c.faq.length ? faqSchema(c.faq) : null, breadcrumbs([{ name: "Главная", path: "/" }, { name: "Ремонт в ЖК", path: "/complexes/" }, { name: c.name, path }]))} />
      <PageHead crumbs={[{ name: "Главная", path: "/" }, { name: "Ремонт в ЖК", path: "/complexes/" }, { name: c.name }]} h1={c.h1} answer={c.answer} />
      <Container>
        <dl className="grid grid-cols-2 border-t border-foreground md:grid-cols-5">
          {c.facts.map(([k, v]) => (
            <div key={k} className="border-b border-border py-5 pr-4">
              <dt className="label-mono text-muted-foreground">{k}</dt>
              <dd className="mt-2 text-[19px] font-medium">{v}</dd>
            </div>
          ))}
        </dl>
      </Container>

      <Section>
        <Container>
          {c.sections.map((s, i) => (
            <Grid key={s.h2} className="border-t border-border py-10 first:border-foreground">
              <div className="md:col-span-4">
                <span className="font-mono text-[13px] text-brand">{String(i + 1).padStart(2, "0")}</span>
                <h2 className="mt-3 text-[28px] leading-tight font-medium tracking-[-0.02em]">{s.h2}</h2>
              </div>
              <div className="md:col-span-7 md:col-start-6">
                {s.text && <p className="text-[18px]">{s.text}</p>}
                {s.items && <ul className="mt-4 border-t border-border">{s.items.map((it) => <li key={it} className="border-b border-border py-3 text-[17px]">{it}</li>)}</ul>}
              </div>
            </Grid>
          ))}
        </Container>
      </Section>

      {cs.length > 0 && (
        <Section className="bg-card">
          <Container>
            <SectionHead n="—" label="Наши объекты" title={`Наши ремонты в ${c.name}`} />
            <div className="grid grid-cols-1 gap-6 gap-y-10 md:grid-cols-3">{cs.map((x) => <CaseCard key={x.slug} c={x} />)}</div>
          </Container>
        </Section>
      )}

      <Section className="bg-secondary">
        <Container>
          <SectionHead n="—" label="Старт" title={`Как начать ремонт в ${c.name}`} />
          <ol className="grid grid-cols-1 border-t border-foreground md:grid-cols-4">
            {start(c.name).map((s, i) => (
              <li key={s.title} className="border-b border-foreground/15 py-6 md:border-r md:px-6 md:first:pl-0 md:last:border-r-0">
                <span className="font-mono text-[13px] text-brand">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 text-[20px] font-medium">{s.title}</h3>
                <p className="mt-2 text-[15px] text-earth">{s.text}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHead n="—" label="Цены" title="Сколько стоят работы" aside="Стоимость работ по тарифам для типичных площадей. Материалы и мебель — отдельно, точная смета после замера." />
          <PriceExamples areas={areas} caption={`Стоимость работ по тарифам в ${c.name}`} />
        </Container>
      </Section>

      {c.faq.length > 0 && (
        <Section className="border-t border-border">
          <Container>
            <Grid>
              <div className="md:col-span-4"><Label>Вопросы</Label><H2>Частые вопросы</H2></div>
              <FaqList items={c.faq} className="md:col-span-7 md:col-start-6" />
            </Grid>
          </Container>
        </Section>
      )}
      <CtaSection source={`complex:${c.slug}`} />
    </>
  );
}
