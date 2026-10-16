import { cn } from "@/lib/utils";

// Фуллскрин-сетка по направляющим (03-design §6–8): во всю ширину окна, поля page-pad-mobile / page-pad (20 / 40 px),
// 12 колонок с gutter 20 px — те же, что рисует <GuideLines />. Значения — токены дизайн-системы (design-system/tokens.json). Правило: любой ряд блоков — на этой сетке
// (gap-x-5, число колонок делит 12); «ящики» с общими рамками без зазоров не используем — только линия сверху.
export const pagePad = "px-page-pad-mobile md:px-page-pad";
export function Container({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("w-full", pagePad, className)} {...props} />;
}

export function Grid({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("grid grid-cols-1 gap-x-gutter gap-y-10 md:grid-cols-12", className)} {...props} />;
}

export function Section({ className, ...props }: React.ComponentProps<"section">) {
  return <section className={cn("py-section-mobile md:py-section", className)} {...props} />;
}

// Метка раздела: одна строка капсом, без скобок и номеров (03-design §9). n оставлен для совместимости и не выводится.
export function Label({ children, className }: { n?: string; children: React.ReactNode; className?: string }) {
  return <p className={cn("caps mb-6 text-muted-foreground", className)}>{children}</p>;
}

// H2 — ступень statement: крупное утверждение, акцентные слова — <em> курсивом с засечками
export function H2({ className, children, count: _count, ...props }: React.ComponentProps<"h2"> & { count?: number | string }) {
  void _count;
  return <h2 className={cn("t-statement", className)} {...props}>{children}</h2>;
}

// Заголовок секции: метка в колонках 1–3, утверждение с 4-й, пояснение под ним тише. Ниже — пауза space-24.
// Бегущая строка, счётчики и номера разделов убраны (03-design §9).
export function SectionHead({ label, title, aside, className }: { n?: string; label: string; title: React.ReactNode; aside?: React.ReactNode; count?: number | string; className?: string }) {
  return (
    <Grid className={cn("mb-16 gap-y-6 md:mb-24", className)}>
      <p className="caps pt-[0.6em] text-muted-foreground md:col-span-3">{label}</p>
      <div className="md:col-span-9 md:col-start-4">
        <H2 className="max-w-[18ch]">{title}</H2>
        {aside && <div className="mt-8 max-w-[52ch] text-muted-foreground">{aside}</div>}
      </div>
    </Grid>
  );
}

export const linkArrow = "inline-flex items-center gap-2 border-b border-current pb-0.5 font-medium text-foreground hover:text-brand";
export const btnPrimary = "inline-flex min-h-[52px] items-center justify-between gap-6 rounded-pill bg-foreground px-7 py-3 text-[15px] font-medium text-background transition-colors hover:bg-brand hover:text-on-brand";
export const btnBrand = btnPrimary;
export const btnOutline = "inline-flex min-h-[52px] items-center justify-center gap-6 rounded-pill border border-foreground/30 px-7 py-3 text-[15px] font-medium transition-colors hover:border-foreground hover:bg-foreground hover:text-background";
// Кнопка на фото: всегда светлая
export const btnOnPhoto = "inline-flex min-h-[52px] items-center justify-between gap-6 rounded-pill bg-on-photo px-7 py-3 text-[15px] font-medium text-on-photo-foreground transition-colors hover:bg-brand hover:text-on-brand";
