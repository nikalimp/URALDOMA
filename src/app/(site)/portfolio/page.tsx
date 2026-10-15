import { cases } from "@/content/cases";
import { complexes } from "@/content/complexes";
import Link from "next/link";
import { Container, Section, SectionHead } from "@/components/container";
import { PageHead } from "@/components/page-head";
import { CaseCard } from "@/components/case-card";
import { CtaSection } from "@/components/cta";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbs, graph, itemList } from "@/lib/schema";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta({
  title: "Портфолио URALDOMA — ремонт квартир и домов в Екатеринбурге",
  description: "Фото наших ремонтов в ЖК «Гаринский», «Тринити», «Клевер Парк», на Радищева и в посёлках «Образцово» и «Заповедник». Решения и детали каждого объекта.",
  path: "/portfolio/",
});

const answer =
  "В портфолио — квартиры и дома, которые URALDOMA отремонтировала под ключ в Екатеринбурге: ЖК «Гаринский», «Тринити», «Клевер Парк», дом на Радищева, коттеджные посёлки «Образцово» и «Заповедник», а также коммерческие помещения. По каждому объекту — фото и ключевые решения.";

const groups: { label: string; kind: (typeof cases)[number]["kind"] }[] = [
  { label: "Квартиры", kind: "квартира" },
  { label: "Дома", kind: "дом" },
  { label: "Коммерческие помещения", kind: "коммерция" },
];

export default function Portfolio() {
  return (
    <>
      <JsonLd data={graph(itemList("Портфолио URALDOMA", cases.map((c) => ({ name: c.title, path: `/portfolio/${c.slug}/` }))), breadcrumbs([{ name: "Главная", path: "/" }, { name: "Портфолио", path: "/portfolio/" }]))} />
      <PageHead crumbs={[{ name: "Главная", path: "/" }, { name: "Портфолио" }]} h1="Портфолио: ремонты квартир и домов" answer={answer} />
      {groups.map((g, i) => {
        const list = cases.filter((c) => c.kind === g.kind);
        if (!list.length) return null;
        return (
          <Section key={g.kind} className={i === 0 ? "pt-0 md:pt-0" : "border-t border-border"}>
            <Container>
              <SectionHead n={String(i + 1).padStart(2, "0")} label={g.label} title={g.label} />
              <div className="grid grid-cols-1 gap-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                {list.map((c) => (
                  <div key={c.slug}>
                    <CaseCard c={c} />
                    <p className="mt-3 text-[15px] text-earth">{c.summary}</p>
                  </div>
                ))}
              </div>
            </Container>
          </Section>
        );
      })}
      <Section className="bg-secondary">
        <Container>
          <SectionHead n="04" label="ЖК и посёлки" title="Ремонт в домах, которые мы знаем" />
          <ul className="border-t border-foreground">
            {complexes.map((c) => (
              <li key={c.slug}><Link href={`/complexes/${c.slug}/`} className="flex justify-between border-b border-foreground/15 py-5 text-[20px] hover:text-brand">{c.h1}<span aria-hidden="true" className="text-brand">→</span></Link></li>
            ))}
          </ul>
        </Container>
      </Section>
      <CtaSection source="portfolio" />
    </>
  );
}
