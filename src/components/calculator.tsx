"use client";

import { useMemo, useState } from "react";
import { tariffs, formatRub } from "@/content/tariffs";
import { designPrice } from "@/content/prices";
import { cn } from "@/lib/utils";
import { LeadForm } from "./lead-form";

// Калькулятор стоимости работ: площадь × ставка тарифа (+ дизайн-проект). Итог — ориентир, точная смета после замера.
export function Calculator() {
  const [area, setArea] = useState(60);
  const [tariff, setTariff] = useState<(typeof tariffs)[number]["id"]>("extended");
  const [design, setDesign] = useState(true);

  const t = tariffs.find((x) => x.id === tariff)!;
  const works = area * t.rate;
  const dp = design ? area * designPrice.rate : 0;
  const total = works + dp;
  const extra = useMemo(
    () => `Калькулятор: ${area} м², тариф «${t.name}», дизайн-проект: ${design ? "да" : "нет"}, ориентир ${formatRub(total)}`,
    [area, t.name, design, total],
  );

  return (
    <div className="grid grid-cols-1 gap-x-5 gap-y-12 md:grid-cols-12">
      <div className="md:col-span-6">
        <fieldset className="border-t border-foreground pt-6">
          <legend className="label-mono float-left mb-6 w-full text-muted-foreground">01 — Площадь квартиры</legend>
          <div className="clear-both flex items-end gap-6">
            <label className="sr-only" htmlFor="calc-area">Площадь, м²</label>
            <input id="calc-area" type="number" min={15} max={400} value={area} onChange={(e) => setArea(Math.max(0, Math.min(400, Number(e.target.value) || 0)))} style={{ width: `${String(area).length + 0.5}ch` }} className="border-0 border-b border-foreground bg-transparent text-[64px] leading-none tracking-[-0.05em] outline-none focus:border-brand md:text-[112px]" />
            <span className="pb-3 text-[24px] text-muted-foreground">м²</span>
          </div>
          <input type="range" min={20} max={250} step={1} value={Math.min(250, Math.max(20, area))} onChange={(e) => setArea(Number(e.target.value))} aria-label="Площадь, м²" className="mt-6 w-full accent-[var(--brand)]" />
        </fieldset>

        <fieldset className="mt-12 border-t border-foreground pt-6">
          <legend className="label-mono float-left mb-6 w-full text-muted-foreground">02 — Тариф</legend>
          <div className="clear-both grid grid-cols-1 gap-x-5 gap-y-3 sm:grid-cols-3">
            {tariffs.map((x) => (
              <label key={x.id} className={cn("flex min-h-[132px] cursor-pointer flex-col justify-between border-t p-4 transition-colors", tariff === x.id ? "border-foreground bg-foreground text-background" : "border-foreground bg-card hover:bg-secondary")}>
                <input type="radio" name="tariff" value={x.id} checked={tariff === x.id} onChange={() => setTariff(x.id)} className="sr-only" />
                <span className="text-[18px] font-medium">{x.name}</span>
                <span className="text-[24px] tracking-[-0.02em]">{formatRub(x.rate)}<span className={cn("text-[14px]", tariff === x.id ? "opacity-70" : "text-muted-foreground")}> / м²</span></span>
              </label>
            ))}
          </div>
          <p className="mt-4 text-[15px] text-earth">{t.short}</p>
        </fieldset>

        <fieldset className="mt-12 border-t border-foreground pt-6">
          <legend className="label-mono float-left mb-6 w-full text-muted-foreground">03 — Дизайн-проект</legend>
          <label className="clear-both flex cursor-pointer items-center gap-4 text-[18px]">
            <input type="checkbox" checked={design} onChange={(e) => setDesign(e.target.checked)} className="size-5 accent-[var(--brand)]" />
            Нужен дизайн-проект — {formatRub(designPrice.rate)} / м²
          </label>
        </fieldset>
      </div>

      <div className="md:col-span-5 md:col-start-8">
        <div className="beam bg-panel p-6 text-panel-foreground md:sticky md:top-28 md:p-8">
          <p className="label-mono text-panel-muted">Ориентир стоимости работ</p>
          <p aria-live="polite" className="mt-4 text-[44px] leading-none tracking-[-0.04em] md:text-[56px]">{formatRub(total)}</p>
          <dl className="mt-6 space-y-2 border-t border-panel-line pt-4 text-[15px]">
            <div className="flex justify-between gap-4"><dt className="text-panel-muted">Работы, {t.name.toLowerCase()}</dt><dd>{formatRub(works)}</dd></div>
            {design && <div className="flex justify-between gap-4"><dt className="text-panel-muted">Дизайн-проект</dt><dd>{formatRub(dp)}</dd></div>}
          </dl>
          <p className="mt-4 text-[13px] text-panel-muted">Без материалов и мебели. Точную смету фиксируем в договоре после бесплатного замера.</p>
          <div className="mt-8 border-t border-panel-line pt-6">
            <p className="mb-4 text-[17px]">Получить смету по этому расчёту</p>
            <LeadForm tone="dark" source="calculator" extra={extra} button="Отправить расчёт" />
          </div>
        </div>
      </div>
    </div>
  );
}
