"use client";

import axiosInstance from "@/shared/lib/axios";
import { Bell, ChevronDown, Menu, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useSidebar } from "../contexts/SidebarContext";
import { useNotification } from "../contexts/NotificationContext";

import { useCurrentUser } from "@/features/auth/shared/hooks/useCurrentUser";

const AdminHeader = () => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const { pendingOrdersCount } = useNotification();
  const { isSidebarOpen, isMobileMenuOpen, toggleMobileMenu, isMobile } =
    useSidebar();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user } = useCurrentUser();

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowUserDropdown(false);
      }
    };

    if (showUserDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showUserDropdown]);

  const handleLogout = async () => {
    setShowUserDropdown(false);
    try {
      await axiosInstance.post("/auth/logout");
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = "/";
    } catch {
      // Even if API fails, clear local data and redirect to login
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = "/";
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-20 shadow-sm">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 h-16">
        {isMobile && (
          <button
            id="mobile-menu-trigger"
            onClick={toggleMobileMenu}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        )}

        <div className="flex items-center relative z-10">
          {(isSidebarOpen && !isMobile) || isMobile ? (
            <Image
              src="/img/logow.jpeg"
              alt="W FOUR TECH"
              width={isMobile ? 180 : 220}
              height={40}
              className="w-auto h-auto max-w-[180px] sm:max-w-[220px] relative z-10001"
            />
          ) : (
            <div className="w-10 h-10 flex items-center justify-center relative z-10001">
              <span className="text-red-600 font-bold text-xl">W</span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          <button 
            className="relative p-2 text-gray-400 hover:text-gray-500 rounded-full transition-colors group"
            title={`${pendingOrdersCount} đơn hàng chờ xử lý`}
          >
            <Bell className="w-5 h-5" />
            {pendingOrdersCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-red-500 text-white text-xs font-medium rounded-full flex items-center justify-center animate-pulse">
                {pendingOrdersCount > 99 ? '99+' : pendingOrdersCount}
              </span>
            )}
          </button>

          <div id="admin-header-user" className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center space-x-2 p-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Image
                className="h-8 w-8 rounded-full object-cover"
                src="/img/user.png"
                alt="User avatar"
                width={32}
                height={32}
              />
              <div className="text-left hidden sm:block">
                <div className="font-medium text-gray-900">
                  {user?.email ? user.email : "..."}
                </div>
                <div className="text-xs text-gray-500">
                  {user?.roles?.length && user.roles[0] 
                    ? user.roles[0].toUpperCase() 
                    : "..."}
                </div>
              </div>
              <ChevronDown className="w-4 h-4 hidden sm:block" />
            </button>

            <div 
              id="user-dropdown-menu"
              className={`absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10000 border border-gray-200 transition-all duration-200 ${
                showUserDropdown 
                  ? "opacity-100 visible translate-y-0" 
                  : "opacity-0 invisible -translate-y-2"
              }`}
            >
              <button
                id="header-logout-btn"
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default AdminHeader;
