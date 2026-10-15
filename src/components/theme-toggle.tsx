"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

// Тема: "system" (по умолчанию, без записи в localStorage), "light" или "dark".
// Начальный класс .dark ставит скрипт в <head> (layout.tsx) до отрисовки — без мигания.
type Mode = "system" | "light" | "dark";

function apply(mode: Mode) {
  const dark = mode === "dark" || (mode === "system" && matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", dark);
  try {
    if (mode === "system") localStorage.removeItem("theme");
    else localStorage.setItem("theme", mode);
  } catch {}
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
  const toggle = () => apply(document.documentElement.classList.contains("dark") ? "light" : "dark");
  return (
    <button type="button" onClick={toggle} aria-label="Переключить тему" title="Светлая / тёмная тема" className={cn("inline-flex size-11 items-center justify-center rounded-full hover:bg-secondary", className)}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" className="dark:hidden"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" /></svg>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" className="hidden dark:block"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
    </button>
  );
}

// Переключатель в футере: Система · Светлая · Тёмная
export function ThemeSelect() {
  const [mode, setMode] = useState<Mode>("system");
  useEffect(() => setMode(read()), []);
  const options: [Mode, string][] = [["system", "Как в системе"], ["light", "Светлая"], ["dark", "Тёмная"]];
  return (
    <div role="radiogroup" aria-label="Тема сайта" className="inline-flex rounded-full border border-inverse-line p-1">
      {options.map(([m, label]) => (
        <button key={m} type="button" role="radio" aria-checked={mode === m} onClick={() => { apply(m); setMode(m); }} className={cn("min-h-[32px] rounded-full px-3 text-[12px]", mode === m ? "bg-inverse-foreground text-inverse" : "text-inverse-muted hover:text-inverse-foreground")}>
          {label}
        </button>
      ))}
    </div>
  );
}
