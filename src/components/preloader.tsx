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

// Минимум 2.4 с (чтобы прошла заливка логотипа), на главной ждём готовности hero-видео (событие hero-video-ready),
// но не дольше 4.8 с, чтобы слабая сеть не держала экран.
export const preloaderScript = `(function(){try{var d=document.documentElement;if(sessionStorage.getItem('pl')||matchMedia('(prefers-reduced-motion: reduce)').matches||/bot|crawl|spider|lighthouse|yandex|google/i.test(navigator.userAgent))return;sessionStorage.setItem('pl','1');d.setAttribute('data-preload','');var done=false,minOk=false,vidOk=false;var hide=function(){if(done)return;done=true;d.setAttribute('data-preload','out');setTimeout(function(){d.removeAttribute('data-preload')},550)};var tryHide=function(){if(minOk&&vidOk)hide()};addEventListener('hero-video-ready',function(){vidOk=true;tryHide()},{once:true});setTimeout(function(){minOk=true;if(!document.querySelector('.hero-video'))vidOk=true;tryHide()},2400);setTimeout(hide,4800)}catch(e){}})()`;
