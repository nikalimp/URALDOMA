import Link from "next/link";
import { notFound } from "next/navigation";
import { cases, caseBySlug, casePhoto, caseReady } from "@/content/cases";
import { complexBySlug } from "@/content/complexes";
import { picsOf } from "@/content/photos";
import { Container, Grid, Section, Label, H2, linkArrow } from "@/components/container";
import { Crumbs } from "@/components/crumbs";
import { CaseCard } from "@/components/case-card";
import { CtaSection } from "@/components/cta";
import { Img } from "@/components/photo";
import { PhotoStory } from "@/components/photo-story";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbs, caseSchema, graph } from "@/lib/schema";
import { pageMeta } from "@/lib/meta";

export const dynamicParams = false;
export function generateStaticParams() {
  return cases.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const c = caseBySlug((await params).slug);
  if (!c) return {};
  // Пока нет площади, тарифа и срока, кейс закрыт от индексации (стандарт §2: от 250 слов)
  return pageMeta({
    noindex: !caseReady(c),
    title: `${c.title}: фото ремонта`,
    description: (() => { const base = `${c.title}: ремонт под ключ от URALDOMA в Екатеринбурге. ${c.solutions.slice(0, 2).join(", ")}.`; const d = `${base} Фото объекта и решения.`; return d.length <= 160 ? d : base.length <= 160 ? base : `${c.title}: ремонт под ключ от URALDOMA в Екатеринбурге. Фото объекта, решения и материалы.`; })(),
    path: `/portfolio/${c.slug}/`,
    image: casePhoto(c, c.cover),
  });
}

// Страница объекта — журнальный материал: заголовок, обложка на весь экран, вводка, фотоистория, решения.
export default async function CasePage({ params }: { params: Promise<{ slug: string }> }) {
  const c = caseBySlug((await params).slug);
  if (!c) notFound();
  const pics = picsOf(c.slug);
  const cover = pics.find((p) => p.key.endsWith(`/${c.cover}`) && p.wide) ?? pics.find((p) => p.wide) ?? pics[Number(c.cover) - 1];
  const story = pics.filter((p) => p.key !== cover.key);
  const photos = pics.map((p) => `${p.base}.webp`);
  const cx = c.complex ? complexBySlug(c.complex) : undefined;
  const more = cases.filter((x) => x.slug !== c.slug && x.kind === c.kind).slice(0, 3);
  const path = `/portfolio/${c.slug}/`;
  const facts = [["Объект", c.kind], ["Площадь", c.area && `${c.area} м²`], ["Тариф", c.tariff], ["Срок", c.term], ["Фото", `${pics.length} кадров`]].filter(([, v]) => v);

  return (
    <>
      <JsonLd data={graph(caseSchema({ ...c, photos }), breadcrumbs([{ name: "Главная", path: "/" }, { name: "Портфолио", path: "/portfolio/" }, { name: c.title, path }]))} />
      <Container className="pt-12 pb-20 md:pt-16 md:pb-32">
        <Crumbs items={[{ name: "Главная", path: "/" }, { name: "Портфолио", path: "/portfolio/" }, { name: c.title }]} />
        <Grid className="items-end">
          <div className="md:col-span-10">
            <p className="caps mb-6 text-muted-foreground">{c.place}</p>
            <h1 className="t-title">{c.title}</h1>
          </div>
        </Grid>
      </Container>

      <figure>
        <div className="relative h-[72svh] min-h-[400px] overflow-hidden bg-secondary md:h-[92svh]"><Img p={cover} eager wide alt={c.alt} sizes="100vw" className="parallax" /></div>
        <Container><figcaption className="caps mt-3 flex justify-between gap-6 text-muted-foreground"><span>{cover.caption}</span><span>{c.place}</span></figcaption></Container>
      </figure>

      <Section>
        <Container>
          <Grid>
            <p className="caps text-muted-foreground md:col-span-3">Об объекте</p>
            <p className="t-lead md:col-span-7 md:col-start-4">{c.summary}</p>
          </Grid>
          <dl className="mt-14 grid grid-cols-2 gap-x-5 md:grid-cols-12">
            {facts.map(([k, v]) => (
              <div key={k} className="border-t border-border pt-3 pb-6 md:col-span-3">
                <dt className="caps text-muted-foreground">{k}</dt>
                <dd className="t-lead mt-2">{v}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </Section>

      <PhotoStory pics={story} start={2} />

      <Section>
        <Container>
          <Grid>
            <p className="caps pt-[0.6em] text-muted-foreground md:col-span-3">Решения</p>
              <H2 className="md:col-span-9 md:col-start-4">Что <em>сделали</em></H2>
            <ol className="md:col-span-9 md:col-start-4 md:mt-16">
              {c.solutions.map((s, i) => (
                <li key={s} className="grid grid-cols-[56px_1fr] items-baseline gap-x-5 border-t border-border py-5 first:border-foreground">
                  <span className="caps text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                  <span className="t-lead">{s}</span>
                </li>
              ))}
            </ol>
          </Grid>
          {cx && (
            <p className="mt-12 md:pl-[calc((100%+20px)*5/12)]"><Link href={`/complexes/${cx.slug}/`} className={linkArrow}>Особенности ремонта в {cx.name} <span aria-hidden="true">→</span></Link></p>
          )}
        </Container>
      </Section>

      {more.length > 0 && (
        <Section>
          <Container>
            <Label>Другие объекты</Label>
            <div className="grid grid-cols-1 gap-x-5 gap-y-12 md:grid-cols-3">{more.map((m, i) => <CaseCard key={m.slug} c={m} className={i === 1 ? "md:mt-16" : ""} />)}</div>
          </Container>
        </Section>
      )}
      <CtaSection source={`case:${c.slug}`} title={<>Хотите так же? <em>Начнём с замера</em></>} photo={story[0]?.key ?? cover.key} />
    </>
  );
}
