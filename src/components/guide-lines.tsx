// Направляющие модульной сетки поверх страницы: 12 колонок на десктопе, 4 на телефоне.
// Те же поля и gutter (токены page-pad, gutter, guide), что у Container/Grid — блоки встают ровно по линиям. Только оформление, без событий мыши.
export function GuideLines() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[60] px-page-pad-mobile md:px-page-pad">
      <div className="grid h-full grid-cols-4 gap-x-gutter md:grid-cols-12">
        {Array.from({ length: 12 }, (_, i) => (
          <div key={i} className={`border-x border-guide ${i >= 4 ? "hidden md:block" : ""}`} />
        ))}
      </div>
    </div>
  );
}
