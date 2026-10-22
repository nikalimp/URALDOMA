import Link from "next/link";
import { notFound } from "next/navigation";
import { services, serviceBySlug } from "@/content/services";
import { cases } from "@/content/cases";
import { Container, Grid, Section, SectionHead, Label, H2, linkArrow } from "@/components/container";
import { PageHead } from "@/components/page-head";
import { FaqList } from "@/components/faq";
import { CtaSection } from "@/components/cta";
import { CaseCard } from "@/components/case-card";
import { TariffTable } from "@/components/tariff-table";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbs, faqSchema, graph, serviceSchema } from "@/lib/schema";
import { getPosts } from "@/lib/posts";
import { pageMeta } from "@/lib/meta";
import { pic } from "@/content/photos";

export const dynamicParams = false;
export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const s = serviceBySlug((await params).slug);
  if (!s) return {};
  return pageMeta({ title: s.metaTitle, description: s.metaDescription, path: `/services/${s.slug}/`, image: `${pic(s.cover).base}.webp` });
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const s = serviceBySlug((await params).slug);
  if (!s) notFound();
  const path = `/services/${s.slug}/`;
  const posts = getPosts().filter((p) => s.articles.includes(p.slug));
  const related = s.related.map((r) => serviceBySlug(r)).filter((x) => x !== undefined);
  const examples = cases.filter((c) => c.kind !== "коммерция").slice(0, 3);
  let n = 0;
  const num = () => String(++n).padStart(2, "0");

  return (
    <>
      <JsonLd data={graph(serviceSchema(s), faqSchema(s.faq), breadcrumbs([{ name: "Главная", path: "/" }, { name: "Услуги", path: "/services/" }, { name: s.title, path }]))} />
      <PageHead crumbs={[{ name: "Главная", path: "/" }, { name: "Услуги", path: "/services/" }, { name: s.title }]} h1={s.h1} answer={s.answer} eyebrow={s.priceFrom} photo={s.cover}>
        <a href="#lead" className={`${linkArrow} mt-6`}>Бесплатный замер <span aria-hidden="true">→</span></a>
      </PageHead>

      <Section className="pt-0 md:pt-0">
        <Container>
          <Grid>
            <p className="caps pt-[0.6em] text-muted-foreground md:col-span-3">Кому подходит</p>
              <H2 className="md:col-span-9 md:col-start-4">Когда это <em>ваш вариант</em></H2>
            <ul className="border-t border-border md:col-span-9 md:col-start-4 md:mt-16">
              {s.forWhom.map((f) => <li key={f} className="t-lead border-b border-border py-5">{f}</li>)}
            </ul>
          </Grid>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHead n={num()} label="Что входит" title={<>Что входит <em>в работу</em></>} />
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2 md:grid-cols-12">
            {s.includes.map((it, i) => (
              <div key={it.title} className="reveal border-t border-border pt-5 pb-12 md:col-span-4">
                <span className="caps text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="t-lead mt-5">{it.title}</h3>
                <p className="text-small mt-3 max-w-[40ch] text-earth">{it.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHead n={num()} label="Стоимость" title={<>Сколько <em>стоит</em></>} aside={`Срок: ${s.timeline}. Цена работ фиксируется в договоре после бесплатного замера.`} />
          {s.showTariffs ? (
            <TariffTable />
          ) : (
            <table className="w-full border-t border-border text-left">
              <caption className="sr-only">Цены: {s.title}</caption>
              <tbody>
                {s.prices.map((p) => (
                  <tr key={p.name} className="border-b border-border">
                    <th scope="row" className="t-lead py-5 pr-4">{p.name}</th>
                    <td className="t-lead py-5 pr-4 whitespace-nowrap">{p.value}</td>
                    <td className="text-small hidden py-5 text-muted-foreground md:table-cell">{p.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <Link href="/prices/#calculator" className={`${linkArrow} mt-8`}>Рассчитать стоимость <span aria-hidden="true">→</span></Link>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHead n={num()} label="Как работаем" title={<>Как проходит <em>работа</em></>} />
          <ol className="grid grid-cols-1 gap-x-5 sm:grid-cols-2 md:grid-cols-4">
            {s.process.map((p, i) => (
              <li key={p.title} className="border-t border-border pt-5 pb-10">
                <span className="text-small font-mono text-brand">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="t-lead mt-3">{p.title}</h3>
                <p className="text-small mt-2 text-earth">{p.text}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHead n={num()} label="Портфолио" title={<>Наши <em>объекты</em></>} aside={<Link href="/portfolio/" className={linkArrow}>Все объекты <span aria-hidden="true">→</span></Link>} />
          <div className="grid grid-cols-1 gap-x-5 gap-y-12 md:grid-cols-3">
            {examples.map((c, i) => <CaseCard key={c.slug} c={c} index={`(0${i + 1})`} className={i === 1 ? "md:mt-16" : ""} />)}
          </div>
        </Container>
      </Section>

      {s.faq.length > 0 && (
        <Section>
          <Container>
            <Grid>
              <p className="caps pt-[0.6em] text-muted-foreground md:col-span-3">Вопросы</p>
              <H2 className="md:col-span-9 md:col-start-4">Частые <em>вопросы</em></H2>
              <FaqList items={s.faq} className="md:col-span-9 md:col-start-4 md:mt-16" />
            </Grid>
          </Container>
        </Section>
      )}

      {(related.length > 0 || posts.length > 0) && (
        <Section>
          <Container>
            <Grid>
              {related.length > 0 && (
                <nav aria-label="Связанные услуги" className="md:col-span-5">
                  <Label>Ещё услуги</Label>
                  <ul className="border-t border-border">
                    {related.map((r) => (
                      <li key={r.slug}><Link href={`/services/${r.slug}/`} className="t-lead flex justify-between border-b border-border py-4 hover:text-brand">{r.title}<span aria-hidden="true" className="text-brand">→</span></Link></li>
                    ))}
                  </ul>
                </nav>
              )}
              {posts.length > 0 && (
                <nav aria-label="Статьи по теме" className="md:col-span-6 md:col-start-7">
                  <Label>Статьи по теме</Label>
                  <ul className="border-t border-border">
                    {posts.map((p) => (
                      <li key={p.slug}><Link href={`/articles/${p.slug}/`} className="t-lead flex justify-between gap-4 border-b border-border py-4 hover:text-brand">{p.title}<span aria-hidden="true" className="text-brand">→</span></Link></li>
                    ))}
                  </ul>
                </nav>
              )}
            </Grid>
          </Container>
        </Section>
      )}

      <CtaSection source={`service:${s.slug}`} />
    </>
  );
}
