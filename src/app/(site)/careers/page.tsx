import { careers as C } from "@/content/pages";
import { site } from "@/content/site";
import { Container, Grid, Section, Label, H2 } from "@/components/container";
import { PageHead } from "@/components/page-head";
import { LeadForm } from "@/components/lead-form";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbs, graph, orgId } from "@/lib/schema";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta({ title: C.metaTitle, description: C.metaDescription, path: "/careers/" });

// Дата публикации вакансий для JobPosting: менять при обновлении списка
const datePosted = "2026-10-15";

export default function Careers() {
  const jobs = C.jobs.map((j) => ({
    "@type": "JobPosting",
    title: j.title,
    description: [j.text, "Обязанности: " + j.duties.join("; "), "Требования: " + j.reqs.join("; ")].join(" "),
    datePosted,
    employmentType: "FULL_TIME",
    hiringOrganization: { "@id": orgId },
    jobLocation: { "@type": "Place", address: { "@type": "PostalAddress", addressLocality: "Екатеринбург", addressRegion: "Свердловская область", addressCountry: "RU" } },
  }));
  return (
    <>
      <JsonLd data={graph(...jobs, breadcrumbs([{ name: "Главная", path: "/" }, { name: "Вакансии", path: "/careers/" }]))} />
      <PageHead crumbs={[{ name: "Главная", path: "/" }, { name: "Вакансии" }]} h1={C.h1} answer={C.answer} photo="obraztsovo/06" />
      <Section className="pt-0 md:pt-0">
        <Container>
          {C.jobs.map((j, i) => (
            <article key={j.title} className="grid grid-cols-1 gap-x-5 gap-y-6 border-t border-border py-10 md:grid-cols-12">
              <div className="md:col-span-3">
                <span className="caps text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                <h2 className="t-lead mt-4">{j.title}</h2>
                <p className="text-small mt-4 text-earth">{j.text}</p>
              </div>
              <div className="md:col-span-3 md:col-start-4">
                <h3 className="label-mono mb-3 text-muted-foreground">Обязанности</h3>
                <ul className="text-small space-y-2">{j.duties.map((d) => <li key={d} className="border-t border-border pt-2">{d}</li>)}</ul>
              </div>
              <div className="md:col-span-3 md:col-start-7">
                <h3 className="label-mono mb-3 text-muted-foreground">Требования</h3>
                <ul className="text-small space-y-2">{j.reqs.map((d) => <li key={d} className="border-t border-border pt-2">{d}</li>)}</ul>
              </div>
            </article>
          ))}
        </Container>
      </Section>
      <Section id="lead" className="bg-secondary">
        <Container>
          <Grid>
            <div className="md:col-span-6">
              <Label>Отклик</Label>
              <H2>Давайте <em>знакомиться</em></H2>
              <p className="text-body mt-6 max-w-[48ch] text-earth">Оставьте имя и телефон — перезвоним и договоримся о встрече. Портфолио и резюме можно прислать на <a href={`mailto:${site.contacts.email}`} className="underline underline-offset-4">{site.contacts.email}</a>.</p>
            </div>
            <div className="rounded-card bg-background p-6 md:col-span-6 md:col-start-7 md:p-8"><LeadForm source="careers" withName button="Отправить отклик" /></div>
          </Grid>
        </Container>
      </Section>
    </>
  );
}
