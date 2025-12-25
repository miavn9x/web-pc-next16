"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ModalLoginForm } from "./ModalLoginForm";
import { ModalRegisterForm } from "./ModalRegisterForm";

interface AuthModalProps {
  activeTab: "login" | "register";
  onSwitchTab: (tab: "login" | "register") => void;
  onClose: () => void;
}

export const AuthModal = ({
  activeTab,
  onSwitchTab,
  onClose,
}: AuthModalProps) => {
  // Removed local state to fix sync issues

  const switchToRegister = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onSwitchTab("register");
  };

  const switchToLogin = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onSwitchTab("login");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >
      <div
        className="relative w-full max-w-[850px] bg-white rounded-lg shadow-2xl overflow-hidden flex min-h-[500px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 z-10"
        >
          <X size={20} />
        </button>

        {/* Form */}
        <div className="w-full md:w-[60%] p-8 flex flex-col justify-center">
          <div className="mb-4">
            <h2 className="text-3xl font-bold text-gray-800 mb-1">
              Xin chào,
            </h2>
            <p className="text-sm text-gray-500">
              {activeTab === "login" ? (
                <>
                  Đăng nhập hoặc{" "}
                  <span
                    onClick={switchToRegister}
                    className="text-[#E31D1C] cursor-pointer hover:underline"
                  >
                    Tạo tài khoản
                  </span>
                </>
              ) : (
                <>
                  <span
                    onClick={switchToLogin}
                    className="text-[#E31D1C] cursor-pointer hover:underline"
                  >
                    Đăng nhập
                  </span>{" "}
                  hoặc Tạo tài khoản
                </>
              )}
            </p>
          </div>

          {activeTab === "login" ? (
            <ModalLoginForm />
          ) : (
            <ModalRegisterForm onSuccess={() => onSwitchTab("login")} />
          )}
        </div>

        {/* Banner */}
        <div className="hidden md:block w-[40%] relative">
          <Image
            src="/banner/banner_login.png"
            alt="Banner Login"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>
    </div>
  );
};
