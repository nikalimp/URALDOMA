import { complexes } from "@/content/complexes";
import { buildMap } from "./map";

// Две карты для главной и /complexes/: город с районами и ЖК, окрестности с коттеджными посёлками.
// Ширина viewBox = ширине блока на 1440 px (6 колонок = 670 px), чтобы подписи были в px.
const zk = complexes.filter((c) => c.kind === "zk" && c.geo.lat);
const kp = complexes.filter((c) => c.kind === "kp" && c.geo.lat);
const point = (c: (typeof complexes)[number]) => ({ slug: c.slug, name: c.name, kind: c.kind, lat: c.geo.lat, lon: c.geo.lon, ours: c.ours });
const byName = (a: { name: string }, b: { name: string }) => a.name.replace(/^\S+ «?/, "").localeCompare(b.name.replace(/^\S+ «?/, ""), "ru");

export const cityMap = buildMap(zk.map(point), { width: 670, pad: 0.1, districts: true });
export const regionMap = buildMap(kp.map(point), { width: 670, pad: 0.1 });
// Главная: карты во всю сетку — широкие (16 : 10), чтобы не уходили на два экрана в высоту
export const cityMapWide = buildMap(zk.map(point), { width: 1360, pad: 0.06, districts: true, aspect: 1.6 });
export const regionMapWide = buildMap(kp.map(point), { width: 1360, pad: 0.06, aspect: 1.6 });
export const zkList = [...zk].sort(byName).map((c) => ({ slug: c.slug, name: c.name, note: c.ours ? "наш объект" : c.district?.replace(/\s*\(.*\)$/, "") }));
export const kpList = [...kp].sort(byName).map((c) => ({ slug: c.slug, name: c.name, note: c.ours ? "наш объект" : undefined }));
export const counts = { zk: zk.length, kp: kp.length };
