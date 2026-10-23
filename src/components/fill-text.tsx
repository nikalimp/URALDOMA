"use client";

import { useEffect, useRef } from "react";

// Заливка текста по скроллу (03-design §11): слова полупрозрачные и темнеют по одному, пока блок
// проходит от низа экрана к его верхней трети. Весь текст — в HTML; без JS и при «уменьшить движение» он сразу тёмный.
export function FillText({ text, className, as: Tag = "p" }: { text: string; className?: string; as?: "p" | "blockquote" | "h2" }) {
  const ref = useRef<HTMLElement>(null);
  const words = text.split(" ");
  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const spans = Array.from(el.querySelectorAll<HTMLElement>(".fill-word"));
    let raf = 0, last = -1;
    const update = () => {
      const r = el.getBoundingClientRect(), vh = innerHeight;
      const start = vh * 0.9, end = vh * 0.35 - r.height * 0.5;
      const p = Math.min(1, Math.max(0, (start - r.top) / (start - end)));
      const n = Math.round(p * spans.length);
      if (n === last) return;
      last = n;
      spans.forEach((s, i) => (i < n ? s.removeAttribute("data-off") : s.setAttribute("data-off", "")));
    };
    const on = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); };
    update();
    addEventListener("scroll", on, { passive: true });
    addEventListener("resize", on);
    return () => { removeEventListener("scroll", on); removeEventListener("resize", on); cancelAnimationFrame(raf); };
  }, []);
  return (
    <Tag ref={ref as never} className={className}>
      {words.map((w, i) => (
        <span key={i} className="fill-word">{w}{i < words.length - 1 ? " " : ""}</span>
      ))}
    </Tag>
  );
}
