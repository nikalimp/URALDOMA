"use client";

// Уведомление о cookies и метрических программах (152-ФЗ).
// Клиентский компонент: скрывается через React state и localStorage, не зависит от CSS [hidden]
// и не теряет обработчик клика после гидратации или мягкой навигации.
import { useEffect, useState } from "react";

const STORAGE_KEY = "cookie-ok";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  const accept = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {}
    setVisible(false);
  };

  return (
    <div
      id="cookie-banner"
      role="region"
      aria-label="Уведомление о cookies"
      className="text-small fixed inset-x-3 bottom-[calc(3.5rem+env(safe-area-inset-bottom))] z-50 md:bottom-3 mx-auto flex max-w-xl flex-col gap-4 rounded-card border border-border bg-card p-5 shadow-lg sm:flex-row sm:items-center"
    >
      <p className="flex-1 text-earth">
        Сайт использует cookies и Яндекс Метрику. Оставаясь на сайте, вы соглашаетесь с <a href="/privacy-policy/" className="underline underline-offset-4 hover:text-brand">политикой обработки данных</a>.
      </p>
      <button
        type="button"
        data-accept
        onClick={accept}
        className="min-h-[44px] shrink-0 cursor-pointer rounded-pill bg-foreground px-5 font-medium text-background hover:bg-brand hover:text-on-brand"
      >
        Понятно
      </button>
    </div>
  );
}
