import { site } from "@/content/site";
import { pic } from "@/content/photos";
import { Container, Grid } from "./container";
import { LeadForm } from "./lead-form";
import { Img } from "./photo";

// Финальный призыв: панель в цвет темы, слева фото объекта до края экрана, справа заголовок и форма с бегущим лучом.
export function CtaSection({ title = <>Консультация, замер и смета — <em>бесплатно</em></>, text = "Оставьте телефон — перезвоним в рабочее время, ответим на вопросы и договоримся о замере. Замер занимает около получаса.", source = "cta", photo = "obraztsovo/03" }: { title?: React.ReactNode; text?: string; source?: string; photo?: string }) {
  const p = pic(photo);
  return (
    <section id="lead" aria-label="Заявка" className="scroll-mt-24 bg-panel text-panel-foreground">
      <Container>
        <Grid className="gap-y-0">
          <div className="relative -mx-5 aspect-[4/5] overflow-hidden md:col-span-6 md:-ml-10 md:mr-0 md:aspect-auto md:min-h-[760px]">
            <Img p={p} sizes="(min-width: 768px) 50vw, 100vw" className="parallax" />
            <p className="label-tech absolute bottom-5 left-5 text-on-photo/90 md:left-10">{p.caption} · {p.place}</p>
          </div>
          <div className="flex flex-col justify-between gap-12 py-16 md:col-span-5 md:col-start-8 md:py-24">
            <div>
              <p className="caps mb-6 flex items-center gap-4 text-panel-muted"><span>[ Заявка ]</span><span aria-hidden="true" className="h-px w-24 bg-current opacity-40" /></p>
              <h2 className="text-[40px] leading-[0.98] tracking-[-0.045em] text-balance md:text-[clamp(48px,4.4vw,80px)]">{title}</h2>
              <p className="mt-6 max-w-[44ch] text-[17px] text-panel-muted">{text}</p>
              <a href={`tel:${site.contacts.phone}`} className="mt-8 inline-block text-[24px] tracking-[-0.02em] hover:text-brand">{site.contacts.phoneDisplay}</a>
            </div>
            <div className="beam rounded-card bg-background p-6 text-foreground md:p-8">
              <LeadForm source={source} />
            </div>
          </div>
        </Grid>
      </Container>
    </section>
  );
}
