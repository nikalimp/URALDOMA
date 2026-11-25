import Link from "next/link";
import { comparisons } from "@/content/compare";
import { Container, Grid, Section, linkArrow } from "@/components/container";
import { PageHead } from "@/components/page-head";
import { CtaSection } from "@/components/cta";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbs, graph, itemList } from "@/lib/schema";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta({
  title: "Сравнения материалов и решений для ремонта «X или Y»",
  description: "Честные сравнения решений для ремонта квартиры в Екатеринбурге от технологов URALDOMA: доска или кварцвинил, White Box или без отделки, EuroKraab или ГКЛ.",
  path: "/compare/",
});

export default function CompareHubPage() {
  return (
    <>
      <JsonLd
        data={graph(
          itemList("Сравнения решений для ремонта квартир", comparisons.map((c) => ({ name: c.h1, path: `/compare/${c.slug}/` }))),
        )}
      />
      <PageHead
        crumbs={[{ name: "Главная", path: "/" }, { name: "Сравнения" }]}
        h1="Сравнения решений «X или Y»"
        answer="Разбираем главные развилки при ремонте квартиры в новостройке и доме: сравниваем материалы, технологии и форматы работы по сроку службы, бюджету, рискам и реальному опыту объектов URALDOMA в Екатеринбурге."
      />

      <Section className="pt-0 md:pt-0">
        <Container>
          <div className="grid grid-cols-1 gap-x-gutter gap-y-10 md:grid-cols-2">
            {comparisons.map((c, i) => (
              <article key={c.slug} className="flex flex-col border-t border-foreground pt-6">
                <span className="caps text-muted-foreground">{String(i + 1).padStart(2, "0")} · {c.aName} vs {c.bName}</span>
                <h2 className="t-lead mt-3"><Link href={`/compare/${c.slug}/`} className="hover:text-brand">{c.h1}</Link></h2>
                <p className="text-small mt-3 flex-1 text-muted-foreground">{c.answer}</p>
                <Link href={`/compare/${c.slug}/`} className={`${linkArrow} mt-6`}>Открыть сравнение <span aria-hidden="true">→</span></Link>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="border-t border-border">
        <Container>
          <Grid>
            <p className="caps text-muted-foreground md:col-span-3">Другие разделы</p>
            <div className="space-y-4 md:col-span-8 md:col-start-4">
              <p className="t-lead">Каждое сравнение опирается на реальные расценки и практику наших прорабов и дизайнеров.</p>
              <div className="flex flex-wrap gap-6 pt-2">
                <Link href="/materials/" className={linkArrow}>Справочник материалов →</Link>
                <Link href="/tools/" className={linkArrow}>Калькуляторы и инструменты →</Link>
                <Link href="/glossary/" className={linkArrow}>Глоссарий терминов →</Link>
              </div>
            </div>
          </Grid>
        </Container>
      </Section>

      <CtaSection source="compare:hub" />
    </>
  );
}
