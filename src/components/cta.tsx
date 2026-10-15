import { site } from "@/content/site";
import { Container, Grid, btnBrand } from "./container";
import { LeadForm } from "./lead-form";

// Финальный призыв: тёмная секция, слева заголовок, справа короткая форма.
export function CtaSection({ title = "Консультация, замер и смета — бесплатно", text = "Оставьте телефон — перезвоним в рабочее время, ответим на вопросы и договоримся о замере. Замер занимает около получаса.", source = "cta" }: { title?: string; text?: string; source?: string }) {
  return (
    <section id="lead" className="scroll-mt-24 bg-earth text-card">
      <Container className="py-20 md:py-32">
        <Grid className="items-end">
          <div className="md:col-span-7">
            <p className="label-mono mb-6 text-earth-foreground">Заявка</p>
            <h2 className="text-[38px] leading-[1.02] font-medium tracking-[-0.03em] text-balance md:text-[64px]">{title}</h2>
            <p className="mt-6 max-w-[48ch] text-[17px] text-earth-foreground">{text}</p>
            <div className="mt-10 flex flex-wrap items-center gap-6">
              <a href={site.cta.href} className={btnBrand}>{site.cta.label}<span aria-hidden="true">→</span></a>
              <a href={`tel:${site.contacts.phone}`} className="text-[22px] font-medium hover:text-earth-foreground">{site.contacts.phoneDisplay}</a>
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
