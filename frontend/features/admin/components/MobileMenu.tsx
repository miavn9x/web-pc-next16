"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import MenuItems from "./MenuItems";
import { useSidebar } from "../contexts/SidebarContext";

const MobileMenu = () => {
  const { isMobileMenuOpen, toggleMobileMenu, isMobile } = useSidebar();
  const pathname = usePathname();

  // Close mobile menu when route changes
  useEffect(() => {
    if (isMobileMenuOpen) {
      toggleMobileMenu();
    }
  }, [pathname]);

  if (!isMobile) return null;

  return (
    <>
      {isMobileMenuOpen && (
        <div
          id="mobile-menu-backdrop"
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={toggleMobileMenu}
        />
      )}

      <div
        className={`fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-white shadow-xl z-9999 transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <Image
            src="/img/logow.jpeg"
            alt="W FOUR TECH"
            width={180}
            height={32}
            className="h-auto"
          />
          <button
            id="mobile-menu-close-btn"
            onClick={toggleMobileMenu}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="h-full overflow-y-auto pb-20 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <MenuItems isSidebarOpen={true} idPrefix="mobile-" />
        </div>
      </div>
    </>
  );
};

export default MobileMenu;
