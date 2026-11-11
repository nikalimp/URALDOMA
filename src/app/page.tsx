import Link from "next/link";
import type { Metadata } from "next";
import { site } from "@/content/site";
import { home, team } from "@/content/home";
import { services, serviceBySlug } from "@/content/services";
import { tariffs, formatRub } from "@/content/tariffs";
import { cases } from "@/content/cases";
import { pic, picsOf } from "@/content/photos";
import { Header } from "@/components/header";
import { Container, Grid, Section, SectionHead, linkArrow, btnPrimary, btnOutline } from "@/components/container";
import { FaqList } from "@/components/faq";
import { CtaSection } from "@/components/cta";
import { Img } from "@/components/photo";
import { CaseRail } from "@/components/case-rail";
import { ProcessScroll } from "@/components/process-scroll";
import { HeroBuild } from "@/components/hero-build";
import { FillText } from "@/components/fill-text";
import { Ticker } from "@/components/motion";
import { ServiceRows, twoPics } from "@/components/service-rows";
import { ObjectsMaps } from "@/components/objects-maps";
import { counts } from "@/lib/objects-map";
import { JsonLd } from "@/components/json-ld";
import { faqSchema, graph, itemList } from "@/lib/schema";

export const metadata: Metadata = { title: { absolute: site.title }, description: site.description, alternates: { canonical: "/" }, verification: { yandex: site.yandexVerification } };

// Главная по 03-design §9–10 «Swiss: воздух и сдержанность»: одна мысль на экран.
// Обложка → ответ и цифры → услуги списком → этапы (липкий блок) → лента объектов → карта ЖК и посёлков → цена → вопросы → заявка.
// Подробности (этапы, тарифы, договор, команда, статьи) — на своих страницах, сюда ведут ссылки.
const [h1a, h1b] = home.h1.split(/\s—\s/);
// Обложка — ролик сборки кухни в «Клевер Парке» (site.heroVideo, решение Ника 11.11.2026); сборка по маскам (assembly) — запасной вариант без ролика
const hero = pic("clover-park/05");
// Обложка-сборка (решение Ника 11.11.2026): пустая комната после чистовой (Nano Banana в Gemini по фото «Клевер Парка»,
// розетки — только за будущими шкафами) и настоящее фото кухни, из которого по скроллу проявляются элементы.
// Многоугольники — в координатах фото 1920×1080; порядок — как собирают кухню: низ, фартук, пенал, верх, свет, стол.
const assembly = {
  base: { src: "/images/hero/finish.webp", small: "/images/hero/finish-960.webp", alt: "Кухня-гостиная после чистовой отделки, до монтажа кухни" },
  final: { src: `${hero.base}-wide.webp`, small: `${hero.base}-wide-960.webp`, alt: hero.alt },
  parts: [
    { points: "180,770 470,668 470,652 1152,652 1152,942 960,942 960,872 370,872 370,952 180,956", from: 0, to: 0.2, dy: 6 }, // нижний ряд и столешница
    { points: "478,476 1152,476 1152,656 478,656", from: 0.14, to: 0.3, dy: 0 }, // фартук
    { points: "1150,38 1652,38 1652,1016 1150,1016", from: 0.26, to: 0.46, dy: 8 }, // пенал с техникой
    { points: "470,92 1152,92 1152,478 470,478", from: 0.42, to: 0.6, dy: -4 }, // верхние шкафы
    { points: "195,0 650,0 650,392 195,392", from: 0.58, to: 0.74, dy: -10 }, // подвесы слева
    { points: "868,0 990,0 990,392 868,392", from: 0.62, to: 0.78, dy: -10 }, // подвес справа
    { points: "0,860 1090,860 1090,1080 0,1080", from: 0.74, to: 0.9, dy: 3 }, // стол и стулья
  ],
};
// Шаги поверх обложки — по мере сборки кухни
const buildSteps = [
  { n: "01", title: "Кухня встаёт на готовые выводы", text: "Розетки, вода и слив разведены по проекту заранее — нижний ряд закрывает их ровно." },
  { n: "02", title: "Пенал и верхний ряд", text: "Техника встраивается в пенал, фасады выставлены в одну линию по уровню." },
  { n: "03", title: "Свет — и можно въезжать", text: "Подвесы и трек по проекту, клининг и акт приёмки. Фото- и видеоотчёт дважды в неделю — на каждом этапе." },
];
// Лента объектов: разные дома подряд, а не три «Гаринских» подряд
const railOrder = ["trinity-14", "obraztsovo", "radishcheva-31", "zapovednik", "garinsky", "clover-park", "garinsky-21", "cosmotheca", "garinsky-20", "boycut"];
const order = ["turnkey-renovation", "interior-design", "designer-renovation", "kitchen-renovation", "bathroom-renovation", "new-build-renovation", "major-renovation", "redevelopment", "furnishing"];

export default function Home() {
  const list = [
    ...order.map((s) => serviceBySlug(s)).filter((s) => s !== undefined).map((s) => ({ href: `/services/${s.slug}/`, title: s.title, note: s.priceFrom, pics: twoPics(s.cover, pic, picsOf) })),
    ...services.filter((s) => !order.includes(s.slug)).map((s) => ({ href: `/services/${s.slug}/`, title: s.title, note: s.priceFrom, pics: twoPics(s.cover, pic, picsOf) })),
  ];
  const from = Math.min(...tariffs.map((t) => t.rate));
  return (
    <>
      <Header />
      <main id="main" className="flex-1">
        {/* 1. Обложка: стройка по скроллу — кадр на весь экран, ролик от бетона до готовой кухни, поверх H1 и шаги (03-design §13) */}
        <HeroBuild photo={hero} video={site.heroVideo.src ? { ...site.heroVideo, alt: hero.alt } : undefined} assembly={assembly} steps={buildSteps}>
          <p className="caps text-on-photo/80">Ремонт квартир · Екатеринбург · с 2016 года</p>
          <h1 className="t-title mt-6 max-w-[16ch]">
            {h1a}<span className="sr-only"> — </span> <em>{h1b}</em>
          </h1>
          <div className="mt-8 grid gap-y-6 md:grid-cols-12 md:items-end md:gap-x-gutter">
            <p className="t-lead text-on-photo/90 md:col-span-6">От {formatRub(from)} за м². {home.lead}</p>
            <div className="flex flex-wrap gap-4 md:col-span-6 md:justify-end">
              <a href={site.cta.href} className="text-small inline-flex min-h-[52px] items-center gap-6 rounded-pill bg-on-photo px-7 font-medium text-on-photo-foreground hover:bg-brand hover:text-on-brand">{site.cta.label}<span aria-hidden="true">→</span></a>
              <a href="#map" data-goal="map" className="text-small max-md:hidden inline-flex min-h-[52px] items-center gap-2 rounded-pill border border-on-photo/60 px-7 font-medium text-on-photo hover:bg-on-photo hover:text-on-photo-foreground">Найдите свой ЖК <span aria-hidden="true">↓</span></a>
            </div>
          </div>
        </HeroBuild>

        {/* 2. Прямой ответ (AEO) и четыре цифры — одна мысль, много воздуха */}
        <Section aria-label="Коротко о компании">
          <Container>
            <Grid>
              <p className="caps pt-[0.4em] text-muted-foreground md:col-span-3">О компании</p>
              <FillText text={home.answer} className="t-lead md:col-span-6 md:col-start-4" />
            </Grid>
            <dl className="mt-24 grid grid-cols-2 gap-x-gutter gap-y-12 md:mt-32 md:grid-cols-4">
              {home.facts.map((f) => (
                <div key={f.label}>
                  <dt className="sr-only">{f.label}</dt>
                  <dd className="t-statement num">{/^\d{4}$/.test(f.value) ? f.value : <Ticker value={f.value} />}</dd>
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
            <ServiceRows rows={list} />
          </Container>
        </Section>

        {/* K3 + K5 (03-design §12): строка направлений сдвигается вместе со скроллом и «дышит» шириной знаков; дубль списка услуг выше — скрыт от читалок */}
        <div aria-hidden="true" className="strip t-display overflow-clip whitespace-nowrap py-8 text-muted-foreground md:py-16">
          <span>Квартиры · Дома · Кухни · Санузлы · Мебель · Квартиры · Дома</span>
        </div>

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
        <Section id="map" aria-label="Карта ЖК и посёлков" className="scroll-mt-20 border-t border-border">
          <Container>
            <SectionHead label="География" title={<>{counts.zk} ЖК и {counts.kp} посёлков — <em>на карте</em></>} aside="По каждому дому собрали застройщика, конструкцию, потолки и отделку от застройщика — и как это влияет на ремонт. Выберите свой дом на карте — у каждой точки своя страница." />
            <ObjectsMaps full />
            <Link href="/complexes/" className={`${linkArrow} mt-16`}>Все ЖК и посёлки списком <span aria-hidden="true">→</span></Link>
          </Container>
        </Section>

        {/* 6. Цена одной строкой; тарифы, этапы и договор — на своих страницах */}
        <Section className="border-t border-border">
          <Container>
            <Grid className="gap-y-10">
              <p className="caps pt-[0.6em] text-muted-foreground md:col-span-3">Цена</p>
              <div className="md:col-span-9 md:col-start-4">
                {/* K2 (03-design §12): цена — самый крупный знак сайта, растёт, пока блок входит в экран */}
                <p className="caps text-muted-foreground">Работы — от</p>
                <p className="t-accidence num grow-in mt-4 whitespace-nowrap">{formatRub(from).replace(/\s*₽$/, "")}</p>
                <p className="t-statement mt-6">₽ <span className="text-muted-foreground">за м²</span></p>
                <FillText text="Три тарифа. Итог фиксируется в договоре после замера и не растёт, пока вы сами не поменяете объём работ." className="t-lead mt-10 max-w-[34ch] text-earth" />
                <div className="mt-12 flex flex-wrap gap-4">
                  <Link href="/prices/#calculator" data-goal="calc" className={btnPrimary}>Посчитать квартиру <span aria-hidden="true">→</span></Link>
                  <Link href="/how-we-work/" className={btnOutline}>Как проходит ремонт</Link>
                </div>
              </div>
            </Grid>
          </Container>
        </Section>

        {/* 6б. Люди: четыре лица по направляющим — доверие к подрядчику начинается с команды */}
        <Section aria-label="Команда" className="border-t border-border">
          <Container>
            <SectionHead label="Команда" title={<>Кто ведёт <em>ваш</em> ремонт</>} />
            <ul className="grid grid-cols-2 gap-x-gutter gap-y-10 md:grid-cols-4">
              {team.slice(0, 4).map((t) => (
                <li key={t.photo}>
                  <img src={`/images/team/${t.photo}.webp`} alt={`${t.name}, ${t.role.toLowerCase()} URALDOMA`} width={600} height={900} loading="lazy" decoding="async" className="aspect-[3/4] w-full bg-secondary object-cover grayscale transition-[filter] duration-500 hover:grayscale-0" />
                  <p className="mt-4 text-body">{t.name}</p>
                  <p className="text-small text-muted-foreground">{t.role}</p>
                </li>
              ))}
            </ul>
            <Link href="/about/" className={`${linkArrow} mt-12`}>Вся команда <span aria-hidden="true">→</span></Link>
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
