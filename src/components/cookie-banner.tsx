// Уведомление о cookies и метрических программах (152-ФЗ). Без JavaScript-библиотек:
// скрывается кнопкой через localStorage; если хранилище недоступно — просто остаётся видимым.
const script = `(function(){try{if(localStorage.getItem('cookie-ok')){document.getElementById('cookie-banner').hidden=true}}catch(e){}})()`;
const accept = `try{localStorage.setItem('cookie-ok','1')}catch(e){};document.getElementById('cookie-banner').hidden=true`;

export function CookieBanner() {
  return (
    <>
      <div id="cookie-banner" role="region" aria-label="Уведомление о cookies" className="text-small fixed inset-x-3 bottom-3 z-50 mx-auto flex max-w-xl flex-col gap-4 rounded-card border border-border bg-card p-5 shadow-lg sm:flex-row sm:items-center">
        <p className="flex-1 text-earth">
          Сайт использует cookies и Яндекс Метрику. Оставаясь на сайте, вы соглашаетесь с <a href="/privacy-policy/" className="underline underline-offset-4 hover:text-brand">политикой обработки данных</a>.
        </p>
        <button type="button" data-accept className="min-h-[44px] shrink-0 rounded-pill bg-foreground px-5 font-medium text-background hover:bg-brand hover:text-on-brand">Понятно</button>
      </div>
      <script dangerouslySetInnerHTML={{ __html: `${script};document.querySelector('#cookie-banner [data-accept]').addEventListener('click',function(){${accept}})` }} />
    </>
  );
}
