import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex-1 p-4 container mx-auto">{children}</main>
      <Footer />
    </>
  );
}
