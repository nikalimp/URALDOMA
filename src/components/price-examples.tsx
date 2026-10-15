import { tariffs, formatRub } from "@/content/tariffs";

// Стоимость работ по тарифам для типичных площадей. На телефоне таблица прокручивается внутри себя.
export function PriceExamples({ areas, caption }: { areas: number[]; caption: string }) {
  return (
    <div className="-mx-4 overflow-x-auto px-4 md:mx-0 md:px-0">
      <table className="w-full min-w-[520px] border-t border-foreground text-left text-[15px] md:text-[17px]">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="label-mono text-muted-foreground">
            <th scope="col" className="py-4 pr-4 font-normal">Площадь</th>
            {tariffs.map((t) => <th key={t.id} scope="col" className="py-4 pr-4 font-normal">{t.name}</th>)}
          </tr>
        </thead>
        <tbody>
          {areas.map((a) => (
            <tr key={a} className="border-t border-border">
              <th scope="row" className="py-5 pr-4 text-[18px] md:text-[22px]">{a} м²</th>
              {tariffs.map((t) => <td key={t.id} className="py-5 pr-4 whitespace-nowrap">{formatRub(a * t.rate)}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
