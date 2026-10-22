import type { Pic } from "@/content/photos";
import { Container, Grid } from "./container";
import { Img, Photo } from "./photo";

// Фотоистория объекта — вёрстка журнального разворота по 12 колонкам: большой кадр + малый, пара со сдвигом,
// одиночный кадр на весь экран (если есть широкая версия) или по центру. Подписи — «Fig. NN» и что на фото.
export function PhotoStory({ pics, start = 1 }: { pics: Pic[]; start?: number }) {
  const rows: { t: "a" | "b" | "c"; ps: Pic[] }[] = [];
  let i = 0;
  let k = 0;
  while (i < pics.length) {
    const t = (["a", "c", "b"] as const)[k % 3];
    if (t !== "c" && pics[i + 1]) { rows.push({ t, ps: [pics[i], pics[i + 1]] }); i += 2; }
    else { rows.push({ t: "c", ps: [pics[i]] }); i += 1; }
    k++;
  }
  let n = start - 1;
  const fig = () => `Fig. ${String(++n).padStart(2, "0")}`;
  return (
    <div className="space-y-16 md:space-y-28">
      {rows.map((r, ri) => {
        if (r.t === "c" && r.ps[0].wide) {
          const p = r.ps[0];
          return (
            <figure key={ri}>
              <div className="relative h-[70svh] min-h-[380px] overflow-hidden bg-secondary md:h-[92svh]"><Img p={p} wide sizes="100vw" className="parallax" /></div>
              <Container><figcaption className="text-small mt-3 flex gap-3 text-muted-foreground"><span className="label-tech text-foreground">{fig()}</span>{p.caption}</figcaption></Container>
            </figure>
          );
        }
        return (
          <Container key={ri}>
            <Grid className="items-end gap-y-12">
              {r.t === "a" && (
                <>
                  <Photo p={r.ps[0]} index={fig()} sizes="(min-width: 768px) 50vw, 100vw" className="reveal md:col-span-6" />
                  <Photo p={r.ps[1]} index={fig()} sizes="(min-width: 768px) 33vw, 100vw" className="reveal md:col-span-3 md:col-start-10" />
                </>
              )}
              {r.t === "b" && (
                <>
                  <Photo p={r.ps[0]} index={fig()} sizes="(min-width: 768px) 25vw, 100vw" className="reveal self-start md:col-span-3" />
                  <Photo p={r.ps[1]} index={fig()} sizes="(min-width: 768px) 50vw, 100vw" className="reveal self-start md:col-span-6 md:col-start-7 md:mt-40" />
                </>
              )}
              {r.t === "c" && <Photo p={r.ps[0]} index={fig()} sizes="(min-width: 768px) 50vw, 100vw" className="reveal md:col-span-6 md:col-start-4" />}
            </Grid>
          </Container>
        );
      })}
    </div>
  );
}
