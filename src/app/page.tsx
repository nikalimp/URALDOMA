import Link from "next/link";
import type { Metadata } from "next";
import { site } from "@/content/site";
import { home } from "@/content/home";
import { services, serviceBySlug } from "@/content/services";
import { tariffs, formatRub } from "@/content/tariffs";
import { cases } from "@/content/cases";
import { pic } from "@/content/photos";
import { Header } from "@/components/header";
import { Container, Grid, Section, SectionHead, linkArrow, btnPrimary, btnOutline } from "@/components/container";
import { FaqList } from "@/components/faq";
import { CtaSection } from "@/components/cta";
import { Img } from "@/components/photo";
import { CaseRail } from "@/components/case-rail";
import { ProcessScroll } from "@/components/process-scroll";
import { ObjectsMaps } from "@/components/objects-maps";
import { counts } from "@/lib/objects-map";
import { JsonLd } from "@/components/json-ld";
import { faqSchema, graph, itemList } from "@/lib/schema";

export const metadata: Metadata = { title: { absolute: site.title }, description: site.description, alternates: { canonical: "/" } };

// Главная по 03-design §9–10 «Swiss: воздух и сдержанность»: одна мысль на экран.
// Обложка → ответ и цифры → услуги списком → этапы (липкий блок) → лента объектов → карта ЖК и посёлков → цена → вопросы → заявка.
// Подробности (этапы, тарифы, договор, команда, статьи) — на своих страницах, сюда ведут ссылки.
const [h1a, h1b] = home.h1.split(/\s—\s/);
const hero = pic("garinsky/02");
// Лента объектов: разные дома подряд, а не три «Гаринских» подряд
const railOrder = ["trinity-14", "obraztsovo", "radishcheva-31", "zapovednik", "garinsky", "clover-park", "garinsky-21", "cosmotheca", "garinsky-20", "boycut"];
const order = ["turnkey-renovation", "interior-design", "designer-renovation", "kitchen-renovation", "bathroom-renovation", "new-build-renovation", "major-renovation", "redevelopment", "furnishing"];

export default function Home() {
  const list = [
    ...order.map((s) => serviceBySlug(s)).filter((s) => s !== undefined).map((s) => ({ href: `/services/${s.slug}/`, title: s.title, note: s.priceFrom })),
    ...services.filter((s) => !order.includes(s.slug)).map((s) => ({ href: `/services/${s.slug}/`, title: s.title, note: s.priceFrom })),
    { href: "/furniture/", title: "Мебель на заказ", note: "своё производство «Мебель-Урал»" },
  ];
  const from = Math.min(...tariffs.map((t) => t.rate));
  return (
    <>
      <Header />
      <main id="main" className="flex-1">
        {/* 1. Обложка: типографика на бумаге, фото отдельным кадром ниже — без текста поверх (03-design §9, приём Reduce / Agency) */}
        <section aria-label="Первый экран">
          <Container className="pt-12 md:pt-20">
            <Grid className="caps text-muted-foreground">
              <p className="md:col-span-3">Ремонт квартир · Екатеринбург</p>
              <p className="hidden md:col-span-3 md:col-start-10 md:block md:text-right">С 2016 года</p>
            </Grid>
            <h1 className="t-display mt-16 md:mt-24">
              <span className="block">{h1a}</span>
              <span className="sr-only"> — </span>
              <em className="block pt-[0.06em] text-[0.82em] leading-[0.95] md:pl-[calc((100%+20px)/4)]">{h1b}</em>
            </h1>
            <Grid className="mt-12 items-end gap-y-8 md:mt-16">
              <p className="t-lead text-earth md:col-span-6 md:col-start-4">{home.lead}</p>
              <div className="flex md:col-span-3 md:col-start-10 md:justify-end">
                <a href={site.cta.href} className={btnPrimary}>{site.cta.label}<span aria-hidden="true">→</span></a>
              </div>
            </Grid>
          </Container>
          <Container className="mt-16 md:mt-24">
            <figure>
              <div className="relative aspect-[4/5] overflow-hidden bg-secondary md:aspect-auto md:h-[78svh]">
                {site.heroVideo.src ? (
                  <video className="size-full object-cover" autoPlay muted loop playsInline preload="metadata" poster={site.heroVideo.poster} aria-hidden="true"><source src={site.heroVideo.src} type="video/mp4" /></video>
                ) : (
                  <Img p={hero} eager wide sizes="100vw" />
                )}
              </div>
              <figcaption className="caps mt-3 flex justify-between gap-6 text-muted-foreground"><span>{hero.caption}</span><span className="text-right">{hero.place}</span></figcaption>
            </figure>
          </Container>
        </section>

        {/* 2. Прямой ответ (AEO) и четыре цифры — одна мысль, много воздуха */}
        <Section aria-label="Коротко о компании">
          <Container>
            <Grid>
              <p className="caps pt-[0.4em] text-muted-foreground md:col-span-3">О компании</p>
              <p className="t-lead md:col-span-6 md:col-start-4">{home.answer}</p>
            </Grid>
            <dl className="mt-24 grid grid-cols-2 gap-x-gutter gap-y-12 md:mt-32 md:grid-cols-4">
              {home.facts.map((f) => (
                <div key={f.label}>
                  <dt className="sr-only">{f.label}</dt>
                  <dd className="t-statement">{f.value}</dd>
                  <dd className="mt-3 max-w-[20ch] text-small text-muted-foreground">{f.label}</dd>
                </div>
              ))}
            </dl>
          </Container>
        </Section>

        {/* 3. Услуги — указатель строками, как оглавление журнала */}
        <Section className="pt-0 md:pt-0">
          <Container>
            <SectionHead label="Услуги" title={<>Что мы <em>делаем</em></>} />
            <ul className="border-t border-border">
              {list.map((s, i) => (
                <li key={s.href} className="border-b border-border">
                  <Link href={s.href} className="group grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-x-gutter py-6 md:grid-cols-12 md:py-8">
                    <span className="caps text-muted-foreground md:col-span-3">{String(i + 1).padStart(2, "0")}</span>
                    <span className="t-lead transition-colors group-hover:text-brand md:col-span-6">{s.title}</span>
                    <span className="col-start-2 text-small text-muted-foreground md:col-span-3 md:col-start-10 md:flex md:justify-between">
                      {s.note}<span aria-hidden="true" className="hidden text-brand transition-transform group-hover:translate-x-1 md:inline">→</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </Section>

        {/* 4. Как проходит ремонт: аксонометрия собирается по стадиям, блок закреплён на экране */}
        <ProcessScroll />

        {/* 5. Объекты: две колонки по направляющим, горизонтальная лента */}
        <Section aria-label="Портфолио">
          <Container>
            <SectionHead label="Портфолио" title={<>Ремонты в ЖК и посёлках <em>Екатеринбурга</em></>} />
            <CaseRail cases={railOrder.map((s) => cases.find((c) => c.slug === s)).filter((c) => c !== undefined)}>
              <Link href="/portfolio/" className={linkArrow}>Все объекты — {cases.length} <span aria-hidden="true">→</span></Link>
            </CaseRail>
          </Container>
        </Section>

        {/* 5. Карта ЖК и посёлков: у каждого объекта своя страница с фактами дома */}
        <Section aria-label="Карта ЖК и посёлков" className="border-t border-border">
          <Container>
            <SectionHead label="География" title={<>{counts.zk} ЖК и {counts.kp} посёлков — <em>на карте</em></>} aside="По каждому дому собрали застройщика, конструкцию, потолки и отделку от застройщика — и как это влияет на ремонт. Выберите свой дом на карте или в списке." />
            <ObjectsMaps />
          </Container>
        </Section>

        {/* 6. Цена одной строкой; тарифы, этапы и договор — на своих страницах */}
        <Section className="border-t border-border">
          <Container>
            <Grid className="gap-y-10">
              <p className="caps pt-[0.6em] text-muted-foreground md:col-span-3">Цена</p>
              <div className="md:col-span-9 md:col-start-4">
                <p className="t-title">от {formatRub(from)} <span className="text-muted-foreground">за м²</span></p>
                <p className="t-lead mt-10 max-w-[34ch] text-earth">Три тарифа. Итог фиксируется в договоре после замера и не растёт, пока вы сами не поменяете объём работ.</p>
                <div className="mt-12 flex flex-wrap gap-4">
                  <Link href="/prices/#calculator" className={btnPrimary}>Посчитать квартиру <span aria-hidden="true">→</span></Link>
                  <Link href="/how-we-work/" className={btnOutline}>Как проходит ремонт</Link>
                </div>
              </div>
            </Grid>
          </Container>
        </Section>

        {/* 7. Вопросы */}
        <Section className="border-t border-border">
          <Container>
            <Grid className="gap-y-10">
              <p className="caps pt-[0.6em] text-muted-foreground md:col-span-3">Вопросы</p>
              <FaqList items={home.faq} className="md:col-span-9 md:col-start-4" />
            </Grid>
          </Container>
        </Section>

        <CtaSection source="home" />
      </main>
      <JsonLd data={graph(faqSchema(home.faq), itemList("Услуги URALDOMA", services.map((s) => ({ name: s.title, path: `/services/${s.slug}/` }))))} />
    </>
  );
}
