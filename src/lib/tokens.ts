// Токены дизайн-системы для TS-кода — там, где CSS-переменная недоступна (цвет панели браузера в <head>).
// Источник — design-system/tokens.json; в вёрстке токены берутся из CSS (src/app/tokens.css).
import ds from "../../design-system/tokens.json";

export type Theme = "light" | "dark";

export function tokenColor(name: string): Record<Theme, string> {
  const t = ds.color.tokens.find((x) => x.name === name);
  if (!t) throw new Error(`В design-system/tokens.json нет цвета ${name}`);
  return t.value as Record<Theme, string>;
}
