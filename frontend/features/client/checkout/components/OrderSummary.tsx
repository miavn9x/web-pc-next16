"use client";

import { useCart } from "@/features/client/cart/context/CartContext";
import { ShoppingBag, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import Image from "next/image";

export default function CheckoutOrderSummary() {
  const { cartItems, totalPrice } = useCart();

  return (
    <div className="space-y-4 sticky top-24">
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-4 border-b pb-2 flex items-center gap-2">
          <ShoppingBag className="text-red-500" size={20} />
          Đơn hàng ({cartItems.length} sản phẩm)
        </h3>

        {/* Mini List */}
        <div className="max-h-[300px] overflow-y-auto pr-1 mb-4 space-y-3 custom-scrollbar">
          {cartItems.map((item) => (
            <div key={item.id} className="flex gap-3">
              <div className="relative w-16 h-16 border rounded bg-gray-50 shrink-0">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-contain p-1"
                />
                <span className="absolute -top-2 -right-2 bg-gray-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border border-white">
                  {item.quantity}
                </span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800 line-clamp-2">
                  {item.name}
                </p>
                <p className="text-red-500 font-bold text-sm mt-1">
                  {item.price.toLocaleString("vi-VN")}₫
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="border-t border-dashed border-gray-200 pt-4 space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Tạm tính</span>
            <span className="font-medium text-gray-900">
              {totalPrice.toLocaleString("vi-VN")}₫
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Phí vận chuyển</span>
            <span className="font-medium text-gray-900">Miễn phí</span>
          </div>
          <div className="flex justify-between items-center text-base pt-2 border-t border-gray-100 mt-2">
            <span className="font-bold text-gray-800">Tổng cộng</span>
            <span className="block font-bold text-xl text-red-500">
              {totalPrice.toLocaleString("vi-VN")}₫
            </span>
          </div>
        </div>

        <button className="w-full mt-6 py-3.5 bg-red-500 text-white font-bold uppercase rounded-md hover:bg-[#c41530] transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2">
          Xác nhận đặt hàng
        </button>

        <div className="mt-4 flex items-start gap-2">
          <input
            type="checkbox"
            id="terms"
            className="mt-1 w-4 h-4 accent-red-500 rounded cursor-pointer"
            defaultChecked
          />
          <label
            htmlFor="terms"
            className="text-xs text-gray-500 cursor-pointer"
          >
            Tôi đồng ý với các{" "}
            <span className="text-red-500 font-semibold hover:underline">
              điều khoản dịch vụ
            </span>{" "}
            và chính sách bảo mật.
          </label>
        </div>
      </div>
    </div>
  );
}
