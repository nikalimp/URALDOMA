import Link from "next/link";
import { materials } from "@/content/materials";
import { tools } from "@/content/tools";
import { glossary } from "@/content/glossary";
import { comparisons } from "@/content/compare";
import { getPosts } from "@/lib/posts";
import { Container, Grid, Section, SectionHead, H2, linkArrow } from "@/components/container";
import { PageHead } from "@/components/page-head";
import { CtaSection } from "@/components/cta";
import { JsonLd } from "@/components/json-ld";
import { graph, itemList } from "@/lib/schema";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta({
  title: "База знаний о ремонте квартир в Екатеринбурге",
  description: "Справочник материалов, бесплатные калькуляторы ремонта, глоссарий строительных терминов и честные сравнения решений от команды URALDOMA.",
  path: "/knowledge/",
});

export default function KnowledgePage() {
  const posts = getPosts();
  const sections = [
    {
      n: "01",
      href: "/materials/",
      title: "Материалы",
      count: `${materials.length} материалов`,
      desc: "Разбираем покрытия и инженерные системы, с которыми работаем на объектах: бренды, реальный срок службы, частые ошибки монтажа и ориентиры цен в Екатеринбурге.",
      samples: materials.slice(0, 4).map((m) => ({ name: m.name, href: `/materials/${m.slug}/` })),
    },
    {
      n: "02",
      href: "/tools/",
      title: "Инструменты и калькуляторы",
      count: `${tools.length} инструментов`,
      desc: "Бесплатные онлайн-расчёты бюджета, сроков по этапам, расхода материалов, электрики, оплаты 30/40/30, чеклист приёмки новостройки и конструктор ТЗ на дизайн-проект.",
      samples: tools.slice(0, 4).map((t) => ({ name: t.name, href: `/tools/${t.slug}/` })),
    },
    {
      n: "03",
      href: "/glossary/",
      title: "Глоссарий терминов",
      count: `${glossary.length} терминов`,
      desc: "Объясняем строительные и дизайнерские термины простыми словами: от «белого куба» и стандартов К2–К4 до профилей EuroKraab, актов скрытых работ и коллекторных узлов.",
      samples: glossary.slice(0, 4).map((g) => ({ name: g.term, href: `/glossary/${g.slug}/` })),
    },
    {
      n: "04",
      href: "/compare/",
      title: "Сравнения «X или Y»",
      count: `${comparisons.length} разборов`,
      desc: "Таблицы и честные выводы технолога по главным развилкам ремонта: инженерная доска или кварцвинил, White Box или без отделки, EuroKraab или ГКЛ, компания или бригада.",
      samples: comparisons.slice(0, 4).map((c) => ({ name: c.h1, href: `/compare/${c.slug}/` })),
    },
    {
      n: "05",
      href: "/articles/",
      title: "Статьи и руководства",
      count: `${posts.length} статей`,
      desc: "Подробные разборы смет, планировок, приёмки квартир в новых ЖК Екатеринбурга и инженерных узлов на примере реальных объектов URALDOMA.",
      samples: posts.slice(0, 4).map((p) => ({ name: p.title, href: `/articles/${p.slug}/` })),
    },
  ];

  return (
    <>
      <JsonLd data={graph(itemList("База знаний URALDOMA", sections.map((s) => ({ name: s.title, path: s.href }))))} />
      <PageHead
        crumbs={[{ name: "Главная", path: "/" }, { name: "База знаний" }]}
        h1="База знаний о ремонте"
        answer="Собрали в одном месте практический опыт инженеров, прорабов и дизайнеров URALDOMA: справочник материалов с брендами, бесплатные калькуляторы, словарь строительных терминов и честные сравнения популярных решений."
      />

      <Section className="pt-0 md:pt-0">
        <Container>
          {sections.map((s) => (
            <Grid key={s.href} className="border-t border-border py-12 first:border-foreground md:py-16">
              <div className="md:col-span-4">
                <p className="caps text-muted-foreground">{s.n} · {s.count}</p>
                <h2 className="t-title mt-3"><Link href={s.href} className="hover:text-brand">{s.title}</Link></h2>
              </div>
              <div className="mt-4 md:col-span-8 md:mt-0">
                <p className="t-lead max-w-[46ch] text-foreground/85">{s.desc}</p>
                <ul className="mt-6 grid grid-cols-1 gap-x-6 border-t border-border sm:grid-cols-2">
                  {s.samples.map((it) => (
                    <li key={it.href}>
                      <Link href={it.href} className="text-small flex items-baseline justify-between gap-4 border-b border-border py-3 hover:text-brand">
                        <span>{it.name}</span>
                        <span aria-hidden="true">→</span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link href={s.href} className={`${linkArrow} mt-6`}>Открыть раздел «{s.title}» <span aria-hidden="true">→</span></Link>
              </div>
            </Grid>
          ))}
        </Container>
      </Section>

      <Section className="border-t border-border">
        <Container>
          <SectionHead label="Как пользоваться" title={<>Зачем мы публикуем <em>все технологии открыто</em></>} aside="Мы работаем в Екатеринбурге с 2016 года и убедились: когда заказчик понимает состав работ, разницу в материалах и порядок этапов, ремонт проходит спокойно и без сюрпризов в смете." />
          <div className="grid grid-cols-1 gap-x-gutter gap-y-8 md:grid-cols-3">
            <div className="border-t border-border pt-5">
              <H2 className="t-lead">1. Считайте бюджет заранее</H2>
              <p className="text-small mt-3 text-muted-foreground">Используйте калькуляторы стоимости, сроков и оплаты 30/40/30, чтобы спланировать финансирование ещё до получения ключей.</p>
            </div>
            <div className="border-t border-border pt-5">
              <H2 className="t-lead">2. Выбирайте проверенные узлы</H2>
              <p className="text-small mt-3 text-muted-foreground">В справочнике материалов и сравнениях мы указываем реальные бренды, ограничения и ошибки, которые чаще всего встречаются в новостройках.</p>
            </div>
            <div className="border-t border-border pt-5">
              <H2 className="t-lead">3. Проверяйте смету и скрытые этапы</H2>
              <p className="text-small mt-3 text-muted-foreground">Глоссарий и чеклист приёмки помогут говорить с любым подрядчиком на одном языке и контролировать критичные узлы до их закрытия.</p>
            </div>
          </div>
        </Container>
      </Section>

      <CtaSection source="knowledge:hub" />
    </>
  );
}
