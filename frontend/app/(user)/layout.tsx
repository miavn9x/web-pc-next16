import Nav from "@/features/client/home/nav/Nav";
import Footer from "@/features/client/footer/footer";
import BackToTop from "@/shared/backtotop/BackToTop";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Nav />
      <main>{children}</main>
      <Footer />
      <BackToTop />
    </>
  );
}
