import { pricesPage as P } from "@/content/pages";
import { tariffs, formatRub, paymentTerms } from "@/content/tariffs";
import { priceRows, designPrice } from "@/content/prices";
import Link from "next/link";
import { Container, Grid, Section, SectionHead, Label, H2 } from "@/components/container";
import { PageHead } from "@/components/page-head";
import { PriceExamples } from "@/components/price-examples";
import { TariffTable } from "@/components/tariff-table";
import { Calculator } from "@/components/calculator";
import { FaqList } from "@/components/faq";
import { CtaSection } from "@/components/cta";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbs, faqSchema, graph, orgId } from "@/lib/schema";
import { site } from "@/content/site";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta({ title: P.metaTitle, description: P.metaDescription, path: "/prices/" });

export default function Prices() {
  const schema = {
    "@type": "Service",
    name: "Ремонт квартиры под ключ",
    url: `${site.url}/prices/`,
    provider: { "@id": orgId },
    areaServed: site.areaServed,
    offers: tariffs.map((t) => ({ "@type": "Offer", name: `Тариф «${t.name}»`, price: String(t.rate), priceCurrency: "RUB", description: `${formatRub(t.rate)} за м² работ. ${t.short}` })),
  };
  return (
    <>
      <JsonLd data={graph(schema, faqSchema(P.faq), breadcrumbs([{ name: "Главная", path: "/" }, { name: "Цены", path: "/prices/" }]))} />
      <PageHead crumbs={[{ name: "Главная", path: "/" }, { name: "Цены" }]} h1={P.h1} answer={P.answer} />

      <Section className="pt-0 md:pt-0">
        <Container>
          <SectionHead n="01" label="Тарифы" title="Что входит в каждый тариф" />
          <TariffTable />
        </Container>
      </Section>

      <Section id="calculator" className="scroll-mt-20 bg-secondary">
        <Container>
          <SectionHead n="02" label="Калькулятор" title="Посчитайте свою квартиру" aside="Ориентир стоимости работ по площади и тарифу. Точную смету пришлём после бесплатного замера." />
          <Calculator />
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHead n="03" label="Примеры" title="Сколько стоят работы для типичных квартир" />
          <PriceExamples areas={P.examples} caption={"Стоимость работ по тарифам для квартир 40, 60 и 80 м²"} />
          <p className="mt-4 text-[14px] text-muted-foreground">Стоимость работ без материалов и мебели. Дизайн-проект — {formatRub(designPrice.rate)} за м², {designPrice.term}.</p>
        </Container>
      </Section>

      <Section className="border-t border-border">
        <Container>
          <SectionHead n="04" label="Другие услуги" title="Цены на отдельные работы" />
          <div className="border-t border-foreground">
            {priceRows.map((r) => (
              <Link key={r.service} href={r.href} className="group grid grid-cols-1 gap-x-6 gap-y-1 border-b border-border py-5 md:grid-cols-12">
                <span className="text-[20px] font-medium group-hover:text-brand md:col-span-5">{r.service}</span>
                <span className="text-[18px] md:col-span-3">{r.value}</span>
                <span className="text-[15px] text-muted-foreground md:col-span-4">{r.note}</span>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="bg-card">
        <Container>
          <Grid>
            <div className="md:col-span-5">
              <Label n="05">Что влияет на цену</Label>
              <H2>От чего зависит итог</H2>
              <dl className="mt-10 border-t border-foreground">
                {P.affects.map((a) => (
                  <div key={a.title} className="border-b border-border py-5">
                    <dt className="text-[19px] font-medium">{a.title}</dt>
                    <dd className="mt-1 text-[16px] text-earth">{a.text}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="md:col-span-6 md:col-start-7">
              <Label n="06">Что не входит</Label>
              <H2>Считается отдельно</H2>
              <ul className="mt-10 border-t border-foreground">
                {P.notIncluded.map((x) => <li key={x} className="border-b border-border py-5 text-[19px]">{x}</li>)}
              </ul>
              <p className="mt-8 text-[17px]">{paymentTerms}</p>
            </div>
          </Grid>
        </Container>
      </Section>

      <Section>
        <Container>
          <Grid>
            <div className="md:col-span-4"><Label n="07">Вопросы</Label><H2>Частые вопросы о цене</H2></div>
            <FaqList items={P.faq} className="md:col-span-7 md:col-start-6" />
          </Grid>
        </Container>
      </Section>
      <CtaSection source="prices" />
    </>
  );
}
