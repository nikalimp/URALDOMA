import Link from "next/link";
import { about, home, team } from "@/content/home";
import { site } from "@/content/site";
import { StickyList } from "@/components/sticky-list";
import { FillText } from "@/components/fill-text";
import { Container, Grid, Section, SectionHead, Label, H2, linkArrow } from "@/components/container";
import { PageHead } from "@/components/page-head";
import { CtaSection } from "@/components/cta";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbs, graph, orgId, personId } from "@/lib/schema";
import { pageMeta } from "@/lib/meta";
import { Photo } from "@/components/photo";
import { pic } from "@/content/photos";

export const metadata = pageMeta({ title: about.metaTitle, description: about.metaDescription, path: "/about/" });

export default function About() {
  return (
    <>
      <JsonLd data={graph({ "@type": "AboutPage", name: about.h1, url: `${site.url}/about/`, description: about.answer, about: { "@id": orgId }, mainEntity: { "@id": personId } }, breadcrumbs([{ name: "Главная", path: "/" }, { name: "О компании", path: "/about/" }]))} />
      <PageHead crumbs={[{ name: "Главная", path: "/" }, { name: "О компании" }]} h1={about.h1} answer={about.answer} photo="obraztsovo/11" />

      <Container>
        <dl className="grid grid-cols-2 gap-x-5 md:grid-cols-4">
          {home.facts.map((f) => (
            <div key={f.label} className="border-t border-border pt-4 pb-10">
              <dt className="sr-only">{f.label}</dt>
              <dd className="t-statement">{f.value}</dd>
              <dd className="text-small mt-3 text-muted-foreground">{f.label}</dd>
            </div>
          ))}
        </dl>
      </Container>

      <Section>
        <Container>
          <Grid className="items-end">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/team/nikolay.webp" alt={`${site.person.name}, директор URALDOMA`} width={600} height={900} loading="lazy" decoding="async" className="aspect-[4/5] w-full object-cover grayscale md:col-span-3" />
            <div className="md:col-span-9 md:col-start-4 md:mt-16">
              <Label n="01">Директор</Label>
              <FillText as="blockquote" text={`«${about.quote}»`} className="t-statement font-serif italic" />
              <p className="text-body mt-8 border-t border-border pt-6 font-medium">{site.person.name}</p>
              <p className="text-small text-muted-foreground">директор URALDOMA</p>
            </div>
          </Grid>
        </Container>
      </Section>

      <Section>
        <Container>
          <StickyList label="Принципы" title={<>Как мы <em>работаем</em></>} items={about.principles} />
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHead n="03" label="Команда" title={<>Люди, которые <em>ведут ваш ремонт</em></>} />
          <ul className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4">
            {team.map((t) => (
              <li key={t.photo}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/images/team/${t.photo}.webp`} alt={`${t.name}, ${t.role.toLowerCase()} URALDOMA`} width={600} height={900} loading="lazy" className="aspect-[3/4] w-full bg-secondary object-cover grayscale transition-[filter] duration-500 hover:grayscale-0" />
                <p className="text-body mt-3 border-t border-border pt-3 font-medium">{t.name}</p>
                <p className="text-small text-muted-foreground">{t.role}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section>
        <Container>
          <Grid>
            <p className="caps pt-[0.6em] text-muted-foreground md:col-span-3">Производство</p>
              <H2 className="md:col-span-9 md:col-start-4">Своя мебель — <em>«Мебель-Урал»</em></H2>
            <div className="md:col-span-6 md:col-start-7">
              <Photo p={pic("trinity-14/01")} ratio="aspect-[4/3]" sizes="(min-width: 768px) 50vw, 100vw" className="mb-8" />
              <p className="text-body">Кухни, шкафы, столешницы и мебель в стиле лофт делаем на собственном производстве. Мебель проектируют те же дизайнеры, что и интерьер, поэтому она встаёт точно по размерам после ремонта.</p>
              <Link href="/furniture/" className={`${linkArrow} mt-6`}>О производстве <span aria-hidden="true">→</span></Link>
            </div>
          </Grid>
        </Container>
      </Section>
      <CtaSection source="about" />
    </>
  );
}
