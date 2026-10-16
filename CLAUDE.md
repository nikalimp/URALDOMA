# Сайт клиента — правила для агента

Проект сделан по принципу spec coding. Главные документы — в `specs/`, код — производное от них.

## Перед любой работой
1. Прочитай `specs/02-spec.md` (что строим) и `specs/05-tasks.md` (что уже сделано и что дальше).
2. Требования, которые действуют всегда, — стандарт AI-Ready сайта: `~/Desktop/NikitOS/Resources/Frameworks/AI-Ready сайт — стандарт.md`. Spec может отступить от стандарта только через раздел «Исключения».
3. Правила вёрстки и текста — скилл `web-dev` NikitOS: shadcn/ui, Главред, Типограф.
4. Дизайн — дизайн-система URALDOMA: `design-system/README.md` (ссылка на артефакт, токены, утилиты).

## Как работать с задачами
- Бери задачи из `specs/05-tasks.md` по порядку, по одной. После задачи — проверка из её описания, отметка `[x]` и строка в «Журнал».
- Нашёл неточность или пробел в spec — не додумывай: поставь задаче `[?]`, запиши вопрос в «Вопросы» и переходи к следующей независимой задаче.
- Задача, которой нет в `05-tasks.md`, — сначала предложи правку spec и задач, потом делай.

## Контент
- Все факты о клиенте живут в `src/content/*.ts` и `content/articles/*.md`. Из них же генерируются страницы, JSON-LD (`src/lib/schema.ts`), `llms.txt` (`src/lib/llms.ts`) и `sitemap.xml`. Один факт — одно место.
- Факты (цены, сроки, цифры, отзывы, регалии, клиенты) берутся только из `specs/00-brief.md` и материалов клиента. Нет факта — `TODO(клиент): что нужно`. Никогда не выдумывай.
- Первый абзац каждой страницы — прямой ответ на её главный вопрос (поле `answer`).
- Новая страница = маршрут в `src/app` + JSON-LD + строка в `src/app/sitemap.ts` + ссылка в `src/lib/llms.ts`, если страница важна для нейросетей.

## Дизайн-система
- Токены живут в `design-system/tokens.json` — копии tokens.json из артефакта дизайн-системы. `src/app/tokens.css` собирается из него сам (`npm run tokens`, перед dev и build) — руками не править.
- Цвет в вёрстке — только токеном (`text-earth`, `hover:text-on-brand`, `text-on-photo/90`, `from-scrim/50`). HEX, `rgb()`, `text-white`, `bg-black/…` и палитра Tailwind в `src/` валят `npm run check`.
- Кегли — только шкала дизайн-системы: `t-display`, `t-title`, `t-statement`, `t-lead`, `text-body`, `text-small`, `caps`. Один экран — одна мысль, без бегущих строк и эффектов (03-design §9).
- Сетка, радиусы и мелкий текст — тоже токенами: `Container`/`Grid`/`Section`, `rounded-card`/`rounded-pill`, `text-caps`/`text-tech`.
- Нужен новый токен — сначала правка дизайн-системы (артефакт), потом копия tokens.json и `npm run tokens`.
- Логотип — только `Logo`/`Monogram` из `src/components/logo.tsx` (контуры из `design-system/logo/*.svg`, цвет — токен текста). Картинками и шрифтом знак не ставим.

## Команды
```bash
npm install
npm run dev        # http://localhost:3010
npm run build      # статический сайт в out/ (перед сборкой сам запускается типограф)
npm run check      # сборка + проверка: нет TODO, домен задан, geo-check ≥ 8/10 без P1, цвета только из токенов
npm run tokens     # design-system/tokens.json → src/app/tokens.css
npm run icons      # design-system/logo + токены → фавикон, apple-icon, logo.png (после смены знака или цветов)
node ~/Desktop/NikitOS/.claude/skills/web-dev/glavred.mjs <файл>   # Главред
```

## Нельзя
- Подключать Google Fonts, внешние CDN и скрипты, которые блокируются в РФ.
- Прятать текст за JavaScript: весь контент — в HTML.
- Размечать в JSON-LD то, чего нет на странице (рейтинги, отзывы, цены).
- Деплоить с проваленным `npm run check`.
