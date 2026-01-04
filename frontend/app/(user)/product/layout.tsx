"use client";

import React from "react";
import FilterSidebar from "@/features/client/product/ProductListing/FilterSidebar";
import {
  SidebarProvider,
  useSidebar,
} from "@/features/client/product/context/SidebarContext";

function ProductLayoutContent({ children }: { children: React.ReactNode }) {
  const { isVisible } = useSidebar();

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col py-2">
      <div className="container mx-auto px-2 flex-1 flex flex-col">
        <div className="flex flex-col lg:flex-row gap-2 flex-1">
          {/* Persistent Sidebar (Left Column) - Only show if visible */}
          <aside
            className={`w-full lg:w-[20%] shrink-0 transition-all duration-300 ${
              isVisible ? "block" : "hidden lg:hidden"
            }`}
          >
            {/* We keep it mounted to preserve state, just hidden */}
            <div className={!isVisible ? "hidden" : ""}>
              <React.Suspense
                fallback={
                  <div className="h-96 bg-gray-100 rounded animate-pulse" />
                }
              >
                <FilterSidebar />
              </React.Suspense>
            </div>
          </aside>

          {/* Main Content (Right Column: Listing or Detail) */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <ProductLayoutContent>{children}</ProductLayoutContent>
    </SidebarProvider>
  );
}
