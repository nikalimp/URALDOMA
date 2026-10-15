import Link from "next/link";
import { nav, site } from "@/content/site";
import { ThemeToggle } from "./theme-toggle";

// Логотип в двух цветах: тёмный — в светлой теме, белый — в тёмной
export function Logo({ className = "h-[18px] w-auto md:h-[20px]" }: { className?: string }) {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/logo-dark.png" alt="URALDOMA" width={200} height={20} className={`${className} dark:hidden`} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/logo-white.png" alt="" aria-hidden="true" width={200} height={20} className={`${className} hidden dark:block`} />
    </>
  );
}

// Мобильное меню на <details>: работает без JavaScript
function MobileMenu() {
  return (
    <details className="group/m lg:hidden">
      <summary aria-label="Открыть меню" className="flex size-11 cursor-pointer list-none items-center justify-center rounded-full border border-border [&::-webkit-details-marker]:hidden">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" className="group-open/m:hidden"><path d="M4 9h16M4 15h16" /></svg>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" className="hidden group-open/m:block"><path d="M6 6l12 12M18 6L6 18" /></svg>
      </summary>
      <div className="fixed inset-x-0 top-[64px] z-50 max-h-[calc(100dvh-64px)] md:top-[72px] overflow-y-auto border-t border-border bg-background px-4 pb-8 pt-2">
        <ul>
          {nav.map((n, i) => (
            <li key={n.href} className="border-b border-border">
              <a href={n.href} className="flex items-baseline justify-between py-4 text-[26px] tracking-[-0.02em]">{n.label}<span className="text-[13px] text-muted-foreground">({String(i + 1).padStart(2, "0")})</span></a>
            </li>
          ))}
        </ul>
        <a href={`tel:${site.contacts.phone}`} className="mt-6 block text-[22px]">{site.contacts.phoneDisplay}</a>
        <a href={site.cta.href} className="mt-6 flex min-h-[52px] items-center justify-between rounded-full bg-foreground px-6 text-background">{site.cta.label}<span aria-hidden="true">→</span></a>
      </div>
    </details>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="grid h-[64px] grid-cols-[auto_1fr_auto] items-center gap-x-5 px-5 md:h-[72px] md:grid-cols-12 md:px-10">
        <Link href="/" aria-label="URALDOMA — на главную" className="shrink-0"><Logo /></Link>
        <nav aria-label="Основное меню" className="hidden gap-6 text-[14px] lg:col-span-5 lg:col-start-4 lg:flex">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="text-muted-foreground transition-colors hover:text-foreground">{n.label}</Link>
          ))}
        </nav>
        <div className="col-start-3 flex items-center justify-end gap-2 whitespace-nowrap md:col-span-4 md:col-start-9 md:gap-3">
          <a href={`tel:${site.contacts.phone}`} className="hidden text-[15px] xl:block">{site.contacts.phoneDisplay}</a>
          <a href={`tel:${site.contacts.phone}`} aria-label="Позвонить" className="flex size-11 items-center justify-center rounded-full hover:bg-secondary xl:hidden">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M15 14.5c-.8.8-3-.8-4.5-2.3S7.7 8.5 8.5 7.7L10 6.2 7 2.5 4 4.8C4 11.6 12.4 20 19.2 20l2.3-3-3.7-3z" /></svg>
          </a>
          <ThemeToggle />
          <a href={site.cta.href} className="ml-2 hidden min-h-[44px] items-center rounded-full bg-foreground px-5 text-[14px] font-medium text-background transition-colors hover:bg-brand hover:text-white sm:inline-flex">{site.cta.label}</a>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
