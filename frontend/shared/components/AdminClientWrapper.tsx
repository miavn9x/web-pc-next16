// components/AdminClientWrapper.tsx
"use client";

import { useAdminAuth } from "../hooks/useAdminAuth";

export function AdminClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loading } = useAdminAuth();
  if (loading) return <div>Loading...</div>;
  return <>{children}</>;
}
