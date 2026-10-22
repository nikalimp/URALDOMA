"use client";

import { useState } from "react";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";

// Форма заявки: POST /api/lead.php (Telegram + почта, public/api/lead.php). Цель Метрики — "lead".
// extra — данные калькулятора или страницы, приходят в заявку текстом.
declare global {
  interface Window { ym?: (id: number, action: string, goal: string, params?: Record<string, unknown>) => void }
}

type Props = { tone?: "light" | "dark"; source: string; extra?: string; withName?: boolean; button?: string; label?: string; className?: string };

export function LeadForm({ tone = "light", source, extra, withName = false, button = "Получить консультацию", label = "Заявка на консультацию", className }: Props) {
  const [state, setState] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const dark = tone !== "light";

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    data.set("source", source);
    data.set("page", typeof location !== "undefined" ? location.pathname : "");
    if (extra) data.set("extra", extra);
    setState("sending");
    try {
      const res = await fetch("/api/lead.php", { method: "POST", body: data });
      if (!res.ok) throw new Error(String(res.status));
      setState("ok");
      form.reset();
      window.ym?.(site.metrikaId, "reachGoal", "lead", { source });
    } catch {
      setState("error");
    }
  }

  const field = cn("min-h-[48px] w-full border-0 border-b bg-transparent py-2 text-body outline-none placeholder:opacity-50", dark ? "border-panel-line text-panel-foreground focus:border-panel-foreground" : "border-foreground/30 focus:border-foreground");
  const hint = dark ? "text-panel-muted" : "text-muted-foreground";

  if (state === "ok") {
    return (
      <div role="status" className={cn("border-t pt-6", dark ? "border-panel-line text-panel-foreground" : "border-foreground", className)}>
        <p className="t-lead">Заявка отправлена</p>
        <p className={cn("mt-2", hint)}>Перезвоним в рабочее время. Если срочно — звоните: <a href={`tel:${site.contacts.phone}`} className="underline underline-offset-4">{site.contacts.phoneDisplay}</a>.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} aria-label={label} className={cn("flex flex-col gap-5", className)}>
      {withName && (
        <label className={cn("text-small flex flex-col gap-1", hint)}>
          Имя
          <input name="name" autoComplete="name" className={field} />
        </label>
      )}
      <label className={cn("text-small flex flex-col gap-1", hint)}>
        Телефон
        <input name="phone" type="tel" required autoComplete="tel" inputMode="tel" placeholder="+7 ___ ___-__-__" pattern="[0-9+()\- ]{10,20}" className={field} />
      </label>
      {/* Ловушка для ботов: людям не видна */}
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 opacity-0" />
      <label className={cn("flex items-start gap-3 text-[12px] leading-snug", hint)}>
        <input type="checkbox" name="consent" required className="mt-0.5 size-4 shrink-0 accent-brand" />
        <span>Даю <a href="/consent/" target="_blank" className="underline underline-offset-2">согласие на обработку персональных данных</a> и принимаю <a href="/privacy-policy/" target="_blank" className="underline underline-offset-2">политику</a></span>
      </label>
      <button type="submit" disabled={state === "sending"} className={cn("text-small flex min-h-[52px] items-center justify-between gap-6 rounded-pill px-6 text-left font-medium transition-colors disabled:opacity-60", dark ? "bg-panel-foreground text-panel hover:bg-brand hover:text-on-brand" : "bg-foreground text-background hover:bg-brand hover:text-on-brand")}>
        {state === "sending" ? "Отправляем…" : button}
        <span aria-hidden="true">→</span>
      </button>
      {state === "error" && (
        <p role="alert" className={cn("text-small", dark && "text-panel-foreground")}>Не получилось отправить. Позвоните нам: <a href={`tel:${site.contacts.phone}`} className="underline">{site.contacts.phoneDisplay}</a> или напишите на <a href={`mailto:${site.contacts.email}`} className="underline">{site.contacts.email}</a>.</p>
      )}
    </form>
  );
}
