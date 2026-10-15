import { cn } from "@/lib/utils";

// Фуллскрин-сетка по направляющим (03-design §6): во всю ширину окна, поля 20 px / 40 px,
// 12 колонок с gutter 20 px — те же, что рисует <GuideLines />. Контент встаёт на колонки, а не в центр.
export const pagePad = "px-5 md:px-10";
export function Container({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("w-full", pagePad, className)} {...props} />;
}

export function Grid({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("grid grid-cols-1 gap-x-5 gap-y-10 md:grid-cols-12", className)} {...props} />;
}

export function Section({ className, ...props }: React.ComponentProps<"section">) {
  return <section className={cn("py-16 md:py-28", className)} {...props} />;
}

// Метка раздела: «[ Услуги ]  (02)» — капсом, в квадратных скобках, как подписи в шаблонах
export function Label({ n, children, className }: { n?: string; children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("caps mb-6 flex items-center gap-4 text-muted-foreground", className)}>
      <span>[ {children} ]</span>
      {n && <span>({n})</span>}
    </p>
  );
}

export function H2({ className, count, children, ...props }: React.ComponentProps<"h2"> & { count?: number | string }) {
  return (
    <h2 className={cn("text-[36px] leading-[1] tracking-[-0.045em] text-balance md:text-[clamp(48px,5vw,88px)]", className)} {...props}>
      {children}
      {count !== undefined && <sup className="sup-count">{count}</sup>}
    </h2>
  );
}

// Заголовок секции во всю ширину: строка-линейка «[ Метка ] (02) ……… счётчик», ниже H2 от 4-й колонки,
// пояснение — в колонках 1–3 (приём из Designer Portfolio / Studio)
export function SectionHead({ n, label, title, aside, count, className }: { n?: string; label: string; title: React.ReactNode; aside?: React.ReactNode; count?: number | string; className?: string }) {
  return (
    <div className={cn("mb-12 md:mb-20", className)}>
      <div className="caps flex items-baseline justify-between border-t border-current/20 pt-3 text-muted-foreground">
        <span>[ {label} ]{n && <span className="ml-4">({n})</span>}</span>
        {count !== undefined && <span>{count}</span>}
      </div>
      <Grid className="mt-8 items-end md:mt-12">
        <H2 className="md:col-span-9 md:col-start-4 md:row-start-1">{title}</H2>
        {aside && <div className="text-[15px] text-muted-foreground md:col-span-3 md:row-start-1 md:self-end">{aside}</div>}
      </Grid>
    </div>
  );
}

export const linkArrow = "inline-flex items-center gap-2 border-b border-current pb-0.5 font-medium text-foreground hover:text-brand";
export const btnPrimary = "inline-flex min-h-[52px] items-center justify-between gap-6 rounded-full bg-foreground px-7 py-3 text-[15px] font-medium text-background transition-colors hover:bg-brand hover:text-white";
export const btnBrand = btnPrimary;
export const btnOutline = "inline-flex min-h-[52px] items-center justify-center gap-6 rounded-full border border-foreground/30 px-7 py-3 text-[15px] font-medium transition-colors hover:border-foreground hover:bg-foreground hover:text-background";
