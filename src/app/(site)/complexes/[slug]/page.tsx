import { notFound } from "next/navigation";
import { complexes, complexBySlug } from "@/content/complexes";
import { inName } from "@/content/objects";
import { caseBySlug } from "@/content/cases";
import { tariffs, formatRub } from "@/content/tariffs";
import Link from "next/link";
import { Container, Grid, Section, SectionHead, Label, H2, linkArrow } from "@/components/container";
import { PageHead } from "@/components/page-head";
import { PriceExamples } from "@/components/price-examples";
import { CaseCard } from "@/components/case-card";
import { FaqList } from "@/components/faq";
import { CtaSection } from "@/components/cta";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbs, complexServiceSchema, faqSchema, graph } from "@/lib/schema";
import { pageMeta } from "@/lib/meta";
import { picsOf } from "@/content/photos";
import { Photo } from "@/components/photo";
import { RailControls } from "@/components/motion";

export const dynamicParams = false;
export function generateStaticParams() {
  return complexes.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const c = complexBySlug((await params).slug);
  if (!c) return {};
  return pageMeta({ title: c.metaTitle, description: c.metaDescription, path: `/complexes/${c.slug}/` });
}

const areas = { zk: [50, 80, 120], kp: [120, 180, 250] };

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
  const pics = cs.flatMap((x) => picsOf(x.slug));
  const cover = pics.find((p) => p.wide) ?? pics[0];
  // Соседи: ближайшие объекты того же типа по расстоянию
  const dist = (o: typeof c) => Math.hypot(o.geo.lat - c.geo.lat, (o.geo.lon - c.geo.lon) * 0.55);
  const near = complexes.filter((o) => o.kind === c.kind && o.slug !== c.slug).sort((a, b) => dist(a) - dist(b)).slice(0, 6);
  return (
    <>
      <JsonLd data={graph(complexServiceSchema({ ...c, address, serviceType: c.kind === "kp" ? "Ремонт и отделка дома" : "Ремонт квартиры" }), c.faq.length ? faqSchema(c.faq) : null, breadcrumbs([{ name: "Главная", path: "/" }, { name: "Ремонт в ЖК", path: "/complexes/" }, { name: c.name, path }]))} />
      <PageHead crumbs={[{ name: "Главная", path: "/" }, { name: "Ремонт в ЖК", path: "/complexes/" }, { name: c.name }]} h1={c.h1} answer={c.answer} photo={cover?.key} />
      <Container>
        <dl className="grid grid-cols-1 gap-x-gutter sm:grid-cols-2 md:grid-cols-12">
          {c.facts.map(([k, v]) => (
            <div key={k} className="border-t border-border pt-3 pb-6 md:col-span-3">
              <dt className="caps text-muted-foreground">{k}</dt>
              <dd className="t-lead mt-2">{v}</dd>
            </div>
          ))}
        </dl>
      </Container>

      <Section>
        <Container>
          {c.sections.map((s, i) => (
            <Grid key={s.h2} className="border-t border-border py-10 first:border-foreground">
              <div className="md:col-span-3">
                <span className="caps text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                <h2 className="t-lead mt-4">{s.h2}</h2>
              </div>
              <div className="md:col-span-6 md:col-start-4">
                {s.text && <p className="text-body">{s.text}</p>}
                {s.items && <ul className="mt-4 border-t border-border">{s.items.map((it) => <li key={it} className="text-body border-b border-border py-3">{it}</li>)}</ul>}
              </div>
            </Grid>
          ))}
        </Container>
      </Section>

      {pics.length > 0 && (
        <section aria-label="Фото наших объектов" className="border-t border-border py-16 md:py-28">
          <Container>
            <Grid className="mb-10 items-end md:mb-14">
              <div className="md:col-span-9">
                <Label>Наши объекты</Label>
                <H2>Наши ремонты <em>в {inName(c.name)}</em></H2>
              </div>
              <div className="flex md:col-span-3 md:col-start-10 md:justify-end"><RailControls target="complex-rail" total={pics.length} label="Фото" /></div>
            </Grid>
          </Container>
          <ul id="complex-rail" className="rail auto-cols-[78%] gap-x-5 px-5 sm:auto-cols-[42%] md:auto-cols-[calc((100%-60px)/4)] md:px-10">
            {pics.map((p, i) => <li key={p.key}><Photo p={p} link sizes="(min-width: 768px) 25vw, 80vw" /></li>)}
          </ul>
          <Container className="mt-14">
            <div className="grid grid-cols-1 gap-x-gutter gap-y-12 md:grid-cols-2">{cs.map((x) => <CaseCard key={x.slug} c={x} ratio="aspect-[4/3]" sizes="(min-width: 768px) 50vw, 100vw" />)}</div>
          </Container>
        </section>
      )}

      <Section>
        <Container>
          <SectionHead n="—" label="Старт" title={<>Как начать ремонт <em>в {inName(c.name)}</em></>} />
          <ol className="grid grid-cols-1 gap-x-gutter sm:grid-cols-2 md:grid-cols-4">
            {start(inName(c.name)).map((s, i) => (
              <li key={s.title} className="border-t border-border pt-5 pb-10">
                <span className="text-small font-mono text-brand">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="t-lead mt-3">{s.title}</h3>
                <p className="text-small mt-2 text-earth">{s.text}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHead n="—" label="Цены" title={<>Сколько стоят <em>работы</em></>} aside={c.kind === "kp" ? "Стоимость работ по тарифам для домов 120, 180 и 250 м². Материалы и мебель — отдельно, точная смета после замера." : "Стоимость работ по тарифам для типичных площадей. Материалы и мебель — отдельно, точная смета после замера."} />
          <PriceExamples areas={areas[c.kind]} caption={`Стоимость работ по тарифам: ${c.name}`} />
        </Container>
      </Section>

      {c.faq.length > 0 && (
        <Section>
          <Container>
            <Grid>
              <p className="caps pt-[0.6em] text-muted-foreground md:col-span-3">Вопросы</p>
              <H2 className="md:col-span-9 md:col-start-4">Частые <em>вопросы</em></H2>
              <FaqList items={c.faq} className="md:col-span-9 md:col-start-4 md:mt-16" />
            </Grid>
          </Container>
        </Section>
      )}
      <Section className="border-t border-border">
        <Container>
          <Grid className="gap-y-12">
            <div className="md:col-span-6">
              <p className="caps text-muted-foreground">{c.kind === "kp" ? "Посёлки рядом" : "Другие ЖК рядом"}</p>
              <ul className="mt-6 border-t border-border">
                {near.map((n) => (
                  <li key={n.slug}><Link href={`/complexes/${n.slug}/`} className="flex items-baseline justify-between gap-6 border-b border-border py-3 hover:text-brand"><span>{n.name}</span><span className="caps shrink-0 text-muted-foreground">{n.district ?? ""}</span></Link></li>
                ))}
              </ul>
              <Link href="/complexes/" className={`${linkArrow} mt-8`}>Все ЖК и посёлки на карте <span aria-hidden="true">→</span></Link>
            </div>
            {c.sources.length > 0 && (
              <div className="md:col-span-6 md:col-start-7">
                <p className="caps text-muted-foreground">Источники фактов о {c.kind === "kp" ? "посёлке" : "доме"}</p>
                <ul className="text-small mt-6 border-t border-border">
                  {c.sources.map((s) => (
                    <li key={s} className="border-b border-border py-3"><a href={s} rel="nofollow noopener" target="_blank" className="break-all text-muted-foreground hover:text-foreground">{s.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}</a></li>
                  ))}
                </ul>
                <p className="text-small mt-4 text-muted-foreground">Данные из открытых источников на октябрь 2026. Точные параметры квартиры или дома проверяем на замере.</p>
              </div>
            )}
          </Grid>
        </Container>
      </Section>
      <CtaSection source={`complex:${c.slug}`} />
    </>
  );
}
