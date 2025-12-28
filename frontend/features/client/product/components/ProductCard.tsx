"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/features/client/cart/context/CartContext";

interface ProductCardProps {
  productCode: string; // Unique identifier
  name: string;
  image: string;
  price: number;
  slug: string; // Add slug for routing
  originalPrice?: number; // Optional
  discount?: number; // Optional
  isNew?: boolean; // Label "MỚI"
  isHot?: boolean; // Label "HOT"
}

export default function ProductCard({
  productCode,
  name,
  image,
  price,
  originalPrice,
  discount,
  isNew,
  isHot,
  slug,
}: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({
      id: productCode,
      name,
      code: productCode,
      price,
      originalPrice: originalPrice || price,
      image,
    });
  };

  // Calculate discount if not provided but originalPrice exists
  const calculatedDiscount =
    discount ||
    (originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0);

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer group/card h-full flex flex-col relative border border-gray-100">
      <Link
        href={`/product/${slug}`}
        className="absolute inset-0 z-5"
        prefetch={false}
      />

      {/* Badges */}
      <div className="absolute top-0 left-0 z-10 flex flex-col gap-1 pointer-events-none">
        {calculatedDiscount > 0 && (
          <div className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-br-lg skew-x-[-10deg] shadow-sm transform -translate-x-1 -translate-y-1">
            Giảm {calculatedDiscount}%
          </div>
          
        )}
        {/* Decorative localized tag corner */}
        <div className="absolute top-0 left-0 w-2 h-2 bg-red-600 translate-y-[15.5px] -translate-x-[4px] rotate-45 z-10"></div>
      </div>

      {/* Product Image Area */}
      <div className="relative w-full aspect-square overflow-hidden rounded-t-lg group/image p-2">
        <Image
          src={image}
          alt={name}
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
          title={name}
        >
          {name}
        </h3>



        <div className="mt-auto flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-red-600 font-bold text-sm md:text-base">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(price)}
              </span>
            </div>
            {originalPrice && originalPrice > price && (
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-xs line-through">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(originalPrice)}
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
}
