import { site } from "@/content/site";
import { Container, Grid } from "./container";
import { LeadForm } from "./lead-form";

// Финальная заявка — типографика на панели, без фото (решение Ника 22.10.2026, 03-design §9):
// заголовок ступенью title во всю сетку, телефон вводится крупно — как строка в журнале, под ним — четыре условия
// на четырёх силовых направляющих (колонки 1, 4, 7, 10). photo оставлен для совместимости вызовов и не выводится.
const terms: [string, string][] = [
  ["Замер", "Бесплатно, около получаса"],
  ["Смета", "Постатейная, до начала работ"],
  ["Цена", "Фиксируется в договоре"],
  ["Гарантия", "2 года на все работы"],
];

export function CtaSection({ title = <>Консультация, замер и смета — <em>бесплатно</em></>, text = "Оставьте телефон — перезвоним в рабочее время, ответим на вопросы и договоримся о замере. Замер занимает около получаса.", source = "cta" }: { title?: React.ReactNode; text?: string; source?: string; photo?: string }) {
  return (
    <section id="lead" aria-label="Заявка" className="scroll-mt-24 bg-panel py-section-mobile text-panel-foreground md:py-section">
      <Container>
        <Grid className="gap-y-6">
          <p className="caps pt-[0.6em] text-panel-muted md:col-span-3">Заявка</p>
          <h2 className="t-title md:col-span-12">{title}</h2>
        </Grid>
        <Grid className="mt-16 gap-y-12 md:mt-24">
          <div className="md:col-span-3">
            <p className="max-w-[32ch] text-panel-muted">{text}</p>
            <a href={`tel:${site.contacts.phone}`} className="t-lead mt-6 inline-block hover:text-brand">{site.contacts.phoneDisplay}</a>
          </div>
          <LeadForm tone="dark" variant="line" source={source} button="Жду звонка" className="md:col-span-9 md:col-start-4" />
        </Grid>
        <dl className="mt-24 grid grid-cols-2 gap-x-gutter gap-y-10 border-t border-panel-line pt-8 md:mt-32 md:grid-cols-4">
          {terms.map(([k, v]) => (
            <div key={k}>
              <dt className="caps text-panel-muted">{k}</dt>
              <dd className="t-lead mt-3">{v}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
