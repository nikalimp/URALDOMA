import fs from "node:fs";
import path from "node:path";
import { cn } from "@/lib/utils";

// Логотип из дизайн-системы (раздел «Логотип», карточка Logo). Контуры читаются при сборке из мастер-файлов
// design-system/logo/*.svg и вставляются inline с fill="currentColor": знак всегда цвета текста вокруг
// (foreground, panel-foreground, on-photo) и сам меняется вместе с темой — отдельных файлов под тему нет.
function load(file: string) {
  const svg = fs.readFileSync(path.join(process.cwd(), "design-system", "logo", file), "utf8");
  const viewBox = svg.match(/viewBox="([^"]+)"/)?.[1];
  const body = svg.match(/<path [^>]*\/>/g)?.join("");
  if (!viewBox || !body) throw new Error(`design-system/logo/${file}: нет viewBox или контуров`);
  return { viewBox, body };
}
const wordmark = load("uraldoma-wordmark.svg");
const mark = load("uraldoma-mark.svg");

type Props = { className?: string; label?: string };

function Svg({ src, className, label }: Props & { src: { viewBox: string; body: string } }) {
  const a11y = label ? { role: "img", "aria-label": label } : { "aria-hidden": true as const };
  return <svg viewBox={src.viewBox} fill="currentColor" className={cn("block shrink-0", className)} {...a11y} dangerouslySetInnerHTML={{ __html: src.body }} />;
}

// Полная версия, 10 : 1. Шапка — 18px на телефоне и 20px от 768px; меньше 14px не ставим — берём Monogram.
export function Logo({ className = "h-[18px] md:h-[20px]", label }: Props) {
  return <Svg src={wordmark} className={cn("aspect-[10/1] w-auto", className)} label={label} />;
}

// Сокращённая версия — монограмма UD, квадрат; от 16px.
export function Monogram({ className = "size-8", label }: Props) {
  return <Svg src={mark} className={cn("aspect-square", className)} label={label} />;
}
