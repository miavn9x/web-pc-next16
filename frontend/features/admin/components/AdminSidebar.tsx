"use client";

import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import MenuItems from "./MenuItems";
import { useSidebar } from "../contexts/SidebarContext";

const AdminSidebar = () => {
  const { isSidebarOpen, toggleSidebar, isMobile } = useSidebar();

  if (isMobile) return null;

  return (
    <div
      id="admin-sidebar"
      className={`bg-white shadow-lg transition-all duration-100 ease-in-out relative flex-shrink-0 ${
        isSidebarOpen ? "w-[300px]" : "w-16"
      }`}
      style={{
        height: "calc(100vh - 4rem)",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      <button
        onClick={toggleSidebar}
        style={{
          position: "absolute",
          top: "16px",
          right: "-16px",
          zIndex: 100,
          width: "32px",
          height: "32px",
          backgroundColor: "white",
          border: "1px solid #d1d5db",
          borderRadius: "50%",
          boxShadow:
            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          transition: "all 0.1s ease-in-out",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#f9fafb";
          e.currentTarget.style.boxShadow =
            "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "white";
          e.currentTarget.style.boxShadow =
            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)";
        }}
        title={isSidebarOpen ? "Thu gọn menu" : "Mở rộng menu"}
      >
        {isSidebarOpen ? (
          <PanelLeftClose
            style={{ width: "16px", height: "16px", color: "#4b5563" }}
          />
        ) : (
          <PanelLeftOpen
            style={{ width: "16px", height: "16px", color: "#4b5563" }}
          />
        )}
      </button>

      <div
        className="h-full overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-150 scrollbar-track-gray-100"
        style={{
          overscrollBehavior: "contain",
          scrollbarGutter: "stable",
        }}
      >
        <MenuItems isSidebarOpen={isSidebarOpen} />
      </div>
    </div>
  );
};

export default AdminSidebar;
