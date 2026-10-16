# Дизайн-система URALDOMA

Главный документ — артефакт «URALDOMA — дизайн-система»: https://claude.ai/artifact/RSfSeE3vwTJfMaM3RTGBbw
Там палитра обеих тем, типографика, сетка, фотография, логотип, иконки, приёмы, тон текста и 12 компонентов сайта с превью.
Логотип ищем на холсте «URALDOMA — поиск логотипа»: https://claude.ai/artifact/RSSi65ggGCiKD6DxyEjgm6

Вёрстка сайта ссылается на систему, а не копирует её значения.

## Что здесь лежит

| Файл | Что это |
|---|---|
| `tokens.json` | Копия `tokens.json` из артефакта: 23 цвета × 2 темы, шрифты, 18 стилей текста, отступы, радиусы, сетка. Единственный источник токенов в репозитории |

## Как токены попадают на сайт

1. `scripts/tokens.mjs` (сам запускается перед `npm run dev` и `npm run build`, вручную — `npm run tokens`) собирает `src/app/tokens.css`:
   - каждый токен — CSS-переменная с тем же именем: `--background`, `--panel-line`, `--gutter`, `--radius-card`, `--text-caps`;
   - светлая тема — `:root`, тёмная — `.dark` на `<html>`;
   - `@theme` — утилиты Tailwind из токенов.
2. `src/app/globals.css` подключает `tokens.css` и своих цветов не задаёт. Классы `.caps`, `.label-tech`, `.label-mono`, `.dropcap`, `.glass`, `.tag`, `.prose-site` берут размеры из токенов.
3. В TS-коде, где CSS-переменной нет (цвет панели браузера в `<head>`), — `tokenColor()` из `src/lib/tokens.ts`.

## Утилиты

| Что | Утилиты |
|---|---|
| Цвета | `bg-background` `text-foreground` `text-earth` `text-muted-foreground` `bg-card` `bg-panel` `text-panel-muted` `border-panel-line` `text-brand` `hover:bg-brand hover:text-on-brand` |
| Поверх фото | `text-on-photo/90` `border-on-photo/40` `from-scrim/50 to-scrim/80` `bg-on-photo text-on-photo-foreground` (белая кнопка) `bg-cover-fill` (подложка первого экрана) |
| Сетка | `px-page-pad-mobile md:px-page-pad` `gap-x-gutter` `py-section-mobile md:py-section` — уже внутри `Container`, `Grid`, `Section`, `GuideLines` |
| Радиусы | `rounded-card` (плавающие карточки: форма, cookies) · `rounded-pill` (кнопки, метки, круглые маркеры) · остальное без скруглений |
| Текст | `text-body` `text-small` `text-label` `text-caps` `text-tech` `text-blueprint` `text-article` `text-h3` |

Шкала `space-1…space-10` совпадает со шкалой Tailwind: `p-3` = `space-3` = 12 px. Генератор падает, если они разойдутся.

У заголовков, цифр, номеров и вводок (`display`, `cover`, `h2`, `number`, `index`, `quote`, `lead`) кегль резиновый, через `clamp()` в компоненте. В токенах — его максимум, поэтому утилит `text-display` и подобных нет.

## Правила

- Цвет — только токеном. `npm run check` (и деплой) падает на HEX, `rgb()`, `text-white`, `bg-black/50` и палитре Tailwind в `src/`, а также на устаревшем `tokens.css`.
- `tokens.css` руками не правят: его перезапишет следующая сборка.
- Новый или изменённый токен:
  1. правка в артефакте дизайн-системы;
  2. копия его `tokens.json` сюда;
  3. `npm run tokens`;
  4. коммит обоих файлов.
- Шрифты на сайте — только локальные пакеты `@fontsource-variable/*`. Google Fonts в превью артефакта нужны только для показа; на сайт их не подключать (CLAUDE.md).
