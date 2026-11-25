import Link from "next/link";
import { notFound } from "next/navigation";
import { comparisons, compareBySlug } from "@/content/compare";
import { materialBySlug } from "@/content/materials";
import { serviceBySlug } from "@/content/services";
import { Container, Grid, Section, H2, linkArrow } from "@/components/container";
import { PageHead } from "@/components/page-head";
import { FaqList } from "@/components/faq";
import { CtaSection } from "@/components/cta";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbs, faqSchema, graph, techArticleSchema } from "@/lib/schema";
import { pageMeta } from "@/lib/meta";

export const dynamicParams = false;
export function generateStaticParams() {
  return comparisons.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const c = compareBySlug((await params).slug);
  if (!c) return {};
  return pageMeta({ title: c.metaTitle, description: c.metaDescription, path: `/compare/${c.slug}/` });
}

export default async function CompareDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const c = compareBySlug((await params).slug);
  if (!c) notFound();
  const path = `/compare/${c.slug}/`;
  const mats = c.relatedMaterials.map((s) => materialBySlug(s)).filter((x) => x !== undefined);
  const relCmp = c.relatedCompare.map((s) => compareBySlug(s)).filter((x) => x !== undefined);
  const srv = serviceBySlug(c.relatedService);

  return (
    <>
      <JsonLd
        data={graph(
          techArticleSchema({ path, title: c.h1, description: c.metaDescription }),
          c.faq.length ? faqSchema(c.faq) : null,
          breadcrumbs([
            { name: "Главная", path: "/" },
            { name: "База знаний", path: "/knowledge/" },
            { name: "Сравнения", path: "/compare/" },
            { name: c.h1, path },
          ]),
        )}
      />
      <PageHead
        crumbs={[
          { name: "Главная", path: "/" },
          { name: "Сравнения", path: "/compare/" },
          { name: c.h1 },
        ]}
        h1={c.h1}
        answer={c.answer}
      />

      <Section className="pt-0 md:pt-0">
        <Container>
          <div className="overflow-x-auto border-t border-foreground">
            <table className="w-full min-w-[600px] border-collapse text-left">
              <thead>
                <tr className="border-b border-border">
                  <th className="caps py-4 pr-4 text-muted-foreground">Критерий</th>
                  <th className="t-lead py-4 pr-4">{c.aName}</th>
                  <th className="t-lead py-4">{c.bName}</th>
                </tr>
              </thead>
              <tbody>
                {c.rows.map(([crit, a, b]) => (
                  <tr key={crit} className="border-b border-border align-top">
                    <td className="text-small py-4 pr-4 font-medium text-muted-foreground">{crit}</td>
                    <td className="text-small py-4 pr-4">{a}</td>
                    <td className="text-small py-4">{b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <Grid className="gap-y-10">
            <div className="border-t border-foreground pt-6 md:col-span-6">
              <p className="caps text-brand">Когда выбрать «{c.aName}»</p>
              <ul className="mt-4 border-t border-border">
                {c.chooseA.map((item) => <li key={item} className="text-body border-b border-border py-3">{item}</li>)}
              </ul>
            </div>
            <div className="border-t border-foreground pt-6 md:col-span-6">
              <p className="caps text-brand">Когда выбрать «{c.bName}»</p>
              <ul className="mt-4 border-t border-border">
                {c.chooseB.map((item) => <li key={item} className="text-body border-b border-border py-3">{item}</li>)}
              </ul>
            </div>
          </Grid>

          <div className="mt-12 border-l-2 border-brand pl-6">
            <p className="caps text-brand">Вывод технолога URALDOMA</p>
            <p className="t-lead mt-3 max-w-[54ch]">{c.verdict}</p>
          </div>
        </Container>
      </Section>

      {c.faq.length > 0 && (
        <Section>
          <Container>
            <Grid>
              <p className="caps pt-[0.6em] text-muted-foreground md:col-span-3">Вопросы</p>
              <H2 className="md:col-span-9 md:col-start-4">Частые <em>вопросы</em></H2>
              <FaqList items={c.faq} className="md:col-span-9 md:col-start-4 md:mt-16" />
            </Grid>
          </Container>
        </Section>
      )}

      <Section className="border-t border-border">
        <Container>
          <Grid className="gap-y-10">
            <div className="md:col-span-6">
              <p className="caps text-muted-foreground">Другие сравнения</p>
              <ul className="mt-4 border-t border-border">
                {relCmp.map((r) => (
                  <li key={r.slug}>
                    <Link href={`/compare/${r.slug}/`} className="flex items-baseline justify-between gap-4 border-b border-border py-3 hover:text-brand">
                      <span>{r.h1}</span>
                      <span aria-hidden="true">→</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link href="/compare/" className={`${linkArrow} mt-6`}>Все сравнения «X или Y» →</Link>
            </div>
            <div className="md:col-span-6">
              <p className="caps text-muted-foreground">Материалы и услуги по теме</p>
              <ul className="mt-4 border-t border-border">
                {mats.map((m) => (
                  <li key={m.slug}>
                    <Link href={`/materials/${m.slug}/`} className="flex items-baseline justify-between gap-4 border-b border-border py-3 hover:text-brand">
                      <span>Материал: {m.name}</span>
                      <span aria-hidden="true">→</span>
                    </Link>
                  </li>
                ))}
                {srv && (
                  <li>
                    <Link href={`/services/${srv.slug}/`} className="flex items-baseline justify-between gap-4 border-b border-border py-3 hover:text-brand">
                      <span>Услуга: {srv.title}</span>
                      <span aria-hidden="true">→</span>
                    </Link>
                  </li>
                )}
                <li>
                  <Link href="/tools/renovation-cost/" className="flex items-baseline justify-between gap-4 border-b border-border py-3 hover:text-brand">
                    <span>Калькулятор стоимости ремонта</span>
                    <span aria-hidden="true">→</span>
                  </Link>
                </li>
              </ul>
            </div>
          </Grid>
        </Container>
      </Section>

      <CtaSection source={`compare:${c.slug}`} />
    </>
  );
}
