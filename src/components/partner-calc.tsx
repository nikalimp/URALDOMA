"use client";

import { useState } from "react";
import { partnerReward } from "@/content/pages";
import { formatRub } from "@/content/tariffs";

// Калькулятор вознаграждения партнёра: послойная шкала 2–6% (content/pages.ts → partners.layers)
export function PartnerCalc() {
  const [sum, setSum] = useState(3_000_000);
  return (
    <div className="grid grid-cols-1 gap-6 border-t border-foreground pt-6 md:grid-cols-2">
      <label className="flex flex-col gap-4">
        <span className="label-mono text-muted-foreground">Сумма договора клиента</span>
        <span className="text-[40px] leading-none tracking-[-0.03em]">{formatRub(sum)}</span>
        <input type="range" min={100_000} max={10_000_000} step={100_000} value={sum} onChange={(e) => setSum(Number(e.target.value))} className="w-full accent-[var(--brand)]" />
      </label>
      <div className="bg-inverse p-6 text-inverse-foreground">
        <p className="label-mono text-inverse-muted">Ваше вознаграждение</p>
        <p aria-live="polite" className="mt-4 text-[48px] leading-none tracking-[-0.035em]">{formatRub(Math.round(partnerReward(sum)))}</p>
      </div>
    </div>
  );
}
