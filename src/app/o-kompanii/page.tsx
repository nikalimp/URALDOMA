import type { Metadata } from "next";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { about } from "@/content/home";
import { Container, Section } from "@/components/container";
import { Crumbs } from "@/components/crumbs";
import { Cta } from "@/components/cta";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbs, graph, orgId } from "@/lib/schema";

export const metadata: Metadata = {
  title: about.metaTitle,
  description: about.metaDescription,
  alternates: { canonical: "/o-kompanii/" },
};

export default function About() {
  return (
    <>
      <JsonLd data={graph({ "@type": "AboutPage", mainEntity: { "@id": orgId } }, breadcrumbs([{ name: "Главная", path: "/" }, { name: "О компании", path: "/o-kompanii/" }]))} />
      <Section className="pt-12">
        <Container className="max-w-3xl">
          <Crumbs items={[{ name: "Главная", path: "/" }, { name: "О компании" }]} />
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{about.h1}</h1>
          <div className="prose-site mt-8">
            <Markdown remarkPlugins={[remarkGfm]}>{about.body}</Markdown>
          </div>
        </Container>
      </Section>
      <Cta />
    </>
  );
}
