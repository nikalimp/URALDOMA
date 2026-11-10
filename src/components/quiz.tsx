"use client";

import { useState } from "react";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";
import { LeadForm } from "./lead-form";

// Квиз для рекламного лендинга: несколько вопросов с вариантами → телефон.
// Цели Метрики: quiz_start — первый ответ (промежуточная цель для обучения стратегии Директа),
// quiz_done — дошли до телефона, lead — заявка отправлена (ставит LeadForm).
type Q = { id: string; q: string; options: string[] };

export function Quiz({ questions, source, title = "Рассчитаем стоимость ремонта вашей квартиры" }: { questions: Q[]; source: string; title?: string }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const total = questions.length;
  const done = step >= total;

  function pick(q: Q, value: string) {
    if (step === 0) window.ym?.(site.metrikaId, "reachGoal", "quiz_start");
    setAnswers((a) => ({ ...a, [q.id]: value }));
    const next = step + 1;
    if (next >= total) window.ym?.(site.metrikaId, "reachGoal", "quiz_done");
    setStep(next);
  }

  const extra = questions.map((q) => `${q.q}: ${answers[q.id] ?? "—"}`).join("; ");

  return (
    <div className="bg-panel p-6 text-panel-foreground md:p-10">
      <div className="flex items-baseline justify-between gap-6">
        <p className="caps text-panel-muted">{done ? "Последний шаг" : `Вопрос ${step + 1} из ${total}`}</p>
        {step > 0 && (
          <button type="button" onClick={() => setStep((s) => s - 1)} className="text-small text-panel-muted underline underline-offset-4 hover:text-panel-foreground">
            Назад
          </button>
        )}
      </div>
      <div className="mt-4 h-px w-full bg-panel-line" aria-hidden="true">
        <div className="h-px bg-brand transition-all" style={{ width: `${(Math.min(step, total) / total) * 100}%` }} />
      </div>

      {!done ? (
        <fieldset key={questions[step].id} className="mt-8">
          <legend className="t-lead">{step === 0 ? title : questions[step].q}</legend>
          {step === 0 && <p className="text-small mt-2 text-panel-muted">{questions[0].q}</p>}
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {questions[step].options.map((o) => (
              <button
                key={o}
                type="button"
                onClick={() => pick(questions[step], o)}
                className={cn(
                  "text-body flex min-h-[64px] items-center justify-between gap-4 border border-panel-line px-5 py-4 text-left transition-colors hover:border-panel-foreground hover:bg-panel-foreground hover:text-panel",
                  answers[questions[step].id] === o && "border-panel-foreground",
                )}
              >
                {o}
                <span aria-hidden="true">→</span>
              </button>
            ))}
          </div>
        </fieldset>
      ) : (
        <div className="mt-8">
          <p className="t-lead">Куда прислать расчёт?</p>
          <p className="text-small mt-2 mb-6 text-panel-muted">Перезвоним в рабочее время, уточним детали и назовём ориентир по стоимости. Замер и смета — бесплатно.</p>
          <LeadForm tone="dark" source={source} extra={`Квиз: ${extra}`} withName button="Получить расчёт" label="Отправить ответы квиза" />
        </div>
      )}
    </div>
  );
}
