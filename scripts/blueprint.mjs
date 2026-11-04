// Аксонометрия квартиры 70 м² для блока «Как проходит ремонт» → src/content/blueprint.ts.
// Квартира-разрез («кукольный дом»): задние наружные стены в полную высоту, перегородки срезаны на 1,1 м,
// передние стены — бортик 0,3 м, поэтому внутрь видно все комнаты. Каждый предмет — отдельная часть со стадией 1–6.
// Грани непрозрачные (заливка цветом панели + тон), порядок отрисовки — по глубине (кто ближе, тот позже),
// поэтому предметы не просвечивают и не налезают друг на друга. Запуск: node scripts/blueprint.mjs
import fs from "node:fs";

const S = 44; // пикселей на метр
const C = Math.cos(Math.PI / 6);
const P = (x, y, z = 0) => [(x - y) * C * S, (x + y) * 0.5 * S - z * S];
const f = (n) => Math.round(n * 10) / 10;
const pts = (a) => a.map(([x, y, z]) => P(x, y, z).map(f).join(",")).join(" ");

const flat = []; // плоское на полу: рисуется первым, его перекрывают стоящие предметы
const solid = []; // объёмное: сортируется по глубине
const over = []; // подписи поверх всего

// Короб: грани сверху, справа (+x) и спереди (+y) — их видит зритель. Тон: 0 — без тона.
function box(s, x0, y0, z0, x1, y1, z1, tone = [0.16, 0.05, 0.1], extra = "") {
  const [t, r, fr] = tone;
  const face = (q, k) => `<polygon points="${pts(q)}" class="fill-panel"/>` + (k ? `<polygon points="${pts(q)}" fill="currentColor" fill-opacity="${k}" stroke="none"/>` : "");
  const d =
    face([[x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1]], r) +
    face([[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]], fr) +
    face([[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]], t) + extra;
  solid.push({ s, x0, y0, z0, x1, y1, z1, d });
}
const line = (a, b, attrs = "") => `<line x1="${f(P(...a)[0])}" y1="${f(P(...a)[1])}" x2="${f(P(...b)[0])}" y2="${f(P(...b)[1])}" ${attrs}/>`;
const poly = (q, attrs = "") => `<polygon points="${pts(q)}" ${attrs}/>`;
const path = (q, attrs = "") => `<polyline points="${pts(q)}" ${attrs}/>`;
const text = (s, x, y, z, t, cls = "", e) => over.push({ s, e, d: `<text x="${f(P(x, y, z)[0])}" y="${f(P(x, y, z)[1])}" text-anchor="middle" stroke="none" fill="currentColor" class="${cls}" paint-order="stroke" style="stroke:var(--panel);stroke-width:4px;font-size:11px;letter-spacing:.08em;text-transform:uppercase">${t}</text>` });

// ── План, м. Квартира 10 × 7: кухня-гостиная, спальня, прихожая, санузел, детская ─────────────
const W = 10, D = 7, H = 2.7, T = 0.2, t = 0.12, CUT = 1.1, CURB = 0.3, SILL = 0.85, TOP = 2.25;
const rooms = [
  { name: "Кухня-гостиная", m: 25, x0: 0, y0: 0, x1: 6, y1: 4.2 },
  { name: "Спальня", m: 17, x0: 6, y0: 0, x1: W, y1: 4.2 },
  { name: "Прихожая", m: 9, x0: 0, y0: 4.2, x1: 3.2, y1: D },
  { name: "Санузел", m: 5, x0: 3.2, y0: 4.2, x1: 5, y1: D },
  { name: "Детская", m: 14, x0: 5, y0: 4.2, x1: W, y1: D },
];

// 1. Обмерный план: плита, наружные стены, окна, размеры
flat.push({ s: 1, d: poly([[0, 0], [W, 0], [W, D], [0, D]].map(([x, y]) => [x, y, 0]), 'fill="currentColor" fill-opacity="0.04"') });
// стена с окнами вдоль оси: участки глухие в полный рост, в проёмах — подоконник, перемычка и рама
function wallX(y0, y1, xa, xb, wins, h) {
  let x = xa;
  for (const [w0, w1] of [...wins, [xb, xb]]) {
    if (w0 > x) box(1, x, y0, 0, w0, y1, h, [0.1, 0.05, 0.12]);
    if (w1 > w0) {
      box(1, w0, y0, 0, w1, y1, SILL, [0.1, 0.05, 0.12]);
      box(1, w0, y0, TOP, w1, y1, h, [0.1, 0.05, 0.12]);
      solid.push({ s: 1, x0: w0, y0: y1, z0: SILL, x1: w1, y1: y1 + 0.01, z1: TOP, d: poly([[w0, y1, SILL], [w1, y1, SILL], [w1, y1, TOP], [w0, y1, TOP]], 'fill="none" stroke-width="0.8"') + line([(w0 + w1) / 2, y1, SILL], [(w0 + w1) / 2, y1, TOP], 'stroke-width="0.6"') });
    }
    x = w1;
  }
}
function wallY(x0, x1, ya, yb, wins, h) {
  let y = ya;
  for (const [w0, w1] of [...wins, [yb, yb]]) {
    if (w0 > y) box(1, x0, y, 0, x1, w0, h, [0.1, 0.12, 0.05]);
    if (w1 > w0) {
      box(1, x0, w0, 0, x1, w1, SILL, [0.1, 0.12, 0.05]);
      box(1, x0, w0, TOP, x1, w1, h, [0.1, 0.12, 0.05]);
      solid.push({ s: 1, x0: x1, y0: w0, z0: SILL, x1: x1 + 0.01, y1: w1, z1: TOP, d: poly([[x1, w0, SILL], [x1, w1, SILL], [x1, w1, TOP], [x1, w0, TOP]], 'fill="none" stroke-width="0.8"') + line([x1, (w0 + w1) / 2, SILL], [x1, (w0 + w1) / 2, TOP], 'stroke-width="0.6"') });
    }
    y = w1;
  }
}
wallX(-T, 0, -T, W + T, [[0.9, 2.9], [8.4, 9.6]], H); // задняя стена: окна гостиной и спальни
wallY(-T, 0, 0, D + T, [[1.2, 2.8]], H); // левая стена: окно гостиной
box(1, 0, D, 0, W + T, D + T, CURB, [0.3, 0.05, 0.1]); // передние стены — бортик разреза
box(1, W, 0, 0, W + T, D, CURB, [0.3, 0.1, 0.05]);
// размерные линии перед квартирой
const dim = (a, b, o, label) => {
  const tick = (p) => line(p, [p[0] + o[0] * 0.25, p[1] + o[1] * 0.25, 0], 'stroke-width="0.8"');
  flat.push({ s: 1, d: line(a, b, 'stroke-width="0.8"') + tick(a) + tick(b) });
  text(1, (a[0] + b[0]) / 2 + o[0] * 0.55, (a[1] + b[1]) / 2 + o[1] * 0.55, 0, label, "dim");
};
dim([0, D + 0.7, 0], [W, D + 0.7, 0], [0, 1], "10 000");
dim([W + 0.7, 0, 0], [W + 0.7, D, 0], [1, 0], "7 000");

// 2. Перегородки (срез на 1,1 м, срез залит — как на чертеже) с дверными проёмами
const cut = [0.5, 0.06, 0.12];
const partX = (y, xa, xb, gaps) => { let x = xa; for (const [g0, g1] of [...gaps, [xb, xb]]) { if (g0 > x) box(2, x, y - t / 2, 0, g0, y + t / 2, CUT, cut); x = g1; } };
const partY = (x, ya, yb, gaps) => { let y = ya; for (const [g0, g1] of [...gaps, [yb, yb]]) { if (g0 > y) box(2, x - t / 2, y, 0, x + t / 2, g0, CUT, [0.5, 0.12, 0.06]); y = g1; } };
partY(6, 0, 4.2 - t / 2, [[3.1, 4.0]]); // гостиная | спальня, дверь в спальню
partX(4.2, 0, W, [[0.6, 2.4], [5.1, 5.9]]); // проём из прихожей, дверь в детскую
partY(3.2, 4.2 + t / 2, D, [[4.6, 5.4]]); // прихожая | санузел, дверь в санузел
partY(5, 4.2 + t / 2, D, []); // санузел | детская
// подписи комнат — по центру пола, только на стадиях 2–3 (потом их закрывает мебель)
for (const r of rooms) text(2, (r.x0 + r.x1) / 2, (r.y0 + r.y1) / 2, 0, r.m > 6 ? `${r.name} · ${r.m} м²` : `С/у · ${r.m} м²`, "room", 3);

// 3. Инженерные сети: стояк, вода к приборам, электрика по стенам, тёплый пол в санузле
const dash = 'stroke-dasharray="5 4" stroke-width="1.4"';
box(3, 3.3, 4.3, 0, 3.55, 4.55, H, [0.3, 0.12, 0.2]); // стояк
flat.push({ s: 3, d: path([[3.55, 4.45, 0], [4.3, 4.45, 0], [4.3, 4.3, 0]], dash) + path([[3.55, 4.45, 0], [3.55, 6.5, 0]], dash) + path([[3.42, 4.3, 0], [3.42, 3.9, 0], [4.8, 3.9, 0], [4.8, 0.35, 0]], dash) });
const el = 'stroke-dasharray="2 4" stroke-width="1.2"';
flat.push({ s: 3, d: path([[0.25, 3.9, 0], [0.25, 0.25, 0], [5.75, 0.25, 0]], el) + path([[6.25, 3.0, 0], [6.25, 0.25, 0], [9.75, 0.25, 0]], el) + path([[5.25, 6.75, 0], [5.25, 4.45, 0], [9.75, 4.45, 0]], el) });
for (const p of [[0.25, 2.0], [2.6, 0.25], [5.75, 0.25], [6.25, 1.6], [9.75, 0.25], [5.25, 5.6], [8.5, 4.45]]) flat.push({ s: 3, d: `<circle cx="${f(P(p[0], p[1])[0])}" cy="${f(P(p[0], p[1])[1])}" r="3.2" fill="currentColor"/>` });
const zig = []; for (let i = 0; i <= 6; i++) zig.push([3.7 + (i % 2) * 1.0, 5.6 + i * 0.2, 0]);
flat.push({ s: 3, d: path(zig, 'stroke-width="1" stroke-opacity="0.7"') });

// 4. Отделка: паркет в комнатах, плитка в санузле и на кухонном фартуке пола
const planks = (r, step) => { let d = ""; for (let y = r.y0 + step; y < r.y1 - 0.05; y += step) d += line([r.x0 + 0.08, y, 0], [r.x1 - 0.08, y, 0], 'stroke-width="0.5" stroke-opacity="0.6"'); return d; };
const tiles = (x0, y0, x1, y1, step) => { let d = ""; for (let x = x0 + step; x < x1 - 0.05; x += step) d += line([x, y0, 0], [x, y1, 0], 'stroke-width="0.5" stroke-opacity="0.6"'); for (let y = y0 + step; y < y1 - 0.05; y += step) d += line([x0, y, 0], [x1, y, 0], 'stroke-width="0.5" stroke-opacity="0.6"'); return d; };
for (const r of rooms.filter((r) => r.name !== "Санузел")) flat.push({ s: 4, d: planks(r, 0.35) });
flat.push({ s: 4, d: tiles(3.26, 4.26, 4.94, 6.94, 0.42) + poly([[3.26, 4.26, 0], [4.94, 4.26, 0], [4.94, 6.94, 0], [3.26, 6.94, 0]], 'fill="currentColor" fill-opacity="0.05" stroke="none"') });

// 5. Мебель и двери — у задних стен комнат, чтобы ничто не пряталось за перегородкой
const arc = (cx, cy, r, a0, a1, axis) => { const q = []; for (let i = 0; i <= 8; i++) { const a = a0 + ((a1 - a0) * i) / 8; q.push(axis === "x" ? [cx + Math.cos(a) * r, cy + Math.sin(a) * r, 0] : [cx + Math.sin(a) * r, cy + Math.cos(a) * r, 0]); } return q; };
const door = (hx, hy, leaf, dir) => { const [lx, ly] = dir; flat.push({ s: 5, d: line([hx, hy, 0], [hx + lx * leaf, hy + ly * leaf, 0], 'stroke-width="1.6"') }); };
door(6, 3.1, 0.85, [1, 0]); flat.push({ s: 5, d: path(arc(6, 3.1, 0.85, 0, Math.PI / 2, "x"), 'stroke-width="0.6" stroke-dasharray="2 3"') });
door(5.1, 4.2, 0.8, [0, 1]); flat.push({ s: 5, d: path(arc(5.1, 4.2, 0.8, 0, Math.PI / 2, "y"), 'stroke-width="0.6" stroke-dasharray="2 3"') });
door(3.2, 4.6, 0.75, [-1, 0]);
door(1, D, 0.9, [0, -1]);
// кухня-гостиная
box(5, 3.5, 0.06, 0, 5.94, 0.66, 0.9); // кухонный ряд
box(5, 3.5, 0.06, 0.9, 5.94, 0.66, 0.94, [0.3, 0.2, 0.3]); // столешница
box(5, 3.7, 1.7, 0, 5.3, 2.6, 0.75); // обеденный стол
box(5, 0.06, 0.6, 0, 0.95, 3.2, 0.45); // диван
box(5, 0.06, 0.6, 0.45, 0.3, 3.2, 0.85, [0.2, 0.05, 0.1]); // спинка
box(5, 1.45, 1.3, 0, 2.1, 2.4, 0.38); // журнальный стол
// спальня
box(5, 6.6, 0.06, 0, 8.2, 2.2, 0.5); // кровать
box(5, 6.6, 0.06, 0.5, 8.2, 0.16, 1.05, [0.2, 0.05, 0.1]); // изголовье
box(5, 8.35, 0.06, 0, 8.85, 0.5, 0.5); // тумба
box(5, 6.06, 2.4, 0, 6.66, 2.95, 2.1); // шкаф у перегородки
// санузел
box(5, 3.7, 4.27, 0, 4.94, 5.0, 0.55); // ванна
box(5, 3.27, 6.2, 0, 3.75, 6.75, 0.4); // унитаз
box(5, 4.3, 6.4, 0, 4.94, 6.94, 0.85); // тумба с раковиной
// прихожая и детская
box(5, 0.06, 4.6, 0, 0.66, 6.2, 2.1); // шкаф в прихожей
box(5, 5.56, 5.2, 0, 7.4, 6.94, 0.45); // кровать в детской
box(5, 8.2, 4.27, 0, 9.94, 4.85, 0.75); // письменный стол

// 6. Комплектация: подушки, ковры, шторы, свет, растения
box(6, 6.75, 0.2, 0.5, 7.35, 0.6, 0.65, [0.3, 0.05, 0.1]);
box(6, 7.45, 0.2, 0.5, 8.05, 0.6, 0.65, [0.3, 0.05, 0.1]);
box(6, 5.65, 5.3, 0.45, 6.05, 5.9, 0.58, [0.3, 0.05, 0.1]);
flat.push({ s: 6, d: poly([[1.15, 1.0, 0], [2.4, 1.0, 0], [2.4, 2.7, 0], [1.15, 2.7, 0]], 'fill="currentColor" fill-opacity="0.1" stroke-width="0.8"') });
flat.push({ s: 6, d: poly([[7.6, 5.2, 0], [9.2, 5.2, 0], [9.2, 6.6, 0], [7.6, 6.6, 0]], 'fill="currentColor" fill-opacity="0.1" stroke-width="0.8"') });
for (const [x0, x1] of [[0.9, 1.15], [2.65, 2.9], [8.4, 8.6], [9.4, 9.6]]) box(6, x0, 0.02, 0.1, x1, 0.1, 2.4, [0.2, 0.1, 0.25]); // шторы
for (const [x, y] of [[4.2, 2.15], [4.8, 2.15]]) solid.push({ s: 6, x0: x - 0.15, y0: y - 0.15, z0: 1.7, x1: x + 0.15, y1: y + 0.15, z1: H, d: line([x, y, H], [x, y, 1.85], 'stroke-width="0.8"') + `<circle cx="${f(P(x, y, 1.75)[0])}" cy="${f(P(x, y, 1.75)[1])}" r="5" class="fill-panel"/>` + `<circle cx="${f(P(x, y, 1.75)[0])}" cy="${f(P(x, y, 1.75)[1])}" r="5" fill="currentColor" fill-opacity="0.3"/>` });
box(6, 3.0, 0.15, 0, 3.35, 0.5, 0.35, [0.2, 0.1, 0.2]);
solid.push({ s: 6, x0: 3.0, y0: 0.15, z0: 0.35, x1: 3.35, y1: 0.5, z1: 1.2, d: `<circle cx="${f(P(3.17, 0.32, 0.8)[0])}" cy="${f(P(3.17, 0.32, 0.8)[1])}" r="13" class="fill-panel"/><circle cx="${f(P(3.17, 0.32, 0.8)[0])}" cy="${f(P(3.17, 0.32, 0.8)[1])}" r="13" fill="currentColor" fill-opacity="0.18"/>` });

// ── Порядок по глубине: A рисуется раньше B, если A целиком за B по x или по y ─────────────
const behind = (a, b) => (a.x1 <= b.x0 + 1e-6 || a.y1 <= b.y0 + 1e-6) && !(b.x1 <= a.x0 + 1e-6 || b.y1 <= a.y0 + 1e-6) || ((a.x1 > b.x0 + 1e-6 && b.x1 > a.x0 + 1e-6 && a.y1 > b.y0 + 1e-6 && b.y1 > a.y0 + 1e-6) && a.z0 < b.z0);
const order = [];
const left = new Set(solid);
while (left.size) {
  const next = [...left].filter((b) => ![...left].some((a) => a !== b && behind(a, b)));
  const pick = next.length ? next : [[...left].sort((a, b) => a.x0 + a.y0 - (b.x0 + b.y0))[0]];
  for (const p of pick) { order.push(p); left.delete(p); }
}
const parts = [...flat, ...order, ...over].map(({ s, e, d }) => (e ? { s, e, d } : { s, d }));

// рамка по содержимому
const xs = [], ys = [];
for (const x of [-T, W + 1.2]) for (const y of [-T, D + 1.2]) for (const z of [0, H]) { const [px, py] = P(x, y, z); xs.push(px); ys.push(py); }
const m = 8, vx = Math.floor(Math.min(...xs) - m), vy = Math.floor(Math.min(...ys) - m);
const vb = `${vx} ${vy} ${Math.ceil(Math.max(...xs) - vx + m)} ${Math.ceil(Math.max(...ys) - vy + m)}`;

fs.writeFileSync("src/content/blueprint.ts", `// Аксонометрия квартиры 70 м² для блока «Как проходит ремонт» — сгенерировано scripts/blueprint.mjs, руками не править.
// parts — части чертежа в порядке отрисовки (по глубине); s — стадия 1–6, на которой часть появляется, e — после какой скрывается.
export const isoViewBox = "${vb}";
export const isoParts: { s: number; e?: number; d: string }[] = ${JSON.stringify(parts, null, 0).replace(/},{/g, "},\n{")};
`);
console.log("blueprint:", parts.length, "частей, viewBox", vb);
