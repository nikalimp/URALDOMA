import { tariffs, formatRub } from "@/content/tariffs";

// Стоимость работ по тарифам для типичных площадей. Таблица на сетке 4 × 3 колонки: каждая колонка начинается
// на силовой направляющей (03-design §9). Семантика таблицы — через role, на телефоне строки складываются.
export function PriceExamples({ areas, caption }: { areas: number[]; caption: string }) {
  const row = "grid grid-cols-2 gap-x-gutter gap-y-2 md:grid-cols-4";
  return (
    <div role="table" aria-label={caption} className="border-t border-foreground">
      <div role="row" className={`${row} caps hidden py-4 text-muted-foreground md:grid`}>
        <span role="columnheader">Площадь</span>
        {tariffs.map((t) => <span key={t.id} role="columnheader">{t.name}</span>)}
      </div>
      {areas.map((a) => (
        <div key={a} role="row" className={`${row} border-t border-border py-5`}>
          <span role="rowheader" className="t-lead col-span-2 md:col-span-1">{a} м²</span>
          {tariffs.map((t) => (
            <span key={t.id} role="cell" className="text-body whitespace-nowrap">
              <span className="caps mr-2 text-muted-foreground md:hidden">{t.name}</span>
              {formatRub(a * t.rate)}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}
