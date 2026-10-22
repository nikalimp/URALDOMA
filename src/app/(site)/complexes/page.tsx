import Link from "next/link";
import { complexes } from "@/content/complexes";
import { caseBySlug } from "@/content/cases";
import { pic } from "@/content/photos";
import { Img } from "@/components/photo";
import { Container, Section } from "@/components/container";
import { PageHead } from "@/components/page-head";
import { CtaSection } from "@/components/cta";
import { ObjectsMaps } from "@/components/objects-maps";
import { counts } from "@/lib/objects-map";
import { Grid } from "@/components/container";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbs, graph, itemList } from "@/lib/schema";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta({
  title: "Ремонт в ЖК Екатеринбурга и коттеджных посёлках — URALDOMA",
  description: `Ремонт квартир в ${counts.zk} ЖК Екатеринбурга и отделка домов в ${counts.kp} коттеджных посёлках: карта, факты о каждом доме, наши объекты и цены от 20 000 ₽/м².`,
  path: "/complexes/",
});

const answer = `URALDOMA ремонтирует квартиры в жилых комплексах Екатеринбурга и отделывает дома в коттеджных посёлках области. На карте — ${counts.zk} ЖК и ${counts.kp} посёлков: для каждого собрали застройщика, конструкцию, потолки и отделку от застройщика и объяснили, как это влияет на проект и смету. Где мы уже работали — показали объекты.`;

export default function Complexes() {
  const ours = complexes.filter((c) => c.cases.length > 0);
  return (
    <>
      <JsonLd data={graph(itemList("Ремонт в ЖК Екатеринбурга", complexes.map((c) => ({ name: c.h1, path: `/complexes/${c.slug}/` }))), breadcrumbs([{ name: "Главная", path: "/" }, { name: "Ремонт в ЖК", path: "/complexes/" }]))} />
      <PageHead crumbs={[{ name: "Главная", path: "/" }, { name: "Ремонт в ЖК" }]} h1={<>Ремонт в ЖК <em>и коттеджных посёлках</em></>} answer={answer} photo="garinsky/04" />
      <Section className="pt-0 md:pt-0" aria-label="Наши объекты">
        <Container>
          <Grid className="mb-10 gap-y-4">
            <p className="caps text-muted-foreground md:col-span-3">Где мы уже работали</p>
          </Grid>
          <ul className="border-t border-border">
            {ours.map((c) => {
              const cs = c.cases.map((s) => caseBySlug(s)).filter((x) => x !== undefined);
              return (
                <li key={c.slug} className="border-b border-border">
                  <Link href={`/complexes/${c.slug}/`} className="group grid grid-cols-1 gap-x-gutter gap-y-4 py-8 md:grid-cols-12">
                    {cs[0] && (
                      <div className="aspect-[4/3] overflow-hidden bg-secondary md:col-span-3"><Img p={pic(`${cs[0].slug}/${cs[0].cover}`)} alt={cs[0].alt} sizes="(min-width: 768px) 25vw, 100vw" className="transition-transform duration-700 group-hover:scale-[1.05]" /></div>
                    )}
                    <div className="md:col-span-6 md:col-start-4">
                      <h2 className="t-statement group-hover:text-brand">{c.name}</h2>
                      <p className="text-small mt-3 text-earth">{c.answer}</p>
                      <p className="label-mono mt-4 text-muted-foreground">{cs.length} {cs.length === 1 ? "объект" : "объекта"} URALDOMA</p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Container>
      </Section>
      <Section className="border-t border-border" aria-label="Карта ЖК и посёлков">
        <Container>
          <ObjectsMaps />
        </Container>
      </Section>
      <CtaSection source="complexes" />
    </>
  );
}
