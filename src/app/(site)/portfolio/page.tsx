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
      <PageHead crumbs={[{ name: "Главная", path: "/" }, { name: "Портфолио" }]} h1={<>Портфолио: ремонты <em>квартир и домов</em></>} answer={answer} photo="obraztsovo/13" />
      {groups.map((g, i) => {
        const list = cases.filter((c) => c.kind === g.kind);
        if (!list.length) return null;
        return (
          <Section key={g.kind} className={i === 0 ? "pt-0 md:pt-0" : ""}>
            <Container>
              <SectionHead n={String(i + 1).padStart(2, "0")} label={g.label} title={g.label} count={list.length} />
              <div className="grid grid-cols-1 gap-x-5 gap-y-14 sm:grid-cols-2 md:grid-cols-3">
                {list.map((c, j) => (
                  <div key={c.slug} className={`reveal ${j % 3 === 1 ? "md:mt-24" : ""}`}>
                    <CaseCard c={c} index={`(${String(j + 1).padStart(2, "0")})`} />
                    <p className="text-small mt-3 text-earth">{c.summary}</p>
                  </div>
                ))}
              </div>
            </Container>
          </Section>
        );
      })}
      <Section>
        <Container>
          <SectionHead n="04" label="ЖК и посёлки" title={<>Ремонт в домах, <em>которые мы знаем</em></>} />
          <ul className="border-t border-border">
            {complexes.map((c) => (
              <li key={c.slug}><Link href={`/complexes/${c.slug}/`} className="t-lead flex justify-between border-b border-foreground/15 py-5 hover:text-brand">{c.h1}<span aria-hidden="true" className="text-brand">→</span></Link></li>
            ))}
          </ul>
        </Container>
      </Section>
      <CtaSection source="portfolio" />
    </>
  );
}
