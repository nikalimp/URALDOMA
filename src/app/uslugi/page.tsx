import type { Metadata } from "next";
import { services } from "@/content/services";
import { site } from "@/content/site";
import { Container, Section } from "@/components/container";
import { Crumbs } from "@/components/crumbs";
import { Cta } from "@/components/cta";
import { ServiceCard } from "@/components/service-card";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbs, graph } from "@/lib/schema";

export const metadata: Metadata = {
  title: "TODO(клиент): Услуги и цены",
  description: "TODO(клиент): описание списка услуг с ценами и городом, 120⁠–⁠160 символов.",
  alternates: { canonical: "/uslugi/" },
};

export default function Services() {
  return (
    <>
      <JsonLd
        data={graph(
          { "@type": "ItemList", name: `Услуги ${site.name}`, itemListElement: services.map((s, i) => ({ "@type": "ListItem", position: i + 1, name: s.title, url: `${site.url}/uslugi/${s.slug}/` })) },
          breadcrumbs([{ name: "Главная", path: "/" }, { name: "Услуги", path: "/uslugi/" }]),
        )}
      />
      <Section className="pt-12">
        <Container>
          <Crumbs items={[{ name: "Главная", path: "/" }, { name: "Услуги" }]} />
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Услуги и цены</h1>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => <ServiceCard key={s.slug} s={s} />)}
          </div>
        </Container>
      </Section>
      <Cta />
    </>
  );
}
