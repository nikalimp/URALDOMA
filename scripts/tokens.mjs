// Токены дизайн-системы → CSS. Источник — design-system/tokens.json (копия tokens.json из артефакта «URALDOMA — дизайн-система»).
// Пишет src/app/tokens.css: каждый токен — CSS-переменная с тем же именем, плюс @theme для утилит Tailwind.
//   node scripts/tokens.mjs           — собрать (запускается сам перед dev и build)
//   node scripts/tokens.mjs --check   — только проверить, что tokens.css собран из текущего tokens.json
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const SRC = path.join(ROOT, "design-system", "tokens.json");
const OUT = path.join(ROOT, "src", "app", "tokens.css");
const DS_URL = "https://claude.ai/artifact/RSfSeE3vwTJfMaM3RTGBbw";

const ds = JSON.parse(fs.readFileSync(SRC, "utf8"));
const errors = [];
const need = (cond, msg) => { if (!cond) errors.push(msg); };

// Стили текста с постоянным кеглем становятся утилитами text-<имя>. У заголовков, цифр, номеров и вводок кегль
// резиновый (clamp в компоненте), в токенах — его максимум, поэтому утилиты для них нет.
const FLUID = new Set(["display", "cover", "h2", "number", "accent", "index", "quote", "lead", "lead-page"]);

const color = ds.color.tokens;
const themes = ds.color.themes.map((t) => t.id);
need(themes.includes("light") && themes.includes("dark"), "color.themes: нужны light и dark");
for (const t of color) for (const th of themes) need(t.value?.[th], `color ${t.name}: нет значения для темы ${th}`);

const list = (group) => ds[group]?.tokens ?? [];
const spacing = list("spacing"), radius = list("radius"), layout = list("layout"), opacity = list("opacity");

// space-N обязаны совпадать со шкалой Tailwind (N × 4 px): p-3 = space-3
for (const t of spacing) {
  const m = t.name.match(/^space-(\d+)$/);
  if (m) need(t.value === `${Number(m[1]) * 4}px`, `${t.name} = ${t.value}, а в Tailwind ${m[1]} = ${Number(m[1]) * 4}px`);
}

const decl = (name, value) => `  --${name}: ${value};`;
const block = (title, lines) => (lines.length ? [`  /* ${title} */`, ...lines] : []);
const colorVars = (th) => color.map((t) => decl(t.name, t.value[th]));

const typeVars = [];
for (const g of ds.type.groups) {
  for (const s of g.styles) {
    if (FLUID.has(s.name)) continue;
    typeVars.push(decl(`text-${s.name}`, s.fontSize));
    if (s.lineHeight !== undefined) typeVars.push(decl(`text-${s.name}--line-height`, s.lineHeight));
    if (s.letterSpacing) typeVars.push(decl(`text-${s.name}--letter-spacing`, s.letterSpacing));
    if (s.fontWeight && s.fontWeight !== 400) typeVars.push(decl(`text-${s.name}--font-weight`, s.fontWeight));
  }
}

const none = radius.find((t) => t.name === "radius-none")?.value ?? "0px";
const css = [
  `/* Сгенерировано scripts/tokens.mjs из design-system/tokens.json — не править руками.`,
  `   Дизайн-система URALDOMA: ${DS_URL}`,
  `   Новый или изменённый токен — сначала в дизайн-системе, потом копия tokens.json сюда и npm run tokens. */`,
  ``,
  `:root {`,
  ...block("Цвета — светлая тема", colorVars("light")),
  `  color-scheme: light;`,
  ...block("Отступы и поля", spacing.map((t) => decl(t.name, t.value))),
  ...block("Радиусы", radius.filter((t) => t.name === "radius-none").map((t) => decl(t.name, t.value))),
  ...block("Сетка и линии", layout.map((t) => decl(t.name, t.value))),
  ...block("Прозрачность", opacity.map((t) => decl(t.name, t.value))),
  `}`,
  ``,
  `.dark {`,
  ...block("Цвета — тёмная тема", colorVars("dark")),
  `  color-scheme: dark;`,
  `}`,
  ``,
  `/* Утилиты Tailwind, зависящие от темы: bg-background, text-brand, hover:text-on-brand, border-panel-line, from-scrim/50 … */`,
  `@theme inline {`,
  ...color.map((t) => decl(`color-${t.name}`, `var(--${t.name})`)),
  ...spacing.filter((t) => !/^space-\d+$/.test(t.name)).map((t) => decl(`spacing-${t.name}`, `var(--${t.name})`)),
  `}`,
  ``,
  `/* Постоянные токены: font-sans/serif/mono, rounded-card/pill, text-body/caps/tech … */`,
  `@theme static {`,
  ...Object.entries(ds.type.families).map(([k, v]) => decl(`font-${k}`, v)),
  `  /* shadcn-компоненты — без скруглений (radius-none) */`,
  ...["sm", "md", "lg", "xl"].map((k) => decl(`radius-${k}`, none)),
  ...radius.filter((t) => t.name !== "radius-none").map((t) => decl(t.name, t.value)),
  ...typeVars,
  `}`,
  ``,
].join("\n");

if (errors.length) {
  console.error(`✗ design-system/tokens.json:\n  ${errors.join("\n  ")}`);
  process.exit(1);
}

const current = fs.existsSync(OUT) ? fs.readFileSync(OUT, "utf8") : "";
if (process.argv.includes("--check")) {
  if (current !== css) { console.error("✗ src/app/tokens.css устарел — запустите npm run tokens"); process.exit(1); }
  console.log("✓ tokens.css собран из design-system/tokens.json");
} else if (current !== css) {
  fs.writeFileSync(OUT, css);
  console.log(`tokens: ${color.length} цветов × ${themes.length} темы, ${typeVars.length} свойств текста → src/app/tokens.css`);
}
