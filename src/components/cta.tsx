import { site } from "@/content/site";
import { Container, Grid } from "./container";
import { LeadForm } from "./lead-form";

// Финальный призыв: тёмная секция, слева заголовок, справа короткая форма.
export function CtaSection({ title = "Консультация, замер и смета — бесплатно", text = "Оставьте телефон — перезвоним в рабочее время, ответим на вопросы и договоримся о замере. Замер занимает около получаса.", source = "cta" }: { title?: string; text?: string; source?: string }) {
  return (
    <section id="lead" className="scroll-mt-24 bg-inverse text-inverse-foreground">
      <Container className="py-20 md:py-32">
        <Grid className="items-end">
          <div className="md:col-span-7">
            <p className="label-mono mb-6 flex items-center gap-4 text-inverse-muted"><span>Заявка</span><span aria-hidden="true" className="h-px w-24 bg-current opacity-40" /></p>
            <h2 className="text-[38px] leading-[1.02] tracking-[-0.04em] text-balance md:text-[72px]">{title}</h2>
            <p className="mt-6 max-w-[48ch] text-[17px] text-inverse-muted">{text}</p>
            <div className="mt-10 flex flex-wrap items-center gap-6">
              <a href={site.cta.href} className="inline-flex min-h-[52px] items-center gap-6 rounded-full border border-inverse-line px-7 text-[15px] font-medium hover:bg-inverse-foreground hover:text-inverse">{site.cta.label}<span aria-hidden="true">→</span></a>
              <a href={`tel:${site.contacts.phone}`} className="text-[22px] hover:text-brand">{site.contacts.phoneDisplay}</a>
            </div>
          </div>
          <div className="md:col-span-4 md:col-start-9">
            <LeadForm tone="dark" source={source} />
          </div>
        </Grid>
      </Container>
    </section>
  );
}
