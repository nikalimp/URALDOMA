"use client";

import { useState } from "react";
import { stages } from "@/content/process";
import { isoLayers, isoViewBox } from "@/content/blueprint";
import { cn } from "@/lib/utils";

const pad = (n: number) => String(n).padStart(2, "0");

// «Как проходит ремонт»: чертёж-аксонометрия собирается до выбранной стадии + таблица стадий (03-design §4, шаблон 21st.dev).
// Описания всех стадий есть в HTML (неактивные — hidden), чтобы текст видели поисковики и нейросети.
export function ProcessBlueprint({ initial = 3 }: { initial?: number }) {
  const [cur, setCur] = useState(initial);
  const line = "border-earth-foreground/45";
  const pct = Math.round((cur / stages.length) * 100);

  return (
    <div>
      <div className={cn("flex flex-col border lg:flex-row", line)}>
        <div className={cn("relative flex min-w-0 flex-col border-b p-5 md:p-6 lg:flex-[1.4] lg:border-r lg:border-b-0", line)}>
          <div className="font-mono text-[12px] tracking-[0.08em] uppercase">
            <div className="text-background italic">Fig. {pad(cur)} — {stages[cur - 1].fig}</div>
            <div className="mt-1.5 text-accent">Аксонометрия · 1:100 · квартира-пример 70 м²</div>
          </div>
          <svg viewBox={isoViewBox} role="img" aria-label={`Аксонометрия квартиры на стадии «${stages[cur - 1].title}»`} className="mt-4 w-full" fill="none" stroke="#E1D3BC" strokeWidth={1.2} strokeLinejoin="round">
            {isoLayers.map((l, i) => (
              <g key={i} style={{ opacity: i < cur ? 1 : 0.1, transition: "opacity .4s" }} dangerouslySetInnerHTML={{ __html: l }} />
            ))}
          </svg>
          <div className="mt-2 flex items-center gap-3 font-mono text-[11px] text-accent">
            <span className="inline-block h-1.5 w-16 border border-t-0 border-accent" />0 — 2 м
          </div>
        </div>

        <div className="flex min-w-0 flex-col lg:flex-1">
          <ol>
            {stages.map((s, i) => {
              const n = i + 1;
              return (
                <li key={s.title}>
                  <button type="button" onClick={() => setCur(n)} aria-pressed={n === cur} className={cn("grid min-h-[52px] w-full grid-cols-[48px_1fr_24px] items-center gap-x-3 border-b px-5 py-3.5 text-left font-mono text-[14px] italic md:px-6", line, n === cur ? "bg-foreground text-background" : n < cur ? "bg-foreground/30 text-background" : "text-accent hover:bg-foreground/15")}>
                    <span className="text-[13px]">{pad(n)}</span>
                    <span>{s.title}</span>
                    <span aria-hidden="true">{n <= cur ? "✓" : ""}</span>
                  </button>
                </li>
              );
            })}
          </ol>
          <div className="flex flex-1 flex-col gap-4 p-5 md:p-6">
            <div className="flex justify-between font-mono text-[12px] tracking-[0.08em] text-background uppercase">
              <span>Стадия {pad(cur)} / {pad(stages.length)}</span>
              <span>{String(pct).padStart(3, "0")}%</span>
            </div>
            <div className="h-[3px] bg-earth-foreground/25"><div className="h-[3px] bg-background transition-[width] duration-400" style={{ width: `${pct}%` }} /></div>
            {stages.map((s, i) => (
              <div key={s.title} hidden={i + 1 !== cur}>
                <h3 className="text-[20px] font-medium text-background">{s.title}</h3>
                <p className="mt-2 text-[16px] text-background/90">{s.text}</p>
                <ul className="mt-3">
                  {s.specs.map(([name, value], j) => (
                    <li key={name} className={cn("grid grid-cols-[28px_1fr_auto] items-center gap-x-3 border-b border-dashed py-3 font-mono text-[13px]", line)}>
                      <span className="inline-flex size-[22px] items-center justify-center rounded-full bg-secondary text-[11px] text-earth">{i * 3 + j + 1}</span>
                      <span className="text-background">{name}</span>
                      <span className="text-accent">{value}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-[15px] text-accent"><span className="label-mono text-accent/70">Вы: </span>{s.client}</p>
                <p className="mt-4 font-mono text-[13px] text-accent italic">Срок: {s.term}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={cn("flex flex-col border border-t-0 lg:flex-row", line)}>
        <p className={cn("p-5 text-[20px] font-medium tracking-[-0.01em] text-background md:p-6 md:text-[22px] lg:flex-[1.4] lg:border-r", line)}>График работ, смета и гарантия 2 года — в договоре до начала ремонта</p>
        <p className="flex items-center justify-between p-5 font-mono text-[13px] text-accent md:p-6 lg:flex-1"><span>URALDOMA · Екатеринбург</span><span>2016–{new Date().getFullYear()}</span></p>
      </div>
    </div>
  );
}
