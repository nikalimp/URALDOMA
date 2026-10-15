import { kitchens as K, furniture as F } from "@/content/home";
import { site } from "@/content/site";
import { Container, Grid, Section, Label, H2 } from "@/components/container";
import { PageHead } from "@/components/page-head";
import { FaqList } from "@/components/faq";
import { CtaSection } from "@/components/cta";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbs, faqSchema, graph, orgId } from "@/lib/schema";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta({ title: K.metaTitle, description: K.metaDescription, path: "/furniture/custom-kitchens/" });

export default function Kitchens() {
  return (
    <>
      <JsonLd data={graph({ "@type": "Service", name: K.h1, serviceType: "Кухни на заказ", description: K.answer, url: `${site.url}/furniture/custom-kitchens/`, provider: { "@id": orgId }, areaServed: site.areaServed }, faqSchema(K.faq), breadcrumbs([{ name: "Главная", path: "/" }, { name: "Мебель на заказ", path: "/furniture/" }, { name: "Кухни на заказ", path: "/furniture/custom-kitchens/" }]))} />
      <PageHead crumbs={[{ name: "Главная", path: "/" }, { name: "Мебель на заказ", path: "/furniture/" }, { name: "Кухни на заказ" }]} h1={K.h1} answer={K.answer} />
      <Container>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/objects/radishcheva-31/04.webp" alt="Кухня с мраморной стеной и островной вытяжкой, Радищева, 31" className="aspect-[16/9] w-full object-cover md:aspect-[21/9]" />
      </Container>
      <Section>
        <Container>
          <Grid>
            <div className="md:col-span-4"><Label n="01">Как делаем</Label><H2>От проекта до установки</H2></div>
            <ol className="border-t border-foreground md:col-span-7 md:col-start-6">
              {K.steps.map((s, i) => (
                <li key={s.title} className="grid grid-cols-[48px_1fr] gap-x-6 border-b border-border py-6">
                  <span className="font-mono text-[14px] text-brand">{String(i + 1).padStart(2, "0")}</span>
                  <div><h3 className="text-[22px] font-medium">{s.title}</h3><p className="mt-2 text-[16px] text-earth">{s.text}</p></div>
                </li>
              ))}
            </ol>
          </Grid>
        </Container>
      </Section>
      <Section className="bg-earth text-card">
        <Container>
          <Grid>
            <div className="md:col-span-5"><Label className="text-earth-foreground">Производство</Label><H2>Своё производство «Мебель-Урал»</H2></div>
            <ul className="border-t border-card/40 md:col-span-6 md:col-start-7">
              {F.production.map((p) => <li key={p} className="border-b border-card/20 py-5 text-[18px]">{p}</li>)}
            </ul>
          </Grid>
        </Container>
      </Section>
      <Section>
        <Container>
          <Grid>
            <div className="md:col-span-4"><Label n="02">Вопросы</Label><H2>Частые вопросы</H2></div>
            <FaqList items={K.faq} className="md:col-span-7 md:col-start-6" />
          </Grid>
        </Container>
      </Section>
      <CtaSection source="kitchens" title="Рассчитаем кухню по вашим размерам" />
    </>
  );
}
