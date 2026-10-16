// Иконки сайта из логотипа дизайн-системы: design-system/logo/uraldoma-mark.svg + цвета из design-system/tokens.json.
//   npm run icons — после смены знака или цветов; результат коммитится.
//   src/app/icon.svg        — знак без подложки, цвет foreground светлой/тёмной темы (вкладки Chrome, Firefox, Яндекс)
//   src/app/favicon.ico     — 16, 32, 48 px: плитка foreground со знаком background (Safari и старые браузеры)
//   src/app/apple-icon.png  — 180 px, та же плитка для экрана «Домой»
//   public/images/logo.png  — 512 px, плитка для logo в JSON-LD
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const ds = JSON.parse(fs.readFileSync(path.join(ROOT, "design-system", "tokens.json"), "utf8"));
const color = (name) => ds.color.tokens.find((t) => t.name === name).value;
const ink = color("foreground").light, paper = color("background").light, inkDark = color("foreground").dark;

const mark = fs.readFileSync(path.join(ROOT, "design-system", "logo", "uraldoma-mark.svg"), "utf8");
const paths = [...mark.matchAll(/<path d="([^"]+)"\/>/g)].map((m) => m[1]);
if (!paths.length) throw new Error("В uraldoma-mark.svg не нашлось контуров");
const [vbX, vbY, vbW, vbH] = mark.match(/viewBox="([^"]+)"/)[1].split(/\s+/).map(Number);
const BOX = { x: 2, y: 10, w: 116, h: 100 }; // габарит знака внутри артборда 120×120
const pathTags = paths.map((d) => `<path d="${d}"/>`).join("");

// Знак без подложки: цвет текста темы, как в шапке
const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vbX} ${vbY} ${vbW} ${vbH}"><style>path{fill:${ink}}@media (prefers-color-scheme:dark){path{fill:${inkDark}}}</style>${pathTags}</svg>\n`;

// Плитка: знак цветом бумаги на тёмном квадрате, поле pad с каждой стороны
function tile(size, pad) {
  const k = (size * (1 - 2 * pad)) / Math.max(BOX.w, BOX.h);
  const tx = (size - BOX.w * k) / 2 - BOX.x * k, ty = (size - BOX.h * k) / 2 - BOX.y * k;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><rect width="${size}" height="${size}" fill="${ink}"/><g fill="${paper}" transform="translate(${tx.toFixed(3)} ${ty.toFixed(3)}) scale(${k.toFixed(5)})">${pathTags}</g></svg>`;
}
const png = (size, pad) => sharp(Buffer.from(tile(size, pad))).png({ compressionLevel: 9 }).toBuffer();

// ICO с PNG внутри (поддерживают все браузеры с Vista/IE9)
function ico(images) {
  const head = Buffer.alloc(6 + 16 * images.length);
  head.writeUInt16LE(0, 0); head.writeUInt16LE(1, 2); head.writeUInt16LE(images.length, 4);
  let offset = head.length;
  images.forEach(({ size, data }, i) => {
    const e = 6 + 16 * i;
    head.writeUInt8(size >= 256 ? 0 : size, e); head.writeUInt8(size >= 256 ? 0 : size, e + 1);
    head.writeUInt16LE(1, e + 4); head.writeUInt16LE(32, e + 6);
    head.writeUInt32LE(data.length, e + 8); head.writeUInt32LE(offset, e + 12);
    offset += data.length;
  });
  return Buffer.concat([head, ...images.map((i) => i.data)]);
}

const out = (rel, data) => { fs.writeFileSync(path.join(ROOT, rel), data); console.log(`icons: ${rel} (${data.length} Б)`); };
out("src/app/icon.svg", iconSvg);
out("src/app/favicon.ico", ico(await Promise.all([16, 32, 48].map(async (size) => ({ size, data: await png(size, 0.08) })))));
out("src/app/apple-icon.png", await png(180, 0.2));
out("public/images/logo.png", await png(512, 0.18));
