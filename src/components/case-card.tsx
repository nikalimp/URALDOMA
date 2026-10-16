import Link from "next/link";
import { type Case } from "@/content/cases";
import { pic } from "@/content/photos";
import { cn } from "@/lib/utils";
import { Img } from "./photo";

export function caseMeta(c: Case) {
  return [c.area && `${c.area} м²`, c.tariff, c.term].filter(Boolean).join(" · ");
}

// Карточка объекта: обложка 3:4, место и тип; при наведении — плавное приближение
export function CaseCard({ c, ratio = "aspect-[3/4]", className, sizes = "(min-width: 768px) 33vw, 100vw", index }: { c: Case; ratio?: string; className?: string; sizes?: string; index?: string }) {
  const meta = caseMeta(c);
  const p = pic(`${c.slug}/${c.cover}`);
  return (
    <Link href={`/portfolio/${c.slug}/`} className={cn("group block", className)}>
      <div className={cn("relative overflow-hidden bg-secondary", ratio)}>
        <Img p={p} alt={c.alt} sizes={sizes} className="transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]" />
              </div>
      <div className="mt-4 flex items-baseline justify-between gap-4">
        <span className="group-hover:text-brand">{c.place}</span>
        {meta ? <span className="label-mono shrink-0 text-muted-foreground">{meta}</span> : <span className="tag shrink-0 text-muted-foreground">{c.kind}</span>}
      </div>
    </Link>
  );
}
