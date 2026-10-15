import { Header } from "@/components/header";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main id="main" className="flex-1">{children}</main>
    </>
  );
}
