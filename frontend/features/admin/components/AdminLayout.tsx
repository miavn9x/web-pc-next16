"use client";

import { useEffect, useRef } from "react";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";
import AdminContent from "./AdminContent";
import MobileMenu from "./MobileMenu";
import { useSidebar } from "../contexts/SidebarContext";

const AdminLayout = () => {
  const { isSidebarOpen, toggleSidebar, isMobile } = useSidebar();
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Handle click outside sidebar to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Chỉ áp dụng cho desktop và khi sidebar đang mở
      if (!isMobile && isSidebarOpen && sidebarRef.current) {
        // Kiểm tra nếu click không nằm trong sidebar
        if (!sidebarRef.current.contains(event.target as Node)) {
          // Kiểm tra nếu click không phải là toggle button
          const toggleButton = document.querySelector(
            "[title=\"Thu gọn menu\"], [title=\"Mở rộng menu\"]"
          );
          if (toggleButton && !toggleButton.contains(event.target as Node)) {
            toggleSidebar();
          }
        }
      }
    };

    if (!isMobile && isSidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobile, isSidebarOpen, toggleSidebar]);

  return (
    <div className="">
      <AdminHeader />
      <MobileMenu />
      <div className="flex pt-16">
        <div ref={sidebarRef}>
          <AdminSidebar />
        </div>
        <AdminContent />
      </div>
    </div>
  );
};

export default AdminLayout;
