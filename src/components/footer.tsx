import Link from "next/link";
import { footerNav, site } from "@/content/site";
import { services } from "@/content/services";
import { Container } from "./container";
import { Logo } from "./logo";
import { NavLink } from "./nav-link";

// Футер — панель в цвет темы. Контакты крупно, четыре тихие колонки, внизу — знак URALDOMA во всю ширину (03-design §9, приём Swiss Brut / Style).
export function Footer() {
  const c = site.contacts;
  return (
    <footer className="border-t border-panel-line bg-panel text-panel-muted">
      <Container className="pt-section-mobile md:pt-section">
        <p className="caps mb-8">Связаться</p>
        <a href={`tel:${c.phone}`} className="t-statement block text-panel-foreground transition-colors hover:text-brand">{c.phoneDisplay}</a>
        <a href={`mailto:${c.email}`} className="t-lead mt-4 inline-block text-panel-foreground hover:text-brand">{c.email}</a>
      </Container>
      <Container className="grid grid-cols-1 gap-x-gutter gap-y-12 py-24 md:grid-cols-12 md:py-32">
        <div className="md:col-span-3">
          <p className="max-w-[30ch] text-small">{site.tagline}</p>
        </div>
        <nav aria-label="Услуги" className="md:col-span-3 md:col-start-4">
          <p className="caps mb-4">Услуги</p>
          <ul className="space-y-2 text-small text-panel-foreground">
            {services.map((s) => (
              <li key={s.slug}><NavLink href={`/services/${s.slug}/`} className="hover:text-brand" active="text-brand">{s.title}</NavLink></li>
            ))}
            <li><NavLink href="/furniture/" className="hover:text-brand" active="text-brand">Мебель на заказ</NavLink></li>
          </ul>
        </nav>
        <nav aria-label="Компания" className="md:col-span-3 md:col-start-7">
          <p className="caps mb-4">Компания</p>
          <ul className="space-y-2 text-small text-panel-foreground">
            {footerNav.map((n) => (
              <li key={n.href}><NavLink href={n.href} className="hover:text-brand" active="text-brand">{n.label}</NavLink></li>
            ))}
            <li><NavLink href="/articles/" className="hover:text-brand" active="text-brand">Статьи</NavLink></li>
          </ul>
        </nav>
        <div className="md:col-span-3 md:col-start-10">
          <p className="caps mb-4">Контакты</p>
          <ul className="space-y-2 text-small text-panel-foreground">
            {site.socials.map((s) => (
              <li key={s.href}><a href={s.href} target="_blank" rel="noopener me" className="hover:text-brand">{s.label}</a></li>
            ))}
            <li>{[c.address.city, c.address.street].filter(Boolean).join(", ")}</li>
            {c.hours && <li>{c.hours}</li>}
          </ul>
        </div>
      </Container>
      <Container>
        {/* K8 (03-design §12): знак во всю ширину — контур-подложка и заливка слева направо, пока подвал входит в экран */}
        <div className="logo-fill relative">
          <Logo className="w-full text-panel-foreground/20" label={site.name} />
          <div aria-hidden="true" className="logo-fill-top absolute inset-0"><Logo className="w-full text-panel-foreground" /></div>
        </div>
      </Container>
      <Container className="flex flex-col gap-3 py-6 text-[12px] md:flex-row md:justify-between">
        <span>© {site.foundingYear}–{new Date().getFullYear()} {site.name} · {site.legalName} · ИНН {site.legal.inn} · ОГРНИП {site.legal.ogrnip}</span>
        <span className="flex flex-wrap gap-x-6 gap-y-2">
          <Link href="/privacy-policy/" className="hover:text-panel-foreground">Политика обработки персональных данных</Link>
          <Link href="/consent/" className="hover:text-panel-foreground">Согласие на обработку</Link>
          <a href="https://nikalimp.ru" className="hover:text-panel-foreground">Разработка сайта</a>
        </span>
      </Container>
    </footer>
  );
}
