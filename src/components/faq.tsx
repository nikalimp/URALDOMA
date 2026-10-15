import type { Faq } from "@/content/services";
import { cn } from "@/lib/utils";

// FAQ на <details>: ответ есть в HTML и виден ботам, раскрытие работает без JavaScript.
export function FaqList({ items, className }: { items: Faq[]; className?: string }) {
  return (
    <div className={cn("border-t border-foreground", className)}>
      {items.map((f) => (
        <details key={f.q} className="group border-b border-border">
          <summary className="flex min-h-[64px] cursor-pointer list-none items-center justify-between gap-6 py-5 [&::-webkit-details-marker]:hidden">
            <h3 className="text-[19px] font-medium leading-snug md:text-[22px]">{f.q}</h3>
            <span aria-hidden="true" className="text-[28px] font-light leading-none text-brand transition-transform group-open:rotate-45">+</span>
          </summary>
          <p className="max-w-[62ch] pb-6 text-[17px] text-earth">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
