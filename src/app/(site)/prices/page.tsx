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
      <PageHead crumbs={[{ name: "Главная", path: "/" }, { name: "Цены" }]} h1={P.h1} answer={P.answer} photo="garinsky/01" />

      <Section className="pt-0 md:pt-0">
        <Container>
          <SectionHead n="01" label="Тарифы" title={<>Что входит <em>в каждый тариф</em></>} />
          <TariffTable />
        </Container>
      </Section>

      <Section id="calculator" className="scroll-mt-20 bg-secondary">
        <Container>
          <SectionHead n="02" label="Калькулятор" title={<>Посчитайте <em>свою квартиру</em></>} aside="Ориентир стоимости работ по площади и тарифу. Точную смету пришлём после бесплатного замера." />
          <Calculator />
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHead n="03" label="Примеры" title={<>Сколько стоят работы <em>для типичных квартир</em></>} />
          <PriceExamples areas={P.examples} caption={"Стоимость работ по тарифам для квартир 40, 60 и 80 м²"} />
          <p className="text-small mt-4 text-muted-foreground">Стоимость работ без материалов и мебели. Дизайн-проект — {formatRub(designPrice.rate)} за м², {designPrice.term}.</p>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHead n="04" label="Другие услуги" title={<>Цены на <em>отдельные работы</em></>} />
          <div className="border-t border-border">
            {priceRows.map((r) => (
              <Link key={r.service} href={r.href} className="group grid grid-cols-1 gap-x-5 gap-y-1 border-b border-border py-5 md:grid-cols-12">
                <span className="t-lead group-hover:text-brand md:col-span-5">{r.service}</span>
                <span className="text-body md:col-span-3">{r.value}</span>
                <span className="text-small text-muted-foreground md:col-span-4">{r.note}</span>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <Grid>
            <div className="md:col-span-5">
              <Label n="05">Что влияет на цену</Label>
              <H2>От чего зависит <em>итог</em></H2>
              <dl className="mt-10 border-t border-border">
                {P.affects.map((a) => (
                  <div key={a.title} className="border-b border-border py-5">
                    <dt className="t-lead">{a.title}</dt>
                    <dd className="text-small mt-1 text-earth">{a.text}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="md:col-span-6 md:col-start-7">
              <Label n="06">Что не входит</Label>
              <H2>Считается <em>отдельно</em></H2>
              <ul className="mt-10 border-t border-border">
                {P.notIncluded.map((x) => <li key={x} className="t-lead border-b border-border py-5">{x}</li>)}
              </ul>
              <p className="text-body mt-8">{paymentTerms}</p>
            </div>
          </Grid>
        </Container>
      </Section>

      <Section>
        <Container>
          <Grid>
            <p className="caps pt-[0.6em] text-muted-foreground md:col-span-3">Вопросы</p>
              <H2 className="md:col-span-9 md:col-start-4">Частые вопросы <em>о цене</em></H2>
            <FaqList items={P.faq} className="md:col-span-9 md:col-start-4 md:mt-16" />
          </Grid>
        </Container>
      </Section>
      <CtaSection source="prices" />
    </>
  );
}
