import { tariffs, formatRub, tariffCommon } from "@/content/tariffs";

// Полный состав тарифов: таблица «тариф × этап работ». Колонки — тарифы, строки — подготовка, инженерия, отделка.
const rows: { key: "prep" | "engineering" | "finish"; label: string }[] = [
  { key: "prep", label: "Подготовка и черновые" },
  { key: "engineering", label: "Инженерные системы" },
  { key: "finish", label: "Чистовая отделка" },
];

export function TariffTable() {
  return (
    <div>
      <div className="hidden border-t border-foreground md:grid md:grid-cols-[200px_repeat(3,minmax(0,1fr))]">
        <div />
        {tariffs.map((t) => (
          <div key={t.id} className="border-l border-border p-6">
            <h3 className="text-[24px] font-medium">{t.name}</h3>
            <p className="mt-2 text-[36px] leading-none font-medium tracking-[-0.03em]">{formatRub(t.rate)}<span className="text-[15px] font-normal text-muted-foreground"> / м²</span></p>
            <p className="mt-4 text-[15px] text-earth">{t.forWhom}</p>
          </div>
        ))}
        {rows.map((r) => (
          <div key={r.key} className="contents">
            <div className="label-mono border-t border-border py-6 pr-4 text-muted-foreground">{r.label}</div>
            {tariffs.map((t) => (
              <p key={t.id} className="border-t border-l border-border p-6 text-[15px] leading-relaxed">{t[r.key]}</p>
            ))}
          </div>
        ))}
      </div>
      {/* Мобильная версия: тариф за тарифом */}
      <div className="space-y-12 md:hidden">
        {tariffs.map((t) => (
          <div key={t.id} className="border-t border-foreground pt-6">
            <h3 className="text-[24px] font-medium">{t.name} — {formatRub(t.rate)} / м²</h3>
            <p className="mt-3 text-[15px] text-earth">{t.forWhom}</p>
            <dl className="mt-4">
              {rows.map((r) => (
                <div key={r.key} className="border-t border-border py-4">
                  <dt className="label-mono text-muted-foreground">{r.label}</dt>
                  <dd className="mt-2 text-[15px]">{t[r.key]}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
      <p className="mt-6 text-[14px] text-muted-foreground">{tariffCommon}</p>
    </div>
  );
}
