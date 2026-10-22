import { ObjectsMap } from "@/components/objects-map";
import { cityMap, regionMap, zkList, kpList } from "@/lib/objects-map";

// Две карты друг под другом: карта в колонках 1–6, легенда и список — в 7–12 (03-design §10)
export function ObjectsMaps() {
  return (
    <div className="space-y-24 md:space-y-32">
      <ObjectsMap map={cityMap} title={`ЖК Екатеринбурга — ${zkList.length}`} list={zkList} kind="Жилой комплекс" />
      <ObjectsMap map={regionMap} title={`Коттеджные посёлки — ${kpList.length}`} list={kpList} kind="Коттеджный посёлок" />
    </div>
  );
}
