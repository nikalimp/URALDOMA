import Link from "next/link";
import { notFound } from "next/navigation";
import { materials, materialBySlug, materialCats } from "@/content/materials";
import { compareBySlug } from "@/content/compare";
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
  return materials.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const m = materialBySlug((await params).slug);
  if (!m) return {};
  return pageMeta({ title: m.metaTitle, description: m.metaDescription, path: `/materials/${m.slug}/` });
}

export default async function MaterialDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const m = materialBySlug((await params).slug);
  if (!m) notFound();
  const path = `/materials/${m.slug}/`;
  const related = m.relatedMaterials.map((s) => materialBySlug(s)).filter((x) => x !== undefined);
  const cmp = m.relatedCompare ? compareBySlug(m.relatedCompare) : undefined;
  const srv = serviceBySlug(m.relatedService);

  return (
    <>
      <JsonLd
        data={graph(
          techArticleSchema({ path, title: m.h1, description: m.metaDescription }),
          m.faq.length ? faqSchema(m.faq) : null,
          breadcrumbs([
            { name: "Главная", path: "/" },
            { name: "База знаний", path: "/knowledge/" },
            { name: "Материалы", path: "/materials/" },
            { name: m.name, path },
          ]),
        )}
      />
      <PageHead
        crumbs={[
          { name: "Главная", path: "/" },
          { name: "Материалы", path: "/materials/" },
          { name: m.name },
        ]}
        h1={m.h1}
        answer={m.answer}
        photo={m.photo}
      />

      <Container>
        <dl className="grid grid-cols-1 gap-x-gutter sm:grid-cols-2 md:grid-cols-12">
          <div className="border-t border-border pt-3 pb-6 md:col-span-3">
            <dt className="caps text-muted-foreground">Категория</dt>
            <dd className="t-lead mt-2">{materialCats[m.cat].label}</dd>
          </div>
          <div className="border-t border-border pt-3 pb-6 md:col-span-3">
            <dt className="caps text-muted-foreground">Ориентир цены</dt>
            <dd className="t-lead mt-2">{m.priceRange}</dd>
          </div>
          <div className="border-t border-border pt-3 pb-6 md:col-span-3">
            <dt className="caps text-muted-foreground">Срок службы</dt>
            <dd className="t-lead mt-2">{m.lifespan}</dd>
          </div>
          <div className="border-t border-border pt-3 pb-6 md:col-span-3">
            <dt className="caps text-muted-foreground">Тарифы URALDOMA</dt>
            <dd className="t-lead mt-2">{m.tariffs.join(", ")}</dd>
          </div>
        </dl>
      </Container>

      <Section>
        <Container>
          <Grid className="border-t border-foreground py-10">
            <div className="md:col-span-3">
              <span className="caps text-muted-foreground">01</span>
              <h2 className="t-lead mt-3">Где применяем и бренды</h2>
            </div>
            <div className="md:col-span-8 md:col-start-4">
              <p className="text-body">{m.whereUsed}</p>
              <p className="caps mt-8 text-muted-foreground">Проверенные бренды</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {m.brands.map((b) => (
                  <li key={b} className="text-small border border-border px-3 py-1.5">{b}</li>
                ))}
              </ul>
            </div>
          </Grid>

          <Grid className="border-t border-border py-10">
            <div className="md:col-span-3">
              <span className="caps text-muted-foreground">02</span>
              <h2 className="t-lead mt-3">Ключевые характеристики</h2>
            </div>
            <dl className="md:col-span-8 md:col-start-4">
              {m.specs.map(([k, v]) => (
                <div key={k} className="grid grid-cols-1 gap-2 border-b border-border py-4 sm:grid-cols-12">
                  <dt className="text-small text-muted-foreground sm:col-span-4">{k}</dt>
                  <dd className="text-body sm:col-span-8">{v}</dd>
                </div>
              ))}
            </dl>
          </Grid>

          <Grid className="border-t border-border py-10">
            <div className="md:col-span-3">
              <span className="caps text-muted-foreground">03</span>
              <h2 className="t-lead mt-3">Плюсы и ограничения</h2>
            </div>
            <div className="grid grid-cols-1 gap-8 md:col-span-8 md:col-start-4 md:grid-cols-2">
              <div>
                <p className="caps text-brand">Плюсы</p>
                <ul className="mt-3 border-t border-border">
                  {m.pros.map((p) => <li key={p} className="text-small border-b border-border py-3">{p}</li>)}
                </ul>
              </div>
              <div>
                <p className="caps text-muted-foreground">Ограничения</p>
                <ul className="mt-3 border-t border-border">
                  {m.cons.map((c) => <li key={c} className="text-small border-b border-border py-3">{c}</li>)}
                </ul>
              </div>
            </div>
          </Grid>

          <Grid className="border-t border-border py-10">
            <div className="md:col-span-3">
              <span className="caps text-muted-foreground">04</span>
              <h2 className="t-lead mt-3">Частые ошибки монтажа</h2>
            </div>
            <div className="md:col-span-8 md:col-start-4">
              <ul className="border-t border-border">
                {m.mistakes.map((ms) => <li key={ms} className="text-body border-b border-border py-3">{ms}</li>)}
              </ul>
              <div className="mt-8 border-l-2 border-brand pl-5">
                <p className="caps text-brand">Рекомендация технолога URALDOMA</p>
                <p className="text-body mt-2">{m.advice}</p>
              </div>
            </div>
          </Grid>
        </Container>
      </Section>

      {m.faq.length > 0 && (
        <Section>
          <Container>
            <Grid>
              <p className="caps pt-[0.6em] text-muted-foreground md:col-span-3">Вопросы</p>
              <H2 className="md:col-span-9 md:col-start-4">Частые <em>вопросы</em></H2>
              <FaqList items={m.faq} className="md:col-span-9 md:col-start-4 md:mt-16" />
            </Grid>
          </Container>
        </Section>
      )}

      <Section className="border-t border-border">
        <Container>
          <Grid className="gap-y-10">
            <div className="md:col-span-6">
              <p className="caps text-muted-foreground">Связанные материалы</p>
              <ul className="mt-4 border-t border-border">
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link href={`/materials/${r.slug}/`} className="flex items-baseline justify-between gap-4 border-b border-border py-3 hover:text-brand">
                      <span>{r.name}</span>
                      <span className="text-small text-muted-foreground">{r.priceRange}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link href="/materials/" className={`${linkArrow} mt-6`}>Все материалы справочника →</Link>
            </div>
            <div className="md:col-span-6">
              <p className="caps text-muted-foreground">Полезные разделы</p>
              <ul className="mt-4 border-t border-border">
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
                  <Link href="/tools/materials-calculator/" className="flex items-baseline justify-between gap-4 border-b border-border py-3 hover:text-brand">
                    <span>Калькулятор расхода материалов</span>
                    <span aria-hidden="true">→</span>
                  </Link>
                </li>
                <li>
                  <Link href="/prices/" className="flex items-baseline justify-between gap-4 border-b border-border py-3 hover:text-brand">
                    <span>Тарифы и цены на ремонт под ключ</span>
                    <span aria-hidden="true">→</span>
                  </Link>
                </li>
              </ul>
            </div>
          </Grid>
        </Container>
      </Section>

      <CtaSection source={`material:${m.slug}`} />
    </>
  );
}
