import { Logo } from "@/components/logo";

// Прелоадер (03-design §11): знак URALDOMA полупрозрачный, заливка слева направо, затем экран уходит.
// Показывается, только если скрипт в <head> поставил html[data-preload] — первый заход за сессию, не бот,
// без «уменьшить движение». Ничего не грузит и не прячет контент: страница под ним уже в HTML.
export function Preloader() {
  return (
    <div className="preloader" aria-hidden="true">
      <div className="relative w-[min(78vw,720px)]">
        <Logo className="h-auto w-full opacity-15" />
        <div className="preloader-fill absolute inset-0"><Logo className="h-auto w-full" /></div>
      </div>
    </div>
  );
}

export const preloaderScript = `(function(){try{var d=document.documentElement;if(sessionStorage.getItem('pl')||matchMedia('(prefers-reduced-motion: reduce)').matches||/bot|crawl|spider|lighthouse|yandex|google/i.test(navigator.userAgent))return;sessionStorage.setItem('pl','1');d.setAttribute('data-preload','');setTimeout(function(){d.removeAttribute('data-preload')},1700)}catch(e){}})()`;
