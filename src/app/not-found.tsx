import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Container, btnPrimary, btnOutline } from "@/components/container";

export const metadata: Metadata = { title: "Страница не найдена", robots: { index: false, follow: true } };

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main" className="flex-1">
        <Container className="py-24 md:py-40">
          <p className="label-mono text-brand">Ошибка 404</p>
          <h1 className="t-statement mt-6 max-w-[16ch]">Такой страницы нет</h1>
          <p className="text-body mt-6 max-w-[48ch] text-earth">Возможно, она переехала, когда мы обновляли сайт. Начните с главной или посмотрите услуги и цены.</p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/" className={btnPrimary}>На главную <span aria-hidden="true">→</span></Link>
            <Link href="/services/" className={btnOutline}>Услуги</Link>
            <Link href="/prices/" className={btnOutline}>Цены</Link>
          </div>
        </Container>
      </main>
    </>
  );
}
