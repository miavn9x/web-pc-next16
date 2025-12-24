"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type AuthTab = "login" | "register";

interface AuthModalContextType {
  isOpen: boolean;
  activeTab: AuthTab;
  openModal: (tab?: AuthTab) => void;
  closeModal: () => void;
  switchTab: (tab: AuthTab) => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

export const AuthModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<AuthTab>("login");

  const openModal = (tab: AuthTab = "login") => {
    setActiveTab(tab);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const switchTab = (tab: AuthTab) => {
    setActiveTab(tab);
  };

  return (
    <AuthModalContext.Provider value={{ isOpen, activeTab, openModal, closeModal, switchTab }}>
      {children}
    </AuthModalContext.Provider>
  );
};

export const useAuthModal = () => {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error("useAuthModal must be used within an AuthModalProvider");
  }
  return context;
};
