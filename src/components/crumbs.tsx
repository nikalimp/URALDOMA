import Link from "next/link";

// Видимые хлебные крошки. JSON-LD BreadcrumbList — через breadcrumbs() из lib/schema.
export function Crumbs({ items }: { items: { name: string; path?: string }[] }) {
  return (
    <nav aria-label="Хлебные крошки" className="label-mono mb-10 flex flex-wrap gap-x-2 text-muted-foreground">
      {items.map((it, i) => (
        <span key={it.name} className="flex gap-2">
          {i > 0 && <span aria-hidden="true">/</span>}
          {it.path ? <Link href={it.path} className="hover:text-foreground">{it.name}</Link> : <span className="text-foreground">{it.name}</span>}
        </span>
      ))}
    </nav>
  );
}
