import { site } from "@/content/site";
import { lp } from "@/content/landing-new-build";
import { caseBySlug, type Case } from "@/content/cases";
import { home } from "@/content/home";
import { reviews, reviewsSource } from "@/content/reviews";
import { pic } from "@/content/photos";
import { tariffCommon } from "@/content/tariffs";
import { Container, Grid, Section, SectionHead, H2 } from "@/components/container";
import { Logo } from "@/components/logo";
import { Img } from "@/components/photo";
import { QuickLeadCard } from "@/components/quick-lead";
import { CaseCard } from "@/components/case-card";
import { TariffTable } from "@/components/tariff-table";
import { CtaSection } from "@/components/cta";
import { pageMeta } from "@/lib/meta";

// Рекламный лендинг под Яндекс Директ (Поиск): без квиза и без лишних секций.
// 6 плотных экранов: Оффер + простая форма → Цифры → Кейсы в ЖК → Тарифы + форма → Отзывы и договор → Финальная заявка.
export const metadata = pageMeta({
  title: lp.metaTitle,
  description: lp.metaDescription,
  path: lp.path,
  image: `${pic(lp.heroPhoto).base}.webp`,
  noindex: true,
});

function LpHeader() {
  return (
    <header className="glass sticky top-0 z-40 border-b border-border">
      <div className="flex h-[64px] items-center justify-between gap-4 px-5 md:h-[72px] md:px-10">
        <a href="/" aria-label="URALDOMA — на главную сайта" className="shrink-0"><Logo /></a>
        <div className="flex items-center gap-3 whitespace-nowrap">
          <a href={`tel:${site.contacts.phone}`} className="text-small font-medium hover:text-brand">{site.contacts.phoneDisplay}</a>
          <a href={site.contacts.telegram} target="_blank" rel="noopener" className="hidden min-h-[42px] items-center rounded-pill border border-border px-4 text-small font-medium transition-colors hover:border-foreground md:inline-flex">Telegram</a>
          <a href="#lead-top" data-goal="cta_header" className="hidden min-h-[42px] items-center rounded-pill bg-foreground px-5 text-small font-medium text-background transition-colors hover:bg-brand hover:text-on-brand sm:inline-flex">Получить смету</a>
        </div>
      </div>
    </header>
  );
}

export default function NewBuildLanding() {
  const cases = lp.cases.map((s) => caseBySlug(s)).filter((c): c is Case => c !== undefined);
  const hero = pic(lp.heroPhoto);

  return (
    <>
      <LpHeader />
      <main id="main" className="flex-1">
        {/* 1. Первый экран: 4U-оффер слева + простая форма заявки в 1 шаг справа */}
        <section className="relative isolate overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <Img p={hero} eager sizes="100vw" className="opacity-100" />
            <div className="absolute inset-0 bg-gradient-to-r from-scrim/85 via-scrim/70 to-scrim/45" aria-hidden="true" />
          </div>
          <Container className="py-10 md:py-20">
            <Grid className="gap-y-8 md:items-center">
              <div className="text-on-photo md:col-span-6 lg:col-span-7">
                <p className="caps text-on-photo/80">Новостройки Екатеринбурга · работаем с 2016 года</p>
                <h1 className="t-title mt-5 max-w-[16ch]">Ремонт новостройки под ключ с фиксированной сметой</h1>
                <p className="t-lead mt-5 max-w-[42ch] text-on-photo/90">
                  Дизайн-проект, черновые и чистовые работы, инженерия и комплектация одной командой — от ключей до переезда за 4⁠–⁠6 месяцев.
                </p>
                <ul className="mt-6 space-y-2.5">
                  <li className="text-body flex gap-3"><span aria-hidden="true" className="text-brand">—</span>Цена работ от 20 000 ₽/м² фиксируется в договоре</li>
                  <li className="text-body flex gap-3"><span aria-hidden="true" className="text-brand">—</span>Поэтапная оплата 30 / 40 / 30 — без риска</li>
                  <li className="text-body flex gap-3"><span aria-hidden="true" className="text-brand">—</span>Фото- и видеоотчёты дважды в неделю + гарантия 2 года</li>
                </ul>
              </div>
              <div id="lead-top" className="scroll-mt-24 md:col-span-6 lg:col-span-5">
                <QuickLeadCard source="lp:new-build:hero" />
              </div>
            </Grid>
          </Container>
        </section>

        {/* 2. Короткие факты доверия */}
        <Section className="py-10 md:py-14">
          <Container>
            <dl className="grid grid-cols-2 gap-x-gutter gap-y-8 md:grid-cols-4">
              {home.facts.map((f) => (
                <div key={f.label} className="border-t border-border pt-4">
                  <dt className="t-statement">{f.value}</dt>
                  <dd className="text-small mt-2 text-muted-foreground">{f.label}</dd>
                </div>
              ))}
            </dl>
          </Container>
        </Section>

        {/* 3. Реальные объекты в ЖК Екатеринбурга */}
        <Section>
          <Container>
            <SectionHead
              label="Объекты"
              title={<>Квартиры в новых ЖК, <em>которые мы сдали</em></>}
              aside="Гаринский, Тринити, Клевер Парк, Радищева 31 — дизайн-проект, ремонт и мебель под ключ одной командой."
            />
            <div className="grid grid-cols-1 gap-x-gutter gap-y-12 md:grid-cols-2">
              {cases.map((c, i) => (
                <CaseCard key={c.slug} c={c} index={`(0${i + 1})`} className={i % 2 === 1 ? "md:mt-14" : ""} />
              ))}
            </div>
          </Container>
        </Section>

        {/* 4. Тарифы + простая промежуточная форма */}
        <Section>
          <Container>
            <SectionHead
              label="Стоимость"
              title={<>Три понятных тарифа — <em>цена за м² работ</em></>}
              aside={`${tariffCommon} Точную постатейную смету фиксируем в договоре после бесплатного замера.`}
            />
            <TariffTable />
            <div className="mt-12 md:mt-16">
              <QuickLeadCard
                source="lp:new-build:tariffs"
                title="Пришлём пример реальной сметы под вашу площадь"
                subtitle="Покажем разбивку по работам и черновым материалам на примере сданной квартиры в похожем ЖК."
                button="Получить пример сметы"
              />
            </div>
          </Container>
        </Section>

        {/* 5. Отзывы и гарантии в договоре */}
        <Section>
          <Container>
            <SectionHead
              label="Отзывы"
              title={<>Что говорят <em>клиенты после сдачи</em></>}
              aside={`Проверенные отзывы на ${reviewsSource.name}.`}
            />
            <ul className="grid grid-cols-1 gap-x-gutter md:grid-cols-3">
              {reviews.slice(0, 3).map((r) => (
                <li key={r.name + r.date} className="border-t border-border pt-5 pb-8">
                  <blockquote className="text-body">«{r.text}»</blockquote>
                  <p className="text-small mt-4 font-medium">{r.name}{r.object ? `, ${r.object}` : ""}</p>
                  <p className="text-small text-muted-foreground">{reviewsSource.name}, {r.date}</p>
                </li>
              ))}
            </ul>
            <a href={reviewsSource.url} target="_blank" rel="noopener" className="text-small underline underline-offset-4">Все отзывы на {reviewsSource.name} <span aria-hidden="true">↗</span></a>

            <Grid className="mt-16 border-t border-border pt-14 md:mt-20">
              <p className="caps pt-[0.6em] text-muted-foreground md:col-span-3">Договор</p>
              <H2 className="md:col-span-9 md:col-start-4">Что <em>закреплено</em> в договоре</H2>
              <dl className="grid grid-cols-1 gap-x-gutter md:col-span-9 md:col-start-4 md:mt-12 md:grid-cols-2">
                {home.contract.map((c) => (
                  <div key={c.title} className="border-t border-border pt-5 pb-8">
                    <dt className="t-lead">{c.title}</dt>
                    <dd className="text-small mt-3 text-earth">{c.text}</dd>
                  </div>
                ))}
              </dl>
            </Grid>
          </Container>
        </Section>

        {/* 6. Финальная заявка */}
        <CtaSection source="lp:new-build:cta" title={<>Бесплатный замер и смета для вашей новостройки</>} />
      </main>
    </>
  );
}
