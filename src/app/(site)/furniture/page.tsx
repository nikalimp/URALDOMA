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
import { pic } from "@/content/photos";
import { Photo } from "@/components/photo";
import { RailControls } from "@/components/motion";

const gallery = ["garinsky-21/05", "radishcheva-31/07", "trinity-14/01", "obraztsovo/11", "trinity-14/11", "obraztsovo/02", "garinsky-21/01", "obraztsovo/13", "clover-park/05", "radishcheva-31/09"].map(pic);

export const metadata = pageMeta({ title: F.metaTitle, description: F.metaDescription, path: "/furniture/" });

export default function Furniture() {
  return (
    <>
      <JsonLd data={graph({ "@type": "Service", name: "Мебель на заказ «Мебель-Урал»", serviceType: "Изготовление мебели на заказ", description: F.answer, url: `${site.url}/furniture/`, provider: { "@id": orgId }, areaServed: site.areaServed }, faqSchema(F.faq), breadcrumbs([{ name: "Главная", path: "/" }, { name: "Мебель на заказ", path: "/furniture/" }]))} />
      <PageHead crumbs={[{ name: "Главная", path: "/" }, { name: "Мебель на заказ" }]} h1={F.h1} answer={F.answer} photo="radishcheva-31/07" />
      <Section className="pt-0 md:pt-0">
        <Container>
          <SectionHead n="01" label="Что делаем" title={<>Мебель по размерам <em>квартиры</em></>} />
          <ul className="grid grid-cols-1 gap-x-5 sm:grid-cols-2 md:grid-cols-3">
            {F.categories.map((c, i) => (
              <li key={c} className="flex items-baseline gap-4 border-t border-foreground pt-4 pb-8 text-[24px] tracking-[-0.015em]">
                <span className="font-serif text-[28px] leading-none text-brand italic">{String(i + 1).padStart(2, "0")}</span>{c}
              </li>
            ))}
          </ul>
          <Link href="/furniture/custom-kitchens/" className={`${linkArrow} mt-8`}>Кухни на заказ <span aria-hidden="true">→</span></Link>
        </Container>
      </Section>
      <section aria-label="Мебель в наших объектах" className="pb-16 md:pb-28">
        <Container>
          <Grid className="mb-10 items-end md:mb-14">
            <div className="md:col-span-8"><Label>Галерея</Label><H2>Кухни и встроенная мебель <em>в наших ремонтах</em></H2></div>
            <div className="flex md:col-span-4 md:col-start-9 md:justify-end"><RailControls target="furniture-rail" total={gallery.length} label="Галерея" /></div>
          </Grid>
        </Container>
        <ul id="furniture-rail" className="rail auto-cols-[78%] gap-x-5 px-5 sm:auto-cols-[42%] md:auto-cols-[calc((100%-60px)/4)] md:px-10">
          {gallery.map((p, i) => <li key={p.key}><Photo p={p} link index={`Fig. ${String(i + 1).padStart(2, "0")}`} sizes="(min-width: 768px) 25vw, 80vw" /></li>)}
        </ul>
      </section>
      <Section className="bg-panel text-panel-foreground">
        <Container>
          <Grid>
            <div className="md:col-span-5"><Label n="02" className="text-panel-muted">Производство</Label><H2>Своё производство <em>в Екатеринбурге</em></H2></div>
            <ul className="border-t border-panel-line md:col-span-6 md:col-start-7">
              {F.production.map((p) => <li key={p} className="border-b border-panel-line py-5 text-[18px]">{p}</li>)}
            </ul>
          </Grid>
        </Container>
      </Section>
      <Section>
        <Container>
          <SectionHead n="03" label="Как работаем" title={<>От проекта <em>до установки</em></>} />
          <ol className="grid grid-cols-1 gap-x-5 sm:grid-cols-2 md:grid-cols-4">
            {F.process.map((p, i) => (
              <li key={p.title} className="border-t border-foreground pt-5 pb-10">
                <span className="font-mono text-[13px] text-brand">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 text-[20px]">{p.title}</h3>
                <p className="mt-2 text-[15px] text-earth">{p.text}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>
      <Section className="border-t border-border">
        <Container>
          <Grid>
            <div className="md:col-span-4"><Label n="04">Вопросы</Label><H2>Частые <em>вопросы</em></H2></div>
            <FaqList items={F.faq} className="md:col-span-7 md:col-start-6" />
          </Grid>
        </Container>
      </Section>
      <CtaSection source="furniture" title={<>Рассчитаем мебель <em>по вашему проекту</em></>} photo="trinity-14/01" />
    </>
  );
}
