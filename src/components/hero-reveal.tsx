"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Container, Grid } from "@/components/container";

type Item = { href: string; label: string };

// Фото под обложкой (03-design §11): на десктопе кадр в рамке сетки, при прокрутке рамка уходит и фото
// раскрывается до краёв экрана; поверх по направляющим появляются услуги «(01)…(04)». Прогресс — переменная --p
// (0…1), её ставит JS; рамка и проявление услуг — в CSS (.hero-frame в globals.css). Без JS и при «уменьшить движение»
// --p = 1: фото сразу на весь экран, услуги видны. На телефоне — кадр в сетке, услуги строками под ним.
export function HeroReveal({ children, items, caption }: { children: React.ReactNode; items: Item[]; caption: React.ReactNode }) {
  const sec = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = sec.current;
    if (!el || !matchMedia("(min-width: 768px)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const update = () => {
      const travel = el.offsetHeight - innerHeight;
      const p = Math.min(1, Math.max(0, -el.getBoundingClientRect().top / (travel * 0.8)));
      el.style.setProperty("--p", p.toFixed(3));
    };
    const on = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); };
    el.style.setProperty("--p", "0");
    update();
    addEventListener("scroll", on, { passive: true });
    addEventListener("resize", on);
    return () => { removeEventListener("scroll", on); removeEventListener("resize", on); cancelAnimationFrame(raf); };
  }, []);
  const list = (cls: string) => (
    <ul className={cls}>
      {items.map((it, i) => (
        <li key={it.href} className="md:col-span-3">
          <Link href={it.href} className="caps inline-flex gap-2 hover:underline">
            <span className="opacity-60">({String(i + 1).padStart(2, "0")})</span>{it.label}
          </Link>
        </li>
      ))}
    </ul>
  );
  return (
    <section ref={sec} aria-label="Услуги на фоне объекта" className="hero-reveal relative mt-16 md:mt-24 md:h-[175svh]">
      <div className="md:sticky md:top-0 md:h-svh md:overflow-hidden">
        <div className="hero-frame relative mx-[var(--page-pad-mobile)] aspect-[4/5] overflow-hidden bg-secondary md:absolute md:inset-0 md:mx-0 md:aspect-auto">
          {children}
          <div className="hero-items pointer-events-none absolute inset-0 hidden bg-gradient-to-t from-scrim/70 via-scrim/10 to-scrim/0 md:block" aria-hidden="true" />
          <Container className="hero-items absolute inset-x-0 bottom-10 hidden text-on-photo md:block">
            {list("grid grid-cols-12 gap-x-gutter [&_a]:pointer-events-auto")}
          </Container>
        </div>
      </div>
      <Container className="md:hidden">
        <p className="caps mt-3 flex justify-between gap-6 text-muted-foreground">{caption}</p>
        {list("mt-8 grid grid-cols-2 gap-x-gutter gap-y-4 border-t border-border pt-6")}
      </Container>
    </section>
  );
}
