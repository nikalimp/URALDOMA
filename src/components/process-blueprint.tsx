"use client";

import { useState } from "react";
import { stages } from "@/content/process";
import { isoLayers, isoViewBox } from "@/content/blueprint";
import { cn } from "@/lib/utils";

const pad = (n: number) => String(n).padStart(2, "0");

// «Как проходит ремонт»: чертёж-аксонометрия собирается до выбранной стадии + таблица стадий (03-design §4, 21st.dev).
// Стоит на панели (bg-panel): цвета линий — от темы. Сетка — 7 + 5 колонок из 12, ровно по направляющим.
// Описания всех стадий есть в HTML (неактивные — hidden), чтобы текст видели поисковики и нейросети.
export function ProcessBlueprint({ initial = 3 }: { initial?: number }) {
  const [cur, setCur] = useState(initial);
  const pct = Math.round((cur / stages.length) * 100);

  return (
    <div className="grid grid-cols-1 gap-x-5 md:grid-cols-12">
      <figure className="dots relative flex min-w-0 flex-col border-t border-panel-foreground pt-4 text-panel-muted md:col-span-7">
        <figcaption className="font-mono text-[12px] tracking-[0.08em] uppercase">
          <span className="block text-panel-foreground italic">Fig. {pad(cur)} — {stages[cur - 1].fig}</span>
          <span className="mt-1.5 block">Аксонометрия · 1:100 · квартира-пример 70 м²</span>
        </figcaption>
        <svg viewBox={isoViewBox} role="img" aria-label={`Аксонометрия квартиры на стадии «${stages[cur - 1].title}»`} className="mt-4 w-full text-panel-foreground" fill="none" stroke="currentColor" strokeOpacity={0.78} strokeWidth={1.2} strokeLinejoin="round">
          {isoLayers.map((l, i) => (
            <g key={i} style={{ opacity: i < cur ? 1 : 0.1, transition: "opacity .4s" }} dangerouslySetInnerHTML={{ __html: l }} />
          ))}
        </svg>
        <div className="mt-2 mb-6 flex items-center gap-3 font-mono text-[11px]">
          <span className="inline-block h-1.5 w-16 border border-t-0 border-panel-muted" />0 — 2 м
        </div>
      </figure>

      <div className="flex min-w-0 flex-col border-t border-panel-foreground md:col-span-5 md:col-start-8">
        <ol>
          {stages.map((s, i) => {
            const n = i + 1;
            return (
              <li key={s.title}>
                <button type="button" onClick={() => setCur(n)} aria-pressed={n === cur} className={cn("text-small grid min-h-[52px] w-full grid-cols-[48px_1fr_24px] items-center gap-x-3 border-b border-panel-line px-4 py-3.5 text-left font-mono italic transition-colors", n === cur ? "bg-panel-foreground text-panel" : n < cur ? "bg-panel-foreground/[0.06] text-panel-foreground" : "text-panel-muted hover:bg-panel-foreground/[0.04]")}>
                  <span className="text-small">{pad(n)}</span>
                  <span>{s.title}</span>
                  <span aria-hidden="true">{n <= cur ? "✓" : ""}</span>
                </button>
              </li>
            );
          })}
        </ol>
        <div className="flex flex-1 flex-col gap-4 pt-6">
          <div className="flex justify-between font-mono text-[12px] tracking-[0.08em] text-panel-foreground uppercase">
            <span>Стадия {pad(cur)} / {pad(stages.length)}</span>
            <span>{String(pct).padStart(3, "0")}%</span>
          </div>
          <div className="h-[3px] bg-panel-line"><div className="h-[3px] bg-brand transition-[width] duration-500" style={{ width: `${pct}%` }} /></div>
          {stages.map((s, i) => (
            <div key={s.title} hidden={i + 1 !== cur}>
              <h3 className="t-lead text-panel-foreground">{s.title}</h3>
              <p className="text-small mt-2 text-panel-foreground/85">{s.text}</p>
              <ul className="mt-3">
                {s.specs.map(([name, value], j) => (
                  <li key={name} className="text-small grid grid-cols-[28px_1fr_auto] items-center gap-x-3 border-b border-dashed border-panel-line py-3 font-mono">
                    <span className="inline-flex size-[22px] items-center justify-center rounded-pill bg-panel-foreground text-[11px] text-panel">{i * 3 + j + 1}</span>
                    <span className="text-panel-foreground">{name}</span>
                    <span className="text-panel-muted">{value}</span>
                  </li>
                ))}
              </ul>
              <p className="text-small mt-4 text-panel-muted"><span className="text-panel-foreground">Вы: </span>{s.client}</p>
              <p className="text-small mt-4 font-mono text-panel-muted italic">Срок: {s.term}</p>
            </div>
          ))}
        </div>
      </div>

      <p className="t-lead mt-10 border-t border-panel-line pt-5 text-panel-foreground md:col-span-7">График работ, смета и гарантия 2 года — <em className="serif">в договоре до начала ремонта</em></p>
      <p className="text-small mt-10 flex items-start justify-between border-t border-panel-line pt-5 font-mono text-panel-muted md:col-span-5 md:col-start-8"><span>URALDOMA · Екатеринбург</span><span>2016–{new Date().getFullYear()}</span></p>
    </div>
  );
}
