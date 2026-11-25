import Link from "next/link";
import { notFound } from "next/navigation";
import { tools, toolBySlug } from "@/content/tools";
import { serviceBySlug } from "@/content/services";
import { Container, Grid, Section, H2, linkArrow } from "@/components/container";
import { PageHead } from "@/components/page-head";
import { ToolWidget } from "@/components/tool-widgets";
import { FaqList } from "@/components/faq";
import { CtaSection } from "@/components/cta";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbs, faqSchema, graph, softwareAppSchema } from "@/lib/schema";
import { pageMeta } from "@/lib/meta";

export const dynamicParams = false;
export function generateStaticParams() {
  return tools.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const t = toolBySlug((await params).slug);
  if (!t) return {};
  return pageMeta({ title: t.metaTitle, description: t.metaDescription, path: `/tools/${t.slug}/` });
}

export default async function ToolDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const t = toolBySlug((await params).slug);
  if (!t) notFound();
  const path = `/tools/${t.slug}/`;
  const related = t.relatedTools.map((s) => toolBySlug(s)).filter((x) => x !== undefined);
  const srv = serviceBySlug(t.relatedService);

  return (
    <>
      <JsonLd
        data={graph(
          softwareAppSchema({ path, name: t.name, description: t.metaDescription }),
          t.faq.length ? faqSchema(t.faq) : null,
          breadcrumbs([
            { name: "Главная", path: "/" },
            { name: "База знаний", path: "/knowledge/" },
            { name: "Инструменты", path: "/tools/" },
            { name: t.name, path },
          ]),
        )}
      />
      <PageHead
        crumbs={[
          { name: "Главная", path: "/" },
          { name: "Инструменты", path: "/tools/" },
          { name: t.name },
        ]}
        h1={t.h1}
        answer={t.answer}
      />

      <Section className="pt-0 md:pt-0">
        <Container>
          <ToolWidget kind={t.slug} />
        </Container>
      </Section>

      <Section>
        <Container>
          <Grid className="border-t border-foreground py-10">
            <div className="md:col-span-3">
              <span className="caps text-muted-foreground">Методика</span>
              <h2 className="t-lead mt-3">Как устроен расчёт</h2>
            </div>
            <ul className="md:col-span-8 md:col-start-4">
              {t.howItWorks.map((line) => (
                <li key={line} className="text-body border-b border-border py-4 first:pt-0">{line}</li>
              ))}
            </ul>
          </Grid>

          <Grid className="border-t border-border py-10">
            <div className="md:col-span-3">
              <span className="caps text-muted-foreground">На практике</span>
              <h2 className="t-lead mt-3">Что важно учесть</h2>
            </div>
            <div className="space-y-4 md:col-span-8 md:col-start-4">
              {t.notes.map((n) => <p key={n} className="text-body">{n}</p>)}
              <p className="text-small text-muted-foreground">В URALDOMA мы выполняем бесплатный лазерный замер по Екатеринбургу, готовим постатейную смету и фиксируем итоговую цену работ в договоре с поэтапной оплатой 30/40/30 и гарантией 2 года.</p>
            </div>
          </Grid>
        </Container>
      </Section>

      {t.faq.length > 0 && (
        <Section>
          <Container>
            <Grid>
              <p className="caps pt-[0.6em] text-muted-foreground md:col-span-3">Вопросы</p>
              <H2 className="md:col-span-9 md:col-start-4">Частые <em>вопросы</em></H2>
              <FaqList items={t.faq} className="md:col-span-9 md:col-start-4 md:mt-16" />
            </Grid>
          </Container>
        </Section>
      )}

      <Section className="border-t border-border">
        <Container>
          <Grid className="gap-y-10">
            <div className="md:col-span-6">
              <p className="caps text-muted-foreground">Другие инструменты</p>
              <ul className="mt-4 border-t border-border">
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link href={`/tools/${r.slug}/`} className="flex items-baseline justify-between gap-4 border-b border-border py-3 hover:text-brand">
                      <span>{r.name}</span>
                      <span aria-hidden="true">→</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link href="/tools/" className={`${linkArrow} mt-6`}>Все инструменты →</Link>
            </div>
            <div className="md:col-span-6">
              <p className="caps text-muted-foreground">Дальше по теме</p>
              <ul className="mt-4 border-t border-border">
                {srv && (
                  <li>
                    <Link href={`/services/${srv.slug}/`} className="flex items-baseline justify-between gap-4 border-b border-border py-3 hover:text-brand">
                      <span>Услуга: {srv.title}</span>
                      <span aria-hidden="true">→</span>
                    </Link>
                  </li>
                )}
                <li>
                  <Link href="/materials/" className="flex items-baseline justify-between gap-4 border-b border-border py-3 hover:text-brand">
                    <span>Справочник материалов и брендов</span>
                    <span aria-hidden="true">→</span>
                  </Link>
                </li>
                <li>
                  <Link href="/compare/" className="flex items-baseline justify-between gap-4 border-b border-border py-3 hover:text-brand">
                    <span>Сравнения решений «X или Y»</span>
                    <span aria-hidden="true">→</span>
                  </Link>
                </li>
              </ul>
            </div>
          </Grid>
        </Container>
      </Section>

      <CtaSection source={`tool:${t.slug}`} />
    </>
  );
}
