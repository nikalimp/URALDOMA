import Link from "next/link";
import { footerNav, site } from "@/content/site";
import { services } from "@/content/services";
import { Container, Marquee } from "./container";
import { Logo } from "./logo";
import { ThemeSelect } from "./theme-toggle";

// Футер — панель в цвет темы (светлая в светлой, тёмная в тёмной). Все колонки — на 12-колоночной сетке.
export function Footer() {
  const c = site.contacts;
  return (
    <footer className="border-t border-panel-line bg-panel text-panel-muted">
      <Marquee
        className="border-b border-panel-line py-5 text-panel-foreground"
        itemClassName="text-[28px] tracking-[-0.03em] md:text-[44px]"
        speed="60s"
        items={["Ремонт под ключ", <em key="d" className="serif">дизайн-проект</em>, "Авторский надзор", <em key="m" className="serif">мебель на заказ</em>, "Гарантия 2 года", <em key="e" className="serif">Екатеринбург</em>]}
      />
      <Container className="pt-16 md:pt-24">
        <p className="caps mb-6">[ Связаться ]</p>
        <a href={`tel:${c.phone}`} className="block text-[44px] leading-none tracking-[-0.045em] text-panel-foreground transition-colors hover:text-brand md:text-[clamp(72px,8vw,140px)]">{c.phoneDisplay}</a>
        <a href={`mailto:${c.email}`} className="mt-5 inline-block text-[18px] text-panel-foreground hover:text-brand md:text-[22px]">{c.email}</a>
      </Container>
      <Container className="grid grid-cols-1 gap-x-5 gap-y-10 py-16 md:grid-cols-12">
        <div className="md:col-span-3">
          <Logo className="h-[20px] text-panel-foreground" label={site.name} />
          <p className="mt-5 max-w-[30ch] text-[15px]">{site.tagline}</p>
          <div className="mt-8"><ThemeSelect /></div>
        </div>
        <nav aria-label="Услуги" className="md:col-span-3 md:col-start-4">
          <p className="caps mb-4">Услуги</p>
          <ul className="space-y-2 text-[15px] text-panel-foreground">
            {services.map((s) => (
              <li key={s.slug}><Link href={`/services/${s.slug}/`} className="hover:text-brand">{s.title}</Link></li>
            ))}
            <li><Link href="/furniture/" className="hover:text-brand">Мебель на заказ</Link></li>
          </ul>
        </nav>
        <nav aria-label="Компания" className="md:col-span-3 md:col-start-7">
          <p className="caps mb-4">Компания</p>
          <ul className="space-y-2 text-[15px] text-panel-foreground">
            {footerNav.map((n) => (
              <li key={n.href}><Link href={n.href} className="hover:text-brand">{n.label}</Link></li>
            ))}
            <li><Link href="/articles/" className="hover:text-brand">Статьи</Link></li>
          </ul>
        </nav>
        <div className="md:col-span-3 md:col-start-10">
          <p className="caps mb-4">Контакты</p>
          <ul className="space-y-2 text-[15px] text-panel-foreground">
            {site.socials.map((s) => (
              <li key={s.href}><a href={s.href} target="_blank" rel="noopener me" className="hover:text-brand">{s.label}</a></li>
            ))}
            <li>{[c.address.city, c.address.street].filter(Boolean).join(", ")}</li>
            {c.hours && <li>{c.hours}</li>}
          </ul>
        </div>
      </Container>
      <Container className="flex flex-col gap-3 border-t border-panel-line py-6 text-[12px] md:flex-row md:justify-between">
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
