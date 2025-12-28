"use client";

import Link from "next/link";
import {
  Facebook,
  Instagram,
  Youtube,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Truck,
  CreditCard,
} from "lucide-react";

export default function Footer() {
  return (
    <footer
      className="relative text-gray-100 pt-12 pb-6 border-t border-gray-800 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/banner/bannr-03.png')" }}
    >
      <div className="absolute inset-0 bg-[#0f172a]/75"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {/* Brand Column */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white uppercase tracking-wider">
              PC STORE <span className="text-red-600">VN</span>
            </h2>
            <p className="text-sm text-gray-200 leading-relaxed max-w-xs">
              Chuyên cung cấp PC Gaming, Laptop, Linh kiện máy tính chính hãng
              với giá tốt nhất thị trường.
              <br />
              Uy tín - Chất lượng - Tận tâm.
            </p>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white mb-2">
              Thông tin liên hệ
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="shrink-0 text-red-500 mt-0.5" size={18} />
                <span className="text-sm">
                  123 Đường Công Nghệ, Quận 1, TP. Hồ Chí Minh
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="shrink-0 text-red-500" size={18} />
                <span className="text-sm font-bold text-white">1900 1234</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="shrink-0 text-red-500" size={18} />
                <span className="text-sm">support@pcstore.vn</span>
              </li>
            </ul>
          </div>

          {/* Quick Policies/Certifications */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white mb-4">
              Kết nối với chúng tôi
            </h3>
            <div className="flex gap-4">
              <Link
                href="#"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all"
              >
                <Facebook size={20} />
              </Link>
              <Link
                href="#"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-pink-600 hover:text-white transition-all"
              >
                <Instagram size={20} />
              </Link>
              <Link
                href="#"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all"
              >
                <Youtube size={20} />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-300">
          <p>
            © 2025 pc.{" "}
            <a
              href="https://wfourtech.vn"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Design By W-FOUR TECH
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
