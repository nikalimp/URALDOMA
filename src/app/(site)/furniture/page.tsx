import Link from "next/link";
import { furniture as F } from "@/content/home";
import { site } from "@/content/site";
import { Container, Grid, Section, SectionHead, Label, H2, linkArrow } from "@/components/container";
import { PageHead } from "@/components/page-head";
import { FaqList } from "@/components/faq";
import { CtaSection } from "@/components/cta";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbs, faqSchema, graph, orgId } from "@/lib/schema";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta({ title: F.metaTitle, description: F.metaDescription, path: "/furniture/" });

export default function Furniture() {
  return (
    <>
      <JsonLd data={graph({ "@type": "Service", name: "Мебель на заказ «Мебель-Урал»", serviceType: "Изготовление мебели на заказ", description: F.answer, url: `${site.url}/furniture/`, provider: { "@id": orgId }, areaServed: site.areaServed }, faqSchema(F.faq), breadcrumbs([{ name: "Главная", path: "/" }, { name: "Мебель на заказ", path: "/furniture/" }]))} />
      <PageHead crumbs={[{ name: "Главная", path: "/" }, { name: "Мебель на заказ" }]} h1={F.h1} answer={F.answer} />
      <Container>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/objects/radishcheva-31/04.webp" alt="Кухня собственного производства в квартире на Радищева, 31" className="aspect-[16/9] w-full object-cover md:aspect-[21/9]" />
      </Container>
      <Section>
        <Container>
          <SectionHead n="01" label="Что делаем" title="Мебель по размерам квартиры" />
          <ul className="grid grid-cols-1 border-t border-l border-border sm:grid-cols-2 lg:grid-cols-3">
            {F.categories.map((c, i) => (
              <li key={c} className="flex items-baseline gap-4 border-r border-b border-border p-6 text-[22px] font-medium">
                <span className="font-mono text-[13px] text-brand">{String(i + 1).padStart(2, "0")}</span>{c}
              </li>
            ))}
          </ul>
          <Link href="/furniture/custom-kitchens/" className={`${linkArrow} mt-8`}>Кухни на заказ <span aria-hidden="true">→</span></Link>
        </Container>
      </Section>
      <Section className="bg-earth text-card">
        <Container>
          <Grid>
            <div className="md:col-span-5"><Label n="02" className="text-earth-foreground">Производство</Label><H2>Своё производство в Екатеринбурге</H2></div>
            <ul className="border-t border-card/40 md:col-span-6 md:col-start-7">
              {F.production.map((p) => <li key={p} className="border-b border-card/20 py-5 text-[18px]">{p}</li>)}
            </ul>
          </Grid>
        </Container>
      </Section>
      <Section>
        <Container>
          <SectionHead n="03" label="Как работаем" title="От проекта до установки" />
          <ol className="grid grid-cols-1 border-t border-foreground md:grid-cols-4">
            {F.process.map((p, i) => (
              <li key={p.title} className="border-b border-border py-6 md:border-r md:px-6 md:first:pl-0 md:last:border-r-0">
                <span className="font-mono text-[13px] text-brand">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 text-[20px] font-medium">{p.title}</h3>
                <p className="mt-2 text-[15px] text-earth">{p.text}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>
      <Section className="border-t border-border">
        <Container>
          <Grid>
            <div className="md:col-span-4"><Label n="04">Вопросы</Label><H2>Частые вопросы</H2></div>
            <FaqList items={F.faq} className="md:col-span-7 md:col-start-6" />
          </Grid>
        </Container>
      </Section>
      <CtaSection source="furniture" title="Рассчитаем мебель по вашему проекту" />
    </>
  );
}
