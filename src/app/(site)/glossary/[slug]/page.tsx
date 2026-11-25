import Link from "next/link";
import { notFound } from "next/navigation";
import { glossary, glossaryBySlug, glossaryCats } from "@/content/glossary";
import { materialBySlug } from "@/content/materials";
import { compareBySlug } from "@/content/compare";
import { serviceBySlug } from "@/content/services";
import { Container, Grid, Section, H2, linkArrow } from "@/components/container";
import { PageHead } from "@/components/page-head";
import { FaqList } from "@/components/faq";
import { CtaSection } from "@/components/cta";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbs, definedTermSchema, faqSchema, graph } from "@/lib/schema";
import { pageMeta } from "@/lib/meta";

export const dynamicParams = false;
export function generateStaticParams() {
  return glossary.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const g = glossaryBySlug((await params).slug);
  if (!g) return {};
  return pageMeta({ title: g.metaTitle, description: g.metaDescription, path: `/glossary/${g.slug}/` });
}

export default async function GlossaryTermPage({ params }: { params: Promise<{ slug: string }> }) {
  const g = glossaryBySlug((await params).slug);
  if (!g) notFound();
  const path = `/glossary/${g.slug}/`;
  const related = g.relatedTerms.map((s) => glossaryBySlug(s)).filter((x) => x !== undefined);
  const mat = g.relatedMaterial ? materialBySlug(g.relatedMaterial) : undefined;
  const cmp = g.relatedCompare ? compareBySlug(g.relatedCompare) : undefined;
  const srv = serviceBySlug(g.relatedService);

  return (
    <>
      <JsonLd
        data={graph(
          definedTermSchema(g),
          g.faq.length ? faqSchema(g.faq) : null,
          breadcrumbs([
            { name: "Главная", path: "/" },
            { name: "База знаний", path: "/knowledge/" },
            { name: "Глоссарий", path: "/glossary/" },
            { name: g.term, path },
          ]),
        )}
      />
      <PageHead
        crumbs={[
          { name: "Главная", path: "/" },
          { name: "Глоссарий", path: "/glossary/" },
          { name: g.term },
        ]}
        h1={g.term}
        answer={g.definition}
      />

      <Section className="pt-0 md:pt-0">
        <Container>
          <Grid className="border-t border-foreground py-10">
            <div className="md:col-span-3">
              <span className="caps text-muted-foreground">{glossaryCats[g.cat]}</span>
              <h2 className="t-lead mt-3">Как это устроено</h2>
            </div>
            <div className="space-y-4 md:col-span-8 md:col-start-4">
              {g.details.map((p) => <p key={p} className="text-body">{p}</p>)}
              <div className="mt-6 border-l-2 border-brand pl-5">
                <p className="caps text-brand">В практике URALDOMA</p>
                <p className="text-body mt-2">{g.inPractice}</p>
              </div>
            </div>
          </Grid>

          <Grid className="border-t border-border py-10">
            <div className="md:col-span-3">
              <span className="caps text-muted-foreground">Контроль качества</span>
              <h2 className="t-lead mt-3">На что обратить внимание</h2>
            </div>
            <ul className="md:col-span-8 md:col-start-4">
              {g.watchOut.map((w) => (
                <li key={w} className="text-body border-b border-border py-4 first:pt-0">{w}</li>
              ))}
            </ul>
          </Grid>
        </Container>
      </Section>

      {g.faq.length > 0 && (
        <Section>
          <Container>
            <Grid>
              <p className="caps pt-[0.6em] text-muted-foreground md:col-span-3">Вопросы</p>
              <H2 className="md:col-span-9 md:col-start-4">Частые <em>вопросы</em></H2>
              <FaqList items={g.faq} className="md:col-span-9 md:col-start-4 md:mt-16" />
            </Grid>
          </Container>
        </Section>
      )}

      <Section className="border-t border-border">
        <Container>
          <Grid className="gap-y-10">
            <div className="md:col-span-6">
              <p className="caps text-muted-foreground">Связанные термины</p>
              <ul className="mt-4 border-t border-border">
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link href={`/glossary/${r.slug}/`} className="flex items-baseline justify-between gap-4 border-b border-border py-3 hover:text-brand">
                      <span>{r.term}</span>
                      <span className="caps text-muted-foreground">{glossaryCats[r.cat]}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link href="/glossary/" className={`${linkArrow} mt-6`}>Весь глоссарий ремонта →</Link>
            </div>
            <div className="md:col-span-6">
              <p className="caps text-muted-foreground">Материалы и расчёты по теме</p>
              <ul className="mt-4 border-t border-border">
                {mat && (
                  <li>
                    <Link href={`/materials/${mat.slug}/`} className="flex items-baseline justify-between gap-4 border-b border-border py-3 hover:text-brand">
                      <span>Материал: {mat.name}</span>
                      <span aria-hidden="true">→</span>
                    </Link>
                  </li>
                )}
                {cmp && (
                  <li>
                    <Link href={`/compare/${cmp.slug}/`} className="flex items-baseline justify-between gap-4 border-b border-border py-3 hover:text-brand">
                      <span>Сравнение: {cmp.h1}</span>
                      <span aria-hidden="true">→</span>
                    </Link>
                  </li>
                )}
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

      <CtaSection source={`glossary:${g.slug}`} />
    </>
  );
}
