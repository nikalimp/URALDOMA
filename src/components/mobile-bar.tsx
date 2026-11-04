import { site } from "@/content/site";

// Нижняя панель на телефоне (03-design §12, маркетинг): позвонить, написать в Telegram, посчитать смету.
// Только до md; место под неё — отступ body в globals.css. Цели Метрики — по data-goal и общему скрипту ссылок.
export function MobileBar() {
  const c = site.contacts;
  const item = "flex flex-1 items-center justify-center py-3 text-small";
  return (
    <nav aria-label="Быстрая связь" className="fixed inset-x-0 bottom-0 z-40 flex divide-x divide-border border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
      <a href={`tel:${c.phone}`} className={item}>Позвонить</a>
      <a href={c.telegram} target="_blank" rel="noopener" className={item}>Telegram</a>
      <a href="/prices/#calculator" data-goal="calc" className={`${item} bg-foreground text-background`}>Смета</a>
    </nav>
  );
}
