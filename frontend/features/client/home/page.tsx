import Banner from "./components/banner/banner";
import HotDeals from "./components/HotDeals";

export default function Home() {
  return (
    <main className="bg-gray-50 min-h-screen pb-10">
      <Banner />
      <HotDeals />
    </main>
  );
}
