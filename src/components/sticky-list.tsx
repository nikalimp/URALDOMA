import { Grid, H2 } from "@/components/container";
import { rise } from "@/components/rise";

export type StickyItem = { title: string; text?: string };

// Липкая колонка + список (03-design §11): слева (колонки 1–6) подпись, заголовок, пояснение и кнопка стоят на месте,
// справа (7–12) прокручивается нумерованный список крупных пунктов. На телефоне — одна колонка.
export function StickyList({ label, title, aside, action, items, as = "h3" }: { label: string; title: React.ReactNode; aside?: React.ReactNode; action?: React.ReactNode; items: StickyItem[]; as?: "h2" | "h3" }) {
  const T = as;
  return (
    <Grid className="gap-y-12">
      <div className="md:sticky md:top-28 md:col-span-6 md:self-start">
        <p className="caps text-muted-foreground">{label}</p>
        <H2 className="rise mt-6 max-w-[16ch]">{rise(title)}</H2>
        {aside && <div className="text-body mt-8 max-w-[44ch] text-earth">{aside}</div>}
        {action && <div className="mt-10">{action}</div>}
      </div>
      <ol className="border-t border-border md:col-span-6 md:col-start-7">
        {items.map((it, i) => (
          <li key={it.title} className="reveal grid grid-cols-[1fr_auto] gap-x-gutter border-b border-border py-8 md:py-10">
            <T className="t-statement">{it.title}</T>
            <span className="caps pt-[0.5em] text-muted-foreground">({String(i + 1).padStart(2, "0")})</span>
            {it.text && <p className="text-small col-span-2 mt-4 max-w-[48ch] text-earth">{it.text}</p>}
          </li>
        ))}
      </ol>
    </Grid>
  );
}
