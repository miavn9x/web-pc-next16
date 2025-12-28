import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingCart,
  Cpu,
  CircuitBoard,
  MemoryStick,
  HardDrive,
} from "lucide-react";
import { PCConfig } from "../data"; // Imported from updated data types
import { useCart } from "../../cart/context/CartContext";

interface ConfigCardProps {
  config: PCConfig;
}

const ConfigCard: React.FC<ConfigCardProps> = ({ config }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({
      id: config.productCode,
      code: config.productCode,
      name: config.name,
      price: config.price,
      image: config.image,
    });
    alert("Đã thêm vào giỏ hàng!");
  };

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer group/card h-full flex flex-col relative border border-gray-100">
      <Link
        href={`/product/${config.slug}`}
        className="absolute inset-0 z-5"
        prefetch={false}
      />

      {/* Badges */}
      <div className="absolute top-0 left-0 z-10 flex flex-col gap-1 pointer-events-none">
        {config.discount > 0 && (
          <div className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-br-lg skew-x-[-10deg] shadow-sm transform -translate-x-1 -translate-y-1">
            Giảm {config.discount}%
          </div>
        )}
        {config.isHot && (
          <div className="bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-br-lg skew-x-[-10deg] shadow-sm w-fit transform -translate-x-1">
            HOT
          </div>
        )}
        {/* Decorative localized tag corner */}
        <div className="absolute top-0 left-0 w-2 h-2 bg-red-600 translate-y-[15.5px] -translate-x-[4px] rotate-45 z-10"></div>
      </div>

      {/* Product Image Area */}
      <div className="relative w-full aspect-square overflow-hidden rounded-t-lg group/image p-2">
        <Image
          src={config.image}
          alt={config.name}
          fill
          className="object-contain transition-transform duration-500 group-hover/image:scale-105"
        />

        {/* Premium Sheen Effect */}
        <div className="absolute inset-0 -translate-x-full group-hover/card:translate-x-full z-5 transition-transform duration-1000 ease-in-out bg-linear-to-r from-transparent via-white/30 to-transparent skew-x-[-45deg]" />

        {/* VIP Gold Gradient Border Effect */}
        {/* Top-Left Bracket */}
        <div className="absolute top-0 left-0 w-0 h-0 border-t-2 border-l-2 border-solid transition-all duration-500 group-hover/card:w-full group-hover/card:h-full z-2 box-border [border-image:linear-gradient(45deg,#b88746,#fdf5a6,#b88746)_1]" />
        {/* Bottom-Right Bracket */}
        <div className="absolute bottom-0 right-0 w-0 h-0 border-b-2 border-r-2 border-solid transition-all duration-500 group-hover/card:w-full group-hover/card:h-full z-2 box-border [border-image:linear-gradient(45deg,#b88746,#fdf5a6,#b88746)_1]" />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-3 z-2">
        <h3
          className="text-xs md:text-sm font-semibold text-gray-800 line-clamp-2 h-8 md:h-10 mb-2 group-hover/card:text-blue-600 transition-colors"
          title={config.name}
        >
          {config.name}
        </h3>

        {/* Specs Mini-Summary (Specifically for PC Builds) */}
        <div className="mb-3 text-[10px] sm:text-xs text-gray-500 space-y-1 bg-gray-50 p-2 rounded">
          <div className="flex gap-1 items-center truncate">
            <Cpu size={12} className="shrink-0" /> {config.specs.cpu}
          </div>
          <div className="flex gap-1 items-center truncate">
            <CircuitBoard size={12} className="shrink-0" /> {config.specs.vga}
          </div>
          <div className="flex gap-1 items-center truncate">
            <MemoryStick size={12} className="shrink-0" /> {config.specs.ram}
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-red-600 font-bold text-sm md:text-base">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(config.price)}
              </span>
            </div>
            {config.originalPrice && config.originalPrice > config.price && (
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-xs line-through">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(config.originalPrice)}
                </span>
              </div>
            )}
          </div>

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleAddToCart();
            }}
            className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white hover:bg-blue-700 transition-colors shadow-sm group/cart active:scale-95 z-2"
            title="Thêm vào giỏ"
          >
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfigCard;
