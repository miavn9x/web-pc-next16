"use client";

import Link from "next/link";

const NavigationMenu = () => {
  return (
    <div className="bg-white border-b border-gray-200 shadow-sm hidden md:block relative z-20">
      <div className="container mx-auto px-4">
        <ul className="flex items-center justify-center h-10 text-[14px] font-medium text-gray-700">
          {[
            { label: "TRANG CHỦ", href: "/" },
            { label: "SẢN PHẨM", href: "/product" },
            { label: "BUILD PC", href: "/build-pc" }, // Lưu ý: Route này có thể chưa tồn tại
            { label: "LIÊN HỆ", href: "/lien-he" },
          ].map((item) => (
            <li key={item.label} className="h-full relative group">
              <Link
                href={item.href}
                className="h-full flex items-center px-6 cursor-pointer hover:text-[#103E8F] transition-colors"
              >
                <span className="relative z-10">{item.label}</span>
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#103E8F] scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default NavigationMenu;
