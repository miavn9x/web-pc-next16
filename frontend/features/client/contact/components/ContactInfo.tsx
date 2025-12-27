"use client";

import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Facebook,
  Instagram,
  Youtube,
} from "lucide-react";

export default function ContactInfo() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-full">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 uppercase border-b-2 border-red-500 inline-block pb-1">
        Thông tin liên hệ
      </h2>

      <div className="space-y-6">
        {/* Address */}
        <div className="flex items-start gap-4">
          <div className="p-3 bg-red-50 text-red-500 rounded-full shrink-0">
            <MapPin size={24} />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-lg mb-1">Địa chỉ</h3>
            <a
              href="https://www.google.com/maps/search/?api=1&query=123+Đường+Nguyễn+Văn+Linh,+Quận+7,+TP.+Hồ+Chí+Minh"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-red-500 transition-colors block"
            >
              123 Đường Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh
            </a>
          </div>
        </div>

        {/* Phone */}
        <div className="flex items-start gap-4">
          <div className="p-3 bg-red-50 text-red-500 rounded-full shrink-0">
            <Phone size={24} />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-lg mb-1">Hotline</h3>
            <a
              href="tel:19001234"
              className="font-bold text-lg text-red-500 hover:text-red-600 transition-colors block"
            >
              1900 1234
            </a>
            <p className="text-sm text-gray-500">(8:00 - 21:00 hàng ngày)</p>
          </div>
        </div>

        {/* Email */}
        <div className="flex items-start gap-4">
          <div className="p-3 bg-red-50 text-red-500 rounded-full shrink-0">
            <Mail size={24} />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-lg mb-1">Email</h3>
            <div className="flex flex-col">
              <a
                href="mailto:hotro@pcstore.vn"
                className="text-gray-600 hover:text-red-500 transition-colors"
              >
                hotro@pcstore.vn
              </a>
              <a
                href="mailto:sales@pcstore.vn"
                className="text-gray-600 hover:text-red-500 transition-colors"
              >
                sales@pcstore.vn
              </a>
            </div>
          </div>
        </div>

        {/* Socials */}
        <div className="pt-6 border-t border-gray-100 flex flex-col items-center">
          <h3 className="font-bold text-gray-800 mb-4">
            Kết nối với chúng tôi
          </h3>
          <div className="flex gap-6 justify-center">
            <a
              href="#"
              className="w-10 h-10 bg-[#1877F2] text-white rounded-full flex items-center justify-center hover:opacity-90 transition-opacity"
            >
              <Facebook size={20} />
            </a>
            <a
              href="#"
              className="w-10 h-10 bg-linear-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white rounded-full flex items-center justify-center hover:opacity-90 transition-opacity"
            >
              <Instagram size={20} />
            </a>
            <a
              href="#"
              className="w-10 h-10 bg-[#FF0000] text-white rounded-full flex items-center justify-center hover:opacity-90 transition-opacity"
            >
              <Youtube size={20} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
