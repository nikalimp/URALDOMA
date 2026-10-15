import Link from "next/link";
import { nav, site } from "@/content/site";
import { cn } from "@/lib/utils";

// Мобильное меню на <details>: работает без JavaScript.
function MobileMenu({ light }: { light?: boolean }) {
  return (
    <details className="group/m lg:hidden">
      <summary aria-label="Открыть меню" className={cn("flex size-11 cursor-pointer list-none items-center justify-center [&::-webkit-details-marker]:hidden", light && "text-card")}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" className="group-open/m:hidden"><path d="M3 8h18M3 16h18" /></svg>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" className="hidden group-open/m:block"><path d="M5 5l14 14M19 5L5 19" /></svg>
      </summary>
      <div className="fixed inset-x-0 top-[72px] z-50 max-h-[calc(100dvh-72px)] overflow-y-auto border-t border-border bg-background px-4 pb-8 pt-2 text-foreground">
        <ul className="border-b border-border">
          {nav.map((n) => (
            <li key={n.href} className="border-t border-border first:border-t-0"><a href={n.href} className="block py-4 text-[22px] font-medium">{n.label}</a></li>
          ))}
        </ul>
        <a href={`tel:${site.contacts.phone}`} className="mt-6 block text-[22px] font-medium">{site.contacts.phoneDisplay}</a>
        <a href={site.cta.href} className="mt-6 flex min-h-[52px] items-center justify-between bg-brand px-6 text-card">{site.cta.label}<span aria-hidden="true">→</span></a>
      </div>
    </details>
  );
}

// variant="overlay" — поверх видео на главной: белый текст, логотип по центру
export function Header({ variant = "default" }: { variant?: "default" | "overlay" }) {
  const overlay = variant === "overlay";
  return (
    <header className={cn(overlay ? "absolute inset-x-0 top-0 z-40 text-card" : "sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur")}>
      <div className="mx-auto grid h-[72px] max-w-[1440px] grid-cols-[1fr_auto_1fr] items-center gap-6 px-4 md:h-[96px] md:px-12">
        <nav aria-label="Основное меню" className="hidden gap-7 text-[15px] lg:flex">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className={cn("hover:underline underline-offset-4", overlay ? "text-card" : "text-foreground")}>{n.label}</Link>
          ))}
        </nav>
        <div className="lg:hidden"><MobileMenu light={overlay} /></div>
        <Link href="/" aria-label="URALDOMA — на главную" className="justify-self-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={overlay ? "/images/logo-white.png" : "/images/logo-dark.png"} alt="URALDOMA" width={240} height={24} className="h-[18px] w-auto md:h-[24px]" />
        </Link>
        <div className="flex items-center justify-end gap-6">
          <div className="hidden text-right text-[14px] leading-tight xl:block">
            <a href={`tel:${site.contacts.phone}`} className="block">{site.contacts.phoneDisplay}</a>
            <a href={`mailto:${site.contacts.email}`} className={cn("block", overlay ? "text-card/75" : "text-muted-foreground")}>{site.contacts.email}</a>
          </div>
          <a href={`tel:${site.contacts.phone}`} aria-label="Позвонить" className="flex size-11 items-center justify-center xl:hidden">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M15 14.5c-.8.8-3-.8-4.5-2.3S7.7 8.5 8.5 7.7L10 6.2 7 2.5 4 4.8C4 11.6 12.4 20 19.2 20l2.3-3-3.7-3z" /></svg>
          </a>
          <a href={site.cta.href} className={cn("hidden min-h-[48px] items-center px-5 text-[15px] font-medium sm:inline-flex", overlay ? "bg-card text-foreground hover:bg-brand hover:text-card" : "bg-foreground text-card hover:bg-brand")}>{site.cta.label}</a>
        </div>
      </div>
    </header>
  );
}
