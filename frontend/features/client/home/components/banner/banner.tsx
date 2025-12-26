"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useState } from "react";

const MAIN_BANNERS = [
  // Kích thước chuẩn thiết kế (Recommend): 1200px x 600px (tỉ lệ 2:1)
  {
    id: 1,
    title: "DIỆN MẠO DEAL",
    subtitle: "THÁNG 12 - SĂN DEAL NGON",
    buttonText: "MUA NGAY",
    image:
      "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=1600",
    color: "from-blue-900 to-purple-900",
  },
  {
    id: 2,
    title: "GAMING GEAR",
    subtitle: "NÂNG TẦM TRẢI NGHIỆM",
    buttonText: "XEM NGAY",
    image:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1600",
    color: "from-red-900 to-black",
  },
];

const SUB_BANNERS = [
  // Kích thước chuẩn thiết kế (Recommend): 400px x 200px (tỉ lệ 2:1)
  {
    id: 1,
    title: "PC GAMING",
    desc: "Cấu hình khủng",
    image:
      "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=500",
    color: "from-indigo-900 to-blue-800",
  },
  {
    id: 2,
    title: "PC HỌC TẬP",
    desc: "Văn Phòng - Cơ Bản",
    image:
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=500",
    color: "from-purple-900 to-pink-800",
  },
  {
    id: 3,
    title: "BUILD PC",
    desc: "Tự Chọn Cấu Hình",
    image:
      "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=500",
    color: "from-slate-800 to-gray-900",
  },
];

export default function Banner() {
  const [currentSlide, setCurrentSlide] = useState(0);

  /* --- Auto Slide Logic --- */
  React.useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 9000); // 5 giây đổi 1 lần

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % MAIN_BANNERS.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + MAIN_BANNERS.length) % MAIN_BANNERS.length
    );
  };

  return (
    <section className="container mx-auto py-2 px-2 md:px-0">
      {/* 
        Mobile/Tablet: Flex-col (Auto height)
        Desktop (lg+): Grid (Fixed 600px height)
      */}
      <div className="flex flex-col lg:grid lg:grid-cols-4 gap-4 lg:h-[600px]">
        {/* Main Banner Slider */}
        <div className="w-full relative group rounded-2xl overflow-hidden shadow-2xl lg:col-span-3 lg:h-full aspect-video md:aspect-2/1 lg:aspect-auto">
          {MAIN_BANNERS.map((banner, index) => (
            <div
              key={banner.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              {/* Image (Original Clear) */}
              <img
                src={banner.image}
                alt={banner.title}
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Text Contrast Overlay (Dark gradient from left) */}
              <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/20 to-transparent" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-12 lg:px-20 text-white font-sans z-10">
                <h3 className="text-base md:text-xl lg:text-2xl font-light tracking-wide mb-1 md:mb-2 opacity-90 uppercase font-outfit">
                  {banner.subtitle}
                </h3>
                <h2 className="text-3xl md:text-5xl lg:text-7xl font-black mb-4 md:mb-6 tracking-tighter drop-shadow-lg font-roboto">
                  {banner.title}
                </h2>
              </div>
            </div>
          ))}

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 p-1 md:p-2 bg-black/30 text-white rounded-full opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/20 backdrop-blur-sm z-20"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 p-1 md:p-2 bg-black/30 text-white rounded-full opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/20 backdrop-blur-sm z-20"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          {/* Indicators */}
          <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {MAIN_BANNERS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`w-8 md:w-12 h-1 md:h-1.5 rounded-full transition-all ${
                  idx === currentSlide
                    ? "bg-yellow-400"
                    : "bg-white/30 hover:bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Sub Banners */}
        {/* Mobile: Grid mix (1 col phone, 3 cols tablet) | Desktop: Flex col */}
        <div className="lg:col-span-1 grid grid-cols-1 md:grid-cols-3 lg:flex lg:flex-col gap-4 lg:h-full">
          {SUB_BANNERS.map((item) => (
            <div
              key={item.id}
              // Mobile: Aspect 2/1 to keep ratio | Desktop: Flex-1 to fill space
              className="relative rounded-2xl overflow-hidden shadow-lg group cursor-pointer hover:-translate-x-1 transition-transform duration-300 w-full aspect-2/1 lg:aspect-auto lg:flex-1"
            >
              {/* Image (Original Clear) */}
              <img
                src={item.image}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />

              {/* Text Contrast Overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent opacity-80" />

              <div className="absolute inset-0 flex flex-col justify-end p-6 text-white z-10">
                <h4 className="text-xl md:text-2xl font-bold mb-1 font-roboto">
                  {item.title}
                </h4>
                <p className="text-sm text-gray-200 font-light">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
