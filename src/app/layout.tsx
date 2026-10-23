import type { Metadata, Viewport } from "next";
import "@fontsource-variable/onest";
import "@fontsource-variable/jetbrains-mono";
import "@fontsource-variable/playfair-display/wght-italic.css";
import "./globals.css";
import { site } from "@/content/site";
import { Footer } from "@/components/footer";
import { CookieBanner } from "@/components/cookie-banner";
import { GuideLines } from "@/components/guide-lines";
import { ScrollTop } from "@/components/scroll-top";
import { Preloader, preloaderScript } from "@/components/preloader";
import { CursorTag } from "@/components/cursor-tag";
import { JsonLd } from "@/components/json-ld";
import { graph, orgSchema, personSchema, websiteSchema } from "@/lib/schema";
import { tokenColor } from "@/lib/tokens";
import { ogImage } from "@/lib/meta";

// Тестовый поддомен закрыт от индексации: сборка с NEXT_PUBLIC_NOINDEX=1 (workflow staging).
const noindex = process.env.NEXT_PUBLIC_NOINDEX === "1";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: `%s — ${site.name}` },
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: { type: "website", locale: site.locale, siteName: site.name, title: site.title, description: site.description, url: site.url, images: [ogImage] },
  robots: noindex ? { index: false, follow: false } : { index: true, follow: true },
};

// theme-color — один тег: его обновляют скрипт темы и переключатель, чтобы панель браузера меняла цвет вместе с сайтом
export const viewport: Viewport = { colorScheme: "light dark" };
const themeColors = tokenColor("background");

// Тема до первой отрисовки: сохранённый выбор или системная; при «как в системе» следим за сменой темы ОС
const themeScript = `(function(){var d=document.documentElement,m=matchMedia('(prefers-color-scheme: dark)');function s(){var t=null;try{t=localStorage.getItem('theme')}catch(e){}var k=t?t==='dark':m.matches;d.classList.toggle('dark',k);var c=document.querySelector('meta[name="theme-color"]');if(c)c.setAttribute('content',k?'${themeColors.dark}':'${themeColors.light}')}s();m.addEventListener&&m.addEventListener('change',s)})()`;

const metrikaScript = (id: number) =>
  `(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return;}}k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window,document,'script','https://mc.yandex.ru/metrika/tag.js?id=${id}','ym');ym(${id},'init',{ssr:true,webvisor:true,clickmap:true,referrer:document.referrer,url:location.href,accurateTrackBounce:true,trackLinks:true});`;

// Цели Метрики без правки компонентов: клики по телефону, почте и Telegram
const goalsScript = `document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a');if(!a||!window.ym)return;var h=a.getAttribute('href')||'';var g=h.indexOf('tel:')===0?'phone':h.indexOf('mailto:')===0?'email':h.indexOf('t.me')>-1?'telegram':'';if(g)ym(${site.metrikaId},'reachGoal',g)});`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const metrika = site.metrikaId > 0 && !noindex;
  return (
    <html lang={site.lang} suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <meta name="theme-color" content={themeColors.light} />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script dangerouslySetInnerHTML={{ __html: preloaderScript }} />
        {metrika && <script dangerouslySetInnerHTML={{ __html: metrikaScript(site.metrikaId) + goalsScript }} />}
        <JsonLd data={graph(websiteSchema, orgSchema, personSchema)} />
      </head>
      <body className="flex min-h-screen flex-col">
        <Preloader />
        {metrika && (
          <noscript><div><img src={`https://mc.yandex.ru/watch/${site.metrikaId}`} style={{ position: "absolute", left: "-9999px" }} alt="" /></div></noscript>
        )}
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:bg-card focus:px-3 focus:py-2">К содержанию</a>
        {children}
        <Footer />
        <CookieBanner />
        <GuideLines />
        <ScrollTop />
        <CursorTag />
      </body>
    </html>
  );
}
