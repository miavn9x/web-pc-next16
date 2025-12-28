import Nav from "@/features/client/home/nav/Nav";
import Footer from "@/features/client/footer/footer";
import BackToTop from "@/shared/backtotop/BackToTop";

import AdsDisplay from "@/features/client/ads/components/AdsDisplay";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AdsDisplay />
      <Nav />
      <main>{children}</main>
      <Footer />
      <BackToTop />
    </>
  );
}
