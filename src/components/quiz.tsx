"use client";

import { useState } from "react";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";
import { LeadForm } from "./lead-form";

// Квиз для рекламного лендинга: несколько вопросов с вариантами → телефон.
// Цели Метрики: quiz_start — первый ответ (промежуточная цель для обучения стратегии Директа),
// quiz_done — дошли до телефона, lead — заявка отправлена (ставит LeadForm).
type Q = { id: string; q: string; options: string[] };
export type Estimate = { questionId: string; tariffs: { name: string; rate: number }[]; ranges: [number, number][] };

const mln = (rub: number) => `${(rub / 1_000_000).toLocaleString("ru-RU", { maximumFractionDigits: 1 })} млн ₽`;

// Ориентир по работам для выбранной площади: границы площади × ставка каждого тарифа.
function estimateRows(e: Estimate, options: string[], answer?: string) {
  const range = answer ? e.ranges[options.indexOf(answer)] : undefined;
  if (!range) return null;
  const [lo, hi] = range;
  return e.tariffs.map((t) => ({
    name: t.name,
    rate: t.rate,
    sum: !lo ? `до ${mln(hi * t.rate)}` : !hi ? `от ${mln(lo * t.rate)}` : `${mln(lo * t.rate)} – ${mln(hi * t.rate)}`,
  }));
}

export function Quiz({ questions, source, estimate, title = "Рассчитаем стоимость ремонта вашей квартиры" }: { questions: Q[]; source: string; estimate?: Estimate; title?: string }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [channel, setChannel] = useState<"Telegram" | "WhatsApp" | "Позвонить">("Telegram");
  const [sent, setSent] = useState(false);
  const total = questions.length;
  const done = step >= total;

  function pick(q: Q, value: string) {
    if (step === 0) window.ym?.(site.metrikaId, "reachGoal", "quiz_start");
    setAnswers((a) => ({ ...a, [q.id]: value }));
    const next = step + 1;
    if (next >= total) window.ym?.(site.metrikaId, "reachGoal", "quiz_done");
    setStep(next);
  }

  const areaQ = estimate && questions.find((q) => q.id === estimate.questionId);
  const rows = estimate && areaQ ? estimateRows(estimate, areaQ.options, answers[estimate.questionId]) : null;
  const extra = questions.map((q) => `${q.q}: ${answers[q.id] ?? "—"}`).join("; ");

  return (
    <div className="bg-panel p-6 text-panel-foreground md:p-10">
      <div className="flex items-baseline justify-between gap-6">
        <p className="caps text-panel-muted">{sent ? "Готово" : done ? "Последний шаг" : `Вопрос ${step + 1} из ${total}`}</p>
        {step > 0 && !sent && (
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
          {!sent && (
            <>
              <p className="t-lead">Расчёт по 3 тарифам готов</p>
              <p className="text-small mt-2 text-panel-muted">Покажем ориентир по вашей площади сразу на экране и пришлём подробную смету удобным способом. Без навязчивых звонков.</p>
              <div className="mt-6 mb-6">
                <p className="caps text-panel-muted">Куда прислать смету?</p>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {(["Telegram", "WhatsApp", "Позвонить"] as const).map((ch) => (
                    <button
                      key={ch}
                      type="button"
                      onClick={() => setChannel(ch)}
                      aria-pressed={channel === ch}
                      className={cn(
                        "text-small min-h-[44px] border px-3 py-2 font-medium transition-colors",
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
            </>
          )}
          <LeadForm
            tone="dark"
            source={source}
            extra={`Способ связи: ${channel}; Квиз: ${extra}`}
            button="Показать расчёт по 3 тарифам"
            label="Отправить ответы квиза"
            onSent={() => setSent(true)}
            sent={
              <div role="status">
                <p className="t-lead">Заявка отправлена</p>
                <p className="text-small mt-2 text-panel-muted">
                  {channel === "Позвонить"
                    ? "Перезвоним в рабочее время и договоримся о бесплатном замере."
                    : `Пришлём подробную смету и примеры похожих квартир в ${channel} в рабочее время.`}
                </p>
                {rows && estimate && (
                  <>
                    <p className="caps mt-8 text-panel-muted">Ориентир по работам · {answers[estimate.questionId]}</p>
                    <dl className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                      {rows.map((r) => (
                        <div key={r.name} className="border-t border-panel-line pt-3">
                          <dt className="text-small text-panel-muted">
                            {r.name} · {r.rate.toLocaleString("ru-RU")} ₽/м²
                          </dt>
                          <dd className="t-lead mt-1">{r.sum}</dd>
                        </div>
                      ))}
                    </dl>
                    <p className="text-small mt-4 text-panel-muted">Это только работы: материалы и мебель считаются отдельно. Точную смету фиксируем в договоре после замера.</p>
                  </>
                )}
              </div>
            }
          />
          {!sent && (
            <p className="text-small mt-6 text-panel-muted">
              Или напишите сразу в <a href={site.contacts.telegram} target="_blank" rel="noopener" className="underline underline-offset-4 hover:text-panel-foreground">Telegram</a> — ответим в переписке.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
