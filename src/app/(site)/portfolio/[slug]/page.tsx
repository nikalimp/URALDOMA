import Link from "next/link";
import { notFound } from "next/navigation";
import { cases, caseBySlug, casePhoto, caseReady } from "@/content/cases";
import { complexBySlug } from "@/content/complexes";
import { Container, Grid, Section, Label, linkArrow } from "@/components/container";
import { Crumbs } from "@/components/crumbs";
import { CaseCard } from "@/components/case-card";
import { CtaSection } from "@/components/cta";
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

export default async function CasePage({ params }: { params: Promise<{ slug: string }> }) {
  const c = caseBySlug((await params).slug);
  if (!c) notFound();
  const photos = Array.from({ length: c.photos }, (_, i) => casePhoto(c, i + 1));
  const cx = c.complex ? complexBySlug(c.complex) : undefined;
  const more = cases.filter((x) => x.slug !== c.slug && x.kind === c.kind).slice(0, 3);
  const path = `/portfolio/${c.slug}/`;

  return (
    <>
      <JsonLd data={graph(caseSchema({ ...c, photos }), breadcrumbs([{ name: "Главная", path: "/" }, { name: "Портфолио", path: "/portfolio/" }, { name: c.title, path }]))} />
      <Container className="pt-10 pb-12 md:pt-14 md:pb-16">
        <Crumbs items={[{ name: "Главная", path: "/" }, { name: "Портфолио", path: "/portfolio/" }, { name: c.title }]} />
        <Grid className="items-end">
          <div className="md:col-span-8">
            <p className="label-mono mb-6 text-brand">{c.place}</p>
            <h1 className="text-[40px] leading-[1.02] font-medium tracking-[-0.035em] text-balance md:text-[72px]">{c.title}</h1>
          </div>
          <p className="text-[18px] text-earth md:col-span-4">{c.summary}</p>
        </Grid>
        <dl className="mt-12 grid grid-cols-2 border-t border-foreground md:grid-cols-4">
          {[["Объект", c.kind], ["Площадь", c.area && `${c.area} м²`], ["Тариф", c.tariff], ["Срок", c.term]].filter(([, v]) => v).map(([k, v]) => (
            <div key={k} className="border-b border-border py-5 pr-4">
              <dt className="label-mono text-muted-foreground">{k}</dt>
              <dd className="mt-2 text-[20px] font-medium">{v}</dd>
            </div>
          ))}
        </dl>
      </Container>

      <Container>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {photos.map((p, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={p} src={p} alt={i === Number(c.cover) - 1 ? c.alt : `${c.title} — фото ${i + 1}`} loading={i < 2 ? "eager" : "lazy"} decoding="async" className={`w-full bg-secondary object-cover ${i % 3 === 0 ? "aspect-[16/10] md:col-span-2" : "aspect-[4/5]"}`} />
          ))}
        </div>
      </Container>

      <Section>
        <Container>
          <Grid>
            <div className="md:col-span-4"><Label n="01">Решения</Label><h2 className="text-[34px] leading-tight font-medium tracking-[-0.03em]">Что сделали</h2></div>
            <ul className="border-t border-foreground md:col-span-7 md:col-start-6">
              {c.solutions.map((s) => <li key={s} className="border-b border-border py-5 text-[19px]">{s}</li>)}
            </ul>
          </Grid>
          {cx && (
            <p className="mt-12"><Link href={`/complexes/${cx.slug}/`} className={linkArrow}>Особенности ремонта в {cx.name} <span aria-hidden="true">→</span></Link></p>
          )}
        </Container>
      </Section>

      {more.length > 0 && (
        <Section className="border-t border-border">
          <Container>
            <Label>Другие объекты</Label>
            <div className="grid grid-cols-1 gap-6 gap-y-10 md:grid-cols-3">{more.map((m) => <CaseCard key={m.slug} c={m} />)}</div>
          </Container>
        </Section>
      )}
      <CtaSection source={`case:${c.slug}`} title="Хотите так же? Начнём с замера" />
    </>
  );
}
