import { contactsPage as C } from "@/content/pages";
import { site } from "@/content/site";
import { Container, Grid, Section, Label } from "@/components/container";
import { PageHead } from "@/components/page-head";
import { LeadForm } from "@/components/lead-form";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbs, graph, orgId } from "@/lib/schema";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta({ title: C.metaTitle, description: C.metaDescription, path: "/contacts/" });

export default function Contacts() {
  const c = site.contacts;
  const rows: [string, React.ReactNode][] = [
    ["Телефон", <a key="p" href={`tel:${c.phone}`} className="hover:text-brand">{c.phoneDisplay}</a>],
    ["Почта", <a key="e" href={`mailto:${c.email}`} className="hover:text-brand">{c.email}</a>],
    ["Telegram", <a key="t" href={c.telegram} target="_blank" rel="noopener" className="hover:text-brand">@uraldoma</a>],
    ["Адрес", [c.address.city, c.address.street].filter(Boolean).join(", ")],
    ...(c.hours ? ([["Часы работы", c.hours]] as [string, string][]) : []),
    ["Реквизиты", `${site.legalName}, ИНН ${site.legal.inn}, ОГРНИП ${site.legal.ogrnip}`],
  ];
  return (
    <>
      <JsonLd data={graph({ "@type": "ContactPage", name: C.h1, url: `${site.url}/contacts/`, about: { "@id": orgId } }, breadcrumbs([{ name: "Главная", path: "/" }, { name: "Контакты", path: "/contacts/" }]))} />
      <PageHead crumbs={[{ name: "Главная", path: "/" }, { name: "Контакты" }]} h1={C.h1} answer={C.answer} />
      <Section className="pt-0 md:pt-0">
        <Container>
          <Grid>
            <dl className="border-t border-border md:col-span-7">
              {rows.map(([k, v]) => (
                <div key={k} className="grid grid-cols-1 gap-1 border-b border-border py-6 sm:grid-cols-[180px_1fr]">
                  <dt className="label-mono pt-1 text-muted-foreground">{k}</dt>
                  <dd className="t-lead">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="self-start rounded-card bg-card p-6 md:col-span-4 md:col-start-9 md:p-8">
              <Label>Заявка</Label>
              <LeadForm source="contacts" withName />
            </div>
          </Grid>
        </Container>
      </Section>
    </>
  );
}
