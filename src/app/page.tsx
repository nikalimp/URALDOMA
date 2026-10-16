import Link from "next/link";
import type { Metadata } from "next";
import { site } from "@/content/site";
import { home, about } from "@/content/home";
import { services, serviceBySlug, primaryServices } from "@/content/services";
import { tariffs, formatRub, tariffCommon } from "@/content/tariffs";
import { cases, caseBySlug } from "@/content/cases";
import { pic } from "@/content/photos";
import { Header } from "@/components/header";
import { Container, Grid, Section, SectionHead, Label, H2, Marquee, linkArrow, btnPrimary, btnOutline, btnOnPhoto } from "@/components/container";
import { LeadForm } from "@/components/lead-form";
import { ProcessBlueprint } from "@/components/process-blueprint";
import { CaseCard } from "@/components/case-card";
import { FaqList } from "@/components/faq";
import { CtaSection } from "@/components/cta";
import { Img, Photo } from "@/components/photo";
import { RailControls, Spotlight, Ticker } from "@/components/motion";
import { JsonLd } from "@/components/json-ld";
import { faqSchema, graph, itemList } from "@/lib/schema";
import { getPosts } from "@/lib/posts";

export const metadata: Metadata = { title: { absolute: site.title }, description: site.description, alternates: { canonical: "/" } };

// v5 «Журнал» (03-design §7): обложка-фото, бегущая строка объектов, услуги карточками с фото,
// развороты объектов на весь экран, лента деталей, чертёж стадий, тарифы, договор, директор, статьи, FAQ, заявка.
const [h1a, h1b] = home.h1.split(/\s—\s/);
const hero = pic("garinsky/02");
const coverLines: [string, string][] = [
  ["110", "квартир под ключ"],
  ["от 20 000 ₽", "за м² работ"],
  ["2 года", "гарантия"],
];
const spreads = [
  { slug: "radishcheva-31", photo: "radishcheva-31/04" },
  { slug: "obraztsovo", photo: "obraztsovo/06" },
  { slug: "trinity-14", photo: "trinity-14/11" },
].map((s) => ({ c: caseBySlug(s.slug)!, p: pic(s.photo) }));
const more = ["clover-park", "zapovednik", "garinsky"].map((s) => caseBySlug(s)!);
const details = ["obraztsovo/09", "radishcheva-31/06", "obraztsovo/01", "trinity-14/09", "clover-park/04", "radishcheva-31/02", "trinity-14/04", "obraztsovo/10", "garinsky-20/02", "zapovednik/06", "garinsky/06", "obraztsovo/08"].map(pic);
const places = ["ЖК «Гаринский»", "ЖК «Тринити»", "ЖК на Радищева", "ЖК «Клевер Парк»", "КП «Образцово»", "КП «Заповедник»", "Cosmotheca", "BoyCut"];
const isYear = (v: string) => /^(19|20)\d\d$/.test(v);

export default function Home() {
  const main = primaryServices.map((s) => serviceBySlug(s)!);
  const posts = getPosts().slice(0, 3);
  return (
    <>
      <Header />
      <main id="main" className="flex-1">
        {/* 1. Обложка: фото объекта на весь экран, H1 капсом + курсив с засечками, «анонсы» как на обложке журнала, форма — стеклянной карточкой */}
        <section aria-label="Первый экран" className="relative isolate flex min-h-[calc(100svh-64px)] flex-col overflow-hidden text-on-photo md:min-h-[calc(100svh-72px)]">
          <div className="absolute inset-0 -z-10 bg-cover-fill">
            {site.heroVideo.src ? (
              <video className="size-full object-cover" autoPlay muted loop playsInline preload="metadata" poster={site.heroVideo.poster} aria-hidden="true"><source src={site.heroVideo.src} type="video/mp4" /></video>
            ) : (
              <Img p={hero} eager wide sizes="100vw" className="kenburns" />
            )}
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-scrim/50 via-scrim/35 to-scrim/80 md:from-scrim/45 md:via-scrim/10 md:to-scrim/70" />
          </div>
          <Container className="flex flex-1 flex-col justify-between gap-16 pt-5 pb-5 md:pt-8 md:pb-10">
            <Grid className="caps gap-y-2 text-on-photo/85">
              <p className="md:col-span-3">[ С 2016 · Екатеринбург ]</p>
              <p className="hidden md:col-span-5 md:col-start-4 md:block">Дизайн-проект · ремонт · мебель — одна команда</p>
              <p className="label-tech md:col-span-4 md:col-start-9 md:text-right">(01) {hero.caption} · {hero.place}</p>
            </Grid>
            <div>
              <h1 className="caps-display text-[12vw] leading-[0.86] tracking-[-0.055em] md:text-[8.4vw]">
                <span className="block">{h1a}</span>
                <span className="sr-only"> — </span>
                <em className="block pt-[0.08em] text-[0.82em] leading-[0.95] md:pl-[calc((100%+20px)/4)]">{h1b}</em>
              </h1>
              <Grid className="mt-10 items-end md:mt-14">
                <div className="md:col-span-4">
                  <p className="max-w-[40ch] text-[17px] text-on-photo/90">{home.lead} Дизайн-проект, ремонт с авторским надзором и мебель собственного производства.</p>
                  <a href={site.cta.href} className={`${btnOnPhoto} mt-6 md:hidden`}>{site.cta.label}<span aria-hidden="true">→</span></a>
                </div>
                <ul className="md:col-span-3 md:col-start-5">
                  {coverLines.map(([v, l]) => (
                    <li key={l} className="flex items-baseline justify-between gap-4 border-t border-on-photo/40 py-2.5">
                      <span className="text-[22px] leading-none tracking-[-0.03em] md:text-[26px]">{v}</span>
                      <span className="text-right text-[12px] text-on-photo/75">{l}</span>
                    </li>
                  ))}
                </ul>
                <div className="beam glass hidden rounded-card p-6 text-foreground md:col-span-4 md:col-start-9 md:block">
                  <p className="caps mb-4 text-muted-foreground">[ Бесплатный замер и смета ]</p>
                  <LeadForm source="hero" />
                </div>
              </Grid>
            </div>
          </Container>
        </section>

        {/* 2. Бегущая строка: где мы работали */}
        <section aria-label="Объекты" className="border-b border-border py-6">
          <Marquee items={places.map((p, i) => (i % 2 ? <em key={p} className="serif">{p}</em> : p))} itemClassName="text-[28px] tracking-[-0.03em] md:text-[48px]" speed="55s" />
        </section>

        {/* 3. Прямой ответ (AEO), фото-деталь и цифры */}
        <section aria-label="Коротко о компании">
          <Container>
            <Grid className="py-16 md:py-28">
              <p className="caps text-muted-foreground md:col-span-3">[ Коротко ]</p>
              <p className="dropcap reveal text-[22px] leading-[1.35] tracking-[-0.01em] md:col-span-6 md:col-start-4 md:text-[30px]">{home.answer}</p>
              <Photo p={pic("obraztsovo/09")} index="Fig. 02" sizes="(min-width: 768px) 25vw, 100vw" className="md:col-span-3 md:col-start-10" />
            </Grid>
            <dl className="grid grid-cols-2 gap-x-5 md:grid-cols-4">
              {home.facts.map((f) => (
                <div key={f.label} className="border-t border-foreground pt-4 pb-12 md:pb-20">
                  <dt className="sr-only">{f.label}</dt>
                  <dd className="text-[56px] leading-none tracking-[-0.05em] md:text-[clamp(72px,7vw,128px)]">{isYear(f.value) ? f.value : <Ticker value={f.value} />}</dd>
                  <dd className="mt-4 max-w-[22ch] text-[15px] text-muted-foreground">{f.label}</dd>
                </div>
              ))}
            </dl>
          </Container>
        </section>

        {/* 4. Услуги — карточки с фото, по 3 колонки из 12 */}
        <Section className="pt-0 md:pt-0">
          <Container>
            <SectionHead n="02" label="Услуги" title={<>Что мы <em>делаем</em></>} count={services.length + 1} aside={<Link href="/services/" className={linkArrow}>Все услуги <span aria-hidden="true">→</span></Link>} />
            <Spotlight className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-12 md:gap-y-12">
              {main.map((s, i) => (
                <Link key={s.slug} href={`/services/${s.slug}/`} className="group reveal block md:col-span-3">
                  <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
                    <Img p={pic(s.cover)} alt={`${s.title}: ${pic(s.cover).alt}`} sizes="(min-width: 768px) 25vw, 50vw" className="transition-transform duration-[1.2s] ease-out group-hover:scale-[1.05]" />
                    <span className="label-tech absolute top-4 left-4 text-on-photo/90">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <div className="mt-3 border-t border-border pt-3">
                    <h3 className="flex items-baseline justify-between gap-3 text-[17px] leading-tight tracking-[-0.015em] group-hover:text-brand md:text-[21px]">{s.title}<span aria-hidden="true" className="text-brand transition-transform group-hover:translate-x-1">→</span></h3>
                    <p className="mt-1 text-[14px] text-muted-foreground">{s.priceFrom}</p>
                  </div>
                </Link>
              ))}
              <Link href="/furniture/" className="group reveal block md:col-span-3">
                <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
                  <Img p={pic("garinsky-21/05")} alt={`Мебель на заказ «Мебель-Урал»: ${pic("garinsky-21/05").alt}`} sizes="(min-width: 768px) 25vw, 50vw" className="transition-transform duration-[1.2s] ease-out group-hover:scale-[1.05]" />
                  <span className="label-tech absolute top-4 left-4 text-on-photo/90">07</span>
                </div>
                <div className="mt-3 border-t border-border pt-3">
                  <h3 className="flex items-baseline justify-between gap-3 text-[17px] leading-tight tracking-[-0.015em] group-hover:text-brand md:text-[21px]">Мебель на заказ<span aria-hidden="true" className="text-brand transition-transform group-hover:translate-x-1">→</span></h3>
                  <p className="mt-1 text-[14px] text-muted-foreground">своё производство «Мебель-Урал»</p>
                </div>
              </Link>
              <Link href="/services/" className="spotlight reveal flex aspect-[3/4] flex-col justify-between bg-panel p-4 text-panel-foreground md:col-span-3 md:p-6">
                <span className="label-tech text-panel-muted">08 · Все услуги</span>
                <span className="text-[22px] leading-[1] tracking-[-0.04em] md:text-[34px]">Ещё {services.length - main.length} услуги — <em className="serif">от новостройки до капитального</em></span>
                <span className="flex items-center justify-between border-t border-panel-line pt-3 text-[15px]">Смотреть все<span aria-hidden="true" className="text-brand">→</span></span>
              </Link>
            </Spotlight>
          </Container>
        </Section>

        {/* 5. Портфолио: три разворота на весь экран */}
        <section aria-label="Портфолио">
          <Container>
            <SectionHead n="03" label="Портфолио" title={<>Ремонты в ЖК и посёлках <em>Екатеринбурга</em></>} count={cases.length} aside={<Link href="/portfolio/" className={linkArrow}>Все объекты <span aria-hidden="true">→</span></Link>} />
          </Container>
          {spreads.map(({ c, p }, i) => (
            <Link key={c.slug} href={`/portfolio/${c.slug}/`} className="group relative isolate block h-[88svh] min-h-[560px] overflow-hidden md:h-[100svh]">
              <div className="absolute inset-0 -z-10 overflow-hidden bg-secondary">
                <Img p={p} wide sizes="100vw" className="parallax transition-transform duration-[1.4s] group-hover:scale-[1.02]" />
              </div>
              <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-scrim/65 via-scrim/0 to-scrim/25" />
              <Container className="flex h-full flex-col justify-between py-5 text-on-photo md:py-10">
                <div className="caps flex justify-between text-on-photo/85"><span>[ {c.kind} ]</span><span className="label-tech">({String(i + 1).padStart(2, "0")} / {String(spreads.length).padStart(2, "0")})</span></div>
                <Grid className="items-end">
                  <p className="text-[40px] leading-[0.92] tracking-[-0.05em] text-balance sm:text-[52px] md:col-span-8 md:text-[clamp(72px,8.6vw,156px)]">{c.place.split(",")[0]}{c.place.includes(",") && <em className="block text-[0.6em]">{c.place.split(",").slice(1).join(",").trim()}</em>}</p>
                  <div className="md:col-span-3 md:col-start-10">
                    <p className="max-w-[36ch] text-[15px] text-on-photo/90">{c.summary}</p>
                    <p className="label-tech mt-4 border-t border-on-photo/35 pt-3 text-on-photo/75">{p.caption}</p>
                  </div>
                </Grid>
              </Container>
            </Link>
          ))}
          <Container className="py-16 md:py-24">
            <Grid className="gap-y-12">
              {more.map((c, i) => <CaseCard key={c.slug} c={c} index={`(0${i + 4})`} className={i === 1 ? "md:col-span-4 md:mt-24" : "md:col-span-4"} />)}
            </Grid>
          </Container>
        </section>

        {/* 6. Лента деталей: прокрутка по кадрам */}
        <section aria-label="Детали" className="border-t border-border py-16 md:py-28">
          <Container>
            <Grid className="mb-10 items-end md:mb-14">
              <div className="md:col-span-8">
                <Label n="04">Детали</Label>
                <H2>Ремонт видно <em>в мелочах</em></H2>
              </div>
              <div className="flex md:col-span-4 md:col-start-9 md:justify-end"><RailControls target="details-rail" total={details.length} label="Детали" /></div>
            </Grid>
          </Container>
          <ul id="details-rail" className="rail auto-cols-[78%] gap-x-5 px-5 sm:auto-cols-[42%] md:auto-cols-[calc((100%-60px)/4)] md:px-10">
            {details.map((p, i) => (
              <li key={p.key}>
                <Photo p={p} link index={`Fig. ${String(i + 1).padStart(2, "0")}`} sizes="(min-width: 768px) 25vw, 80vw" />
              </li>
            ))}
          </ul>
        </section>

        {/* 7. Как проходит ремонт — чертёж на панели */}
        <section aria-label="Как проходит ремонт" className="bg-panel py-16 text-panel-muted md:py-28">
          <Container>
            <Grid className="mb-12 items-end md:mb-16">
              <div className="md:col-span-8">
                <Label n="05" className="text-panel-muted">Как проходит ремонт</Label>
                <H2 className="text-panel-foreground">Шесть стадий. Каждая — <em>в графике договора</em></H2>
              </div>
              <p className="text-[17px] md:col-span-4 md:col-start-9">Выберите стадию — квартира на чертеже соберётся до неё. Дважды в неделю присылаем фото и видео с объекта.</p>
            </Grid>
            <ProcessBlueprint />
            <Link href="/how-we-work/" className="mt-10 inline-flex items-center gap-2 border-b border-current pb-0.5 text-panel-foreground hover:text-brand">Подробно о каждом этапе <span aria-hidden="true">→</span></Link>
          </Container>
        </section>

        {/* 8. Тарифы: три колонки по 4 из 12, выделенный — на панели с лучом */}
        <Section>
          <Container>
            <SectionHead n="06" label="Тарифы" title={<>Цена за м² работ — <em>и полный состав</em> в каждом тарифе</>} aside="Итог фиксируется в договоре после замера и не растёт, пока вы сами не поменяете объём работ." />
            <Spotlight className="grid grid-cols-1 gap-x-5 gap-y-5 md:grid-cols-12">
              {tariffs.map((t) => {
                const hot = t.id === "extended";
                return (
                  <div key={t.id} className={`spotlight flex flex-col border-t p-6 md:col-span-4 md:p-8 ${hot ? "beam border-transparent bg-panel text-panel-foreground" : "border-foreground bg-card"}`}>
                    <p className="flex items-center justify-between label-mono text-muted-foreground"><span>{t.name}</span>{hot && <span className="tag border-brand/40 text-brand">выбирают чаще</span>}</p>
                    <p className="mt-8 text-[52px] leading-none tracking-[-0.05em] md:text-[64px]">{formatRub(t.rate)}</p>
                    <p className="mt-2 text-[14px] text-muted-foreground">за м² работ</p>
                    <ul className="mt-8 space-y-3 text-[16px]">
                      {t.highlights.map((h) => <li key={h} className="border-t border-border pt-3">{h}</li>)}
                    </ul>
                  </div>
                );
              })}
            </Spotlight>
            <p className="mt-4 text-[14px] text-muted-foreground">{tariffCommon}</p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/prices/#calculator" className={btnPrimary}>Посчитать свою квартиру <span aria-hidden="true">→</span></Link>
              <Link href="/prices/" className={btnOutline}>Что входит в каждый тариф</Link>
            </div>
          </Container>
        </Section>

        {/* 9. Договор: крупные номера по колонкам */}
        <Section className="border-t border-border">
          <Container>
            <SectionHead n="07" label="Договор" title={<>Всё записано <em>до начала работ</em></>} aside={<Link href="/warranty/" className={linkArrow}>Гарантия и договор <span aria-hidden="true">→</span></Link>} />
            <dl className="grid grid-cols-1 gap-x-5 sm:grid-cols-2 md:grid-cols-4">
              {home.contract.map((c, i) => (
                <div key={c.title} className="reveal border-t border-foreground pt-4 pb-10">
                  <span aria-hidden="true" className="block font-serif text-[96px] leading-[0.8] tracking-[-0.04em] text-brand italic md:text-[clamp(96px,9vw,168px)]">{String(i + 1).padStart(2, "0")}</span>
                  <dt className="mt-6 text-[22px] tracking-[-0.01em]">{c.title}</dt>
                  <dd className="mt-3 max-w-[34ch] text-[15px] text-earth">{c.text}</dd>
                </div>
              ))}
            </dl>
          </Container>
        </Section>

        {/* 10. Директор: портрет и цитата курсивом с засечками */}
        <section aria-label="Команда" className="bg-secondary">
          <Container className="py-16 md:py-28">
            <Grid className="items-end">
              <figure className="md:col-span-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/team/nikolay.webp" alt={`${site.person.name}, директор URALDOMA`} width={600} height={900} loading="lazy" decoding="async" className="aspect-[4/5] w-full object-cover grayscale" />
                <figcaption className="label-tech mt-3 text-muted-foreground">Fig. 03 · {site.person.name}</figcaption>
              </figure>
              <div className="md:col-span-7 md:col-start-6">
                <Label n="08">Команда</Label>
                <blockquote className="font-serif text-[32px] leading-[1.12] tracking-[-0.02em] text-balance italic md:text-[clamp(40px,3.6vw,64px)]">«{about.quote}»</blockquote>
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

        {/* 11. Статьи — карточки с обложками */}
        {posts.length > 0 && (
          <Section>
            <Container>
              <SectionHead n="09" label="Статьи" title={<>Разбираем ремонт <em>по шагам</em></>} count={getPosts().length} aside={<Link href="/articles/" className={linkArrow}>Все статьи <span aria-hidden="true">→</span></Link>} />
              <ul className="grid grid-cols-1 gap-x-5 gap-y-12 md:grid-cols-12">
                {posts.map((p) => (
                  <li key={p.slug} className="md:col-span-4">
                    <Link href={`/articles/${p.slug}/`} className="group block">
                      {p.cover && <div className="aspect-[4/3] overflow-hidden bg-secondary"><Img p={pic(p.cover)} sizes="(min-width: 768px) 33vw, 100vw" className="transition-transform duration-[1.2s] group-hover:scale-[1.04]" /></div>}
                      <h3 className="mt-4 border-t border-border pt-3 text-[22px] leading-snug tracking-[-0.01em] group-hover:text-brand">{p.title}</h3>
                      <p className="mt-2 text-[15px] text-muted-foreground">{p.description}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </Container>
          </Section>
        )}

        {/* 12. FAQ */}
        <Section className="border-t border-border">
          <Container>
            <Grid>
              <div className="md:col-span-4">
                <Label n="10">Вопросы</Label>
                <H2>Частые <em>вопросы</em></H2>
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
