import Link from "next/link";
import { services } from "@/content/services";
import { site } from "@/content/site";
import { Container, Section, SectionHead } from "@/components/container";
import { PageHead } from "@/components/page-head";
import { CtaSection } from "@/components/cta";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbs, graph, itemList } from "@/lib/schema";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta({
  title: "Услуги по ремонту квартир в Екатеринбурге — цены URALDOMA",
  description: "Ремонт под ключ, дизайн-проект, ремонт кухни и санузла, перепланировка и мебель на заказ в Екатеринбурге. Цены от 20 000 ₽/м², гарантия 2 года.",
  path: "/services/",
});

const answer =
  "URALDOMA делает ремонт квартир и домов в Екатеринбурге полного цикла: дизайн-проект, черновые и чистовые работы, инженерию, перепланировку, комплектацию и мебель на собственном производстве. Ремонт под ключ стоит от 20 000 до 40 000 ₽ за м² работ по трём тарифам, цена фиксируется в договоре.";

const groups = [
  { label: "Ремонт квартиры", slugs: ["turnkey-renovation", "designer-renovation", "new-build-renovation", "major-renovation"] },
  { label: "Проект и отдельные помещения", slugs: ["interior-design", "kitchen-renovation", "bathroom-renovation", "redevelopment"] },
  { label: "Комплектация", slugs: ["furnishing"] },
];

export default function Services() {
  return (
    <>
      <JsonLd data={graph(itemList(`Услуги ${site.name}`, services.map((s) => ({ name: s.title, path: `/services/${s.slug}/` }))), breadcrumbs([{ name: "Главная", path: "/" }, { name: "Услуги", path: "/services/" }]))} />
      <PageHead crumbs={[{ name: "Главная", path: "/" }, { name: "Услуги" }]} h1="Услуги по ремонту квартир в Екатеринбурге" answer={answer} />
      {groups.map((g, gi) => {
        const list = g.slugs.map((s) => services.find((x) => x.slug === s)).filter((x) => x !== undefined);
        if (!list.length) return null;
        return (
          <Section key={g.label} className={gi % 2 ? "bg-secondary" : ""}>
            <Container>
              <SectionHead n={String(gi + 1).padStart(2, "0")} label={g.label} title={g.label} />
              <div className="border-t border-foreground">
                {list.map((s) => (
                  <Link key={s.slug} href={`/services/${s.slug}/`} className="group grid grid-cols-1 gap-x-6 gap-y-2 border-b border-foreground/15 py-8 md:grid-cols-12">
                    <h2 className="text-[26px] tracking-[-0.015em] group-hover:text-brand md:col-span-5 md:text-[32px]">{s.title}</h2>
                    <p className="text-[16px] text-earth md:col-span-4">{s.short}</p>
                    <p className="flex justify-between gap-4 text-[16px] md:col-span-3 md:justify-end">
                      <span className="text-muted-foreground">{s.priceFrom}</span>
                      <span aria-hidden="true" className="text-brand">→</span>
                    </p>
                  </Link>
                ))}
              </div>
            </Container>
          </Section>
        );
      })}
      <Section>
        <Container>
          <SectionHead n="04" label="Мебель" title="Мебель на заказ «Мебель-Урал»" aside="Кухни, островки, столешницы, раковины и мебель в стиле лофт делаем на своём производстве — под размеры квартиры после ремонта." />
          <Link href="/furniture/" className="inline-flex items-center gap-2 font-medium hover:text-brand">О производстве <span aria-hidden="true">→</span></Link>
        </Container>
      </Section>
      <CtaSection source="services" />
    </>
  );
}
