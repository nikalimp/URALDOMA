import contours from "@/content/geo/contours.json";

// Контурная карта ЖК и посёлков: контуры округов и водоёмов — OpenStreetMap (src/content/geo/contours.json),
// точки — координаты объектов из src/content/geo/objects.json. Проекция равнопромежуточная с поправкой cos(φ):
// на 60 км вокруг Екатеринбурга искажения не видны. Всё считается при сборке — на странице готовый SVG.

export type MapInput = { slug: string; name: string; kind: "zk" | "kp"; lat: number; lon: number; ours: boolean };
export type MapPoint = MapInput & { x: number; y: number };
export type MapShape = { name: string; d: string; label?: { x: number; y: number } };
export type MapData = { width: number; height: number; areas: MapShape[]; districts?: MapShape[]; city: MapShape; water: MapShape[]; points: MapPoint[] };

type Ring = [number, number][];
const parse = (s: string): Ring => s.split(" ").map((p) => p.split(",").map(Number) as [number, number]);

// districts — районы Екатеринбурга (карта города); без них — округа вокруг (карта посёлков). minSpan — минимальный охват в градусах широты.
// aspect — минимальное отношение ширины к высоте: охват по долготе расширяется вокруг центра (широкая карта на главной).
export function buildMap(input: MapInput[], { width = 1360, pad = 0.12, districts = false, minSpan = 0, aspect = 0 } = {}): MapData {
  const lats = input.map((p) => p.lat), lons = input.map((p) => p.lon);
  let [lat0, lat1, lon0, lon1] = [Math.min(...lats), Math.max(...lats), Math.min(...lons), Math.max(...lons)];
  if (lat1 - lat0 < minSpan) { const c = (lat0 + lat1) / 2; lat0 = c - minSpan / 2; lat1 = c + minSpan / 2; }
  const dLat = (lat1 - lat0) * pad, dLon = (lon1 - lon0) * pad;
  [lat0, lat1, lon0, lon1] = [lat0 - dLat, lat1 + dLat, lon0 - dLon, lon1 + dLon];
  const cos = Math.cos((((lat0 + lat1) / 2) * Math.PI) / 180);
  if (aspect && ((lon1 - lon0) * cos) / (lat1 - lat0) < aspect) { const c = (lon0 + lon1) / 2, h = ((lat1 - lat0) * aspect) / cos / 2; [lon0, lon1] = [c - h, c + h]; }
  const k = width / ((lon1 - lon0) * cos);
  const height = Math.round((lat1 - lat0) * k);
  const xy = (lon: number, lat: number) => [(lon - lon0) * cos * k, (lat1 - lat) * k] as const;
  const r1 = (n: number) => Math.round(n * 10) / 10;

  const shape = (name: string, rings: string[]): MapShape => {
    const parsed = rings.map(parse);
    const d = parsed.map((ring) => "M" + ring.map(([lon, lat]) => xy(lon, lat).map(r1).join(",")).join("L") + "Z").join("");
    // подпись — в центре тяжести видимой части контура (контур обрезан рамкой карты), если она крупная
    const box = parsed.map((ring) => clip(ring.map(([lon, lat]) => xy(lon, lat) as unknown as [number, number]), width, height)).filter((r) => r.length > 2);
    const c = centroid(box);
    const inside = c && c.area > width * height * 0.02 && c.x > 50 && c.x < width - 50 && c.y > 30 && c.y < height - 30;
    return { name, d, label: inside ? { x: r1(c.x), y: r1(c.y) } : undefined };
  };

  const areas = Object.entries(contours.areas).filter(([n]) => n !== "Екатеринбург").map(([n, r]) => shape(n, r));
  const city = shape("Екатеринбург", contours.areas["Екатеринбург"]);
  const water = Object.entries(contours.water).map(([n, r]) => shape(n, r));
  const dist = districts ? Object.entries(contours.districts).map(([n, r]) => shape(n, r)) : undefined;
  const points = input.map((p) => { const [x, y] = xy(p.lon, p.lat); return { ...p, x: r1(x), y: r1(y) }; });
  return { width, height, areas: districts ? areas.map((a) => ({ ...a, label: undefined })) : areas, districts: dist, city, water, points };
}

// Обрезка многоугольника прямоугольником 0..w × 0..h (Сазерленд — Ходжмен)
function clip(ring: [number, number][], w: number, h: number) {
  const edges: [(p: [number, number]) => boolean, (a: [number, number], b: [number, number]) => [number, number]][] = [
    [(p) => p[0] >= 0, (a, b) => [0, a[1] + ((b[1] - a[1]) * (0 - a[0])) / (b[0] - a[0])]],
    [(p) => p[0] <= w, (a, b) => [w, a[1] + ((b[1] - a[1]) * (w - a[0])) / (b[0] - a[0])]],
    [(p) => p[1] >= 0, (a, b) => [a[0] + ((b[0] - a[0]) * (0 - a[1])) / (b[1] - a[1]), 0]],
    [(p) => p[1] <= h, (a, b) => [a[0] + ((b[0] - a[0]) * (h - a[1])) / (b[1] - a[1]), h]],
  ];
  let out = ring;
  for (const [inside, cut] of edges) {
    const src = out; out = [];
    src.forEach((cur, i) => {
      const prev = src[(i + src.length - 1) % src.length];
      if (inside(cur)) { if (!inside(prev)) out.push(cut(prev, cur)); out.push(cur); }
      else if (inside(prev)) out.push(cut(prev, cur));
    });
    if (!out.length) break;
  }
  return out;
}

// Центр тяжести набора многоугольников по площади
function centroid(rings: [number, number][][]) {
  let A = 0, X = 0, Y = 0;
  for (const r of rings) r.forEach((a, i) => { const b = r[(i + 1) % r.length]; const f = a[0] * b[1] - b[0] * a[1]; A += f; X += (a[0] + b[0]) * f; Y += (a[1] + b[1]) * f; });
  if (!A) return null;
  return { area: Math.abs(A / 2), x: X / (3 * A), y: Y / (3 * A) };
}
