import Link from "next/link";
import { materials, materialCats, type MaterialCat } from "@/content/materials";
import { pic } from "@/content/photos";
import { Container, Grid, Section, SectionHead, linkArrow } from "@/components/container";
import { PageHead } from "@/components/page-head";
import { Img } from "@/components/photo";
import { CtaSection } from "@/components/cta";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbs, graph, itemList } from "@/lib/schema";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta({
  title: "Материалы для ремонта квартиры: справочник, бренды, цены",
  description: "Справочник материалов для ремонта от технологов URALDOMA: полы, стены, потолки, инженерия, скрытые двери, популярные бренды и цены в Екатеринбурге.",
  path: "/materials/",
});

export default function MaterialsPage() {
  const catOrder: MaterialCat[] = ["floors", "walls", "ceilings", "engineering", "doors-light"];

  return (
    <>
      <JsonLd
        data={graph(
          itemList("Материалы для ремонта квартир", materials.map((m) => ({ name: m.name, path: `/materials/${m.slug}/` }))),
        )}
      />
      <PageHead
        crumbs={[{ name: "Главная", path: "/" }, { name: "Материалы" }]}
        h1="Материалы для ремонта"
        answer="Справочник покрытий, профилей и инженерных систем, которые URALDOMA использует в квартирах и домах Екатеринбурга. По каждому материалу — проверенные бренды, реальный срок службы, ориентир цены, ошибки монтажа и привязка к нашим тарифам."
      />

      <Section className="pt-0 md:pt-0">
        <Container>
          {catOrder.map((cat) => {
            const list = materials.filter((m) => m.cat === cat);
            if (!list.length) return null;
            return (
              <div key={cat} className="border-t border-foreground py-12 md:py-16">
                <SectionHead label={materialCats[cat].label} title={materialCats[cat].label} aside={materialCats[cat].desc} />
                <div className="grid grid-cols-1 gap-x-gutter gap-y-12 md:grid-cols-2 lg:grid-cols-3">
                  {list.map((m) => (
                    <article key={m.slug} className="flex flex-col border-t border-border pt-5">
                      {m.photo && (
                        <Link href={`/materials/${m.slug}/`} className="mb-4 block overflow-hidden bg-secondary">
                          <Img p={pic(m.photo)} sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw" className="aspect-[4/3] w-full object-cover transition-transform duration-500 hover:scale-[1.03]" />
                        </Link>
                      )}
                      <p className="caps text-muted-foreground">{m.tariffs.join(" · ")}</p>
                      <h3 className="t-lead mt-2"><Link href={`/materials/${m.slug}/`} className="hover:text-brand">{m.name}</Link></h3>
                      <p className="text-small mt-3 flex-1 text-muted-foreground">{m.answer}</p>
                      <p className="text-small mt-4 font-medium">{m.priceRange}</p>
                      <p className="mt-1 text-[12px] text-muted-foreground">Бренды: {m.brands.slice(0, 4).join(", ")}</p>
                      <Link href={`/materials/${m.slug}/`} className={`${linkArrow} mt-4`}>Подробнее о материале <span aria-hidden="true">→</span></Link>
                    </article>
                  ))}
                </div>
              </div>
            );
          })}
        </Container>
      </Section>

      <Section className="border-t border-border">
        <Container>
          <Grid>
            <p className="caps text-muted-foreground md:col-span-3">Полезно рядом</p>
            <div className="md:col-span-9 md:col-start-4">
              <p className="t-lead">Сомневаетесь между двумя покрытиями или нужно посчитать расход на вашу площадь?</p>
              <div className="mt-6 flex flex-wrap gap-6">
                <Link href="/compare/" className={linkArrow}>Сравнения материалов «X или Y» →</Link>
                <Link href="/tools/materials-calculator/" className={linkArrow}>Калькулятор расхода материалов →</Link>
                <Link href="/glossary/" className={linkArrow}>Глоссарий терминов →</Link>
              </div>
            </div>
          </Grid>
        </Container>
      </Section>

      <CtaSection source="materials:hub" />
    </>
  );
}
