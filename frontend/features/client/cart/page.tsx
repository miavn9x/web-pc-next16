"use client";

import { ChevronRight, Trash2 } from "lucide-react";
import Link from "next/link";
import CartItem from "./components/CartItem";
import CartSummary from "./components/CartSummary";
import EmptyCart from "./components/EmptyCart";
import { useCart } from "./context/CartContext";

export default function CartPage() {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    totalPrice,
    removeSelected,
    toggleSelection,
    toggleAll,
  } = useCart();

  const allSelected =
    cartItems.length > 0 && cartItems.every((item) => item.selected);

  if (cartItems.length === 0) {
    return (
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center text-sm text-gray-500 mb-6 font-medium">
            <Link href="/" className="hover:text-[#E31837] transition-colors">
              Trang chủ
            </Link>
            <ChevronRight size={14} className="mx-2" />
            <span className="text-gray-800">Giỏ hàng của bạn</span>
          </div>
          <EmptyCart />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-4">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 mb-6 font-medium">
          <Link href="/" className="hover:text-[#E31837] transition-colors">
            Trang chủ
          </Link>
          <ChevronRight size={14} className="mx-2" />
          <span className="text-gray-800">Giỏ hàng của bạn</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column: Cart Items */}
          <div className="w-full lg:w-2/3">
            {/* Header Bar */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between mb-4 sticky top-[72px] z-10 lg:static">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={(e) => toggleAll(e.target.checked)}
                  className="w-5 h-5 accent-red-600 rounded cursor-pointer"
                />
                <span className="font-bold text-gray-800">
                  Tất cả ({cartItems.length} sản phẩm)
                </span>
              </div>
              <div className="hidden md:flex text-gray-500 text-sm font-medium gap-14 mr-12">
                <span>Đơn giá</span>
                <span>Số lượng</span>
                <span>Thành tiền</span>
              </div>
              <button
                onClick={removeSelected}
                className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-full transition-colors"
                title="Xóa các sản phẩm đã chọn"
              >
                <Trash2 size={18} />
              </button>
            </div>

            {/* List */}
            <div>
              {cartItems.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeFromCart}
                  onToggle={toggleSelection}
                />
              ))}
            </div>
          </div>

          {/* Right Column: Summary */}
          <div className="w-full lg:w-1/3">
            <CartSummary subtotal={totalPrice} total={totalPrice} />
          </div>
        </div>
      </div>
    </div>
  );
}
