import { Container, Grid } from "./container";
import { Crumbs } from "./crumbs";

// Шапка внутренней страницы: крошки, H1 на 8 колонок, справа — прямой ответ (первый абзац страницы).
export function PageHead({ crumbs, h1, answer, eyebrow, children }: { crumbs: { name: string; path?: string }[]; h1: string; answer: string; eyebrow?: string; children?: React.ReactNode }) {
  return (
    <Container className="pt-10 pb-16 md:pt-14 md:pb-24">
      <Crumbs items={crumbs} />
      <Grid className="items-end">
        <div className="md:col-span-8">
          {eyebrow && <p className="label-mono mb-6 text-brand">{eyebrow}</p>}
          <h1 className="text-[40px] leading-[1.02] font-medium tracking-[-0.035em] text-balance md:text-[72px]">{h1}</h1>
        </div>
        <div className="md:col-span-4">
          <p className="text-[18px] text-earth">{answer}</p>
          {children}
        </div>
      </Grid>
    </Container>
  );
}
