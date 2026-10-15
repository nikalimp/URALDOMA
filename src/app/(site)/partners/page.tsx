import { partners as P } from "@/content/pages";
import { site } from "@/content/site";
import { Container, Grid, Section, SectionHead, Label, H2 } from "@/components/container";
import { PageHead } from "@/components/page-head";
import { PartnerCalc } from "@/components/partner-calc";
import { LeadForm } from "@/components/lead-form";
import { FaqList } from "@/components/faq";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbs, faqSchema, graph, orgId } from "@/lib/schema";
import { pageMeta } from "@/lib/meta";
import { formatRub } from "@/content/tariffs";

export const metadata = pageMeta({ title: P.metaTitle, description: P.metaDescription, path: "/partners/" });

const range = (from: number, to: number) => (to === Infinity ? `свыше ${formatRub(from)}` : `${formatRub(from)} – ${formatRub(to)}`);

export default function Partners() {
  return (
    <>
      <JsonLd data={graph({ "@type": "WebPage", name: P.h1, url: `${site.url}/partners/`, description: P.answer, publisher: { "@id": orgId } }, faqSchema(P.faq), breadcrumbs([{ name: "Главная", path: "/" }, { name: "Партнёрская программа", path: "/partners/" }]))} />
      <PageHead crumbs={[{ name: "Главная", path: "/" }, { name: "Партнёрская программа" }]} h1={P.h1} answer={P.answer} />
      <Section className="pt-0 md:pt-0">
        <Container>
          <Grid>
            <div className="md:col-span-5">
              <Label n="01">Кому подходит</Label>
              <ul className="border-t border-foreground">{P.allowed.map((a) => <li key={a} className="border-b border-border py-4 text-[18px]">{a}</li>)}</ul>
            </div>
            <div className="md:col-span-6 md:col-start-7">
              <Label n="02">Не допускается</Label>
              <ul className="border-t border-foreground">{P.forbidden.map((a) => <li key={a} className="border-b border-border py-4 text-[18px]">{a}</li>)}</ul>
              <p className="mt-4 text-[14px] text-muted-foreground">Нарушение условий — основание для блокировки и аннулирования неоплаченных начислений.</p>
            </div>
          </Grid>
        </Container>
      </Section>
      <Section className="bg-secondary">
        <Container>
          <SectionHead n="03" label="Шкала" title="Ставка растёт послойно" aside="Каждая часть суммы договора считается по своей ставке — как прогрессивный налог, а не вся сумма по верхнему порогу." />
          <table className="w-full border-t border-foreground text-left text-[18px]">
            <caption className="sr-only">Ставки вознаграждения по слоям суммы договора</caption>
            <thead><tr className="label-mono text-muted-foreground"><th scope="col" className="py-4 font-normal">Слой суммы договора</th><th scope="col" className="py-4 font-normal">Ставка</th></tr></thead>
            <tbody>{P.layers.map((l) => <tr key={l.from} className="border-t border-foreground/15"><td className="py-4">{range(l.from, l.to)}</td><td className="py-4 font-medium">{Math.round(l.rate * 100)}%</td></tr>)}</tbody>
          </table>
          <div className="mt-12"><PartnerCalc /></div>
        </Container>
      </Section>
      <Section>
        <Container>
          <SectionHead n="04" label="Правила" title="Как начисляется вознаграждение" />
          <dl className="grid grid-cols-1 border-t border-foreground md:grid-cols-2">
            {P.rules.map((r) => (
              <div key={r.title} className="border-b border-border py-8 md:odd:border-r md:odd:pr-6 md:even:pl-6">
                <dt className="text-[22px] font-medium">{r.title}</dt>
                <dd className="mt-3 text-[16px] text-earth">{r.text}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </Section>
      <Section className="border-t border-border">
        <Container>
          <Grid>
            <div className="md:col-span-4"><Label n="05">Вопросы</Label><H2>Частые вопросы</H2></div>
            <FaqList items={P.faq} className="md:col-span-7 md:col-start-6" />
          </Grid>
        </Container>
      </Section>
      <Section id="lead" className="bg-earth text-card">
        <Container>
          <Grid>
            <div className="md:col-span-6"><Label className="text-earth-foreground">Заявка</Label><H2>Стать партнёром</H2><p className="mt-6 text-[17px] text-earth-foreground">Оставьте контакты — пришлём партнёрскую ссылку и договоримся об условиях.</p></div>
            <div className="md:col-span-4 md:col-start-9"><LeadForm tone="dark" source="partners" withName button="Стать партнёром" /></div>
          </Grid>
        </Container>
      </Section>
    </>
  );
}
