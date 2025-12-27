"use client";

import { ShoppingCart } from "lucide-react";
import Link from "next/link";

export default function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="bg-gray-100 p-6 rounded-full mb-6">
        <ShoppingCart size={48} className="text-gray-400" />
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        Giỏ hàng của bạn đang trống
      </h2>
      <p className="text-gray-500 mb-8 max-w-md">
        Có vẻ như bạn chưa thêm sản phẩm nào vào giỏ hàng. Hãy tham quan cửa
        hàng và chọn cho mình những món đồ ưng ý nhé!
      </p>
      <Link
        href="/"
        className="px-8 py-3 bg-red-500 text-white font-bold rounded-lg hover:bg-[#c41530] transition-colors shadow-lg hover:shadow-xl uppercase tracking-wide"
      >
        Tiếp tục mua sắm
      </Link>
    </div>
  );
}
