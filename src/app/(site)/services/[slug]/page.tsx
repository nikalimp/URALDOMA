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

export const dynamicParams = false;
export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const s = serviceBySlug((await params).slug);
  if (!s) return {};
  return pageMeta({ title: s.metaTitle, description: s.metaDescription, path: `/services/${s.slug}/`, image: s.cover });
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
      <PageHead crumbs={[{ name: "Главная", path: "/" }, { name: "Услуги", path: "/services/" }, { name: s.title }]} h1={s.h1} answer={s.answer} eyebrow={s.priceFrom}>
        <a href="#lead" className={`${linkArrow} mt-6`}>Бесплатный замер <span aria-hidden="true">→</span></a>
      </PageHead>

      <Container>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={s.cover} alt={s.title} className="aspect-[16/9] w-full object-cover md:aspect-[21/9]" />
      </Container>

      <Section>
        <Container>
          <Grid>
            <div className="md:col-span-4">
              <Label n={num()}>Кому подходит</Label>
              <H2>Когда это ваш вариант</H2>
            </div>
            <ul className="border-t border-foreground md:col-span-7 md:col-start-6">
              {s.forWhom.map((f) => <li key={f} className="border-b border-border py-5 text-[19px]">{f}</li>)}
            </ul>
          </Grid>
        </Container>
      </Section>

      <Section className="bg-secondary">
        <Container>
          <SectionHead n={num()} label="Что входит" title="Что входит в работу" />
          <div className="grid grid-cols-1 border-t border-l border-foreground/15 sm:grid-cols-2 lg:grid-cols-3">
            {s.includes.map((it, i) => (
              <div key={it.title} className="border-r border-b border-foreground/15 p-6 md:p-8">
                <span className="font-mono text-[13px] text-brand">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-4 text-[22px] font-medium">{it.title}</h3>
                <p className="mt-3 text-[16px] text-earth">{it.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHead n={num()} label="Стоимость" title="Сколько стоит" aside={`Срок: ${s.timeline}. Цена работ фиксируется в договоре после бесплатного замера.`} />
          {s.showTariffs ? (
            <TariffTable />
          ) : (
            <table className="w-full border-t border-foreground text-left">
              <caption className="sr-only">Цены: {s.title}</caption>
              <tbody>
                {s.prices.map((p) => (
                  <tr key={p.name} className="border-b border-border">
                    <th scope="row" className="py-5 pr-4 text-[19px] font-medium">{p.name}</th>
                    <td className="py-5 pr-4 text-[19px] whitespace-nowrap">{p.value}</td>
                    <td className="hidden py-5 text-[15px] text-muted-foreground md:table-cell">{p.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <Link href="/prices/#calculator" className={`${linkArrow} mt-8`}>Рассчитать стоимость <span aria-hidden="true">→</span></Link>
        </Container>
      </Section>

      <Section className="border-t border-border">
        <Container>
          <SectionHead n={num()} label="Как работаем" title="Как проходит работа" />
          <ol className="grid grid-cols-1 border-t border-foreground md:grid-cols-4">
            {s.process.map((p, i) => (
              <li key={p.title} className="border-b border-border py-6 md:border-r md:px-6 md:first:pl-0 md:last:border-r-0">
                <span className="font-mono text-[13px] text-brand">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 text-[20px] font-medium">{p.title}</h3>
                <p className="mt-2 text-[15px] text-earth">{p.text}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section className="bg-card">
        <Container>
          <SectionHead n={num()} label="Портфолио" title="Наши объекты" aside={<Link href="/portfolio/" className={linkArrow}>Все объекты <span aria-hidden="true">→</span></Link>} />
          <div className="grid grid-cols-1 gap-6 gap-y-10 md:grid-cols-3">
            {examples.map((c) => <CaseCard key={c.slug} c={c} />)}
          </div>
        </Container>
      </Section>

      {s.faq.length > 0 && (
        <Section>
          <Container>
            <Grid>
              <div className="md:col-span-4">
                <Label n={num()}>Вопросы</Label>
                <H2>Частые вопросы</H2>
              </div>
              <FaqList items={s.faq} className="md:col-span-7 md:col-start-6" />
            </Grid>
          </Container>
        </Section>
      )}

      {(related.length > 0 || posts.length > 0) && (
        <Section className="border-t border-border">
          <Container>
            <Grid>
              {related.length > 0 && (
                <nav aria-label="Связанные услуги" className="md:col-span-5">
                  <Label>Ещё услуги</Label>
                  <ul className="border-t border-foreground">
                    {related.map((r) => (
                      <li key={r.slug}><Link href={`/services/${r.slug}/`} className="flex justify-between border-b border-border py-4 text-[19px] hover:text-brand">{r.title}<span aria-hidden="true" className="text-brand">→</span></Link></li>
                    ))}
                  </ul>
                </nav>
              )}
              {posts.length > 0 && (
                <nav aria-label="Статьи по теме" className="md:col-span-6 md:col-start-7">
                  <Label>Статьи по теме</Label>
                  <ul className="border-t border-foreground">
                    {posts.map((p) => (
                      <li key={p.slug}><Link href={`/articles/${p.slug}/`} className="flex justify-between gap-4 border-b border-border py-4 text-[19px] hover:text-brand">{p.title}<span aria-hidden="true" className="text-brand">→</span></Link></li>
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
