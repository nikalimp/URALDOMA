"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

// Ссылка меню с подсветкой текущей страницы (aria-current="page"). prefix — раздел подсвечивается и на вложенных страницах
// (/services/ на /services/kitchen-renovation/). Классы active — токены темы (шапка: foreground + линия, подвал: brand).
export function NavLink({ href, prefix = false, className, active, children }: { href: string; prefix?: boolean; className?: string; active: string; children: React.ReactNode }) {
  const path = usePathname() ?? "";
  const norm = (p: string) => (p.endsWith("/") ? p : `${p}/`);
  const on = norm(path) === href || (prefix && href !== "/" && norm(path).startsWith(href));
  return (
    <Link href={href} aria-current={on ? "page" : undefined} className={cn(className, on && active)}>
      {children}
    </Link>
  );
}
