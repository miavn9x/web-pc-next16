import type { Metadata } from "next";
import React from "react";

import { AdminPageProvider } from "@/features/admin/contexts/AdminPageContext";
import { SidebarProvider } from "@/features/admin/contexts/SidebarContext";
import { NotificationProvider } from "@/features/admin/contexts/NotificationContext";
import "@/shared/styles/globals.css";
import "suneditor/dist/css/suneditor.min.css";

import { AdminClientWrapper } from "@/shared/components/AdminClientWrapper";
import QueryProvider from "@/shared/components/QueryProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const dynamic = "force-dynamic"; // Fix build error: Route used cookies

import { redirect } from "next/navigation";
import { verifyAdminAccess } from "@/features/admin/lib/admin-guard";

export const metadata: Metadata = {
  title: "W Four Tech Admin",
  description: "Admin Dashboard",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // --- Auth Check ---
  // Toàn bộ logic kiểm tra quyền đã được bọc kín trong hàm verifyAdminAccess
  // để đảm bảo bảo mật và không lộ Role ra ngoài layout.
  const hasAccess = await verifyAdminAccess();

  if (!hasAccess) {
    // Nếu không có quyền, đá về trang chủ
    redirect("/");
  }

  return (
    <>
      <AdminClientWrapper>
        <QueryProvider>
          <SidebarProvider>
            <NotificationProvider>
              <AdminPageProvider>
                <div className="h-screen flex flex-col overflow-hidden">
                  {children}
                </div>
                <ToastContainer />
              </AdminPageProvider>
            </NotificationProvider>
          </SidebarProvider>
        </QueryProvider>
      </AdminClientWrapper>
    </>
  );
}
