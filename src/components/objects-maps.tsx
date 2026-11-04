import { ObjectsMap } from "@/components/objects-map";
import { cityMap, regionMap, cityMapWide, regionMapWide, zkList, kpList } from "@/lib/objects-map";

// Две карты друг под другом: карта в колонках 1–6, легенда и список — в 7–12 (03-design §10).
// full — на главной: карта во всю сетку, легенда строкой под ней, без списка (список — на странице «Ремонт в ЖК»)
export function ObjectsMaps({ full }: { full?: boolean }) {
  return (
    <div className="space-y-24 md:space-y-32">
      <ObjectsMap map={full ? cityMapWide : cityMap} alt={full ? cityMap : undefined} title={`ЖК Екатеринбурга — ${zkList.length}`} list={zkList} kind="Жилой комплекс" full={full} />
      <ObjectsMap map={full ? regionMapWide : regionMap} alt={full ? regionMap : undefined} title={`Коттеджные посёлки — ${kpList.length}`} list={kpList} kind="Коттеджный посёлок" full={full} />
    </div>
  );
}
