"use client";

import { useEffect, useRef, useState } from "react";
import type { Pic } from "@/content/photos";
import { Img } from "@/components/photo";
import { Container } from "@/components/container";

export type BuildStep = { n: string; title: string; text: string };

// Обложка главной «стройка по скроллу» (03-design §13, референс Ника 11.11.2026): кадр на весь экран закреплён,
// пока секция прокручивается; прокрутка ведёт ролик от бетонной коробки до готовой кухни (video.currentTime = доля).
// Поверх — H1 и шаги ремонта, сменяются по доле прокрутки. Ролика ещё нет — фото объекта «проявляется»:
// из серого бетона в цвет (CSS-фильтр от --p). Весь текст — в HTML; при «уменьшить движение» и без JS —
// финальный кадр и H1, без прокрутки ролика.
export function HeroBuild({ photo, video, steps, children }: { photo: Pic; video?: { src: string; poster: string }; steps: BuildStep[]; children: React.ReactNode }) {
  const sec = useRef<HTMLElement>(null);
  const vid = useRef<HTMLVideoElement>(null);
  const [step, setStep] = useState(0); // 0 — H1, 1…N — шаги

  useEffect(() => {
    const el = sec.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const v = vid.current;
    let raf = 0, target = 0;
    // Ролик перематываем только по готовности кадра: новая цель во время перемотки ставится после события seeked
    const seek = () => { if (v && v.duration && !v.seeking) v.currentTime = target * v.duration; };
    v?.addEventListener("seeked", () => { if (Math.abs(v.currentTime - target * v.duration) > 0.04) seek(); });
    v?.addEventListener("loadedmetadata", seek);
    const update = () => {
      const travel = el.offsetHeight - innerHeight;
      const p = Math.min(1, Math.max(0, -el.getBoundingClientRect().top / travel));
      el.style.setProperty("--p", p.toFixed(3));
      target = p;
      seek();
      setStep(p < 0.12 ? 0 : Math.min(steps.length, 1 + Math.floor(((p - 0.12) / 0.88) * steps.length)));
    };
    const on = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); };
    el.style.setProperty("--p", "0");
    update();
    addEventListener("scroll", on, { passive: true });
    addEventListener("resize", on);
    return () => { removeEventListener("scroll", on); removeEventListener("resize", on); cancelAnimationFrame(raf); };
  }, [steps.length]);

  return (
    <section ref={sec} aria-label="Первый экран" className="hero-build relative -mt-[64px] h-[300svh] md:-mt-[72px] md:h-[400svh]">
      <div className="sticky top-0 h-svh overflow-hidden bg-secondary">
        {video ? (
          <video ref={vid} className="absolute inset-0 size-full object-cover" muted playsInline preload="auto" poster={video.poster} aria-hidden="true">
            <source src={video.src} type="video/mp4" />
          </video>
        ) : (
          <div className="hero-build-photo absolute inset-0"><Img p={photo} eager wide sizes="100vw" /></div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-scrim/70 via-scrim/20 to-scrim/30" aria-hidden="true" />

        <Container className="absolute inset-x-0 bottom-0 pb-20 text-on-photo md:pb-14">
          <div className="relative min-h-[46svh] md:min-h-[52svh]">
            <div className={`build-layer ${step === 0 ? "is-on" : ""}`}>{children}</div>
            {steps.map((s, i) => (
              <div key={s.n} className={`build-layer ${step === i + 1 ? "is-on" : ""}`}>
                <p className="caps text-on-photo/80">{s.n} / {String(steps.length).padStart(2, "0")}</p>
                <h2 className="t-title mt-6 max-w-[14ch]">{s.title}</h2>
                <p className="t-lead mt-6 max-w-[36ch] text-on-photo/90">{s.text}</p>
              </div>
            ))}
          </div>
        </Container>
        {/* Шкала прогресса: четыре деления — обложка и три шага */}
        <ol aria-hidden="true" className="absolute top-[88px] right-[var(--page-pad-mobile)] flex gap-2 md:top-[104px] md:right-[var(--page-pad)]">
          {[0, ...steps.map((_, i) => i + 1)].map((k) => (
            <li key={k} className={`h-[2px] w-8 transition-colors duration-500 md:w-12 ${k <= step ? "bg-on-photo" : "bg-on-photo/30"}`} />
          ))}
        </ol>
      </div>
    </section>
  );
}
