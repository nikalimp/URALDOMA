import { site } from "@/content/site";
import { lp, lpFaq } from "@/content/landing-new-build";
import { caseBySlug, type Case } from "@/content/cases";
import { home } from "@/content/home";
import { pic } from "@/content/photos";
import { tariffCommon } from "@/content/tariffs";
import { Container, Grid, Section, SectionHead, H2, btnPrimary } from "@/components/container";
import { Logo } from "@/components/logo";
import { Img } from "@/components/photo";
import { Quiz } from "@/components/quiz";
import { CaseCard } from "@/components/case-card";
import { TariffTable } from "@/components/tariff-table";
import { FaqList } from "@/components/faq";
import { CtaSection } from "@/components/cta";
import { pageMeta } from "@/lib/meta";

// Рекламный лендинг (Яндекс Директ). noindex: не конкурирует в поиске с /services/new-build-renovation/.
// Шапка без меню: одна цель страницы — заявка (квиз, телефон или форма внизу).
export const metadata = pageMeta({ title: lp.metaTitle, description: lp.metaDescription, path: lp.path, image: `${pic(lp.heroPhoto).base}.webp`, noindex: true });

function LpHeader() {
  return (
    <header className="glass sticky top-0 z-40 border-b border-border">
      <div className="flex h-[64px] items-center justify-between gap-5 px-5 md:h-[72px] md:px-10">
        <a href="/" aria-label="URALDOMA — на главную сайта" className="shrink-0"><Logo /></a>
        <div className="flex items-center gap-3 whitespace-nowrap">
          <a href={`tel:${site.contacts.phone}`} className="text-small font-medium">{site.contacts.phoneDisplay}</a>
          <a href="#quiz" data-goal="cta_header" className="hidden min-h-[44px] items-center rounded-pill bg-foreground px-5 text-small font-medium text-background transition-colors hover:bg-brand hover:text-on-brand sm:inline-flex">Рассчитать стоимость</a>
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
        {/* Первый экран: оффер слева, квиз справа — заявка без прокрутки */}
        <section className="relative isolate overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <Img p={hero} eager sizes="100vw" className="opacity-100" />
            <div className="absolute inset-0 bg-gradient-to-r from-scrim/80 via-scrim/60 to-scrim/30" aria-hidden="true" />
          </div>
          <Container className="py-12 md:py-24">
            <Grid className="gap-y-10 md:items-end">
              <div className="text-on-photo md:col-span-6">
                <p className="caps text-on-photo/80">{lp.eyebrow}</p>
                <h1 className="t-title mt-6">{lp.h1}</h1>
                <p className="t-lead mt-6 hidden max-w-[40ch] text-on-photo/90 md:block">{lp.lead}</p>
                <ul className="mt-6 space-y-3 md:mt-8">
                  {lp.bullets.map((b) => (
                    <li key={b} className="text-body flex gap-3"><span aria-hidden="true" className="text-brand">—</span>{b}</li>
                  ))}
                </ul>
                <p className="caps mt-10 text-on-photo/70">Работы — от 20 000 ₽/м² · дизайн-проект — от 3 000 ₽/м²</p>
              </div>
              <div id="quiz" className="scroll-mt-24 md:col-span-6">
                <Quiz questions={lp.quiz} estimate={lp.estimate} source="lp:new-build:quiz" />
              </div>
            </Grid>
          </Container>
        </section>

        {/* Цифры */}
        <Section className="py-12 md:py-16">
          <Container>
            <dl className="grid grid-cols-2 gap-x-gutter gap-y-10 md:grid-cols-4">
              {home.facts.map((f) => (
                <div key={f.label} className="border-t border-border pt-5">
                  <dt className="t-statement">{f.value}</dt>
                  <dd className="text-small mt-2 text-muted-foreground">{f.label}</dd>
                </div>
              ))}
            </dl>
          </Container>
        </Section>

        {/* Объекты в ЖК — главное доказательство для премиального клиента */}
        <Section>
          <Container>
            <SectionHead label="Объекты" title={<>Квартиры в новых ЖК, <em>которые мы сделали</em></>} aside="Гаринский, Тринити, Клевер Парк, Радищева 31 — дизайн-проект, ремонт и мебель одной командой." />
            <div className="grid grid-cols-1 gap-x-gutter gap-y-12 md:grid-cols-2">
              {cases.map((c, i) => <CaseCard key={c.slug} c={c} index={`(0${i + 1})`} className={i % 2 === 1 ? "md:mt-16" : ""} />)}
            </div>
          </Container>
        </Section>

        {/* Почему с нами спокойно */}
        <Section>
          <Container>
            <Grid>
              <p className="caps pt-[0.6em] text-muted-foreground md:col-span-3">Почему мы</p>
              <H2 className="md:col-span-9 md:col-start-4">Ремонт, которым <em>не нужно руководить</em></H2>
              <ul className="grid grid-cols-1 gap-x-gutter md:col-span-9 md:col-start-4 md:mt-16 md:grid-cols-3">
                {lp.pains.map((p) => (
                  <li key={p.title} className="border-t border-border pt-5 pb-10">
                    <h3 className="t-lead">{p.title}</h3>
                    <p className="text-small mt-3 text-earth">{p.text}</p>
                  </li>
                ))}
              </ul>
            </Grid>
          </Container>
        </Section>

        {/* Тарифы */}
        <Section>
          <Container>
            <SectionHead label="Стоимость" title={<>Три тарифа — <em>цена за м² работ</em></>} aside={`${tariffCommon} Точную смету фиксируем в договоре после бесплатного замера.`} />
            <TariffTable />
            <a href="#quiz" data-goal="cta_tariffs" className={`${btnPrimary} mt-10`}>Рассчитать мою квартиру <span aria-hidden="true">→</span></a>
          </Container>
        </Section>

        {/* Этапы */}
        <Section>
          <Container>
            <SectionHead label="Как работаем" title={<>От ключей <em>до переезда</em></>} />
            <ol className="grid grid-cols-1 gap-x-5 sm:grid-cols-2 md:grid-cols-5">
              {lp.steps.map((p, i) => (
                <li key={p.title} className="border-t border-border pt-5 pb-10">
                  <span className="text-small font-mono text-brand">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="t-lead mt-3">{p.title}</h3>
                  <p className="text-small mt-2 text-earth">{p.text}</p>
                </li>
              ))}
            </ol>
          </Container>
        </Section>

        {/* Договор */}
        <Section>
          <Container>
            <Grid>
              <p className="caps pt-[0.6em] text-muted-foreground md:col-span-3">Договор</p>
              <H2 className="md:col-span-9 md:col-start-4">Что <em>закреплено</em> в договоре</H2>
              <dl className="grid grid-cols-1 gap-x-gutter md:col-span-9 md:col-start-4 md:mt-16 md:grid-cols-2">
                {home.contract.map((c) => (
                  <div key={c.title} className="border-t border-border pt-5 pb-10">
                    <dt className="t-lead">{c.title}</dt>
                    <dd className="text-small mt-3 text-earth">{c.text}</dd>
                  </div>
                ))}
              </dl>
            </Grid>
          </Container>
        </Section>

        {/* Вопросы */}
        <Section>
          <Container>
            <Grid>
              <p className="caps pt-[0.6em] text-muted-foreground md:col-span-3">Вопросы</p>
              <H2 className="md:col-span-9 md:col-start-4">Частые <em>вопросы</em></H2>
              <FaqList items={lpFaq} className="md:col-span-9 md:col-start-4 md:mt-16" />
            </Grid>
          </Container>
        </Section>

        <CtaSection source="lp:new-build:cta" title={<>Замер и смета для вашей новостройки — <em>бесплатно</em></>} />
      </main>
    </>
  );
}
