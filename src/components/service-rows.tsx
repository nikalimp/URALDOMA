import Link from "next/link";
import type { Pic } from "@/content/photos";
import { Img } from "@/components/photo";
import { cn } from "@/lib/utils";

export type ServiceRow = { href: string; title: string; note?: string; pics?: Pic[] };

// Услуги строками (03-design §11): в покое — номер, название и цена по направляющим 1/4/10.
// При наведении номер и цена уходят, по краям строки появляются два фото объекта, за курсором — «(подробнее) ↘».
export function ServiceRows({ rows, className }: { rows: ServiceRow[]; className?: string }) {
  const thumb = "pointer-events-none absolute top-1/2 hidden aspect-[4/3] w-[9.5rem] -translate-y-1/2 overflow-hidden opacity-0 transition-[opacity,scale] duration-500 ease-out scale-95 group-hover:scale-100 group-hover:opacity-100 md:block";
  return (
    <ul className={cn("border-t border-border", className)}>
      {rows.map((s, i) => (
        <li key={s.href} className="border-b border-border">
          <Link href={s.href} data-cursor="(подробнее) ↘" className="group relative grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-x-gutter py-6 md:grid-cols-12 md:py-8">
            <span className="caps text-muted-foreground transition-opacity md:col-span-3 md:group-hover:opacity-0">{String(i + 1).padStart(2, "0")}</span>
            <span className="t-lead transition-colors group-hover:text-brand md:col-span-6">{s.title}</span>
            {s.note && (
              <span className="col-start-2 text-small text-muted-foreground transition-opacity md:col-span-3 md:col-start-10 md:text-right md:group-hover:opacity-0">{s.note}</span>
            )}
            {s.pics?.[0] && <span aria-hidden="true" className={cn(thumb, "left-0")}><Img p={s.pics[0]} alt="" sizes="160px" /></span>}
            {s.pics?.[1] && <span aria-hidden="true" className={cn(thumb, "right-0")}><Img p={s.pics[1]} alt="" sizes="160px" /></span>}
          </Link>
        </li>
      ))}
    </ul>
  );
}

// Два фото объекта для превью: обложка услуги и ещё один кадр того же объекта
export function twoPics(key: string, pic: (k: string) => Pic, picsOf: (slug: string) => Pic[]): Pic[] {
  const a = pic(key);
  const b = picsOf(key.split("/")[0]).find((x) => x.key !== key && !x.wide) ?? a;
  return [a, b];
}
