"use client";

import { Menu, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import MegaMenu from "./MegaMenu";
import SearchBox from "./SearchBox";
import AuthButtons from "./AuthButtons";
import MobileMenu from "./MobileMenu";
import { useCart } from "@/features/client/cart/context/CartContext";

interface HeaderProps {
  isMobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
}

const Header = ({ isMobileMenuOpen, onToggleMobileMenu }: HeaderProps) => {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const { totalItems, totalPrice } = useCart();

  return (
    <div className="bg-white lg:bg-[#103E8F] text-gray-800 lg:text-white py-2 lg:py-4 shadow-sm lg:shadow-lg z-40 sticky top-0 transition-colors duration-300">
      <div className="container mx-auto px-4 flex items-center justify-between gap-2 lg:gap-4 relative">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="bg-[#103E8F] lg:bg-white text-white lg:text-[#103E8F] w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full shadow-md group-hover:scale-105 transition-transform duration-300">
            <span className="font-extrabold text-lg md:text-xl">W</span>
          </div>
          <span className="text-lg md:text-2xl font-bold tracking-tight hidden sm:block lg:text-white text-[#103E8F]">
            ComputerWorld
          </span>
        </Link>

        {/* Desktop Category Button (Hidden on Mobile/Tablet) */}
        <div
          className="hidden lg:flex items-center h-10 group"
          onMouseEnter={() => setIsCategoryOpen(true)}
          onMouseLeave={() => setIsCategoryOpen(false)}
        >
          <div className="relative flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-md cursor-pointer transition-colors h-full">
            <Menu size={20} />
            <span className="font-semibold text-sm">DANH MỤC SẢN PHẨM</span>
            <span className="absolute bottom-0 left-0 w-full h-[3px] bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
          </div>
          {isCategoryOpen && <MegaMenu />}
        </div>

        {/* Search Box Component */}
        <SearchBox />

        {/* User Actions */}
        <div className="flex items-center gap-2 md:gap-4 lg:gap-6 shrink-0">
          {/* Auth Buttons Component */}
          <AuthButtons />

          <div className="h-8 w-px bg-white/20 hidden lg:block"></div>

          {/* Cart */}
          <Link href="/cart">
            <div className="flex items-center gap-1 lg:gap-3 cursor-pointer lg:hover:bg-white/10 px-1 lg:px-2 py-1.5 rounded-md transition-colors duration-200 relative group">
              <div className="relative">
                <ShoppingCart
                  className="w-6 h-6 lg:w-[26px] lg:h-[26px] text-gray-700 lg:text-white"
                  strokeWidth={1.5}
                />
                <span className="absolute -top-1.5 -right-1.5 bg-[#FF0000] lg:bg-[#FFB800] text-white lg:text-[#103E8F] text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold shadow-sm group-hover:scale-110 transition-transform">
                  {totalItems}
                </span>
              </div>
              <div className="hidden lg:flex flex-col leading-tight">
                <span className="text-[11px] opacity-80">Giỏ hàng</span>
                <span className="text-[13px] font-semibold">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(totalPrice)}
                </span>
              </div>
            </div>
          </Link>

          {/* Mobile/Tablet Menu Toggle (New Design) */}
          <button
            type="button"
            onClick={onToggleMobileMenu}
            className="lg:hidden flex flex-col items-center gap-0.5 text-gray-700 p-1"
          >
            {isMobileMenuOpen ? (
              <Menu className="w-6 h-6 md:w-7 md:h-7 text-red-600" />
            ) : (
              <Menu className="w-6 h-6 md:w-7 md:h-7" />
            )}
            <span className="text-[9px] font-bold">MENU</span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown (Absolute to Header) */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={onToggleMobileMenu} />
    </div>
  );
};

export default Header;
