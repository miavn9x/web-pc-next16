"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/features/client/cart/context/CartContext";

interface ProductCardProps {
  productCode: string;
  name: string;
  image: string;
  price: number;
  originalPrice: number;
  discount: number;
}

export default function FlashSaleProductCard({
  productCode,
  name,
  image,
  price,
  originalPrice,
  discount,
}: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({
      id: productCode, // Using productCode as ID for now
      name,
      code: productCode,
      price,
      originalPrice,
      image,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer group/card h-full flex flex-col relative border border-gray-100">
      {/* Discount Tag */}
      <div className="absolute top-0 left-0 z-40 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-br-lg  skew-x-[-10deg] shadow-sm transform -translate-x-1 -translate-y-1">
        Giảm {discount}%
      </div>

      {/* Decorative localized tag corner */}
      <div className="absolute top-0 left-0 w-2 h-2 bg-red-600 translate-y-[15.5px] -translate-x-[4px] rotate-45 z-39"></div>

      {/* Image */}
      <div className="relative w-full aspect-square overflow-hidden rounded-t-lg group/image">
        <Image
          src={image}
          alt={name}
          fill
          className="object-contain transition-transform duration-500"
        />
        {/* Premium Sheen Effect - Diagonal */}
        <div className="absolute inset-0 -translate-x-full group-hover/card:translate-x-full z-10 transition-transform duration-1000 ease-in-out bg-linear-to-r from-transparent via-white/30 to-transparent skew-x-[-45deg]" />

        {/* Split Square Border Effect (VIP Gold Gradient) */}
        {/* Top-Left Bracket */}
        <div className="absolute top-0 left-0 w-0 h-0 border-t-2 border-l-2 border-solid transition-all duration-500 group-hover/card:w-full group-hover/card:h-full z-20 box-border [border-image:linear-gradient(45deg,#b88746,#fdf5a6,#b88746)_1]" />
        {/* Bottom-Right Bracket */}
        <div className="absolute bottom-0 right-0 w-0 h-0 border-b-2 border-r-2 border-solid transition-all duration-500 group-hover/card:w-full group-hover/card:h-full z-20 box-border [border-image:linear-gradient(45deg,#b88746,#fdf5a6,#b88746)_1]" />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-3">
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
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-xs line-through">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(originalPrice)}
              </span>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault(); // Prevent navigating if wrapped in Link
              e.stopPropagation();
              handleAddToCart();
            }}
            className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white hover:bg-blue-700 transition-colors shadow-sm group/cart active:scale-95"
            title="Thêm vào giỏ"
          >
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
