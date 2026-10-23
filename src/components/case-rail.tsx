"use client";

import { useRef } from "react";
import Link from "next/link";
import type { Case } from "@/content/cases";
import { pic } from "@/content/photos";
import { Img } from "./photo";
import { CaseHover } from "./case-card";

// Объекты на главной: две колонки по направляющим (1–6 и 7–12), горизонтальная прокрутка с привязкой к кадру.
// Стрелки листают на одну колонку; без JavaScript лента прокручивается пальцем, тачпадом и Shift+колесом.
export function CaseRail({ cases, children }: { cases: Case[]; children?: React.ReactNode }) {
  const ref = useRef<HTMLUListElement>(null);
  const go = (dir: number) => {
    const el = ref.current;
    if (!el) return;
    const item = el.querySelector("li");
    const step = item ? item.getBoundingClientRect().width + parseFloat(getComputedStyle(el).columnGap || "0") : el.clientWidth / 2;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };
  const btn = "flex size-[52px] items-center justify-center rounded-pill border border-foreground/30 transition-colors hover:border-foreground hover:bg-foreground hover:text-background";
  return (
    <div>
      <ul ref={ref} className="rail [scroll-padding-inline:0] gap-x-gutter [grid-auto-columns:85%] md:[grid-auto-columns:calc((100%-var(--gutter))/2)]" aria-label="Объекты URALDOMA">
        {cases.map((c) => {
          const p = pic(`${c.slug}/${c.cover}`);
          return (
            <li key={c.slug}>
              <Link href={`/portfolio/${c.slug}/`} data-cursor="(подробнее) ↘" className="group block">
                <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
                  <Img p={p} alt={c.alt} sizes="(min-width: 768px) 50vw, 85vw" className="transition-transform duration-[1.2s] ease-out group-hover:scale-[1.03]" />
                  <CaseHover c={c} />
                </div>
                <div className="mt-5 flex items-baseline justify-between gap-6">
                  <span className="t-lead group-hover:text-brand">{c.place}</span>
                  <span className="caps shrink-0 text-muted-foreground">{c.kind}</span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="mt-10 flex items-center gap-3">
        <div className="mr-auto">{children}</div>
        <button type="button" className={btn} onClick={() => go(-1)} aria-label="Предыдущие объекты"><span aria-hidden="true">←</span></button>
        <button type="button" className={btn} onClick={() => go(1)} aria-label="Следующие объекты"><span aria-hidden="true">→</span></button>
      </div>
    </div>
  );
}
