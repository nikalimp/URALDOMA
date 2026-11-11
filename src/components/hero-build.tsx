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
// frames — кадры стройки от бетона до готовой кухни (1920 и 960 px по ширине). Сменяются растворением по прокрутке.
export type BuildFrame = { src: string; small: string; alt: string };
// assembly — сборка по элементам, как в референсе: база (пустая комната после чистовой) и финальное фото,
// из которого по маскам проявляются элементы — нижний ряд, фартук, пенал, верхние шкафы, свет, стол.
// points — многоугольник в координатах кадра 1920×1080; from/to — отрезок --q, на котором элемент появляется;
// dy — откуда он «приезжает», % высоты (+ снизу, − сверху). Маска с растушёвкой, размер cover — совпадает с object-cover.
export type BuildPart = { points: string; from: number; to: number; dy: number };
const maskUrl = (points: string) =>
  `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='1920' height='1080' viewBox='0 0 1920 1080'><filter id='b' x='-5%' y='-5%' width='110%' height='110%'><feGaussianBlur stdDeviation='5'/></filter><polygon points='${points}' fill='white' filter='url(%23b)'/></svg>`).replace(/%2523/g, "%23")}")`;

export function HeroBuild({ photo, video, frames, assembly, steps, children }: { photo: Pic; video?: { src: string; small?: string; poster: string; end: string; alt: string }; frames?: BuildFrame[]; assembly?: { base: BuildFrame; final: BuildFrame; parts: BuildPart[] }; steps: BuildStep[]; children: React.ReactNode }) {
  const sec = useRef<HTMLElement>(null);
  const vid = useRef<HTMLVideoElement>(null);
  const [step, setStep] = useState(0); // 0 — H1, 1…N — шаги

  useEffect(() => {
    const el = sec.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const v = vid.current;
    let raf = 0, target = 0, blobUrl = "";
    // Ролик грузим целиком в Blob: так перемотка не ждёт сеть и не зависит от поддержки Range у хостинга.
    // На узком экране — лёгкая версия 720p с ключевым кадром каждые 4 кадра.
    if (v && video) {
      const src = innerWidth < 768 && video.small ? video.small : video.src;
      fetch(src).then((r) => r.blob()).then((b) => { blobUrl = URL.createObjectURL(b); v.src = blobUrl; }).catch(() => { v.src = src; });
    }
    // Ролик перематываем только по готовности кадра: новая цель во время перемотки ставится после события seeked.
    // Последний кадр — чуть раньше конца: на самом конце часть браузеров показывает пустой кадр.
    const at = () => (v ? Math.min(target * v.duration, v.duration - 0.05) : 0);
    const seek = () => { if (v && v.duration && !v.seeking) v.currentTime = at(); };
    v?.addEventListener("seeked", () => { if (Math.abs(v.currentTime - at()) > 0.04) seek(); });
    v?.addEventListener("loadedmetadata", seek);
    const update = () => {
      const travel = el.offsetHeight - innerHeight;
      const p = Math.min(1, Math.max(0, -el.getBoundingClientRect().top / travel));
      el.style.setProperty("--p", p.toFixed(3));
      el.style.setProperty("--q", Math.min(1, Math.max(0, (p - 0.12) / 0.8)).toFixed(3));
      target = p;
      seek();
      setStep(p < 0.12 ? 0 : Math.min(steps.length, 1 + Math.floor(((p - 0.12) / 0.88) * steps.length)));
    };
    const on = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); };
    el.style.setProperty("--p", "0");
    el.style.setProperty("--q", "0");
    update();
    addEventListener("scroll", on, { passive: true });
    addEventListener("resize", on);
    return () => { removeEventListener("scroll", on); removeEventListener("resize", on); cancelAnimationFrame(raf); if (blobUrl) URL.revokeObjectURL(blobUrl); };
  }, [steps.length, video]);

  return (
    <section ref={sec} aria-label="Первый экран" className="hero-build relative -mt-[64px] h-[300svh] md:-mt-[72px] md:h-[400svh]">
      <div className="sticky top-0 h-svh overflow-hidden bg-secondary">
        {video ? (
          <>
            {/* Ролик без src в HTML: его подставляет скрипт из Blob. Без JS и при «уменьшить движение» — финальный кадр картинкой */}
            <video ref={vid} className="hero-video absolute inset-0 size-full object-cover" muted playsInline preload="auto" poster={video.poster} aria-hidden="true" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={video.end} alt={video.alt} width={1920} height={1080} loading="lazy" decoding="async" className="hero-video-end absolute inset-0 size-full object-cover" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <noscript><img src={video.end} alt="" aria-hidden="true" width={1920} height={1080} className="absolute inset-0 size-full object-cover" /></noscript>
          </>
        ) : assembly ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={assembly.base.src} srcSet={`${assembly.base.small} 960w, ${assembly.base.src} 1920w`} sizes="100vw" alt="" aria-hidden="true" width={1920} height={1080} loading="eager" fetchPriority="high" decoding="async" className="build-frame absolute inset-0 size-full object-cover" />
            {assembly.parts.map((part, k) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={k} src={assembly.final.src} srcSet={`${assembly.final.small} 960w, ${assembly.final.src} 1920w`} sizes="100vw" alt="" aria-hidden="true" width={1920} height={1080} loading="eager" decoding="async"
                className="build-frame build-part absolute inset-0 size-full object-cover"
                style={{ "--t": `clamp(0, calc((var(--q) - ${part.from}) / ${(part.to - part.from).toFixed(3)}), 1)`, "--dy": `${part.dy}%`, maskImage: maskUrl(part.points), WebkitMaskImage: maskUrl(part.points) } as React.CSSProperties} />
            ))}
            {/* В конце — финальное фото целиком: свет, тени и стыки масок сходятся в настоящий кадр */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={assembly.final.src} srcSet={`${assembly.final.small} 960w, ${assembly.final.src} 1920w`} sizes="100vw" alt={assembly.final.alt} width={1920} height={1080} loading="eager" decoding="async"
              className="build-frame absolute inset-0 size-full object-cover" style={{ opacity: "clamp(0, calc((var(--q) - .9) / .1), 1)" } as React.CSSProperties} />
          </>
        ) : frames && frames.length > 1 ? (
          // Кадр k проявляется поверх предыдущего в первые 40 % своего шага и держится до следующего; --q — доля после обложки (0…1)
          frames.map((f, k) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={f.src} src={f.src} srcSet={`${f.small} 960w, ${f.src} 1920w`} sizes="100vw" alt={k === frames.length - 1 ? f.alt : ""} aria-hidden={k === frames.length - 1 ? undefined : true}
              width={1920} height={1080} loading={k < 2 ? "eager" : "lazy"} decoding="async"
              className="build-frame absolute inset-0 size-full object-cover"
              style={k === 0 ? undefined : { opacity: `clamp(0, calc((var(--q) * ${frames.length - 1} - ${k - 1}) * 2.5), 1)` } as React.CSSProperties} />
          ))
        ) : (
          <div className="hero-build-photo absolute inset-0"><Img p={photo} eager wide sizes="100vw" /></div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-scrim/70 via-scrim/10 to-scrim/0" aria-hidden="true" />

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
