import Link from "next/link";
import { services } from "@/content/services";
import { site } from "@/content/site";
import { Container, Section, SectionHead } from "@/components/container";
import { PageHead } from "@/components/page-head";
import { CtaSection } from "@/components/cta";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbs, graph, itemList } from "@/lib/schema";
import { pageMeta } from "@/lib/meta";
import { pic, picsOf } from "@/content/photos";
import { twoPics } from "@/components/service-rows";
import { Img } from "@/components/photo";

export const metadata = pageMeta({
  title: "Услуги по ремонту квартир в Екатеринбурге — цены URALDOMA",
  description: "Ремонт под ключ, дизайн-проект, ремонт кухни и санузла, перепланировка и комплектация в Екатеринбурге. Цены от 20 000 ₽/м², гарантия 2 года.",
  path: "/services/",
});

const answer =
  "URALDOMA делает ремонт квартир и домов в Екатеринбурге полного цикла: дизайн-проект, черновые и чистовые работы, инженерию, перепланировку и комплектацию. Ремонт под ключ стоит от 20 000 до 60 000 ₽ за м² работ по трём тарифам, цена фиксируется в договоре.";

const groups = [
  { label: "Ремонт квартиры", slugs: ["turnkey-renovation", "designer-renovation", "new-build-renovation", "major-renovation"] },
  { label: "Проект и отдельные помещения", slugs: ["interior-design", "kitchen-renovation", "bathroom-renovation", "redevelopment"] },
  { label: "Комплектация", slugs: ["furnishing"] },
];

export default function Services() {
  return (
    <>
      <JsonLd data={graph(itemList(`Услуги ${site.name}`, services.map((s) => ({ name: s.title, path: `/services/${s.slug}/` }))), breadcrumbs([{ name: "Главная", path: "/" }, { name: "Услуги", path: "/services/" }]))} />
      <PageHead crumbs={[{ name: "Главная", path: "/" }, { name: "Услуги" }]} h1={<>Услуги по ремонту квартир <em>в Екатеринбурге</em></>} answer={answer} photo="trinity-14/11" />
      {groups.map((g, gi) => {
        const list = g.slugs.map((s) => services.find((x) => x.slug === s)).filter((x) => x !== undefined);
        if (!list.length) return null;
        return (
          <Section key={g.label} className="pt-0 md:pt-0">
            <Container>
              <SectionHead n={String(gi + 1).padStart(2, "0")} label={g.label} title={g.label} />
              <div className="border-t border-border">
                {list.map((s) => {
                  const [a, b] = twoPics(s.cover, pic, picsOf);
                  return (
                    <Link key={s.slug} href={`/services/${s.slug}/`} data-cursor="(подробнее) ↘" className="group relative grid grid-cols-1 gap-x-gutter gap-y-2 border-b border-foreground/15 py-6 md:grid-cols-12 md:items-baseline md:py-8">
                      <h2 className="t-lead group-hover:text-brand md:col-span-6">{s.title}</h2>
                      <p className="text-small text-earth transition-opacity md:col-span-3 md:col-start-7 md:group-hover:opacity-0">{s.short}</p>
                      <p className="text-small flex justify-between gap-4 transition-opacity md:col-span-3 md:col-start-10 md:group-hover:opacity-0">
                        <span className="text-muted-foreground">{s.priceFrom}</span>
                        <span aria-hidden="true" className="text-brand">→</span>
                      </p>
                      {/* превью при наведении: два кадра объекта на месте описания и цены (03-design §11) */}
                      <span aria-hidden="true" className="pointer-events-none absolute inset-y-3 right-0 hidden w-[calc(50%-var(--gutter)/2)] grid-cols-2 gap-x-gutter opacity-0 transition-opacity duration-500 group-hover:opacity-100 md:grid">
                        <span className="overflow-hidden"><Img p={a} alt="" sizes="320px" className="scale-105 transition-transform duration-700 group-hover:scale-100" /></span>
                        <span className="overflow-hidden"><Img p={b} alt="" sizes="320px" className="scale-105 transition-transform duration-700 group-hover:scale-100" /></span>
                      </span>
                    </Link>
                  );
                })}
              </div>
            </Container>
          </Section>
        );
      })}
      <CtaSection source="services" />
    </>
  );
}
