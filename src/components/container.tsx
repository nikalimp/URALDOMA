import { cn } from "@/lib/utils";

// Швейцарская сетка (03-design §3.1): контейнер 1440, поля 48 px (мобильный 16), 12 колонок, gutter 24.
export function Container({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("mx-auto w-full max-w-[1440px] px-4 md:px-12", className)} {...props} />;
}

export function Grid({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("grid grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-12", className)} {...props} />;
}

export function Section({ className, ...props }: React.ComponentProps<"section">) {
  return <section className={cn("py-16 md:py-32", className)} {...props} />;
}

// «01 — Услуги»: моно-метка над заголовком секции
export function Label({ n, children, className }: { n?: string; children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("label-mono mb-6 text-muted-foreground", className)}>
      {n && <>{n} — </>}
      {children}
    </p>
  );
}

export function H2({ className, ...props }: React.ComponentProps<"h2">) {
  return <h2 className={cn("text-[34px] leading-[1.05] font-medium tracking-[-0.03em] text-balance md:text-[52px]", className)} {...props} />;
}

// Заголовок секции: метка + H2 в колонках 1–5, справа — опциональный текст
export function SectionHead({ n, label, title, aside, className }: { n?: string; label: string; title: React.ReactNode; aside?: React.ReactNode; className?: string }) {
  return (
    <Grid className={cn("mb-12 items-end md:mb-16", className)}>
      <div className="md:col-span-6">
        <Label n={n}>{label}</Label>
        <H2>{title}</H2>
      </div>
      {aside && <div className="text-[17px] text-muted-foreground md:col-span-5 md:col-start-8">{aside}</div>}
    </Grid>
  );
}

export const linkArrow = "inline-flex items-center gap-2 font-medium text-foreground hover:text-brand";
export const btnPrimary = "inline-flex min-h-[52px] items-center justify-between gap-6 bg-foreground px-7 py-4 text-[16px] font-medium text-card hover:bg-brand";
export const btnBrand = "inline-flex min-h-[52px] items-center justify-between gap-6 bg-brand px-7 py-4 text-[16px] font-medium text-card hover:bg-foreground";
export const btnOutline = "inline-flex min-h-[52px] items-center justify-center gap-6 border border-foreground px-7 py-4 text-[16px] font-medium hover:bg-foreground hover:text-card";
