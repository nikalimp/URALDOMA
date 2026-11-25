"use client";

import { useEffect, useState } from "react";
import type { ToolKind } from "@/content/tools";
import { tariffs, formatRub } from "@/content/tariffs";
import { LeadForm } from "./lead-form";
import { cn } from "@/lib/utils";

const btnChoice = (active: boolean) =>
  cn(
    "text-small min-h-[44px] border px-4 py-2 text-left font-medium transition-colors",
    active
      ? "border-foreground bg-foreground text-background"
      : "border-border text-muted-foreground hover:border-foreground hover:text-foreground",
  );

const rangeCls = "mt-3 w-full accent-brand cursor-pointer";

function SendResultBox({ source, summary, title = "Отправить расчёт технологу" }: { source: string; summary: string; title?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-8 border-t border-border pt-6">
      {!open ? (
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-small max-w-[46ch] text-muted-foreground">Хотите зафиксировать точную смету по вашей планировке? Отправьте этот расчёт технологу — перезвоним или напишем в мессенджер.</p>
          <button type="button" onClick={() => setOpen(true)} className="text-small inline-flex min-h-[44px] items-center gap-3 rounded-pill bg-foreground px-6 font-medium text-background transition-colors hover:bg-brand hover:text-on-brand">
            {title} <span aria-hidden="true">→</span>
          </button>
        </div>
      ) : (
        <div className="bg-panel p-6 text-panel-foreground md:p-8">
          <div className="flex items-baseline justify-between gap-4">
            <p className="t-lead">{title}</p>
            <button type="button" onClick={() => setOpen(false)} className="text-small text-panel-muted underline underline-offset-4 hover:text-panel-foreground">Скрыть</button>
          </div>
          <p className="text-small mt-2 mb-6 text-panel-muted">Параметры расчёта прикрепятся к заявке автоматически.</p>
          <LeadForm tone="dark" source={source} extra={summary} button="Отправить расчёт" label={title} />
        </div>
      )}
    </div>
  );
}

// 1. Калькулятор стоимости ремонта
function CostCalc() {
  const [area, setArea] = useState(75);
  const [tariffId, setTariffId] = useState<"basic" | "extended" | "all">("extended");
  const [withDesign, setWithDesign] = useState(true);
  const [state, setState] = useState("Без отделки");

  const t = tariffs.find((x) => x.id === tariffId) ?? tariffs[1];
  const works = area * t.rate;
  const design = withDesign ? area * 3000 : 0;
  const roughMin = Math.round(works * 0.35);
  const roughMax = Math.round(works * 0.45);
  const totalWorks = works + design;

  const summary = `Калькулятор стоимости: ${area} м², состояние «${state}», тариф «${t.name}» (${t.rate} ₽/м²), дизайн-проект: ${withDesign ? "да" : "нет"}. Работы: ${formatRub(works)}, проект: ${formatRub(design)}.`;

  return (
    <div className="border border-border bg-secondary/40 p-6 md:p-10">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
        <div className="space-y-6 md:col-span-7">
          <div>
            <div className="flex items-baseline justify-between">
              <label htmlFor="cost-area" className="caps text-muted-foreground">Площадь квартиры</label>
              <span className="t-lead num">{area} м²</span>
            </div>
            <input id="cost-area" type="range" min={25} max={250} step={5} value={area} onChange={(e) => setArea(Number(e.target.value))} className={rangeCls} />
            <div className="mt-1 flex justify-between text-[12px] text-muted-foreground"><span>25 м²</span><span>100 м²</span><span>250 м²</span></div>
          </div>

          <div>
            <p className="caps text-muted-foreground">Тариф работ URALDOMA</p>
            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
              {tariffs.map((item) => (
                <button key={item.id} type="button" onClick={() => setTariffId(item.id)} className={btnChoice(tariffId === item.id)}>
                  <div>{item.name}</div>
                  <div className="mt-1 text-[12px] opacity-75">{formatRub(item.rate)}/м²</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="caps text-muted-foreground">Состояние квартиры</p>
            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
              {["Без отделки", "White Box", "Вторичка"].map((s) => (
                <button key={s} type="button" onClick={() => setState(s)} className={btnChoice(state === s)}>{s}</button>
              ))}
            </div>
          </div>

          <label className="flex cursor-pointer items-center gap-3 text-body">
            <input type="checkbox" checked={withDesign} onChange={(e) => setWithDesign(e.target.checked)} className="size-4 accent-brand" />
            <span>Добавить дизайн-проект (от 3 000 ₽/м²)</span>
          </label>
        </div>

        <div className="border-t border-border pt-6 md:col-span-5 md:border-t-0 md:border-l md:pt-0 md:pl-8">
          <p className="caps text-muted-foreground">Итоговый ориентир</p>
          <p className="t-statement num mt-3">{formatRub(totalWorks)}</p>
          <p className="text-small mt-1 text-muted-foreground">Работы {withDesign ? "+ дизайн-проект" : "без проекта"} ({t.name})</p>
          <dl className="mt-6 space-y-3 border-t border-border pt-4 text-small">
            <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Строительные работы</dt><dd className="num font-medium">{formatRub(works)}</dd></div>
            {withDesign && <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Дизайн-проект</dt><dd className="num font-medium">{formatRub(design)}</dd></div>}
            <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Черновые материалы (ориентир)</dt><dd className="num font-medium">{formatRub(roughMin)} – {formatRub(roughMax)}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Подъём и вывоз мусора</dt><dd className="font-medium text-brand">Включено</dd></div>
          </dl>
        </div>
      </div>
      <SendResultBox source="tool:renovation-cost" summary={summary} />
    </div>
  );
}

// 2. Калькулятор сроков ремонта
function TimelineCalc() {
  const [area, setArea] = useState(80);
  const [withDesign, setWithDesign] = useState(true);
  const [replan, setReplan] = useState(true);

  const designW = withDesign ? (area > 110 ? 10 : area > 70 ? 8 : 6) : 0;
  const roughW = Math.round((area > 110 ? 8 : area > 70 ? 6 : 5) + (replan ? 2 : 0));
  const engW = area > 110 ? 4 : 3;
  const finishW = area > 110 ? 10 : area > 70 ? 8 : 6;
  const furnitureW = area > 110 ? 4 : 3;
  const totalW = designW + roughW + engW + finishW + furnitureW;
  const months = (totalW / 4.3).toFixed(1);

  const rows = [
    ...(withDesign ? [["Дизайн-проект и спецификации", `${designW} нед.`]] : []),
    ["Демонтаж, перегородки, штукатурка и стяжка", `${roughW} нед.`],
    ["Электрика, сантехника, отопление, вентиляция", `${engW} нед.`],
    ["Плитка, малярка, полы, потолки и двери", `${finishW} нед.`],
    ["Монтаж кухни, мебели, света и клининг", `${furnitureW} нед.`],
  ];

  return (
    <div className="border border-border bg-secondary/40 p-6 md:p-10">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
        <div className="space-y-6 md:col-span-5">
          <div>
            <div className="flex items-baseline justify-between">
              <label htmlFor="time-area" className="caps text-muted-foreground">Площадь квартиры</label>
              <span className="t-lead num">{area} м²</span>
            </div>
            <input id="time-area" type="range" min={30} max={220} step={10} value={area} onChange={(e) => setArea(Number(e.target.value))} className={rangeCls} />
          </div>
          <label className="flex cursor-pointer items-center gap-3 text-body">
            <input type="checkbox" checked={withDesign} onChange={(e) => setWithDesign(e.target.checked)} className="size-4 accent-brand" />
            <span>Нужен дизайн-проект</span>
          </label>
          <label className="flex cursor-pointer items-center gap-3 text-body">
            <input type="checkbox" checked={replan} onChange={(e) => setReplan(e.target.checked)} className="size-4 accent-brand" />
            <span>Будет перепланировка и новые перегородки</span>
          </label>
        </div>
        <div className="border-t border-border pt-6 md:col-span-7 md:border-t-0 md:border-l md:pt-0 md:pl-8">
          <p className="caps text-muted-foreground">Общий срок под ключ</p>
          <p className="t-statement num mt-2">{totalW} недель (~{months} мес.)</p>
          <ol className="mt-6 divide-y divide-border border-t border-border">
            {rows.map(([label, dur], i) => (
              <li key={label} className="flex items-baseline justify-between gap-4 py-3 text-small">
                <span><span className="mr-3 font-mono text-brand">{String(i + 1).padStart(2, "0")}</span>{label}</span>
                <span className="num shrink-0 font-medium">{dur}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
      <SendResultBox source="tool:renovation-timeline" summary={`Калькулятор сроков: ${area} м², проект: ${withDesign ? "да" : "нет"}, перепланировка: ${replan ? "да" : "нет"}. Итого: ${totalW} недель.`} title="Зафиксировать график в договоре" />
    </div>
  );
}

// 3. Калькулятор расхода материалов
function MaterialsCalc() {
  const [area, setArea] = useState(70);
  const [height, setHeight] = useState(2.8);
  const [plasterMm, setPlasterMm] = useState(20);
  const [screedMm, setScreedMm] = useState(60);

  const wallArea = Math.round(area * 2.55 * (height / 2.7));
  const plasterBags = Math.ceil((wallArea * (plasterMm / 10) * 10) / 30);
  const screedBags = Math.ceil((area * (screedMm / 10) * 18) / 25);
  const paintLiters = Math.ceil(wallArea * 0.24);
  const floorWithReserve = Math.ceil(area * 1.1);

  return (
    <div className="border border-border bg-secondary/40 p-6 md:p-10">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
        <div className="space-y-5 md:col-span-6">
          <div>
            <div className="flex justify-between"><label htmlFor="m-area" className="caps text-muted-foreground">Площадь пола</label><span className="num font-medium">{area} м²</span></div>
            <input id="m-area" type="range" min={25} max={220} step={5} value={area} onChange={(e) => setArea(Number(e.target.value))} className={rangeCls} />
          </div>
          <div>
            <div className="flex justify-between"><label htmlFor="m-h" className="caps text-muted-foreground">Высота потолков</label><span className="num font-medium">{height.toFixed(1)} м</span></div>
            <input id="m-h" type="range" min={2.5} max={3.8} step={0.1} value={height} onChange={(e) => setHeight(Number(e.target.value))} className={rangeCls} />
          </div>
          <div>
            <div className="flex justify-between"><label htmlFor="m-p" className="caps text-muted-foreground">Средний слой штукатурки</label><span className="num font-medium">{plasterMm} мм</span></div>
            <input id="m-p" type="range" min={10} max={40} step={5} value={plasterMm} onChange={(e) => setPlasterMm(Number(e.target.value))} className={rangeCls} />
          </div>
          <div>
            <div className="flex justify-between"><label htmlFor="m-s" className="caps text-muted-foreground">Толщина стяжки</label><span className="num font-medium">{screedMm} мм</span></div>
            <input id="m-s" type="range" min={40} max={90} step={5} value={screedMm} onChange={(e) => setScreedMm(Number(e.target.value))} className={rangeCls} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 border-t border-border pt-6 md:col-span-6 md:border-t-0 md:border-l md:pt-0 md:pl-8">
          <div className="border-t border-border pt-3"><p className="caps text-muted-foreground">Штукатурка (30 кг)</p><p className="t-title num mt-2">{plasterBags} меш.</p><p className="text-[12px] text-muted-foreground">~{wallArea} м² стен</p></div>
          <div className="border-t border-border pt-3"><p className="caps text-muted-foreground">Стяжка (25 кг)</p><p className="t-title num mt-2">{screedBags} меш.</p><p className="text-[12px] text-muted-foreground">при слое {screedMm} мм</p></div>
          <div className="border-t border-border pt-3"><p className="caps text-muted-foreground">Краска (2 слоя)</p><p className="t-title num mt-2">{paintLiters} л</p><p className="text-[12px] text-muted-foreground">с запасом 10%</p></div>
          <div className="border-t border-border pt-3"><p className="caps text-muted-foreground">Напольное покрытие</p><p className="t-title num mt-2">{floorWithReserve} м²</p><p className="text-[12px] text-muted-foreground">с запасом 10% под рез</p></div>
        </div>
      </div>
      <SendResultBox source="tool:materials-calculator" summary={`Расход материалов: ${area} м², потолки ${height} м, штукатурка ${plasterBags} меш., стяжка ${screedBags} меш., краска ${paintLiters} л.`} title="Заказать точный замер и смету" />
    </div>
  );
}

// 4. Калькулятор керамогранита и плитки
function TileCalc() {
  const [area, setArea] = useState(28);
  const [format, setFormat] = useState<"60x60" | "60x120" | "120x240">("60x120");
  const [reserve, setReserve] = useState(12);

  const tileArea = format === "60x60" ? 0.36 : format === "60x120" ? 0.72 : 2.88;
  const totalArea = +(area * (1 + reserve / 100)).toFixed(1);
  const pieces = Math.ceil(totalArea / tileArea);
  const glueBags = Math.ceil((area * (format === "60x60" ? 5 : 6.5)) / 25);
  const groutKg = Math.max(2, Math.ceil(area * 0.25));

  return (
    <div className="border border-border bg-secondary/40 p-6 md:p-10">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
        <div className="space-y-5 md:col-span-6">
          <div>
            <div className="flex justify-between"><label htmlFor="t-area" className="caps text-muted-foreground">Чистая площадь облицовки</label><span className="num font-medium">{area} м²</span></div>
            <input id="t-area" type="range" min={4} max={120} step={2} value={area} onChange={(e) => setArea(Number(e.target.value))} className={rangeCls} />
          </div>
          <div>
            <p className="caps text-muted-foreground">Формат керамогранита (см)</p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {(["60x60", "60x120", "120x240"] as const).map((f) => (
                <button key={f} type="button" onClick={() => setFormat(f)} className={btnChoice(format === f)}>{f.replace("x", "×")}</button>
              ))}
            </div>
          </div>
          <div>
            <p className="caps text-muted-foreground">Запас на подрезку и углы 45°</p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {[10, 12, 15].map((r) => (
                <button key={r} type="button" onClick={() => setReserve(r)} className={btnChoice(reserve === r)}>+{r}%</button>
              ))}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 border-t border-border pt-6 md:col-span-6 md:border-t-0 md:border-l md:pt-0 md:pl-8">
          <div className="border-t border-border pt-3"><p className="caps text-muted-foreground">Купить с запасом</p><p className="t-title num mt-2">{totalArea} м²</p></div>
          <div className="border-t border-border pt-3"><p className="caps text-muted-foreground">Количество плит</p><p className="t-title num mt-2">{pieces} шт.</p></div>
          <div className="border-t border-border pt-3"><p className="caps text-muted-foreground">Клей C2 (25 кг)</p><p className="t-title num mt-2">{glueBags} меш.</p></div>
          <div className="border-t border-border pt-3"><p className="caps text-muted-foreground">Эпоксидная затирка</p><p className="t-title num mt-2">~{groutKg} кг</p></div>
        </div>
      </div>
    </div>
  );
}

// 5. Калькулятор электрики
function ElectricalCalc() {
  const [rooms, setRooms] = useState(2);
  const [baths, setBaths] = useState(1);
  const [acCount, setAcCount] = useState(2);
  const [warmFloors, setWarmFloors] = useState(2);

  const sockets = 14 + rooms * 12 + baths * 4;
  const switches = 6 + rooms * 4 + baths * 2;
  const groups = 10 + rooms * 2 + baths * 2 + acCount + warmFloors;
  const modules = Math.ceil((groups + 8) * 1.25 / 12) * 12;
  const cableM = 120 + rooms * 95 + baths * 45 + acCount * 20;

  return (
    <div className="border border-border bg-secondary/40 p-6 md:p-10">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
        <div className="space-y-5 md:col-span-6">
          <div>
            <p className="caps text-muted-foreground">Количество жилых комнат</p>
            <div className="mt-2 grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((n) => <button key={n} type="button" onClick={() => setRooms(n)} className={btnChoice(rooms === n)}>{n}</button>)}
            </div>
          </div>
          <div>
            <p className="caps text-muted-foreground">Количество санузлов</p>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {[1, 2, 3].map((n) => <button key={n} type="button" onClick={() => setBaths(n)} className={btnChoice(baths === n)}>{n}</button>)}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="caps text-muted-foreground">Кондиционеры</p>
              <div className="mt-2 grid grid-cols-4 gap-1">
                {[0, 1, 2, 3].map((n) => <button key={n} type="button" onClick={() => setAcCount(n)} className={btnChoice(acCount === n)}>{n}</button>)}
              </div>
            </div>
            <div>
              <p className="caps text-muted-foreground">Зоны тёплого пола</p>
              <div className="mt-2 grid grid-cols-4 gap-1">
                {[0, 1, 2, 3].map((n) => <button key={n} type="button" onClick={() => setWarmFloors(n)} className={btnChoice(warmFloors === n)}>{n}</button>)}
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 border-t border-border pt-6 md:col-span-6 md:border-t-0 md:border-l md:pt-0 md:pl-8">
          <div className="border-t border-border pt-3"><p className="caps text-muted-foreground">Электроточки</p><p className="t-title num mt-2">~{sockets + switches}</p><p className="text-[12px] text-muted-foreground">{sockets} роз. + {switches} выкл.</p></div>
          <div className="border-t border-border pt-3"><p className="caps text-muted-foreground">Размер щита</p><p className="t-title num mt-2">{modules} мод.</p><p className="text-[12px] text-muted-foreground">с запасом + УЗО + реле</p></div>
          <div className="border-t border-border pt-3"><p className="caps text-muted-foreground">Линии автоматов</p><p className="t-title num mt-2">{groups} шт.</p></div>
          <div className="border-t border-border pt-3"><p className="caps text-muted-foreground">Кабель ВВГнг-LS</p><p className="t-title num mt-2">~{cableM} м</p></div>
        </div>
      </div>
    </div>
  );
}

// 6. Калькулятор поэтапной оплаты 30/40/30
function PaymentCalc() {
  const [area, setArea] = useState(80);
  const [tariffId, setTariffId] = useState<"basic" | "extended" | "all">("extended");
  const t = tariffs.find((x) => x.id === tariffId) ?? tariffs[1];
  const total = area * t.rate;
  const p1 = Math.round(total * 0.3);
  const p2 = Math.round(total * 0.4);
  const p3 = total - p1 - p2;

  return (
    <div className="border border-border bg-secondary/40 p-6 md:p-10">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <div className="flex justify-between"><label htmlFor="pay-area" className="caps text-muted-foreground">Площадь квартиры</label><span className="t-lead num">{area} м²</span></div>
          <input id="pay-area" type="range" min={25} max={250} step={5} value={area} onChange={(e) => setArea(Number(e.target.value))} className={rangeCls} />
        </div>
        <div className="grid grid-cols-3 gap-2">
          {tariffs.map((item) => (
            <button key={item.id} type="button" onClick={() => setTariffId(item.id)} className={btnChoice(tariffId === item.id)}>
              <div>{item.name}</div>
              <div className="text-[12px] opacity-75">{formatRub(item.rate)}/м²</div>
            </button>
          ))}
        </div>
      </div>
      <div className="mt-8 grid grid-cols-1 gap-4 border-t border-border pt-6 md:grid-cols-3">
        <div className="border-t border-foreground pt-4"><p className="caps text-brand">01 · Старт (30%)</p><p className="t-title num mt-2">{formatRub(p1)}</p><p className="text-small mt-2 text-muted-foreground">После подписания договора и утверждения сметы.</p></div>
        <div className="border-t border-foreground pt-4"><p className="caps text-brand">02 · Черновые (40%)</p><p className="t-title num mt-2">{formatRub(p2)}</p><p className="text-small mt-2 text-muted-foreground">После приёмки черновых и инженерных работ.</p></div>
        <div className="border-t border-foreground pt-4"><p className="caps text-brand">03 · Сдача (30%)</p><p className="t-title num mt-2">{formatRub(p3)}</p><p className="text-small mt-2 text-muted-foreground">После чистовой отделки, клининга и подписания акта.</p></div>
      </div>
    </div>
  );
}

// 7. Интерактивный чеклист приёмки новостройки
const checklistGroups: { title: string; items: string[] }[] = [
  { title: "Входная дверь и окна", items: ["Замки и петли входной двери работают без заеданий, уплотнитель целый", "На стеклопакетах нет царапин, сколов и окалин от сварки", "Створки окон открываются и откидываются плавно, не задевают раму", "По периметру оконных откосов и подоконника нет продувания"] },
  { title: "Стены, потолок и стяжка", items: ["В стяжке нет сквозных трещин, отслоений и пустот при простукивании", "Проверены вертикали и углы 90° в зонах кухни и санузлов", "На плитах перекрытия и стыках нет следов протечек и плесени", "Высота потолков и площадь совпадают с планом ДДУ"] },
  { title: "Вода, отопление и вентиляция", items: ["Стояки холодной и горячей воды сухие, краны перекрываются плавно", "Проверена тяга вентиляции на кухне и в санузлах листом бумаги А4", "Радиаторы отопления закреплены ровно, нет сколов и подтёков на соединениях", "Счётчики воды и тепла опломбированы, номера совпадают с паспортами"] },
  { title: "Электрика", items: ["В электрощите работают вводной автомат и УЗО (проверка кнопкой «Тест»)", "Во всех установленных розетках есть напряжение и заземление", "Вводной кабель не повреждён, домофон и звонок подключены"] },
];

function AcceptanceChecklist() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  useEffect(() => {
    try {
      const saved = localStorage.getItem("ud_accept_v1");
      if (saved) setChecked(JSON.parse(saved));
    } catch {}
  }, []);

  const toggle = (key: string) => {
    setChecked((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      try { localStorage.setItem("ud_accept_v1", JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const allItems = checklistGroups.flatMap((g) => g.items);
  const doneCount = allItems.filter((it) => checked[it]).length;

  return (
    <div className="border border-border bg-secondary/40 p-6 md:p-10">
      <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-border pb-4">
        <div>
          <p className="caps text-muted-foreground">Прогресс приёмки</p>
          <p className="t-lead num mt-1">Проверено {doneCount} из {allItems.length} пунктов</p>
        </div>
        {doneCount > 0 && (
          <button type="button" onClick={() => { setChecked({}); try { localStorage.removeItem("ud_accept_v1"); } catch {} }} className="text-small text-muted-foreground underline underline-offset-4 hover:text-foreground">
            Сбросить отметки
          </button>
        )}
      </div>
      <div className="mt-6 space-y-8">
        {checklistGroups.map((g) => (
          <div key={g.title}>
            <h3 className="t-lead">{g.title}</h3>
            <ul className="mt-3 divide-y divide-border border-t border-border">
              {g.items.map((item) => (
                <li key={item} className="py-3">
                  <label className="flex cursor-pointer items-start gap-3 text-body">
                    <input type="checkbox" checked={!!checked[item]} onChange={() => toggle(item)} className="mt-1 size-4 shrink-0 accent-brand" />
                    <span className={checked[item] ? "line-through opacity-55" : ""}>{item}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

// 8. Конструктор ТЗ на дизайн-проект
const briefFeatures = ["Скрытые двери", "Теневые потолки EuroKraab", "Магнитные треки", "Инженерная доска", "Шумоизоляция спальни", "Защита от протечек", "Постирочная / сушилка", "Приточная вентиляция", "Тёплые полы в санузле и прихожей"];

function DesignBriefBuilder() {
  const [area, setArea] = useState(85);
  const [style, setStyle] = useState("Тёплый минимализм");
  const [people, setPeople] = useState("Семья с детьми");
  const [selected, setSelected] = useState<string[]>(["Скрытые двери", "Теневые потолки EuroKraab", "Защита от протечек"]);
  const [copied, setCopied] = useState(false);

  const toggleFeat = (f: string) => setSelected((s) => (s.includes(f) ? s.filter((x) => x !== f) : [...s, f]));
  const briefText = `ТЗ на дизайн-проект: площадь ${area} м², стиль «${style}», проживают: ${people}. Обязательные решения: ${selected.length ? selected.join(", ") : "обсудим на встрече"}.`;

  return (
    <div className="border border-border bg-secondary/40 p-6 md:p-10">
      <div className="space-y-6">
        <div>
          <div className="flex justify-between"><label htmlFor="b-area" className="caps text-muted-foreground">Площадь объекта</label><span className="t-lead num">{area} м²</span></div>
          <input id="b-area" type="range" min={30} max={250} step={5} value={area} onChange={(e) => setArea(Number(e.target.value))} className={rangeCls} />
        </div>
        <div>
          <p className="caps text-muted-foreground">Близкий стиль интерьера</p>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {["Тёплый минимализм", "Джапанди", "Современная классика", "Контемпорари"].map((s) => (
              <button key={s} type="button" onClick={() => setStyle(s)} className={btnChoice(style === s)}>{s}</button>
            ))}
          </div>
        </div>
        <div>
          <p className="caps text-muted-foreground">Кто будет жить</p>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {["Один человек", "Пара", "Семья с детьми", "Под сдачу"].map((p) => (
              <button key={p} type="button" onClick={() => setPeople(p)} className={btnChoice(people === p)}>{p}</button>
            ))}
          </div>
        </div>
        <div>
          <p className="caps text-muted-foreground">Важные инженерные и интерьерные решения</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {briefFeatures.map((f) => (
              <button key={f} type="button" onClick={() => toggleFeat(f)} className={btnChoice(selected.includes(f))}>{f}</button>
            ))}
          </div>
        </div>
        <div className="border border-border bg-background p-5">
          <div className="flex items-center justify-between gap-4">
            <p className="caps text-muted-foreground">Готовый черновик ТЗ</p>
            <button type="button" onClick={() => { navigator.clipboard?.writeText(briefText); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="text-small underline underline-offset-4 hover:text-brand">
              {copied ? "Скопировано" : "Копировать текст"}
            </button>
          </div>
          <p className="text-body mt-3">{briefText}</p>
        </div>
      </div>
      <SendResultBox source="tool:design-brief" summary={briefText} title="Отправить ТЗ дизайнеру URALDOMA" />
    </div>
  );
}

export function ToolWidget({ kind }: { kind: ToolKind }) {
  switch (kind) {
    case "renovation-cost": return <CostCalc />;
    case "renovation-timeline": return <TimelineCalc />;
    case "materials-calculator": return <MaterialsCalc />;
    case "tile-calculator": return <TileCalc />;
    case "electrical-calculator": return <ElectricalCalc />;
    case "payment-schedule": return <PaymentCalc />;
    case "acceptance-checklist": return <AcceptanceChecklist />;
    case "design-brief": return <DesignBriefBuilder />;
  }
}
