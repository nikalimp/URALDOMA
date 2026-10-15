import { cn } from "@/lib/utils";

// Сетка: контейнер 1440, поля 48 px (мобильный 16), 12 колонок, gutter 24. Стиль v3 — 03-design §5.
export function Container({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("mx-auto w-full max-w-[1440px] px-4 md:px-12", className)} {...props} />;
}

export function Grid({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("grid grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-12", className)} {...props} />;
}

export function Section({ className, ...props }: React.ComponentProps<"section">) {
  return <section className={cn("py-16 md:py-28", className)} {...props} />;
}

// Метка раздела: «Услуги ———— (02)» — подпись, волосяная линия, номер
export function Label({ n, children, className }: { n?: string; children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("label-mono mb-6 flex items-center gap-4 text-muted-foreground", className)}>
      <span>{children}</span>
      <span aria-hidden="true" className="h-px w-16 bg-current opacity-40 md:w-24" />
      {n && <span>({n})</span>}
    </p>
  );
}

export function H2({ className, count, children, ...props }: React.ComponentProps<"h2"> & { count?: number | string }) {
  return (
    <h2 className={cn("text-[34px] leading-[1.04] tracking-[-0.035em] text-balance md:text-[56px]", className)} {...props}>
      {children}
      {count !== undefined && <sup className="sup-count">{count}</sup>}
    </h2>
  );
}

// Заголовок секции: метка + H2 слева, справа — пояснение
export function SectionHead({ n, label, title, aside, count, className }: { n?: string; label: string; title: React.ReactNode; aside?: React.ReactNode; count?: number | string; className?: string }) {
  return (
    <Grid className={cn("mb-12 items-end md:mb-16", className)}>
      <div className="md:col-span-7">
        <Label n={n}>{label}</Label>
        <H2 count={count}>{title}</H2>
      </div>
      {aside && <div className="text-[17px] text-muted-foreground md:col-span-4 md:col-start-9">{aside}</div>}
    </Grid>
  );
}

export const linkArrow = "inline-flex items-center gap-2 border-b border-current pb-0.5 font-medium text-foreground hover:text-brand";
export const btnPrimary = "inline-flex min-h-[52px] items-center justify-between gap-6 rounded-full bg-foreground px-7 py-3 text-[15px] font-medium text-background transition-colors hover:bg-brand hover:text-white";
export const btnBrand = btnPrimary;
export const btnOutline = "inline-flex min-h-[52px] items-center justify-center gap-6 rounded-full border border-foreground/30 px-7 py-3 text-[15px] font-medium transition-colors hover:border-foreground hover:bg-foreground hover:text-background";
