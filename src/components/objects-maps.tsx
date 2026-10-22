import { Grid } from "@/components/container";
import { ObjectsMap } from "@/components/objects-map";
import { cityMap, regionMap, zkList, kpList } from "@/lib/objects-map";

// Две карты на направляющих: ЖК Екатеринбурга (колонки 1–6) и коттеджные посёлки вокруг (7–12)
export function ObjectsMaps() {
  return (
    <Grid className="gap-y-16">
      <div className="md:col-span-6">
        <ObjectsMap map={cityMap} title={`ЖК Екатеринбурга — ${zkList.length}`} list={zkList} cols={2} />
      </div>
      <div className="md:col-span-6 md:col-start-7">
        <ObjectsMap map={regionMap} title={`Коттеджные посёлки — ${kpList.length}`} list={kpList} cols={2} />
      </div>
    </Grid>
  );
}
