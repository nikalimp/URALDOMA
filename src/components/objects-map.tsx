"use client";

import { useState } from "react";
import Link from "next/link";
import type { MapData } from "@/lib/map";
import { cn } from "@/lib/utils";
import { Grid } from "@/components/container";

// Контурная карта ЖК или посёлков (03-design §9: монохром, линии структурные, один акцент — объекты URALDOMA).
// SVG собран при сборке (lib/map.ts); точки — ссылки на страницы объектов. Наведение на точку или строку списка
// подсвечивает пару и показывает название. Карта — колонки 1–6, справа легенда: условные знаки и список объектов
// текстом (для поиска и без мыши).
export function ObjectsMap({ map, title, list, kind }: { map: MapData; title: string; list: { slug: string; name: string; note?: string }[]; kind: string }) {
  const [on, setOn] = useState<string | null>(null);
  const active = map.points.find((p) => p.slug === on);
  return (
    <Grid className="gap-y-10">
      <figure className="relative border-t border-foreground pt-4 md:sticky md:top-[96px] md:col-span-6 md:self-start">
        <figcaption className="caps flex justify-between gap-6 text-muted-foreground">
          <span>{title}</span>
          <span>© участники OpenStreetMap</span>
        </figcaption>
        <svg viewBox={`0 0 ${map.width} ${map.height}`} role="img" aria-label={`Карта: ${title}`} className="mt-4 h-auto w-full overflow-hidden" onMouseLeave={() => setOn(null)}>
          <g fill="none" className="stroke-border" strokeWidth={1}>
            {map.areas.map((a) => <path key={a.name} d={a.d} vectorEffect="non-scaling-stroke" />)}
          </g>
          {map.districts?.map((a) => <path key={a.name} d={a.d} fill="none" className="stroke-border" strokeWidth={1} vectorEffect="non-scaling-stroke" />)}
          <path d={map.city.d} className="fill-foreground/[0.03] stroke-foreground/60" strokeWidth={1.2} vectorEffect="non-scaling-stroke" />
          <g className="fill-muted">{map.water.map((w) => <path key={w.name} d={w.d} />)}</g>
          <g className="caps fill-muted-foreground max-sm:hidden" style={{ fontSize: 12 }}>
            {[...map.areas, ...(map.districts ?? []), ...(map.districts ? [] : [map.city])].filter((a) => a.label).map((a) => (
              <text key={a.name} x={a.label!.x} y={a.label!.y} textAnchor="middle">{a.name}</text>
            ))}
          </g>
          {map.points.map((p) => (
            <Link key={p.slug} href={`/complexes/${p.slug}/`} aria-label={p.name} onMouseEnter={() => setOn(p.slug)} onFocus={() => setOn(p.slug)}>
              <circle cx={p.x} cy={p.y} r={18} fill="transparent" />
              <circle cx={p.x} cy={p.y} r={p.ours ? 7 : 5} className={cn("transition-all", p.ours ? "fill-brand" : "fill-foreground", on && on !== p.slug && "opacity-30")} />
              {p.ours && <circle cx={p.x} cy={p.y} r={13} fill="none" className="stroke-brand" strokeWidth={1} />}
            </Link>
          ))}
          {active && (
            <g pointerEvents="none">
              <text x={active.x + 16} y={active.y + 5} className="fill-background stroke-background" strokeWidth={6} strokeLinejoin="round" style={{ fontSize: 15 }}>{active.name}</text>
              <text x={active.x + 16} y={active.y + 5} className="fill-foreground" style={{ fontSize: 15 }}>{active.name}</text>
            </g>
          )}
        </svg>
      </figure>
      <div className="border-t border-foreground pt-4 md:col-span-6 md:col-start-7">
        <p className="caps text-muted-foreground">Легенда</p>
        <ul className="caps mt-4 flex flex-wrap gap-x-8 gap-y-3 text-muted-foreground">
          <li className="flex items-center gap-3"><svg width="14" height="14" aria-hidden="true"><circle cx="7" cy="7" r="5" className="fill-foreground" /></svg>{kind}</li>
          <li className="flex items-center gap-3"><svg width="28" height="28" aria-hidden="true"><circle cx="14" cy="14" r="7" className="fill-brand" /><circle cx="14" cy="14" r="13" fill="none" className="stroke-brand" /></svg>Наш объект</li>
          <li className="flex items-center gap-3"><svg width="28" height="14" aria-hidden="true"><path d="M1 7h26" className={map.districts ? "stroke-border" : "stroke-foreground/60"} strokeWidth={1.2} /></svg>{map.districts ? "Граница района" : "Граница Екатеринбурга"}</li>
        </ul>
        <ul className="mt-8 gap-x-gutter sm:columns-2">
          {list.map((o) => (
            <li key={o.slug} className="break-inside-avoid border-t border-border">
              <Link href={`/complexes/${o.slug}/`} onMouseEnter={() => setOn(o.slug)} onMouseLeave={() => setOn(null)} onFocus={() => setOn(o.slug)} className={cn("flex items-baseline justify-between gap-4 py-3 transition-colors hover:text-brand", on === o.slug && "text-brand")}>
                <span className="text-body">{o.name}</span>
                {o.note && <span className="caps shrink-0 text-muted-foreground">{o.note}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Grid>
  );
}
