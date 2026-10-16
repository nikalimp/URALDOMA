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
      {/* Десктоп: 3 колонки подписи + по 3 на тариф — ровно по направляющим, только горизонтальные линии */}
      <div className="hidden md:grid md:grid-cols-12 md:gap-x-5">
        <div className="col-span-3 border-t border-foreground" />
        {tariffs.map((t) => (
          <div key={t.id} className="col-span-3 border-t border-foreground pt-6 pb-8">
            <h3 className="text-[24px]">{t.name}</h3>
            <p className="mt-2 text-[40px] leading-none tracking-[-0.04em]">{formatRub(t.rate)}<span className="text-[15px] font-normal text-muted-foreground"> / м²</span></p>
            <p className="mt-4 text-[15px] text-earth">{t.forWhom}</p>
          </div>
        ))}
        {rows.map((r) => (
          <div key={r.key} className="contents">
            <div className="caps col-span-3 border-t border-border py-6 text-muted-foreground">{r.label}</div>
            {tariffs.map((t) => (
              <p key={t.id} className="col-span-3 border-t border-border py-6 text-[15px] leading-relaxed">{t[r.key]}</p>
            ))}
          </div>
        ))}
      </div>
      {/* Мобильная версия: тариф за тарифом */}
      <div className="space-y-12 md:hidden">
        {tariffs.map((t) => (
          <div key={t.id} className="border-t border-foreground pt-6">
            <h3 className="text-[24px]">{t.name} — {formatRub(t.rate)} / м²</h3>
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
