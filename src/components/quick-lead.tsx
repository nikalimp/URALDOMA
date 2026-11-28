"use client";

import { useState } from "react";
import { site } from "@/content/site";
import { LeadForm } from "./lead-form";
import { cn } from "@/lib/utils";

// Простая форма заявки без квиза: выбор канала (Telegram / WhatsApp / Позвонить) + телефон в 1 шаг.
export function QuickLeadCard({
  source,
  title = "Бесплатный замер и постатейная смета",
  subtitle = "Оставьте телефон — пришлём пример сметы под вашу площадь и договоримся о замере. Без навязчивых звонков.",
  button = "Получить смету и замер",
}: {
  source: string;
  title?: string;
  subtitle?: string;
  button?: string;
}) {
  const [channel, setChannel] = useState<"Telegram" | "WhatsApp" | "Позвонить">("Telegram");

  return (
    <div className="bg-panel p-6 text-panel-foreground md:p-9">
      <p className="caps text-brand">Замер и смета — 0 ₽</p>
      <h2 className="t-lead mt-2">{title}</h2>
      <p className="text-small mt-2 text-panel-muted">{subtitle}</p>

      <div className="mt-5 mb-5">
        <p className="caps text-panel-muted">Как удобнее получить расчёт?</p>
        <div className="mt-2.5 grid grid-cols-3 gap-2">
          {(["Telegram", "WhatsApp", "Позвонить"] as const).map((ch) => (
            <button
              key={ch}
              type="button"
              onClick={() => setChannel(ch)}
              aria-pressed={channel === ch}
              className={cn(
                "text-small min-h-[42px] border px-2 py-2 font-medium transition-colors",
                channel === ch
                  ? "border-panel-foreground bg-panel-foreground text-panel"
                  : "border-panel-line text-panel-muted hover:border-panel-foreground hover:text-panel-foreground",
              )}
            >
              {ch}
            </button>
          ))}
        </div>
      </div>

      <LeadForm
        tone="dark"
        source={source}
        extra={`Способ связи: ${channel}`}
        button={button}
        label={title}
      />

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-panel-line pt-4 text-small text-panel-muted">
        <span>Или напишите сразу:</span>
        <a
          href={site.contacts.telegram}
          target="_blank"
          rel="noopener"
          className="font-medium text-panel-foreground underline underline-offset-4 hover:text-brand"
        >
          Открыть Telegram ↗
        </a>
      </div>
    </div>
  );
}
