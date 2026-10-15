import { pic } from "@/content/photos";
import { Container, Grid } from "./container";
import { Crumbs } from "./crumbs";
import { Img } from "./photo";

// Шапка внутренней страницы в духе журнального разворота: крошки, крупный H1 на 9 колонок,
// под ним — прямой ответ (первый абзац страницы, поле answer) с 4-й колонки, затем фото во всю ширину экрана.
export function PageHead({ crumbs, h1, answer, eyebrow, photo, children }: { crumbs: { name: string; path?: string }[]; h1: React.ReactNode; answer: string; eyebrow?: string; photo?: string; children?: React.ReactNode }) {
  const p = photo ? pic(photo) : undefined;
  return (
    <>
      <Container className="pt-10 pb-14 md:pt-14 md:pb-20">
        <Crumbs items={crumbs} />
        <Grid>
          <div className="md:col-span-10">
            {eyebrow && <p className="tag mb-6">{eyebrow}</p>}
            <h1 className="text-[44px] leading-[0.96] tracking-[-0.05em] text-balance md:text-[clamp(60px,6.6vw,120px)]">{h1}</h1>
          </div>
        </Grid>
        <Grid className="mt-10 md:mt-14">
          <p className="caps text-muted-foreground md:col-span-3">[ Коротко ]</p>
          <div className="md:col-span-6 md:col-start-4">
            <p className="text-[19px] leading-[1.45] text-earth md:text-[22px]">{answer}</p>
            {children}
          </div>
        </Grid>
      </Container>
      {p && (
        <figure className="mb-16 md:mb-28">
          <div className="relative h-[62svh] min-h-[360px] overflow-hidden bg-secondary md:h-[86svh]">
            <Img p={p} eager wide sizes="100vw" className="parallax" />
          </div>
          <Container>
            <figcaption className="label-tech mt-3 flex justify-between gap-6 text-muted-foreground"><span>{p.caption}</span><span className="text-right">{p.place}</span></figcaption>
          </Container>
        </figure>
      )}
    </>
  );
}
