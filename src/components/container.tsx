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

// Метка раздела: «[ Услуги ]  (02)» — капсом, в квадратных скобках
export function Label({ n, children, className }: { n?: string; children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("caps mb-6 flex items-center gap-4 text-muted-foreground", className)}>
      <span>[ {children} ]</span>
      {n && <span>({n})</span>}
    </p>
  );
}

// H2: гротеск, акцентные слова — <em> курсивом с засечками (стили em в globals.css)
export function H2({ className, count, children, ...props }: React.ComponentProps<"h2"> & { count?: number | string }) {
  return (
    <h2 className={cn("text-[40px] leading-[0.98] tracking-[-0.045em] text-balance md:text-[clamp(52px,5.4vw,96px)]", className)} {...props}>
      {children}
      {count !== undefined && <sup className="sup-count">{count}</sup>}
    </h2>
  );
}

// Заголовок секции: строка-линейка «[ Метка ] (02) ……… счётчик», ниже H2 от 4-й колонки, пояснение — в колонках 1–3
export function SectionHead({ n, label, title, aside, count, className }: { n?: string; label: string; title: React.ReactNode; aside?: React.ReactNode; count?: number | string; className?: string }) {
  return (
    <div className={cn("mb-12 md:mb-20", className)}>
      <div className="caps flex items-baseline justify-between border-t border-current/20 pt-3 text-muted-foreground">
        <span>[ {label} ]{n && <span className="ml-4">({n})</span>}</span>
        {count !== undefined && <span className="label-tech">{String(count).padStart(2, "0")}</span>}
      </div>
      <Grid className="mt-8 items-end md:mt-12">
        <H2 className="md:col-span-9 md:col-start-4 md:row-start-1">{title}</H2>
        {aside && <div className="text-[15px] text-muted-foreground md:col-span-3 md:row-start-1 md:self-end">{aside}</div>}
      </Grid>
    </div>
  );
}

// Бегущая строка: вторая копия скрыта от скринридеров; при reduced motion — статичная строка (globals.css)
export function Marquee({ items, className, itemClassName, speed = "40s", sep = "✦" }: { items: React.ReactNode[]; className?: string; itemClassName?: string; speed?: string; sep?: string }) {
  const row = (hidden?: boolean) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {items.map((it, i) => (
        <li key={i} className={cn("flex items-center whitespace-nowrap", itemClassName)}>
          {it}
          <span aria-hidden="true" className="mx-[0.6em] text-[0.45em] text-brand">{sep}</span>
        </li>
      ))}
    </ul>
  );
  return (
    <div className={cn("marquee", className)} style={{ ["--marquee-speed" as string]: speed }}>
      <div className="marquee-track">{row()}{row(true)}</div>
    </div>
  );
}

export const linkArrow = "inline-flex items-center gap-2 border-b border-current pb-0.5 font-medium text-foreground hover:text-brand";
export const btnPrimary = "inline-flex min-h-[52px] items-center justify-between gap-6 rounded-pill bg-foreground px-7 py-3 text-[15px] font-medium text-background transition-colors hover:bg-brand hover:text-on-brand";
export const btnBrand = btnPrimary;
export const btnOutline = "inline-flex min-h-[52px] items-center justify-center gap-6 rounded-pill border border-foreground/30 px-7 py-3 text-[15px] font-medium transition-colors hover:border-foreground hover:bg-foreground hover:text-background";
// Кнопка на фото: всегда светлая
export const btnOnPhoto = "inline-flex min-h-[52px] items-center justify-between gap-6 rounded-pill bg-on-photo px-7 py-3 text-[15px] font-medium text-on-photo-foreground transition-colors hover:bg-brand hover:text-on-brand";
