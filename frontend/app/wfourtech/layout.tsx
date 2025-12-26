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
import TourGuide from "@/features/admin/common/TourGuide";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { parseJwt } from "@/shared/utlis/jwt.utils";
import { UnauthorizedHandler } from "@/features/admin/common/UnauthorizedHandler";


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
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!accessToken) {
    if (!refreshToken) {
      return <UnauthorizedHandler />;
    }
    // Logic refresh token để client tự xử lý hoặc xử lý tại đây (ở đây tạm thời cho qua để client handle)
  } else {
    try {
      const payload = parseJwt(accessToken);
      if (
        !payload.roles ||
        !payload.roles.some((role: string) =>
          ["admin", "employment", "cskh"].includes(role)
        )
      ) {
         return <UnauthorizedHandler />;
      }
    } catch {
       return <UnauthorizedHandler />;
    }
  }

  return (
    <>
        <AdminClientWrapper>
          <QueryProvider>
            <SidebarProvider>
              <NotificationProvider>
                <AdminPageProvider>
                  <TourGuide /> {/* ✅ Global Tour Listener */}
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
