"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import ContactInfo from "./components/ContactInfo";
import ContactForm from "./components/ContactForm";

export default function ContactFeaturePage() {
  return (
    <div className="bg-gray-50 min-h-screen py-4">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 mb-4 font-medium bg-white p-3 rounded-lg shadow-sm w-fit">
          <Link
            href="/"
            className="hover:text-red-500 transition-colors flex items-center gap-1"
          >
            <Home size={16} />
            Trang chủ
          </Link>
          <ChevronRight size={14} className="mx-2" />
          <span className="text-red-500 font-bold">Liên hệ</span>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-12">
          {/* Left: Info (2 cols) */}
          <div className="lg:col-span-2">
            <ContactInfo />
          </div>

          {/* Right: Form (3 cols) */}
          <div className="lg:col-span-3">
            <ContactForm />
          </div>
        </div>

        {/* Full width Map Section */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-red-500 rounded-full inline-block"></span>
            Bản đồ chỉ đường
          </h2>
          <div className="w-full h-[400px] bg-gray-200 rounded-lg overflow-hidden relative">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.6696584237106!2d106.66488007469707!3d10.759920059496675!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f9023a3a85d%3A0x620bd5517f827e73!2zSGMgQ29tcHV0ZXI!5e0!3m2!1svi!2s!4v1714000000000!5m2!1svi!2s"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="grayscale hover:grayscale-0 transition-all duration-500"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}
