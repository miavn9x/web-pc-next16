"use client";

import { Ticket } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface CartSummaryProps {
  subtotal: number;
  total: number;
}

export default function CartSummary({ subtotal, total }: CartSummaryProps) {
  return (
    <div className="space-y-4">
      {/* Order Summary Section */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 sticky top-24">
        <h3 className="font-bold text-gray-800 mb-4 border-b pb-2">
          Thông tin đơn hàng
        </h3>

        <div className="space-y-3 mb-6">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Tổng tiền sản phẩm</span>
            <span className="font-bold text-gray-900">
              {subtotal.toLocaleString("vi-VN")}₫
            </span>
          </div>

          <div className="flex justify-between items-center text-sm border-t border-dashed border-gray-200 pt-3">
            <span className="font-bold text-gray-800">Cần thanh toán</span>
            <div className="text-right">
              <span className="block font-bold text-xl text-red-500">
                {total.toLocaleString("vi-VN")}₫
              </span>
              <span className="text-xs text-gray-500">(Đã bao gồm VAT)</span>
            </div>
          </div>
        </div>

        {total > 0 ? (
          <Link href="/checkout" className="w-full mb-3 block">
            <button className="w-full py-3.5 bg-red-500 text-white font-bold uppercase rounded-md hover:bg-[#c41530] transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group">
              <span>Tiến hành đặt hàng</span>
            </button>
          </Link>
        ) : (
          <button
            disabled
            className="w-full mb-3 py-3.5 bg-gray-300 text-gray-500 font-bold uppercase rounded-md cursor-not-allowed flex items-center justify-center gap-2"
          >
            <span>Tiến hành đặt hàng</span>
          </button>
        )}
      </div>
    </div>
  );
}
