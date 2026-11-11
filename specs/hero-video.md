# Ролик для обложки главной: стройка по скроллу

Решение Ника 11.11.2026, референс — сайт, где пустая комната при прокрутке собирается в кухню. Обложка главной уже свёрстана (`src/components/hero-build.tsx`, 03-design §13). Пока ролика нет, фото кухни в «Клевер Парке» при прокрутке переходит из серого в цвет. Как только в `public/video/` появится ролик, прокрутка начнёт вести его кадр за кадром.

## Как устроено на сайте
- Секция высотой 4 экрана, кадр закреплён на весь экран. Доля прокрутки от 0 до 1 переводится в `video.currentTime`: обычный `<video>`, без GSAP и без раскадровки. Ролик весит меньше мегабайта и грузится одним файлом.
- Поверх ролика сменяются 4 слоя: H1 с ценой и кнопками (0–12 % прокрутки), затем «Черновые и инженерия», «Чистовая отделка», «Комплектация и сдача» — по трети от оставшейся прокрутки.
- В ролике этапы должны идти в том же порядке и примерно в тех же долях: бетон → черновые → отделка → кухня и свет.
- При «уменьшить движение» показываем финальный кадр (постер) и H1.

## Кадры
- **Финальный кадр** — `public/images/objects/clover-park/05-wide.webp` (1920×1080). Это готовая кухня: фронтальный ракурс, гарнитур, подвесные светильники, пол. Если у клиента есть исходник крупнее, лучше взять его.
- **Стартовый кадр** — та же комната в бетоне. Его генерирует нейросеть по финальному кадру, ракурс и окна должны совпадать.

## Higgsfield: шаг за шагом
1. **Стартовый кадр** (Image → Edit, модель Nano Banana или Seedream, 16:9). Загрузить финальный кадр, промпт:
   > Same room, same camera position, lens and lighting, but before renovation: bare grey concrete walls and ceiling, rough concrete floor slab, exposed electrical conduits and wires hanging from the ceiling where the pendant lights are, no kitchen cabinets, no appliances, no furniture, no lamps, empty construction site, daylight, photorealistic, architectural photography. Keep the exact room geometry, wall positions and perspective.

   Сделать 3–4 варианта и выбрать тот, где стены, углы и проёмы совпадают с финальным кадром. Без этого совпадения ролик «поплывёт».
2. **Ролик** (Video → Start & End Frame, модель Kling 2.x или Veo 3.1, 16:9, 8–10 секунд, без звука). Start — стартовый кадр, End — финальный. Промпт:
   > Static locked-off camera, no camera movement. Time-lapse of an apartment kitchen renovation: walls and ceiling get plastered and painted white, wiring disappears into the walls, the floor is covered with wood flooring, then the kitchen cabinets, countertop and tall appliance column assemble in place, finally the pendant lights appear and switch on. Smooth continuous build-up, no people, no cuts, photorealistic.

   Сделать 3 прогона дешёвой моделью и выбрать лучший. Это выгоднее одного дорогого: судя по сравнениям, лучший из нескольких дешёвых прогонов обычно лучше.
3. **Проверка:** камера стоит на месте, этапы идут по порядку, последний кадр совпадает с фото. Если кадр в конце дёргается, его можно обрезать при перекодировании.
4. **Вертикальная версия для телефона** (по желанию). На телефоне 16:9 обрезается по центру, а кухня и так стоит в центре. Если обрезка не понравится, повторить шаги 1–2 в 9:16.

## Перекодирование и подключение (делает Claude, когда пришлёшь ролик)
```bash
# 720p, ключевой кадр каждые 8 кадров — быстрая перемотка скроллом, ~0,8–1,5 МБ
ffmpeg -i build.mp4 -an -vf "scale=1280:-2" -c:v libx264 -crf 28 -preset slow \
  -g 8 -keyint_min 8 -sc_threshold 0 -pix_fmt yuv420p -movflags +faststart public/video/hero-build.mp4
# постер — первый кадр (бетон): его видно до загрузки ролика
ffmpeg -i public/video/hero-build.mp4 -frames:v 1 -c:v libwebp -quality 80 public/video/hero-build-start.webp
```
Затем в `src/content/site.ts`: `heroVideo: { src: "/video/hero-build.mp4", poster: "/video/hero-build-start.webp" }`. Хостинг REG.RU (Apache) отдаёт видео частями (206), этого достаточно для перемотки.

## Источники
- Как собрать скролл-ролик из AI-видео (Veo, кодирование `-g 8`, перемотка через `currentTime`): https://learnwithhasan.com/guide/ai-video-scroll-animation-page/
- Готовые компоненты того же приёма — 21st.dev Hero Scrub (GSAP + раскадровка на canvas): https://21st.dev/@jean.duthil13/components/hero-scrub. Мы взяли вариант проще: обычный `<video>` без GSAP.
