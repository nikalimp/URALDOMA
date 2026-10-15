import Link from "next/link";
import { footerNav, site } from "@/content/site";
import { services } from "@/content/services";
import { Container } from "./container";
import { ThemeSelect } from "./theme-toggle";

// Футер — инверсный блок (тёмный в обеих темах), как в референсах
export function Footer() {
  const c = site.contacts;
  return (
    <footer className="border-t border-inverse-line bg-inverse text-inverse-muted">
      <Container className="pt-16 md:pt-24">
        <a href={`tel:${c.phone}`} className="block text-[40px] leading-none tracking-[-0.04em] text-inverse-foreground hover:text-brand md:text-[96px]">{c.phoneDisplay}</a>
        <a href={`mailto:${c.email}`} className="mt-4 inline-block text-[18px] text-inverse-foreground hover:text-brand md:text-[22px]">{c.email}</a>
      </Container>
      <Container className="grid grid-cols-1 gap-10 py-16 md:grid-cols-12 md:gap-x-6">
        <div className="md:col-span-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo-white.png" alt="URALDOMA" width={200} height={20} className="h-[18px] w-auto" loading="lazy" />
          <p className="mt-5 max-w-[30ch] text-[15px]">{site.tagline}</p>
          <div className="mt-8"><ThemeSelect /></div>
        </div>
        <nav aria-label="Услуги" className="md:col-span-3 md:col-start-5">
          <p className="label-mono mb-4">Услуги</p>
          <ul className="space-y-2 text-[15px] text-inverse-foreground">
            {services.map((s) => (
              <li key={s.slug}><Link href={`/services/${s.slug}/`} className="hover:text-brand">{s.title}</Link></li>
            ))}
            <li><Link href="/furniture/" className="hover:text-brand">Мебель на заказ</Link></li>
          </ul>
        </nav>
        <nav aria-label="Компания" className="md:col-span-2">
          <p className="label-mono mb-4">Компания</p>
          <ul className="space-y-2 text-[15px] text-inverse-foreground">
            {footerNav.map((n) => (
              <li key={n.href}><Link href={n.href} className="hover:text-brand">{n.label}</Link></li>
            ))}
            <li><Link href="/articles/" className="hover:text-brand">Статьи</Link></li>
          </ul>
        </nav>
        <div className="md:col-span-3 md:col-start-10">
          <p className="label-mono mb-4">Контакты</p>
          <ul className="space-y-2 text-[15px] text-inverse-foreground">
            {site.socials.map((s) => (
              <li key={s.href}><a href={s.href} target="_blank" rel="noopener me" className="hover:text-brand">{s.label}</a></li>
            ))}
            <li>{[c.address.city, c.address.street].filter(Boolean).join(", ")}</li>
            {c.hours && <li>{c.hours}</li>}
          </ul>
        </div>
      </Container>
      <Container className="flex flex-col gap-3 border-t border-inverse-line py-6 text-[12px] md:flex-row md:justify-between">
        <span>© {site.foundingYear}–{new Date().getFullYear()} {site.name} · {site.legalName} · ИНН {site.legal.inn} · ОГРНИП {site.legal.ogrnip}</span>
        <span className="flex flex-wrap gap-x-6 gap-y-2">
          <Link href="/privacy-policy/" className="hover:text-inverse-foreground">Политика обработки персональных данных</Link>
          <Link href="/consent/" className="hover:text-inverse-foreground">Согласие на обработку</Link>
          <a href="https://nikalimp.ru" className="hover:text-inverse-foreground">Разработка сайта</a>
        </span>
      </Container>
    </footer>
  );
}
