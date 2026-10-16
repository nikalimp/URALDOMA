# AI-Ready сайт — стартер

Шаблон клиентского сайта NikitOS: Next.js 16 (App Router, статический экспорт) + Tailwind 4 + shadcn/ui. GEO-фундамент работает из коробки. Гайд — `Resources/Know-how/Стартер AI-Ready сайта — гайд.md`, стандарт — `Resources/Frameworks/AI-Ready сайт — стандарт.md`.

## Что уже есть
- Страницы: главная, услуги (список и шаблон), блог (список и шаблон статьи), о компании, контакты, политика ПДн, 404.
- `/llms.txt`, `/llms-full.txt`, `/robots.txt` (AI-боты открыты), `/sitemap.xml` — генерируются при сборке из контента.
- JSON-LD: WebSite, Organization/LocalBusiness, Person, Service + Offer, FAQPage, BlogPosting, BreadcrumbList, ItemList, AboutPage, ContactPage.
- Типограф перед каждой сборкой, баннер cookies, Яндекс Метрика по номеру счётчика, тёмная тема, мобильное меню и FAQ без JavaScript.
- `npm run check` — проверка перед запуском, `.github/workflows/deploy.yml` — выкладка на хостинг по SSH.

## Где что править
| Что | Файл |
|---|---|
| Компания, контакты, реквизиты, CTA, Метрика | `src/content/site.ts` |
| Услуги | `src/content/services.ts` |
| Главная, «О компании» | `src/content/home.ts` |
| Статьи | `content/articles/<slug>.md` (образец — `_primer.md`) |
| Цвета, шрифты, радиусы, отступы | `design-system/tokens.json` → `npm run tokens` (см. `design-system/README.md`) |
| Шрифт | `src/app/layout.tsx` (`@fontsource-variable/…`) |
| Логотип | `design-system/logo/*.svg` → `src/components/logo.tsx`; фавиконы — `npm run icons` |
| OG-картинка | `public/og.jpg` (1200×630, из дизайн-системы) |

## Команды
```bash
npm install
npm run dev       # http://localhost:3010
npm run build     # out/
npm run check     # сборка + проверки
npm run preview   # просмотр out/ на http://localhost:3011
```
