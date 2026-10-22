# 04 · План сборки — URALDOMA

> Spec: `02-spec.md` v0.3 · Дизайн: `03-design.md` (направление A «Тёплый дом», швейцарская типографика) · Стандарт: AI-Ready сайт.
> Обновлено 2026-10-15.

## Стек
- Next.js 16 App Router, статический экспорт (`out/`), `trailingSlash: true`, Tailwind 4, токены в `src/app/globals.css`.
- Шрифты локально: Onest Variable + JetBrains Mono Variable (`@fontsource-variable`). Иконки — инлайн-SVG и типографские стрелки.
- Контент — `src/content/*.ts` и `content/blog/*.md`; из них страницы, JSON-LD (`src/lib/schema.ts`), `llms.txt`, `sitemap.xml`.
- Интерактив — три клиентских компонента: форма заявки, калькулятор, чертёж процесса. Весь текст есть в HTML без JS.

## Хостинг и выкладка
- REG.RU, виртуальный хостинг (Apache, ISPmanager), SSH + rsync из GitHub Actions.
- `dev.uraldoma.ru` — тестовый поддомен: `staging.yml` выкладывает каждый push в `main`, сборка с `NEXT_PUBLIC_NOINDEX=1` (noindex, robots закрыт, без Метрики).
- `uraldoma.ru` — прод: `deploy.yml` только вручную (`workflow_dispatch`), перед выкладкой `npm run check`. Переключение DNS — в день запуска, Tilda живёт ещё 30 дней.
- Заявки: `public/api/lead.php` → CSV на хостинге (152-ФЗ, первичная запись в РФ) → Telegram (2 чата) + почта. Ключи — `lead-config.php` над папкой сайта, пишет workflow из секретов.
- Редиректы и 410 — `public/.htaccess` по spec §4.3.

## Структура маршрутов
- `src/app/page.tsx` — главная с прозрачной шапкой поверх видео.
- `src/app/(site)/` — все внутренние страницы с обычной шапкой: services (+9), prices, how-we-work, warranty, portfolio (+10), complexes (+6), furniture (+custom-kitchens), about, contacts, articles (+13), careers, partners, privacy-policy.
- `/reviews/` — P1, после отзывов клиента (бриф в. 12).

## Компоненты
`container` (сетка 12 колонок, Section/Label/H2/кнопки) · `header` (overlay/default, меню на `<details>`) · `footer` · `page-head` · `lead-form` · `calculator` · `process-blueprint` · `tariff-table` · `price-examples` · `case-card` · `faq` · `cta` · `partner-calc` · `cookie-banner`.

## Что блокирует запуск
Факты клиента: реквизиты, адрес, часы, данные кейсов (площадь, тариф, срок), цена кухонь, текст вакансии электромонтажника, подтверждение рыночных цен, видео первого экрана. Пока их нет, `npm run check` не пройдёт — так задумано.
