"use client";

import { useEffect, useRef, useState } from "react";
import { stages } from "@/content/process";
import { isoParts, isoViewBox } from "@/content/blueprint";
import { cn } from "@/lib/utils";
import { Container, Grid } from "./container";

const pad = (n: number) => String(n).padStart(2, "0");
const N = stages.length;

// Главная, «Как проходит ремонт»: аксонометрия квартиры собирается по стадиям, пока блок закреплён на экране.
// Секция высотой N экранов, внутри — sticky-кадр; стадия = доля прокрученного (03-design §9: одна мысль на экран).
// Чертёж — колонки 1–9 (до направляющей 10), стадии — 10–12. Весь текст стадий в HTML. На телефоне без закрепления: чертёж целиком и список всех стадий.
export function ProcessScroll() {
  const ref = useRef<HTMLElement>(null);
  const [cur, setCur] = useState(1);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = ref.current;
        if (!el || window.innerWidth < 768) return;
        const r = el.getBoundingClientRect();
        const run = Math.max(1, r.height - window.innerHeight);
        const p = Math.min(0.9999, Math.max(0, -r.top / run));
        setCur(Math.floor(p * N) + 1);
      });
    };
    update();
    addEventListener("scroll", update, { passive: true });
    addEventListener("resize", update);
    return () => { removeEventListener("scroll", update); removeEventListener("resize", update); cancelAnimationFrame(raf); };
  }, []);

  // Клик по стадии — прокрутка к её отрезку секции
  const goTo = (n: number) => {
    const el = ref.current;
    if (!el || window.innerWidth < 768) return setCur(n);
    const run = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: el.offsetTop + (run * (n - 0.5)) / N, behavior: "smooth" });
  };

  return (
    <section ref={ref} aria-label="Как проходит ремонт" className="relative bg-panel text-panel-foreground md:h-[calc(var(--n)*70svh+100svh)]" style={{ "--n": N } as React.CSSProperties}>
      <div className="md:sticky md:top-[72px] md:flex md:h-[calc(100svh-72px)] md:flex-col">
        <Container className="flex flex-1 flex-col py-section-mobile md:py-12">
          <Grid className="gap-y-6">
            <p className="caps pt-[0.6em] text-panel-muted md:col-span-3">Как проходит ремонт</p>
            <h2 className="t-statement md:col-span-9 md:col-start-4">{N} стадий — <em>один договор</em></h2>
          </Grid>

          <Grid className="mt-10 min-h-0 flex-1 gap-y-10 md:mt-8">
            <figure className="relative flex min-h-0 flex-col md:col-span-9">
              <figcaption className="caps flex justify-between gap-6 border-t border-panel-line pt-4 text-panel-muted">
                <span><span className="hidden md:inline">Стадия {pad(cur)} — </span>{stages[cur - 1].fig}</span>
                <span className="hidden shrink-0 lg:inline">Квартира 70 м²</span>
              </figcaption>
              <svg viewBox={isoViewBox} role="img" aria-label="Аксонометрия квартиры по стадиям ремонта" className="mt-4 min-h-0 w-full flex-1 md:max-h-[calc(100svh-17rem)]" fill="none" stroke="currentColor" strokeOpacity={0.8} strokeWidth={1.2} strokeLinejoin="round">
                {isoParts.map((l, i) => (
                  <g key={i} className={cn("transition-opacity duration-500", l.s <= cur && (!l.e || cur <= l.e) ? "opacity-100" : l.e ? "opacity-0" : "opacity-100 md:opacity-0", l.s === cur && "md:text-brand")} dangerouslySetInnerHTML={{ __html: l.d }} />
                ))}
              </svg>
            </figure>

            <ol className="md:col-span-3 md:col-start-10">
              {stages.map((s, i) => {
                const n = i + 1;
                const on = n === cur;
                return (
                  <li key={s.title} className="border-t border-panel-line last:border-b">
                    <button type="button" onClick={() => goTo(n)} aria-current={on ? "step" : undefined} className={cn("flex w-full items-baseline gap-x-gutter py-3 text-left transition-colors", on ? "text-panel-foreground" : "text-panel-foreground md:text-panel-muted md:hover:text-panel-foreground")}>
                      <span className="flex-1"><span className="caps block text-panel-muted">{pad(n)} · {s.term}</span><span className="text-body mt-1 block">{s.title}</span></span>
                    </button>
                    <div className={cn("max-w-[62ch] pb-5", !on && "md:hidden")}>
                      <p className="text-small text-panel-foreground/85">{s.text}</p>
                      <p className="text-small mt-3 text-panel-muted"><span className="text-panel-foreground">Вы: </span>{s.client}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </Grid>
        </Container>
      </div>
    </section>
  );
}
