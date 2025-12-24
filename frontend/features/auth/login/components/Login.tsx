"use client";
// --- [Thư viện] ---
import { userService } from "@/features/auth/shared/services/user.service";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import { useLogin } from "../hooks/useLogin";

import { Eye, EyeOff } from "lucide-react";

// --- [LoginForm Component] ---
const LoginForm: React.FC = () => {
  // const t = useTranslations("LoginPage");
  const router = useRouter();
  const { mutate: login, isLoading } = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // --- [Xử lý submit] ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
      toast.success("Đăng nhập thành công!");
      // Wait longer for cookies to be properly set
      await new Promise((resolve) => setTimeout(resolve, 1500));
      try {
        const user = await userService.getCurrentUser();
        if (user) {
          const roles = user.roles || [];
          const isAdminOrOther = roles.some((role: string) => role !== "user");
          router.push(isAdminOrOther ? "/wfourtech" : "/");
        } else {
          router.push("/");
        }
      } catch (userError) {
        // If getting user fails, still redirect to home
        console.error("Failed to get user info:", userError);
        router.push("/");
      }
    } catch (error) {
      toast.error("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
    }
  };

  return (
    <div className="bg-gray-50 font-sans min-h-screen">
      {/* --- [UI: Breadcrumb] --- */}
      <div className="bg-gray-100 py-3 px-4 sm:px-6 md:px-8 text-sm">
        <nav className="max-w-7xl mx-auto flex flex-wrap gap-1 text-xs sm:text-sm">
          <Link href="/">
            <span className="text-[#a9b02f]">Trang chủ</span>
          </Link>
          <span>/</span>
          <Link href="/tai-khoan">
            <span className="text-[#a9b02f]">Tài khoản</span>
          </Link>
          <span>/</span>
          <span className="text-gray-400">Đăng nhập</span>
        </nav>
      </div>
      {/* --- [UI: Main Content] */}
      <main className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8 mt-6 bg-white rounded-lg">
        <h1 className="text-lg sm:text-xl font-semibold mb-3">Đăng nhập</h1>
        <p className="text-xs sm:text-sm mb-6 text-[#a9b02f]">
          Bạn chưa có tài khoản?{" "}
          <Link href="/tai-khoan/dang-ky" className="underline">
            Đăng ký tại đây
          </Link>
        </p>
        {/* --- [UI: Form] --- */}
        <form className="max-w-xl mx-auto" onSubmit={handleSubmit}>
          <label
            htmlFor="email"
            className="block text-[10px] sm:text-xs font-semibold text-yellow-700 mb-1"
          >
            Email <span className="text-red-600">*</span>
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Nhập email của bạn"
            required
            className="w-full border border-gray-300 rounded px-2 py-2 mb-4 text-gray-500 placeholder-gray-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <label
            htmlFor="password"
            className="block text-[10px] sm:text-xs font-semibold text-yellow-700 mb-1"
          >
            Mật khẩu <span className="text-red-600">*</span>
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
              required
              className="w-full border border-gray-300 rounded px-2 py-2 mb-1 text-gray-500 placeholder-gray-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 -translate-y-[60%] text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <p className="text-[9px] sm:text-xs mb-6">
            Quên mật khẩu?{" "}
            <Link
              href="/tai-khoan/quen-mat-khau"
              className="text-blue-600 hover:underline"
            >
              Nhấn vào đây
            </Link>
          </p>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-md py-2 sm:py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-medium text-sm sm:text-base transition-colors"
          >
            Đăng nhập
          </button>
        </form>
      </main>
    </div>
  );
};

export default LoginForm;
