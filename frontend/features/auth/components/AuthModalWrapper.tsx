"use client";

import { useAuthModal } from "../shared/contexts/AuthModalContext";
import { AuthModal } from "./AuthModal";

export const AuthModalWrapper = () => {
  const { isOpen, activeTab, closeModal } = useAuthModal();

  if (!isOpen) return null;

  return (
    <AuthModal
      initialTab={activeTab}
      onClose={closeModal}
    />
  );
};
