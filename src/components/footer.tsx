import Link from "next/link";
import { footerNav, site } from "@/content/site";
import { services } from "@/content/services";
import { Container } from "./container";

export function Footer() {
  const c = site.contacts;
  return (
    <footer className="bg-foreground text-accent">
      <Container className="grid grid-cols-1 gap-10 py-16 md:grid-cols-12 md:gap-x-6 md:py-20">
        <div className="md:col-span-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo-white.png" alt="URALDOMA" width={160} height={16} className="h-4 w-auto" loading="lazy" />
          <p className="mt-5 max-w-[30ch] text-[15px]">{site.tagline}</p>
        </div>
        <nav aria-label="Услуги" className="md:col-span-3 md:col-start-5">
          <p className="label-mono mb-4 text-accent/60">Услуги</p>
          <ul className="space-y-2 text-[15px]">
            {services.map((s) => (
              <li key={s.slug}><Link href={`/services/${s.slug}/`} className="hover:text-card">{s.title}</Link></li>
            ))}
            <li><Link href="/furniture/" className="hover:text-card">Мебель на заказ</Link></li>
          </ul>
        </nav>
        <nav aria-label="Компания" className="md:col-span-2">
          <p className="label-mono mb-4 text-accent/60">Компания</p>
          <ul className="space-y-2 text-[15px]">
            {footerNav.map((n) => (
              <li key={n.href}><Link href={n.href} className="hover:text-card">{n.label}</Link></li>
            ))}
            <li><Link href="/articles/" className="hover:text-card">Статьи</Link></li>
          </ul>
        </nav>
        <div className="md:col-span-3 md:col-start-10">
          <p className="label-mono mb-4 text-accent/60">Контакты</p>
          <ul className="space-y-2 text-[15px]">
            <li><a href={`tel:${c.phone}`} className="text-[22px] font-medium text-card">{c.phoneDisplay}</a></li>
            <li><a href={`mailto:${c.email}`} className="hover:text-card">{c.email}</a></li>
            {site.socials.map((s) => (
              <li key={s.href}><a href={s.href} target="_blank" rel="noopener me" className="hover:text-card">{s.label}</a></li>
            ))}
            <li>{[c.address.city, c.address.street].filter(Boolean).join(", ")}</li>
            {c.hours && <li>{c.hours}</li>}
          </ul>
        </div>
      </Container>
      <Container className="flex flex-col gap-2 border-t border-accent/20 py-6 font-mono text-[12px] text-accent/70 md:flex-row md:justify-between">
        <span>© {site.foundingYear}–{new Date().getFullYear()} {site.name} · {site.legalName} · ИНН {site.legal.inn} · ОГРНИП {site.legal.ogrnip}</span>
        <span className="flex gap-6">
          <Link href="/privacy-policy/" className="hover:text-card">Политика обработки персональных данных</Link>
          <Link href="/consent/" className="hover:text-card">Согласие на обработку</Link>
          <a href="https://nikalimp.ru" className="hover:text-card">Разработка сайта</a>
        </span>
      </Container>
    </footer>
  );
}
