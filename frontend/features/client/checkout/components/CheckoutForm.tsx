"use client";

import {
  MapPin,
  Phone,
  User,
  Mail,
  FileText,
  Truck,
  Store,
  CreditCard,
} from "lucide-react";
import { useState } from "react";

export default function CheckoutForm() {
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "store">("cod");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Mock validation (logic would be in the submit handler)
  const validate = (field: string, value: string) => {
    if (!value) return "Thông tin này là bắt buộc";
    if (field === "email" && !/^\S+@\S+\.\S+$/.test(value))
      return "Email không hợp lệ";
    if (field === "phone" && !/^[0-9]{10}$/.test(value))
      return "Số điện thoại không hợp lệ";
    return "";
  };

  return (
    <div className="space-y-6">
      {/* DELIVERY INFO */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2 border-b pb-4">
          <MapPin className="text-[#E31837]" size={20} />
          Thông tin giao hàng
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">
              Họ và tên <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <User size={18} />
              </div>
              <input
                type="text"
                placeholder="Nhập họ tên của bạn"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E31837]/20 focus:border-[#E31837] transition-all text-sm"
              />
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">
              Số điện thoại <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Phone size={18} />
              </div>
              <input
                type="tel"
                placeholder="Nhập số điện thoại"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E31837]/20 focus:border-[#E31837] transition-all text-sm"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-sm font-semibold text-gray-700">Email</label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Mail size={18} />
              </div>
              <input
                type="email"
                placeholder="Nhập email để nhận thông tin đơn hàng"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E31837]/20 focus:border-[#E31837] transition-all text-sm"
              />
            </div>
          </div>

          {/* Address */}
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-sm font-semibold text-gray-700">
              Địa chỉ nhận hàng <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute left-3 top-3 text-gray-400">
                <MapPin size={18} />
              </div>
              <textarea
                rows={3}
                placeholder="Nhập địa chỉ chi tiết (Số nhà, đường, phường/xã...)"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E31837]/20 focus:border-[#E31837] transition-all text-sm resize-none"
              />
            </div>
          </div>

          {/* Note */}
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-sm font-semibold text-gray-700">
              Ghi chú đơn hàng
            </label>
            <div className="relative">
              <div className="absolute left-3 top-3 text-gray-400">
                <FileText size={18} />
              </div>
              <textarea
                rows={2}
                placeholder="Ghi chú thêm (ví dụ: Giao hàng giờ hành chính...)"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E31837]/20 focus:border-[#E31837] transition-all text-sm resize-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* PAYMENT METHOD */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2 border-b pb-4">
          <CreditCard className="text-[#E31837]" size={20} />
          Hình thức thanh toán
        </h3>

        <div className="space-y-3">
          {/* COD */}
          <label
            className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-all ${
              paymentMethod === "cod"
                ? "border-[#E31837] bg-red-50 ring-1 ring-[#E31837]"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <input
              type="radio"
              name="payment"
              value="cod"
              checked={paymentMethod === "cod"}
              onChange={() => setPaymentMethod("cod")}
              className="w-5 h-5 accent-[#E31837]"
            />
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <Truck size={20} />
            </div>
            <div>
              <p className="font-bold text-gray-800">
                Thanh toán khi nhận hàng (COD)
              </p>
              <p className="text-xs text-gray-500">
                Bạn chỉ phải thanh toán khi đã nhận được hàng
              </p>
            </div>
          </label>

          {/* Store Pickup */}
          <label
            className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-all ${
              paymentMethod === "store"
                ? "border-[#E31837] bg-red-50 ring-1 ring-[#E31837]"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <input
              type="radio"
              name="payment"
              value="store"
              checked={paymentMethod === "store"}
              onChange={() => setPaymentMethod("store")}
              className="w-5 h-5 accent-[#E31837]"
            />
            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
              <Store size={20} />
            </div>
            <div>
              <p className="font-bold text-gray-800">
                Đến nhận hàng tại cửa hàng
              </p>
              <p className="text-xs text-gray-500">
                Nhận hàng trực tiếp tại showroom gần nhất
              </p>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}
