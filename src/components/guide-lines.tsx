// Направляющие поверх страницы: 4 колонки — каждая третья из 12 (03-design §9: тише). Сетка вёрстки остаётся 12-колоночной.
// Те же поля и gutter (токены page-pad, gutter, guide), что у Container/Grid — блоки встают ровно по линиям. Только оформление, без событий мыши.
export function GuideLines() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[60] px-page-pad-mobile md:px-page-pad">
      <div className="grid h-full grid-cols-4 gap-x-gutter">
        {Array.from({ length: 4 }, (_, i) => <div key={i} className="border-x border-guide" />)}
      </div>
    </div>
  );
}
