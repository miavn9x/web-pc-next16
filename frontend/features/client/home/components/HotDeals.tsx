"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import Image from "next/image";

const PROMOS = [
  {
    id: 1,
    title: "PC GAMING GIÁ HỦY DIỆT",
    subtitle: "Giảm tới 5 triệu",
    buttonText: "Săn Ngay",
    bg: "bg-gradient-to-r from-blue-900 to-blue-600",
    image:
      "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: 2,
    title: "MÀN HÌNH ĐỒ HỌA",
    subtitle: "Deal hời giá sốc",
    buttonText: "Mua Ngay",
    bg: "bg-gradient-to-r from-purple-900 to-indigo-800",
    image:
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: 3,
    title: "GEAR XỊN GIÁ MỊN",
    subtitle: "Phụ kiện giảm 50%",
    buttonText: "Chi Tiết",
    bg: "bg-gradient-to-r from-gray-900 to-gray-700",
    image:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: 4,
    title: "LAPTOP GAMING",
    subtitle: "Quà tặng 2 triệu",
    buttonText: "Xem Ngay",
    bg: "bg-gradient-to-r from-red-900 to-red-600",
    image:
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=600",
  },
];

export default function HotDeals() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 400; // Adjust based on card width + gap
      const newScrollLeft =
        direction === "left"
          ? scrollRef.current.scrollLeft - scrollAmount
          : scrollRef.current.scrollLeft + scrollAmount;

      scrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold uppercase text-gray-800">
            Ưu đãi hot
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => scroll("left")}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Scrollable list */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {PROMOS.map((item) => (
            <div
              key={item.id}
              className={`min-w-[300px] md:min-w-[400px] lg:min-w-[32%] h-48 md:h-56 rounded-2xl relative overflow-hidden shrink-0 snap-start group cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 ${item.bg}`}
            >
              {/* Background Image / Overlay */}
              <div className="absolute right-0 top-0 h-full w-2/3 opacity-50 mix-blend-overlay">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>

              {/* Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-center items-start text-white z-10">
                <p className="text-xs md:text-sm font-medium uppercase tracking-wider mb-2 opacity-90 text-yellow-400">
                  {item.subtitle}
                </p>
                <h3 className="text-xl md:text-2xl font-black uppercase mb-4 leading-tight w-2/3">
                  {item.title}
                </h3>
                <button className="px-5 py-2 bg-white text-gray-900 text-xs md:text-sm font-bold rounded-full hover:scale-105 transition-transform shadow-lg group-hover:bg-yellow-400 group-hover:text-black">
                  {item.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
