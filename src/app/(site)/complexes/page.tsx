import Link from "next/link";
import { complexes } from "@/content/complexes";
import { caseBySlug } from "@/content/cases";
import { pic } from "@/content/photos";
import { Img } from "@/components/photo";
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
      <PageHead crumbs={[{ name: "Главная", path: "/" }, { name: "Ремонт в ЖК" }]} h1={<>Ремонт квартир <em>в ЖК Екатеринбурга</em></>} answer={answer} photo="garinsky/04" />
      <Section className="pt-0 md:pt-0">
        <Container>
          <ul className="border-t border-foreground">
            {complexes.map((c) => {
              const cs = c.cases.map((s) => caseBySlug(s)).filter((x) => x !== undefined);
              return (
                <li key={c.slug} className="border-b border-border">
                  <Link href={`/complexes/${c.slug}/`} className="group grid grid-cols-1 gap-x-5 gap-y-4 py-8 md:grid-cols-12">
                    {cs[0] && (
                      <div className="aspect-[4/3] overflow-hidden bg-secondary md:col-span-3"><Img p={pic(`${cs[0].slug}/${cs[0].cover}`)} alt={cs[0].alt} sizes="(min-width: 768px) 25vw, 100vw" className="transition-transform duration-700 group-hover:scale-[1.05]" /></div>
                    )}
                    <div className="md:col-span-7 md:col-start-5">
                      <h2 className="text-[34px] leading-tight tracking-[-0.03em] group-hover:text-brand md:text-[44px]">{c.name}</h2>
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
