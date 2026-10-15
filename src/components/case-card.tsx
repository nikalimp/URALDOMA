import Link from "next/link";
import { type Case, caseCover } from "@/content/cases";
import { cn } from "@/lib/utils";

export function caseMeta(c: Case) {
  return [c.area && `${c.area} м²`, c.tariff, c.term].filter(Boolean).join(" · ");
}

export function CaseCard({ c, ratio = "aspect-[4/3]", className, sizes }: { c: Case; ratio?: string; className?: string; sizes?: string }) {
  const meta = caseMeta(c);
  return (
    <Link href={`/portfolio/${c.slug}/`} className={cn("group block", className)}>
      <div className={cn("overflow-hidden bg-secondary", ratio)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={caseCover(c)} alt={c.alt} loading="lazy" decoding="async" sizes={sizes} className="size-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
      </div>
      <div className="mt-3 flex items-baseline justify-between gap-4 border-t border-border pt-3">
        <span className="text-[17px] font-medium group-hover:text-brand">{c.place}</span>
        {meta && <span className="label-mono shrink-0 text-muted-foreground">{meta}</span>}
      </div>
    </Link>
  );
}
