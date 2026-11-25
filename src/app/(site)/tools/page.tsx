import Link from "next/link";
import { tools } from "@/content/tools";
import { Container, Grid, Section, linkArrow } from "@/components/container";
import { PageHead } from "@/components/page-head";
import { CtaSection } from "@/components/cta";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbs, graph, itemList } from "@/lib/schema";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta({
  title: "Калькуляторы и инструменты для ремонта квартиры",
  description: "Бесплатные онлайн-инструменты URALDOMA: расчёт стоимости ремонта, сроков, материалов, плитки, электрики, оплаты 30/40/30, чеклист приёмки и конструктор ТЗ.",
  path: "/tools/",
});

export default function ToolsPage() {
  return (
    <>
      <JsonLd
        data={graph(
          itemList("Инструменты и калькуляторы ремонта", tools.map((t) => ({ name: t.name, path: `/tools/${t.slug}/` }))),
        )}
      />
      <PageHead
        crumbs={[{ name: "Главная", path: "/" }, { name: "Инструменты" }]}
        h1="Инструменты и калькуляторы"
        answer="Восемь бесплатных онлайн-инструментов для подготовки к ремонту квартиры в Екатеринбурге. Все расчёты работают мгновенно в браузере без регистрации, а готовый результат можно сразу отправить технологу или дизайнеру URALDOMA."
      />

      <Section className="pt-0 md:pt-0">
        <Container>
          <div className="grid grid-cols-1 gap-x-gutter gap-y-10 md:grid-cols-2">
            {tools.map((t, i) => (
              <article key={t.slug} className="flex flex-col border-t border-foreground pt-6">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="caps text-brand">{String(i + 1).padStart(2, "0")} · {t.badge}</span>
                </div>
                <h2 className="t-lead mt-3"><Link href={`/tools/${t.slug}/`} className="hover:text-brand">{t.name}</Link></h2>
                <p className="text-small mt-3 flex-1 text-muted-foreground">{t.answer}</p>
                <Link href={`/tools/${t.slug}/`} className={`${linkArrow} mt-6`}>Открыть инструмент <span aria-hidden="true">→</span></Link>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="border-t border-border">
        <Container>
          <Grid>
            <p className="caps text-muted-foreground md:col-span-3">Точность расчётов</p>
            <div className="space-y-4 md:col-span-8 md:col-start-4">
              <p className="t-lead">Все формулы основаны на реальных сметах и графиках объектов URALDOMA за 2024⁠–⁠2026 годы в Екатеринбурге.</p>
              <p className="text-body text-muted-foreground">Калькуляторы помогают быстро прикинуть бюджет, объём мешков, количество автоматов в щите и календарь переезда до первого звонка. Точную постатейную смету мы составляем бесплатно после лазерного замера вашей квартиры и фиксируем её в договоре.</p>
              <div className="flex flex-wrap gap-6 pt-2">
                <Link href="/materials/" className={linkArrow}>Справочник материалов →</Link>
                <Link href="/compare/" className={linkArrow}>Сравнения «X или Y» →</Link>
                <Link href="/glossary/" className={linkArrow}>Глоссарий терминов →</Link>
              </div>
            </div>
          </Grid>
        </Container>
      </Section>

      <CtaSection source="tools:hub" />
    </>
  );
}
