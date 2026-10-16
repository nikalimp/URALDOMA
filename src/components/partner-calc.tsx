"use client";

import { useState } from "react";
import { partnerReward } from "@/content/pages";
import { formatRub } from "@/content/tariffs";

// Калькулятор вознаграждения партнёра: послойная шкала 2–6% (content/pages.ts → partners.layers)
export function PartnerCalc() {
  const [sum, setSum] = useState(3_000_000);
  return (
    <div className="grid grid-cols-1 gap-x-5 gap-y-6 border-t border-foreground pt-6 md:grid-cols-2">
      <label className="flex flex-col gap-4">
        <span className="label-mono text-muted-foreground">Сумма договора клиента</span>
        <span className="t-statement">{formatRub(sum)}</span>
        <input type="range" min={100_000} max={10_000_000} step={100_000} value={sum} onChange={(e) => setSum(Number(e.target.value))} className="w-full accent-brand" />
      </label>
      <div className="bg-panel p-6 text-panel-foreground">
        <p className="label-mono text-panel-muted">Ваше вознаграждение</p>
        <p aria-live="polite" className="t-statement mt-4">{formatRub(Math.round(partnerReward(sum)))}</p>
      </div>
    </div>
  );
}
