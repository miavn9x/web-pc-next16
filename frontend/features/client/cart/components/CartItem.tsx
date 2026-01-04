"use client";

import { Trash2, Minus, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { getProductImageUrl } from "@/shared/utlis/image.utils";

interface CartItemProps {
  item: {
    id: number | string;
    name: string;
    code: string;
    price: number;
    originalPrice?: number;
    image: string;
    quantity: number;
    selected: boolean;
  };
  onUpdateQuantity: (id: number | string, newQuantity: number) => void;
  onRemove: (id: number | string) => void;
  onToggle: (id: number | string) => void;
}

export default function CartItem({
  item,
  onUpdateQuantity,
  onRemove,
  onToggle,
}: CartItemProps) {
  const handleDecrease = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.id, item.quantity - 1);
    }
  };

  const handleIncrease = () => {
    onUpdateQuantity(item.id, item.quantity + 1);
  };

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-4 p-4 bg-white rounded-lg shadow-sm border border-gray-100 mb-4 transition-all hover:shadow-md">
      {/* Checkbox & Image */}
      <div className="flex items-center gap-3 w-full md:w-auto">
        <input
          type="checkbox"
          checked={item.selected}
          onChange={() => onToggle(item.id)}
          className="w-5 h-5 accent-red-600 rounded cursor-pointer"
        />
        <div className="relative w-20 h-20 md:w-24 md:h-24 shrink-0 border border-gray-200 rounded-md overflow-hidden bg-white">
          <Image
            src={getProductImageUrl(item.image)}
            alt={item.name}
            fill
            className="object-contain p-1"
          />
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 w-full">
        <div className="flex flex-col md:flex-row md:justify-between gap-y-2">
          <div className="flex-1 pr-4">
            <Link
              href={`/product/${item.id}`}
              className="text-sm md:text-base font-bold text-gray-800 hover:text-blue-700 line-clamp-2 mb-1"
            >
              {item.name}
            </Link>
            <p className="text-xs text-gray-500 font-medium">Mã: {item.code}</p>

            {/* Mobile Actions */}
            <div className="flex md:hidden mt-3 items-center justify-between">
              <div className="flex items-center border border-gray-300 rounded overflow-hidden">
                <button
                  onClick={handleDecrease}
                  className="w-8 h-8 flex items-center justify-center bg-gray-50 active:bg-gray-200 transition-colors"
                >
                  <Minus size={14} />
                </button>
                <input
                  type="text"
                  value={item.quantity}
                  readOnly
                  className="w-10 h-8 text-center border-l border-r border-gray-300 text-sm font-semibold text-gray-700"
                />
                <button
                  onClick={handleIncrease}
                  className="w-8 h-8 flex items-center justify-center bg-gray-50 active:bg-gray-200 transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Price & Desktop Actions */}
          <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto mt-2 md:mt-0 gap-4 md:gap-1">
            <div className="text-right">
              <p className="text-red-600 font-bold text-base md:text-lg">
                {item.price.toLocaleString("vi-VN")}₫
              </p>
              {item.originalPrice && (
                <p className="text-gray-400 text-xs md:text-sm line-through">
                  {item.originalPrice.toLocaleString("vi-VN")}₫
                </p>
              )}
            </div>

            <div className="hidden md:flex items-center gap-6 mt-2">
              <div className="flex items-center border border-gray-300 rounded overflow-hidden">
                <button
                  onClick={handleDecrease}
                  className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 transition-colors"
                >
                  <Minus size={12} />
                </button>
                <div className="w-10 h-7 flex items-center justify-center text-sm font-semibold border-x border-gray-300">
                  {item.quantity}
                </div>
                <button
                  onClick={handleIncrease}
                  className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 transition-colors"
                >
                  <Plus size={12} />
                </button>
              </div>

              <button
                onClick={() => onRemove(item.id)}
                className="text-gray-400 hover:text-red-500 transition-colors p-1"
                title="Xóa sản phẩm"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Remove & Save for later */}
        <div className="flex md:hidden items-center justify-between mt-3 text-xs font-medium text-blue-600">
          <button className="hover:underline flex items-center gap-1">
            <span>+ Mua sau</span>
          </button>
          <button
            onClick={() => onRemove(item.id)}
            className="text-red-500 hover:underline flex items-center gap-1"
          >
            <Trash2 size={14} /> Xóa
          </button>
        </div>
      </div>
    </div>
  );
}
