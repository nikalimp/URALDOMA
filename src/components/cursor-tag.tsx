"use client";

import { useEffect, useRef, useState } from "react";

// Плашка за курсором (03-design §11): над элементами с data-cursor="…" показывает их подпись,
// например «(подробнее) ↘». Только мышь: на сенсорных экранах скрыта (globals.css), ссылка работает и без неё.
export function CursorTag() {
  const ref = useRef<HTMLDivElement>(null);
  const [text, setText] = useState("");
  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia("(pointer: coarse)").matches) return;
    let raf = 0, x = 0, y = 0;
    const move = (e: PointerEvent) => {
      x = e.clientX; y = e.clientY;
      const t = (e.target as Element | null)?.closest?.("[data-cursor]");
      if (t) { setText(t.getAttribute("data-cursor") || ""); el.setAttribute("data-on", ""); } else el.removeAttribute("data-on");
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => { el.style.transform = `translate3d(${x + 18}px, ${y + 18}px, 0)`; });
    };
    const leave = () => el.removeAttribute("data-on");
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    window.addEventListener("scroll", leave, { passive: true });
    return () => { window.removeEventListener("pointermove", move); document.removeEventListener("pointerleave", leave); window.removeEventListener("scroll", leave); cancelAnimationFrame(raf); };
  }, []);
  return <div ref={ref} className="cursor-tag caps bg-foreground px-3 py-2 text-background" aria-hidden="true">{text}</div>;
}
