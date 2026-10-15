import Link from "next/link";
import { complexes } from "@/content/complexes";
import { caseCover, caseBySlug } from "@/content/cases";
import { Container, Section } from "@/components/container";
import { PageHead } from "@/components/page-head";
import { CtaSection } from "@/components/cta";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbs, graph, itemList } from "@/lib/schema";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta({
  title: "Ремонт квартир в ЖК Екатеринбурга — URALDOMA",
  description: "Ремонт квартир в ЖК «Тринити», «Гаринский», «Клевер Парк», на Радищева и домов в КП «Образцово» и «Заповедник»: особенности домов, наши объекты и цены.",
  path: "/complexes/",
});

const answer =
  "URALDOMA делала ремонт в жилых комплексах и коттеджных посёлках Екатеринбурга: ЖК «Тринити» и «Гаринский», «Клевер Парк», дом на Радищева, КП «Образцово» и «Заповедник». Для каждого дома собрали особенности конструкции и инженерии, которые влияют на проект и смету, и показали наши объекты там.";

export default function Complexes() {
  return (
    <>
      <JsonLd data={graph(itemList("Ремонт в ЖК Екатеринбурга", complexes.map((c) => ({ name: c.h1, path: `/complexes/${c.slug}/` }))), breadcrumbs([{ name: "Главная", path: "/" }, { name: "Ремонт в ЖК", path: "/complexes/" }]))} />
      <PageHead crumbs={[{ name: "Главная", path: "/" }, { name: "Ремонт в ЖК" }]} h1="Ремонт квартир в ЖК Екатеринбурга" answer={answer} />
      <Section className="pt-0 md:pt-0">
        <Container>
          <ul className="border-t border-foreground">
            {complexes.map((c) => {
              const cs = c.cases.map((s) => caseBySlug(s)).filter((x) => x !== undefined);
              return (
                <li key={c.slug} className="border-b border-border">
                  <Link href={`/complexes/${c.slug}/`} className="group grid grid-cols-1 gap-x-6 gap-y-4 py-8 md:grid-cols-12">
                    {cs[0] && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={caseCover(cs[0])} alt={cs[0].alt} loading="lazy" className="aspect-[4/3] w-full object-cover md:col-span-3" />
                    )}
                    <div className="md:col-span-8 md:col-start-5">
                      <h2 className="text-[28px] font-medium tracking-[-0.02em] group-hover:text-brand">{c.name}</h2>
                      <p className="mt-3 text-[16px] text-earth">{c.answer}</p>
                      <p className="label-mono mt-4 text-muted-foreground">{cs.length} {cs.length === 1 ? "объект" : "объекта"} URALDOMA</p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Container>
      </Section>
      <CtaSection source="complexes" />
    </>
  );
}
