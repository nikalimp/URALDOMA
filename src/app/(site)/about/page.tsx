import Link from "next/link";
import { about, home, team } from "@/content/home";
import { site } from "@/content/site";
import { Container, Grid, Section, SectionHead, Label, H2, linkArrow } from "@/components/container";
import { PageHead } from "@/components/page-head";
import { CtaSection } from "@/components/cta";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbs, graph, orgId, personId } from "@/lib/schema";
import { pageMeta } from "@/lib/meta";
import { Ticker } from "@/components/motion";
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
            <div key={f.label} className="border-t border-foreground pt-4 pb-10">
              <dt className="sr-only">{f.label}</dt>
              <dd className="text-[56px] leading-none tracking-[-0.05em] md:text-[clamp(72px,7vw,120px)]">{/^(19|20)\d\d$/.test(f.value) ? f.value : <Ticker value={f.value} />}</dd>
              <dd className="mt-3 text-[15px] text-muted-foreground">{f.label}</dd>
            </div>
          ))}
        </dl>
      </Container>

      <Section>
        <Container>
          <Grid className="items-end">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/team/nikolay.webp" alt={`${site.person.name}, директор URALDOMA`} width={600} height={900} loading="lazy" decoding="async" className="aspect-[4/5] w-full object-cover grayscale md:col-span-4" />
            <div className="md:col-span-7 md:col-start-6">
              <Label n="01">Директор</Label>
              <blockquote className="font-serif text-[32px] leading-[1.12] tracking-[-0.02em] text-balance italic md:text-[clamp(40px,3.6vw,64px)]">«{about.quote}»</blockquote>
              <p className="mt-8 border-t border-foreground pt-6 text-[18px] font-medium">{site.person.name}</p>
              <p className="text-[15px] text-muted-foreground">директор URALDOMA</p>
            </div>
          </Grid>
        </Container>
      </Section>

      <Section className="bg-secondary">
        <Container>
          <SectionHead n="02" label="Принципы" title={<>Как мы <em>работаем</em></>} />
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2 md:grid-cols-4">
            {about.principles.map((p, i) => (
              <div key={p.title} className="reveal border-t border-foreground pt-5 pb-10">
                <span className="font-serif text-[40px] leading-none text-brand italic">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-5 text-[24px] tracking-[-0.015em]">{p.title}</h3>
                <p className="mt-3 text-[15px] text-earth">{p.text}</p>
              </div>
            ))}
          </div>
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
                <p className="mt-3 border-t border-border pt-3 text-[18px] font-medium">{t.name}</p>
                <p className="text-[14px] text-muted-foreground">{t.role}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section className="border-t border-border">
        <Container>
          <Grid>
            <div className="md:col-span-5">
              <Label n="04">Производство</Label>
              <H2>Своя мебель — <em>«Мебель-Урал»</em></H2>
            </div>
            <div className="md:col-span-6 md:col-start-7">
              <Photo p={pic("trinity-14/01")} ratio="aspect-[4/3]" sizes="(min-width: 768px) 50vw, 100vw" className="mb-8" />
              <p className="text-[18px]">Кухни, шкафы, столешницы и мебель в стиле лофт делаем на собственном производстве. Мебель проектируют те же дизайнеры, что и интерьер, поэтому она встаёт точно по размерам после ремонта.</p>
              <Link href="/furniture/" className={`${linkArrow} mt-6`}>О производстве <span aria-hidden="true">→</span></Link>
            </div>
          </Grid>
        </Container>
      </Section>
      <CtaSection source="about" />
    </>
  );
}
