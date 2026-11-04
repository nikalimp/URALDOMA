import { Children, cloneElement, isValidElement, type ReactNode, type ReactElement } from "react";

// K1 — строки из маски (03-design §12): каждое слово заголовка в своей маске, при появлении на экране слова
// поднимаются из-под базовой линии по очереди (--i). Режет при сборке, без клиентского JS; анимация — CSS view().
// Курсив <em> и ссылки внутри сохраняются: слово режется внутри своего элемента. Текст целиком в HTML.
export function rise(node: ReactNode): ReactNode {
  let i = 0;
  const words = (text: string) =>
    text.split(/(\s+)/).map((part, k) =>
      /^\s+$/.test(part) || !part ? part : (
        <span key={`w${i}-${k}`} className="w" style={{ "--i": i++ } as React.CSSProperties}><span>{part}</span></span>
      ),
    );
  const walk = (n: ReactNode): ReactNode =>
    Children.map(n, (c) => {
      if (typeof c === "string") return words(c);
      if (typeof c === "number") return words(String(c));
      if (isValidElement(c)) {
        const el = c as ReactElement<{ children?: ReactNode; className?: string }>;
        if (el.props.className?.includes("sr-only")) return el;
        return cloneElement(el, {}, walk(el.props.children));
      }
      return c;
    });
  return walk(node);
}
