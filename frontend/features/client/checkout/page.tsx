"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import CheckoutForm from "./components/CheckoutForm";
import CheckoutOrderSummary from "./components/OrderSummary";
import { useCart } from "../cart/context/CartContext";
import EmptyCart from "../cart/components/EmptyCart";
import CheckoutSteps from "./components/CheckoutSteps";

export default function CheckoutPage() {
  const { cartItems } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center text-sm text-gray-500 mb-6 font-medium">
            <Link href="/" className="hover:text-red-500 transition-colors">
              Trang chủ
            </Link>
            <ChevronRight size={14} className="mx-2" />
            <span className="text-gray-800">Thanh toán</span>
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
        <div className="flex items-center text-sm text-gray-500 mb-6 font-medium bg-white p-3 rounded-lg shadow-sm w-fit">
          <Link
            href="/"
            className="hover:text-red-500 transition-colors flex items-center gap-1"
          >
            <Home size={16} />
            Trang chủ
          </Link>
          <ChevronRight size={14} className="mx-2" />
          <Link href="/cart" className="hover:text-red-500 transition-colors">
            Giỏ hàng
          </Link>
          <ChevronRight size={14} className="mx-2" />
          <span className="text-red-500 font-bold">Thanh toán</span>
        </div>

        {/* Steps */}
        <CheckoutSteps currentStep={2} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
          <div className="lg:col-span-2">
            <CheckoutForm />
          </div>
          <div className="lg:col-span-1">
            <CheckoutOrderSummary />
          </div>
        </div>
      </div>
    </div>
  );
}
