import Link from "next/link";
import type { Metadata } from "next";
import { site } from "@/content/site";
import { home, about } from "@/content/home";
import { services, serviceBySlug, primaryServices } from "@/content/services";
import { tariffs, formatRub, tariffCommon } from "@/content/tariffs";
import { cases, caseBySlug, caseCover } from "@/content/cases";
import { Header } from "@/components/header";
import { Container, Grid, Section, SectionHead, Label, H2, linkArrow, btnPrimary, btnOutline } from "@/components/container";
import { LeadForm } from "@/components/lead-form";
import { ProcessBlueprint } from "@/components/process-blueprint";
import { CaseCard } from "@/components/case-card";
import { FaqList } from "@/components/faq";
import { CtaSection } from "@/components/cta";
import { JsonLd } from "@/components/json-ld";
import { faqSchema, graph, itemList } from "@/lib/schema";
import { getPosts } from "@/lib/posts";

export const metadata: Metadata = { title: { absolute: site.title }, description: site.description, alternates: { canonical: "/" } };

// Заголовок первого экрана в два тона: до тире — чёрным, после — серым (приём из PAMM)
const [h1a, h1b] = home.h1.split(/\s—\s/);
const heroMeta: [string, string][] = [
  ["Квартир под ключ", "110"],
  ["Цена работ", "от 20 000 ₽/м²"],
  ["Гарантия", "2 года"],
];

const featured = ["radishcheva-31", "obraztsovo", "trinity-14", "clover-park", "zapovednik", "garinsky"].map((s) => caseBySlug(s)!).filter(Boolean);

export default function Home() {
  const main = primaryServices.map((s) => serviceBySlug(s)!);
  const posts = getPosts().slice(0, 3);
  return (
    <>
      <Header />
      <main id="main" className="flex-1">
        {/* 1. Первый экран на весь экран (03-design §6): H1 во всю ширину, подписи по углам, видео с объекта до низа экрана, форма — карточкой на видео */}
        <section aria-label="Первый экран" className="flex min-h-[calc(100svh-64px)] flex-col md:min-h-[calc(100svh-72px)]">
          <Container className="pt-6 md:pt-8">
            <h1 className="caps-display text-[9.4vw] leading-[0.88] tracking-[-0.055em] md:text-[7.3vw]">
              <span className="block">{h1a}</span>
              {h1b?.split(/\s(?=до\s)/).map((part) => <span key={part} className="block text-muted-foreground md:whitespace-nowrap md:pl-[calc((100%+20px)/6)]">{part}</span>)}
            </h1>
            <Grid className="mt-6 gap-y-4 md:mt-8">
              <p className="caps text-muted-foreground md:col-span-3">[ с 2016 · Екатеринбург ]</p>
              <p className="max-w-[46ch] text-[16px] md:col-span-5 md:col-start-4">{home.lead} Дизайн-проект, ремонт с авторским надзором и мебель собственного производства — одна команда.</p>
              <ul className="caps text-muted-foreground md:col-span-3 md:col-start-10 md:text-right">
                {heroMeta.map(([k, v]) => <li key={k}>{k}: <span className="text-foreground">{v}</span></li>)}
              </ul>
            </Grid>
          </Container>
          <div className="relative mt-6 min-h-[56svh] flex-1 overflow-hidden bg-secondary md:mt-8">
            <video className="absolute inset-0 size-full object-cover" autoPlay muted loop playsInline preload="metadata" poster={site.heroVideo.poster} aria-hidden="true">
              <source src={site.heroVideo.src} type="video/mp4" />
            </video>
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
            <Container className="relative flex h-full min-h-[56svh] flex-col justify-end pb-5 md:pb-10">
              <Grid className="items-end">
                <p className="caps text-white/85 md:col-span-3">[ Видео · объект URALDOMA ]</p>
                <div className="bg-background p-5 md:col-span-4 md:col-start-9 md:p-6">
                  <p className="caps mb-4 text-muted-foreground">[ Бесплатный замер и смета ]</p>
                  <LeadForm source="hero" />
                </div>
              </Grid>
            </Container>
          </div>
        </section>

        {/* 2. Прямой ответ и цифры */}
        <section aria-label="Коротко о компании" className="border-b border-border">
          <Container>
            <Grid className="py-16 md:py-24">
              <p className="caps text-muted-foreground md:col-span-3">[ Коротко ]</p>
              <p className="text-[22px] leading-[1.35] tracking-[-0.01em] md:col-span-8 md:col-start-5 md:text-[28px]">{home.answer}</p>
            </Grid>
            <dl className="grid grid-cols-2 border-t border-border md:grid-cols-4">
              {home.facts.map((f, i) => (
                <div key={f.label} className={`py-8 pr-4 md:py-12 ${i % 2 ? "pl-4 md:pl-6" : "md:pl-6 md:first:pl-0"} ${i < home.facts.length - 1 ? "md:border-r" : ""} ${i % 2 === 0 ? "border-r md:border-r" : ""} ${i < 2 ? "border-b md:border-b-0" : ""} border-border`}>
                  <dt className="sr-only">{f.label}</dt>
                  <dd className="text-[48px] leading-none tracking-[-0.04em] md:text-[72px]">{f.value}</dd>
                  <dd className="mt-4 max-w-[22ch] text-[15px] text-muted-foreground">{f.label}</dd>
                </div>
              ))}
            </dl>
          </Container>
        </section>

        {/* 3. Полный цикл */}
        <Section>
          <Container>
            <Grid>
              <div className="md:col-span-4">
                <Label n="01">Полный цикл</Label>
                <H2>Одна команда от планировки до последней полки</H2>
              </div>
              <ol className="border-t border-foreground md:col-span-7 md:col-start-6">
                {home.cycle.map((c, i) => (
                  <li key={c.title} className="grid grid-cols-[48px_1fr] gap-x-6 gap-y-2 border-b border-border py-8 md:grid-cols-[80px_1fr_1.4fr]">
                    <span className="font-mono text-[14px] text-brand">{String(i + 1).padStart(2, "0")}</span>
                    <h3 className="text-[24px] tracking-[-0.01em] md:text-[26px]">{c.title}</h3>
                    <p className="col-start-2 text-[16px] text-earth md:col-start-3">{c.text}</p>
                  </li>
                ))}
              </ol>
            </Grid>
          </Container>
        </Section>

        {/* 4. Услуги */}
        <Section className="bg-secondary">
          <Container>
            <SectionHead n="02" label="Услуги" title="Что мы делаем" count={services.length + 1} aside={<Link href="/services/" className={linkArrow}>Все услуги <span aria-hidden="true">→</span></Link>} />
            <div className="border-t border-foreground">
              {main.map((s) => (
                <Link key={s.slug} href={`/services/${s.slug}/`} className="group grid grid-cols-[1fr_32px] items-baseline gap-x-6 gap-y-1 border-b border-foreground/15 py-6 md:grid-cols-[1fr_minmax(0,1fr)_auto_32px]">
                  <span className="text-[24px] tracking-[-0.015em] group-hover:text-brand md:text-[28px]">{s.title}</span>
                  <span className="hidden text-[15px] text-earth md:block">{s.short}</span>
                  <span className="col-start-1 text-[15px] text-muted-foreground md:col-start-auto">{s.priceFrom}</span>
                  <span aria-hidden="true" className="col-start-2 row-start-1 text-brand md:col-start-auto md:row-start-auto">→</span>
                </Link>
              ))}
              <Link href="/furniture/" className="group grid grid-cols-[1fr_32px] items-baseline gap-x-6 border-b border-foreground/15 py-6 md:grid-cols-[1fr_minmax(0,1fr)_auto_32px]">
                <span className="text-[24px] tracking-[-0.015em] group-hover:text-brand md:text-[28px]">Мебель на заказ «Мебель-Урал»</span>
                <span className="hidden text-[15px] text-earth md:block">Кухни, островки, столешницы и мебель в стиле лофт на своём производстве.</span>
                <span className="col-start-1 text-[15px] text-muted-foreground md:col-start-auto">своё производство</span>
                <span aria-hidden="true" className="col-start-2 row-start-1 text-brand md:col-start-auto md:row-start-auto">→</span>
              </Link>
            </div>
          </Container>
        </Section>

        {/* 5. Как проходит ремонт — чертёж */}
        <section aria-label="Как проходит ремонт" className="bg-inverse py-16 text-inverse-muted md:py-24">
          <Container>
            <Grid className="mb-12 items-end">
              <div className="md:col-span-6">
                <Label n="03" className="text-inverse-muted">Как проходит ремонт</Label>
                <H2 className="text-inverse-foreground">Шесть стадий. Каждая — в графике договора</H2>
              </div>
              <p className="text-[17px] md:col-span-5 md:col-start-8">Выберите стадию — квартира на чертеже соберётся до неё. Дважды в неделю присылаем фото и видео с объекта.</p>
            </Grid>
            <ProcessBlueprint />
            <Link href="/how-we-work/" className="mt-8 inline-flex items-center gap-2 border-b border-current pb-0.5 text-inverse-foreground hover:text-brand">Подробно о каждом этапе <span aria-hidden="true">→</span></Link>
          </Container>
        </section>

        {/* 6. Тарифы */}
        <Section>
          <Container>
            <SectionHead n="04" label="Тарифы" title="Цена за м² работ — и полный состав в каждом тарифе" aside="Итог фиксируется в договоре после замера и не растёт, пока вы сами не поменяете объём работ." />
            <div className="grid grid-cols-1 border-t border-l border-border md:grid-cols-3">
              {tariffs.map((t) => (
                <div key={t.id} className={`flex flex-col border-r border-b border-border p-6 md:p-8 ${t.id === "extended" ? "bg-foreground text-background" : ""}`}>
                  <p className={`label-mono ${t.id === "extended" ? "opacity-70" : "text-muted-foreground"}`}>{t.name}{t.id === "extended" && " · выбирают чаще"}</p>
                  <p className="mt-6 text-[48px] leading-none tracking-[-0.04em] md:text-[56px]">{formatRub(t.rate)}</p>
                  <p className={`mt-2 text-[14px] ${t.id === "extended" ? "opacity-70" : "text-muted-foreground"}`}>за м² работ</p>
                  <ul className="mt-8 space-y-3 text-[16px]">
                    {t.highlights.map((h) => <li key={h} className={`border-t pt-3 ${t.id === "extended" ? "border-current/20" : "border-border"}`}>{h}</li>)}
                  </ul>
                </div>
              ))}
            </div>
            <p className="mt-4 text-[14px] text-muted-foreground">{tariffCommon}</p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/prices/#calculator" className={btnPrimary}>Посчитать свою квартиру <span aria-hidden="true">→</span></Link>
              <Link href="/prices/" className={btnOutline}>Что входит в каждый тариф</Link>
            </div>
          </Container>
        </Section>

        {/* 7. Портфолио: три объекта на весь экран (Craft Studio), остальные — сеткой по колонкам (Architecture) */}
        <section aria-label="Портфолио" className="pt-16 md:pt-28">
          <Container>
            <SectionHead n="05" label="Портфолио" title="Ремонты в ЖК и посёлках Екатеринбурга" count={cases.length} aside={<Link href="/portfolio/" className={linkArrow}>Все объекты <span aria-hidden="true">→</span></Link>} />
          </Container>
          {featured.slice(0, 3).map((c, i) => (
            <Link key={c.slug} href={`/portfolio/${c.slug}/`} className="group relative block h-[88svh] min-h-[520px] overflow-hidden md:h-[100svh]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={caseCover(c)} alt={c.alt} loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover transition-transform duration-[1.2s] group-hover:scale-[1.02]" />
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-black/20" />
              <Container className="relative flex h-full flex-col justify-between py-5 text-white md:py-10">
                <div className="caps flex justify-between text-white/85"><span>[ {c.kind} ]</span><span>({String(i + 1).padStart(2, "0")})</span></div>
                <Grid className="items-end">
                  <p className="text-[48px] leading-[0.9] tracking-[-0.05em] md:col-span-8 md:text-[clamp(64px,8vw,140px)]">{c.place}</p>
                  <p className="max-w-[36ch] text-[15px] text-white/90 md:col-span-3 md:col-start-10">{c.summary}</p>
                </Grid>
              </Container>
            </Link>
          ))}
          <Container className="py-16 md:py-24">
            <Grid className="gap-y-12">
              {featured.slice(3, 6).map((c, i) => <CaseCard key={c.slug} c={c} className={i === 1 ? "md:col-span-4 md:mt-24" : "md:col-span-4"} />)}
            </Grid>
          </Container>
        </section>

        {/* 8. Договор: крупные номера по колонкам (Studio — «01 Advantage») */}
        <Section>
          <Container>
            <SectionHead n="06" label="Договор" title="Всё записано до начала работ" aside={<Link href="/warranty/" className={linkArrow}>Гарантия и договор <span aria-hidden="true">→</span></Link>} />
            <dl className="grid grid-cols-1 gap-x-5 md:grid-cols-4">
              {home.contract.map((c, i) => (
                <div key={c.title} className="border-t border-foreground pt-4 pb-10">
                  <span aria-hidden="true" className="block text-[96px] leading-[0.8] tracking-[-0.06em] md:text-[clamp(96px,9vw,160px)]">{String(i + 1).padStart(2, "0")}</span>
                  <dt className="mt-6 text-[22px] tracking-[-0.01em]">{c.title}</dt>
                  <dd className="mt-3 max-w-[34ch] text-[15px] text-earth">{c.text}</dd>
                </div>
              ))}
            </dl>
          </Container>
        </Section>

        {/* 9. Директор */}
        <section aria-label="Команда" className="bg-secondary">
          <Container className="py-16 md:py-24">
            <Grid className="items-end">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/team/nikolay.webp" alt={`${site.person.name}, директор URALDOMA`} width={600} height={900} loading="lazy" className="aspect-[4/5] w-full object-cover md:col-span-4" />
              <div className="md:col-span-7 md:col-start-6">
                <Label n="07">Команда</Label>
                <blockquote className="text-[28px] leading-[1.2] tracking-[-0.02em] text-balance md:text-[44px]">«{about.quote}»</blockquote>
                <div className="mt-10 flex flex-wrap items-end justify-between gap-6 border-t border-foreground pt-6">
                  <div>
                    <p className="text-[18px] font-medium">{site.person.name}</p>
                    <p className="text-[15px] text-muted-foreground">директор URALDOMA</p>
                  </div>
                  <Link href="/about/" className={linkArrow}>Вся команда <span aria-hidden="true">→</span></Link>
                </div>
              </div>
            </Grid>
          </Container>
        </section>

        {/* 10. Статьи */}
        {posts.length > 0 && (
          <Section>
            <Container>
              <SectionHead n="08" label="Статьи" title="Разбираем ремонт по шагам" count={getPosts().length} aside={<Link href="/articles/" className={linkArrow}>Все статьи <span aria-hidden="true">→</span></Link>} />
              <ul className="grid grid-cols-1 border-t border-foreground md:grid-cols-3">
                {posts.map((p) => (
                  <li key={p.slug} className="border-b border-border md:border-r md:last:border-r-0">
                    <Link href={`/articles/${p.slug}/`} className="group block py-8 md:px-6 md:first:pl-0">
                      <h3 className="text-[22px] leading-snug group-hover:text-brand">{p.title}</h3>
                      <p className="mt-3 text-[15px] text-muted-foreground">{p.description}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </Container>
          </Section>
        )}

        {/* 11. FAQ */}
        <Section className="border-t border-border">
          <Container>
            <Grid>
              <div className="md:col-span-4">
                <Label n="09">Вопросы</Label>
                <H2>Частые вопросы</H2>
              </div>
              <FaqList items={home.faq} className="md:col-span-7 md:col-start-6" />
            </Grid>
          </Container>
        </Section>

        <CtaSection source="home" />
      </main>
      <JsonLd data={graph(faqSchema(home.faq), itemList("Услуги URALDOMA", services.map((s) => ({ name: s.title, path: `/services/${s.slug}/` }))))} />
    </>
  );
}
