import React from "react";
import FilterSidebar from "@/features/client/product/ProductListing/FilterSidebar";

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col py-2">
      <div className="container mx-auto px-2 flex-1 flex flex-col">
        <div className="flex flex-col lg:flex-row gap-2 flex-1">
          {/* Persistent Sidebar (Left Column) */}
          <aside className="w-full lg:w-[20%] shrink-0">
            <React.Suspense
              fallback={
                <div className="h-64 bg-gray-100 animate-pulse rounded-lg" />
              }
            >
              <FilterSidebar />
            </React.Suspense>
          </aside>

          {/* Main Content (Right Column: Listing or Detail) */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
