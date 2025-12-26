"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";

const PROMOS = [
  {
    id: 1,
    title: "PC GAMING CHIẾN MỌI GAME",
    subtitle: "Hiệu năng cực đỉnh",
    image:
      "https://images.unsplash.com/photo-1624705002806-5d72df19c3ad?auto=format&fit=crop&q=80&w=1200",
    href: "/product",
  },
  {
    id: 2,
    title: "BUILD PC THEO YÊU CẦU",
    subtitle: "Tư vấn cấu hình chuẩn",
    image:
      "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&q=80&w=1200",
    href: "/build-pc",
  },
];

export default function HotDeals() {
  const HeaderContent = (
    <div className="absolute inset-0 flex items-center justify-center z-20">
      <div className="flex items-center gap-3">
        <div className="w-1.5 h-6 bg-yellow-400 rounded-full shadow-[0_0_10px_rgba(250,204,21,0.8)]"></div>
        <h2 className="text-xl md:text-2xl font-black uppercase text-white tracking-wide drop-shadow-md">
          Ưu đãi hot
        </h2>
      </div>
    </div>
  );

  return (
    <section className="py-8">
      <div className="container mx-auto">
        {/* Top Decorative Banner - Mobile */}
        <div className="flex justify-center relative z-10 -mb-[28px] pointer-events-none md:hidden">
          <Image
            src="/banner/bannet-05.2.png"
            alt="Hot Deals Header Mobile"
            width={1200}
            height={100}
            className="w-full max-w-5xl h-auto object-contain drop-shadow-2xl"
          />
          {HeaderContent}
        </div>

        {/* Top Decorative Banner - Tablet */}
        <div className="justify-center relative z-10 -mb-[28px] pointer-events-none hidden md:flex lg:hidden">
          <Image
            src="/banner/bannet-05.1.png"
            alt="Hot Deals Header Tablet"
            width={1200}
            height={100}
            className="w-full max-w-5xl h-auto object-contain drop-shadow-2xl"
          />
          {HeaderContent}
        </div>

        {/* Top Decorative Banner - PC */}
        <div className="justify-center relative z-10 -mb-[36px] pointer-events-none hidden lg:flex">
          <Image
            src="/banner/bannet-05.png"
            alt="Hot Deals Header"
            width={1200}
            height={100}
            className="w-[90%] xl:w-full max-w-5xl h-auto object-contain drop-shadow-2xl"
          />
          {HeaderContent}
        </div>

        <div className="bg-[url('/banner/bannr-03.png')] bg-cover bg-center rounded-2xl p-6 md:p-10 shadow-2xl relative z-0 pt-10 md:pt-14">
          {/* List Items - Grid on Desktop, Flex on Mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {PROMOS.map((item) => (
              <Link
                href={item.href}
                key={item.id}
                className="relative h-48 md:h-64 rounded-xl overflow-hidden group cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 bg-gray-900 border border-white/10"
              >
                {/* Background Image / Overlay */}
                <div className="absolute inset-0 w-full h-full transition-transform duration-700 group-hover:scale-105">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>
                {/* Gradient overlay for text readability */}
                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent md:bg-linear-to-r md:from-black/90 md:via-transparent md:to-transparent"></div>

                {/* Content */}
                <div className="absolute inset-0 p-5 md:p-8 flex flex-col justify-end md:justify-center items-start text-white z-10">
                  <p className="text-xs md:text-sm font-bold uppercase tracking-wider mb-2 text-[#FFB800] animate-in slide-in-from-left-2 duration-300">
                    {item.subtitle}
                  </p>
                  <h3 className="text-xl md:text-3xl font-black uppercase leading-tight max-w-[90%] md:max-w-[70%] group-hover:text-[#FFB800] transition-colors duration-300">
                    {item.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
