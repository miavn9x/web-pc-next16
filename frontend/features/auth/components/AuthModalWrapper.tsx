"use client";

import { useEffect } from "react";
import { useAuthModal } from "../shared/contexts/AuthModalContext";
import { AuthModal } from "./AuthModal";

export const AuthModalWrapper = () => {
  const { isOpen, activeTab, closeModal, switchTab, openModal } = useAuthModal();
  useEffect(() => {
    // Check for cookie trigger (set by proxy.ts middleware)
    if (typeof document !== "undefined" && document.cookie.includes("auth_modal_trigger=login")) {
      openModal("login"); // Use openModal to ensure it actually OPENS
      // Clear the cookie
      document.cookie = "auth_modal_trigger=; path=/; max-age=0";
    }
  }, [switchTab]);

  if (!isOpen) return null;

  return (
    <AuthModal
      activeTab={activeTab}
      onSwitchTab={switchTab}
      onClose={closeModal}
    />
  );
};
