"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthModal } from "@/features/auth/shared/contexts/AuthModalContext";

export const UnauthorizedHandler = () => {
  const router = useRouter();
  const { openModal } = useAuthModal();

  useEffect(() => {
    // Open login modal
    openModal("login");
    // Redirect to home
    router.replace("/");
  }, [openModal, router]);

  // Render nothing or a loading state while redirecting
  return null;
};
