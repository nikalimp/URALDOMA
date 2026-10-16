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
      <PageHead crumbs={[{ name: "Главная", path: "/" }, { name: "Партнёрская программа" }]} h1={P.h1} answer={P.answer} photo="trinity-14/12" />
      <Section className="pt-0 md:pt-0">
        <Container>
          <Grid>
            <div className="md:col-span-5">
              <Label n="01">Кому подходит</Label>
              <ul className="border-t border-border">{P.allowed.map((a) => <li key={a} className="text-body border-b border-border py-4">{a}</li>)}</ul>
            </div>
            <div className="md:col-span-6 md:col-start-7">
              <Label n="02">Не допускается</Label>
              <ul className="border-t border-border">{P.forbidden.map((a) => <li key={a} className="text-body border-b border-border py-4">{a}</li>)}</ul>
              <p className="text-small mt-4 text-muted-foreground">Нарушение условий — основание для блокировки и аннулирования неоплаченных начислений.</p>
            </div>
          </Grid>
        </Container>
      </Section>
      <Section>
        <Container>
          <SectionHead n="03" label="Шкала" title={<>Ставка растёт <em>послойно</em></>} aside="Каждая часть суммы договора считается по своей ставке — как прогрессивный налог, а не вся сумма по верхнему порогу." />
          <table className="text-body w-full border-t border-border text-left">
            <caption className="sr-only">Ставки вознаграждения по слоям суммы договора</caption>
            <thead><tr className="label-mono text-muted-foreground"><th scope="col" className="py-4 font-normal">Слой суммы договора</th><th scope="col" className="py-4 font-normal">Ставка</th></tr></thead>
            <tbody>{P.layers.map((l) => <tr key={l.from} className="border-t border-border/15"><td className="py-4">{range(l.from, l.to)}</td><td className="py-4 font-medium">{Math.round(l.rate * 100)}%</td></tr>)}</tbody>
          </table>
          <div className="mt-12"><PartnerCalc /></div>
        </Container>
      </Section>
      <Section>
        <Container>
          <SectionHead n="04" label="Правила" title={<>Как начисляется <em>вознаграждение</em></>} />
          <dl className="grid grid-cols-1 gap-x-5 md:grid-cols-2">
            {P.rules.map((r) => (
              <div key={r.title} className="border-t border-border pt-5 pb-10">
                <dt className="t-lead">{r.title}</dt>
                <dd className="text-small mt-3 text-earth">{r.text}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </Section>
      <Section>
        <Container>
          <Grid>
            <p className="caps pt-[0.6em] text-muted-foreground md:col-span-3">Вопросы</p>
              <H2 className="md:col-span-9 md:col-start-4">Частые <em>вопросы</em></H2>
            <FaqList items={P.faq} className="md:col-span-9 md:col-start-4 md:mt-16" />
          </Grid>
        </Container>
      </Section>
      <Section id="lead" className="bg-panel text-panel-foreground">
        <Container>
          <Grid>
            <div className="md:col-span-6"><Label className="text-panel-muted">Заявка</Label><H2>Стать <em>партнёром</em></H2><p className="text-body mt-6 text-panel-muted">Оставьте контакты — пришлём партнёрскую ссылку и договоримся об условиях.</p></div>
            <div className="rounded-card bg-background p-6 text-foreground md:col-span-5 md:col-start-8 md:p-8"><LeadForm source="partners" withName button="Стать партнёром" /></div>
          </Grid>
        </Container>
      </Section>
    </>
  );
}
