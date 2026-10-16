"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

// Счётчик (Number Ticker, 21st.dev): в HTML сразу итоговое число — его видят поисковики и люди без JS.
// Если блок ещё ниже экрана, при появлении число «докручивается» от нуля. Без анимации при reduced motion.
export function Ticker({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(value);
  useEffect(() => {
    const el = ref.current;
    const m = value.match(/^(\D*)(\d+(?:[\s ]\d{3})*)(.*)$/);
    if (!el || !m || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < innerHeight) return; // уже на экране — не трогаем
    const target = Number(m[2].replace(/\D/g, ""));
    const fmt = (n: number) => m[1] + (m[2].match(/[\s ]/) ? n.toLocaleString("ru-RU") : String(n)) + m[3];
    setShown(fmt(0));
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const step = (t: number) => {
        const k = Math.min(1, (t - t0) / 1400);
        const eased = 1 - Math.pow(1 - k, 4);
        setShown(fmt(Math.round(target * eased)));
        if (k < 1) requestAnimationFrame(step);
        else setShown(value);
      };
      requestAnimationFrame(step);
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [value]);
  return <span ref={ref} className={cn("tabular-nums", className)}>{shown}</span>;
}

// Подсветка под курсором (Spotlight): задаёт --mx/--my карточкам .spotlight внутри группы
export function Spotlight({ className, children, ...props }: React.ComponentProps<"div">) {
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const card = (e.target as HTMLElement).closest<HTMLElement>(".spotlight");
    if (!card) return;
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${e.clientX - r.left}px`);
    card.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  return <div onPointerMove={onMove} className={className} {...props}>{children}</div>;
}

// Лента фото с прокруткой по кадрам: кнопки и счётчик; без JS — обычная горизонтальная прокрутка
export function RailControls({ target, total, label }: { target: string; total: number; label: string }) {
  const [i, setI] = useState(1);
  useEffect(() => {
    const el = document.getElementById(target);
    if (!el) return;
    const on = () => {
      const f = el.children[0] as HTMLElement | undefined;
      if (!f) return;
      const end = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
      setI(end ? total : Math.min(total, Math.round(el.scrollLeft / (f.offsetWidth + 20)) + 1));
    };
    el.addEventListener("scroll", on, { passive: true });
    return () => el.removeEventListener("scroll", on);
  }, [target, total]);
  const go = (dir: number) => {
    const el = document.getElementById(target);
    const first = el?.children[0] as HTMLElement | undefined;
    if (!el || !first) return;
    el.scrollBy({ left: dir * (first.offsetWidth + 20), behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };
  const btn = "inline-flex size-12 items-center justify-center rounded-pill border border-foreground/25 transition-colors hover:bg-foreground hover:text-background";
  return (
    <div className="flex items-center gap-3">
      <span className="label-tech mr-3 tabular-nums text-muted-foreground">{String(i).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
      <button type="button" onClick={() => go(-1)} aria-label={`${label}: назад`} aria-controls={target} className={btn}><span aria-hidden="true">←</span></button>
      <button type="button" onClick={() => go(1)} aria-label={`${label}: вперёд`} aria-controls={target} className={btn}><span aria-hidden="true">→</span></button>
    </div>
  );
}
