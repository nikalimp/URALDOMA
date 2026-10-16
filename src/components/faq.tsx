import type { Faq } from "@/content/services";
import { cn } from "@/lib/utils";

// FAQ на <details>: ответ есть в HTML и виден ботам, раскрытие работает без JavaScript.
export function FaqList({ items, className }: { items: Faq[]; className?: string }) {
  return (
    <div className={cn("border-t border-border", className)}>
      {items.map((f) => (
        <details key={f.q} className="group border-b border-border">
          <summary className="flex min-h-[72px] cursor-pointer list-none items-center justify-between gap-8 py-6 [&::-webkit-details-marker]:hidden">
            <h3 className="t-lead">{f.q}</h3>
            <span aria-hidden="true" className="t-lead font-light leading-none text-brand transition-transform group-open:rotate-45">+</span>
          </summary>
          <p className="max-w-[62ch] pb-8 text-earth">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
