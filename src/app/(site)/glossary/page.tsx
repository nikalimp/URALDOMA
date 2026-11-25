import Link from "next/link";
import { glossary } from "@/content/glossary";
import { Container, Grid, Section, linkArrow } from "@/components/container";
import { PageHead } from "@/components/page-head";
import { GlossaryFilter } from "@/components/glossary-filter";
import { CtaSection } from "@/components/cta";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbs, definedTermSetSchema, graph } from "@/lib/schema";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta({
  title: "Глоссарий ремонта и дизайна квартир — словарь терминов",
  description: "Словарь терминов ремонта, инженерии и дизайна интерьера от команды URALDOMA: White Box, К2–К4, EuroKraab, коллекторный узел, акт скрытых работ и другие понятия.",
  path: "/glossary/",
});

export default function GlossaryPage() {
  return (
    <>
      <JsonLd
        data={graph(
          definedTermSetSchema(glossary),
        )}
      />
      <PageHead
        crumbs={[{ name: "Главная", path: "/" }, { name: "Глоссарий" }]}
        h1="Глоссарий ремонта и дизайна"
        answer="Объясняем строительные, инженерные и дизайнерские термины простыми словами — без канцелярита и с примерами из реальных объектов в Екатеринбурге. Выберите категорию или найдите нужное понятие через поиск."
      />

      <Section className="pt-0 md:pt-0">
        <Container>
          <GlossaryFilter items={glossary} />
        </Container>
      </Section>

      <Section className="border-t border-border">
        <Container>
          <Grid>
            <p className="caps text-muted-foreground md:col-span-3">Зачем знать термины</p>
            <div className="space-y-4 md:col-span-8 md:col-start-4">
              <p className="t-lead">Понимание базовых терминов помогает сравнивать сметы разных подрядчиков и замечать скрытые упрощения ещё до подписания договора.</p>
              <p className="text-body text-muted-foreground">В каждой карточке глоссария мы объясняем не только определение, но и то, где это решение применяется в наших тарифах и какие ошибки чаще всего допускают на объектах.</p>
              <div className="flex flex-wrap gap-6 pt-2">
                <Link href="/materials/" className={linkArrow}>Справочник материалов →</Link>
                <Link href="/compare/" className={linkArrow}>Сравнения «X или Y» →</Link>
                <Link href="/tools/" className={linkArrow}>Бесплатные калькуляторы →</Link>
              </div>
            </div>
          </Grid>
        </Container>
      </Section>

      <CtaSection source="glossary:hub" />
    </>
  );
}
