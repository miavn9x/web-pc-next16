

"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface AdminPageContextType {
  currentPage: string;
  setCurrentPage: (_page: string) => void;
}

const AdminPageContext = createContext<AdminPageContextType | undefined>(
  undefined
);

export function AdminPageProvider({ children }: { children: ReactNode }) {
  const [currentPage, setCurrentPage] = useState("dashboard");

  return (
    <AdminPageContext.Provider value={{ currentPage, setCurrentPage }}>
      {children}
    </AdminPageContext.Provider>
  );
}

export function useAdminPage() {
  const context = useContext(AdminPageContext);
  if (context === undefined) {
    throw new Error("useAdminPage must be used within an AdminPageProvider");
  }
  return context;
}