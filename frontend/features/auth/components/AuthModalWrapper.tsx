"use client";

import { useEffect } from "react";
import { useAuthModal } from "../shared/contexts/AuthModalContext";
import { AuthModal } from "./AuthModal";

export const AuthModalWrapper = () => {
  const { isOpen, activeTab, closeModal, openModal } = useAuthModal();
  useEffect(() => {
    // Check for cookie trigger (set by proxy.ts middleware)
    if (typeof document !== "undefined" && document.cookie.includes("auth_modal_trigger=login")) {
      openModal("login");
      // Clear the cookie ensuring path and max-age match to delete it
      document.cookie = "auth_modal_trigger=; path=/; max-age=0";
    }
  }, [openModal]);

  if (!isOpen) return null;

  return (
    <AuthModal
      initialTab={activeTab}
      onClose={closeModal}
    />
  );
};
