import { pic } from "@/content/photos";
import { Container, Grid } from "./container";
import { Crumbs } from "./crumbs";
import { Img } from "./photo";
import { rise } from "./rise";

// Шапка внутренней страницы: крошки, H1 ступени title, много воздуха, прямой ответ (поле answer) с 4-й колонки ступенью lead,
// затем фото во всю ширину. Без меток и подписей-индексов (03-design §9).
export function PageHead({ crumbs, h1, answer, eyebrow, photo, children }: { crumbs: { name: string; path?: string }[]; h1: React.ReactNode; answer: string; eyebrow?: string; photo?: string; children?: React.ReactNode }) {
  const p = photo ? pic(photo) : undefined;
  return (
    <>
      <Container className="pt-12 pb-20 md:pt-16 md:pb-32">
        <Crumbs items={crumbs} />
        <Grid>
          <div className="md:col-span-9">
            {eyebrow && <p className="tag mb-6">{eyebrow}</p>}
            <h1 className="t-title rise trim">{rise(h1)}</h1>
          </div>
        </Grid>
        <Grid className="mt-16 md:mt-24">
          <div className="md:col-span-6 md:col-start-4">
            <p className="t-lead text-earth">{answer}</p>
            {children}
          </div>
        </Grid>
      </Container>
      {p && (
        <figure className="mb-section-mobile md:mb-section">
          <div className="relative h-[62svh] min-h-[360px] overflow-hidden bg-secondary md:h-[86svh]">
            <Img p={p} eager wide sizes="100vw" className="parallax" />
          </div>
          <Container>
            <figcaption className="caps mt-3 flex justify-between gap-6 text-muted-foreground"><span>{p.caption}</span><span className="text-right">{p.place}</span></figcaption>
          </Container>
        </figure>
      )}
    </>
  );
}
