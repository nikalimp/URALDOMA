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
      <PageHead crumbs={[{ name: "Главная", path: "/" }, { name: "Мебель на заказ", path: "/furniture/" }, { name: "Кухни на заказ" }]} h1={K.h1} answer={K.answer} photo="garinsky-21/05" />
      <Section className="pt-0 md:pt-0">
        <Container>
          <Grid>
            <p className="caps pt-[0.6em] text-muted-foreground md:col-span-3">Как делаем</p>
              <H2 className="md:col-span-9 md:col-start-4">От проекта <em>до установки</em></H2>
            <ol className="border-t border-border md:col-span-9 md:col-start-4 md:mt-16">
              {K.steps.map((s, i) => (
                <li key={s.title} className="grid grid-cols-[56px_1fr] gap-x-5 border-b border-border py-6">
                  <span className="caps text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                  <div><h3 className="t-lead">{s.title}</h3><p className="text-small mt-2 text-earth">{s.text}</p></div>
                </li>
              ))}
            </ol>
          </Grid>
        </Container>
      </Section>
      <Section className="bg-panel text-panel-foreground">
        <Container>
          <Grid>
            <p className="caps pt-[0.6em] text-muted-foreground md:col-span-3 text-panel-muted">Производство</p>
              <H2 className="md:col-span-9 md:col-start-4">Своё производство <em>«Мебель-Урал»</em></H2>
            <ul className="border-t border-panel-line md:col-span-6 md:col-start-7">
              {F.production.map((p) => <li key={p} className="text-body border-b border-panel-line py-5">{p}</li>)}
            </ul>
          </Grid>
        </Container>
      </Section>
      <Section>
        <Container>
          <Grid>
            <p className="caps pt-[0.6em] text-muted-foreground md:col-span-3">Вопросы</p>
              <H2 className="md:col-span-9 md:col-start-4">Частые <em>вопросы</em></H2>
            <FaqList items={K.faq} className="md:col-span-9 md:col-start-4 md:mt-16" />
          </Grid>
        </Container>
      </Section>
      <CtaSection source="kitchens" title={<>Рассчитаем кухню <em>по вашим размерам</em></>} photo="radishcheva-31/03" />
    </>
  );
}
