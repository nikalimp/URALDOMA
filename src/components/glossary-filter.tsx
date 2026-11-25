"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { glossaryCats, type GlossaryCat, type GlossaryTerm } from "@/content/glossary";
import { cn } from "@/lib/utils";

export function GlossaryFilter({ items }: { items: GlossaryTerm[] }) {
  const [cat, setCat] = useState<GlossaryCat | "all">("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((it) => {
      if (cat !== "all" && it.cat !== cat) return false;
      if (!q) return true;
      return it.term.toLowerCase().includes(q) || it.definition.toLowerCase().includes(q);
    });
  }, [items, cat, query]);

  return (
    <div>
      <div className="flex flex-col gap-4 border-b border-border pb-6 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Категории терминов">
          <button
            type="button"
            onClick={() => setCat("all")}
            className={cn(
              "text-small min-h-[40px] rounded-pill border px-4 transition-colors",
              cat === "all" ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:border-foreground hover:text-foreground",
            )}
          >
            Все ({items.length})
          </button>
          {(Object.keys(glossaryCats) as GlossaryCat[]).map((k) => {
            const count = items.filter((x) => x.cat === k).length;
            return (
              <button
                key={k}
                type="button"
                onClick={() => setCat(k)}
                className={cn(
                  "text-small min-h-[40px] rounded-pill border px-4 transition-colors",
                  cat === k ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:border-foreground hover:text-foreground",
                )}
              >
                {glossaryCats[k]} ({count})
              </button>
            );
          })}
        </div>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Найти термин…"
          aria-label="Поиск по глоссарию"
          className="text-small min-h-[44px] w-full border-b border-foreground/30 bg-transparent py-2 outline-none focus:border-foreground md:w-64"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-body py-12 text-muted-foreground">По запросу «{query}» ничего не найдено. Попробуйте другой термин или сбросьте фильтр.</p>
      ) : (
        <ul className="divide-y divide-border">
          {filtered.map((item) => (
            <li key={item.slug}>
              <Link href={`/glossary/${item.slug}/`} className="group grid grid-cols-1 gap-x-gutter gap-y-2 py-6 transition-colors md:grid-cols-12 md:items-baseline">
                <span className="caps text-muted-foreground md:col-span-3">{glossaryCats[item.cat]}</span>
                <span className="t-lead group-hover:text-brand md:col-span-4">{item.term}</span>
                <span className="text-small text-muted-foreground md:col-span-5">{item.definition}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
