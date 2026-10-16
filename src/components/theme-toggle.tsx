"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

// Тема: "system" (по умолчанию, без записи в localStorage), "light" или "dark".
// Начальный класс .dark и цвет панели браузера ставит скрипт в <head> (layout.tsx) до отрисовки — без мигания.
type Mode = "system" | "light" | "dark";
const EVENT = "uraldoma:theme";

function paint(dark: boolean) {
  const d = document.documentElement;
  d.classList.toggle("dark", dark);
  // Цвет панели браузера = токен background выбранной темы
  const bg = getComputedStyle(d).getPropertyValue("--background").trim();
  if (bg) document.querySelector('meta[name="theme-color"]')?.setAttribute("content", bg);
}

// Переключение с анимацией: круг от кнопки (View Transitions), иначе — плавная смена цветов
function apply(mode: Mode, from?: { x: number; y: number }) {
  const dark = mode === "dark" || (mode === "system" && matchMedia("(prefers-color-scheme: dark)").matches);
  try {
    if (mode === "system") localStorage.removeItem("theme");
    else localStorage.setItem("theme", mode);
  } catch {}
  const d = document.documentElement;
  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const vt = (document as Document & { startViewTransition?: (cb: () => void) => unknown }).startViewTransition;
  if (from) { d.style.setProperty("--tx", `${from.x}px`); d.style.setProperty("--ty", `${from.y}px`); }
  if (vt && !calm && d.classList.contains("dark") !== dark) {
    vt.call(document, () => paint(dark));
  } else {
    d.classList.add("theme-anim");
    paint(dark);
    setTimeout(() => d.classList.remove("theme-anim"), 400);
  }
  window.dispatchEvent(new CustomEvent(EVENT, { detail: mode }));
}

function read(): Mode {
  try {
    const t = localStorage.getItem("theme");
    return t === "light" || t === "dark" ? t : "system";
  } catch {
    return "system";
  }
}

// Кнопка в шапке: переключает светлую ↔ тёмную относительно того, что видно сейчас
export function ThemeToggle({ className }: { className?: string }) {
  const toggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    apply(document.documentElement.classList.contains("dark") ? "light" : "dark", { x: r.left + r.width / 2, y: r.top + r.height / 2 });
  };
  return (
    <button type="button" onClick={toggle} aria-label="Переключить тему" title="Светлая / тёмная тема" className={cn("inline-flex size-11 items-center justify-center rounded-pill hover:bg-secondary", className)}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" className="dark:hidden"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" /></svg>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" className="hidden dark:block"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
    </button>
  );
}

// Переключатель в футере: Как в системе · Светлая · Тёмная. Синхронизирован с кнопкой в шапке
export function ThemeSelect() {
  const [mode, setMode] = useState<Mode>("system");
  useEffect(() => {
    setMode(read());
    const on = (e: Event) => setMode((e as CustomEvent<Mode>).detail);
    window.addEventListener(EVENT, on);
    return () => window.removeEventListener(EVENT, on);
  }, []);
  const options: [Mode, string][] = [["system", "Как в системе"], ["light", "Светлая"], ["dark", "Тёмная"]];
  return (
    <div role="radiogroup" aria-label="Тема сайта" className="inline-flex rounded-pill border border-panel-line p-1">
      {options.map(([m, label]) => (
        <button key={m} type="button" role="radio" aria-checked={mode === m} onClick={(e) => { const r = e.currentTarget.getBoundingClientRect(); apply(m, { x: r.left + r.width / 2, y: r.top + r.height / 2 }); }} className={cn("min-h-[32px] rounded-pill px-3 text-[12px] transition-colors", mode === m ? "bg-panel-foreground text-panel" : "text-panel-muted hover:text-panel-foreground")}>
          {label}
        </button>
      ))}
    </div>
  );
}
