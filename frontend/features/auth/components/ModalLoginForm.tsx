"use client";

import { useLogin } from "@/features/auth/login/hooks/useLogin";
import { userService } from "@/features/auth/shared/services/user.service";
import { Eye, EyeOff, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { useAuthModal } from "../shared/contexts/AuthModalContext";
import Captcha from "react-captcha-code";
import { useRef } from "react";

export const ModalLoginForm = () => {
  const router = useRouter();
  const { closeModal } = useAuthModal();
  const { mutate: login, isLoading } = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [captchaCode, setCaptchaCode] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaKey, setCaptchaKey] = useState(0);

  // Ref for native validation
  const captchaRef = useRef<HTMLInputElement>(null);

  const handleChangeCaptcha = (code: string) => {
    setCaptchaCode(code);
  };
  
  const handleCaptchaInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      setCaptchaInput(e.target.value);
      e.target.setCustomValidity("");
  };

  const handleRefreshCaptcha = () => {
    setCaptchaKey(prev => prev + 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (captchaInput !== captchaCode) {
        if (captchaRef.current) {
            captchaRef.current.setCustomValidity("Mã captcha không đúng! Vui lòng thử lại.");
            captchaRef.current.reportValidity();
        }
        handleRefreshCaptcha(); // Auto reset captcha
        setCaptchaInput(""); // Clear input
        return;
    }

    try {
      await login({ email, password });
      toast.success("Đăng nhập thành công!");
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      try {
        const user = await userService.getCurrentUser();
        
        if (user) {
           const roles = user.roles || [];
           const isAdminOrOther = roles.some((role: string) => role !== "user");
           closeModal();
           
           if (isAdminOrOther) {
             router.push("/wfourtech");
           } else {
             router.refresh();
           }
        } else {
           closeModal();
           router.refresh();
        }
      } catch (userError) {
        console.error("Failed to get user info:", userError);
        closeModal();
        router.refresh();
      }
    } catch (error) {
      toast.error("Đăng nhập thất bại. Kiểm tra lại thông tin.");
    }
  };



  return (
    <>
      <style jsx global>{`
        input:-webkit-autofill,
        input:-webkit-autofill:hover, 
        input:-webkit-autofill:focus, 
        input:-webkit-autofill:active {
            -webkit-box-shadow: 0 0 0 30px white inset !important;
            -webkit-text-fill-color: #1f2937 !important;
        }
      `}</style>
      <form className="flex flex-col gap-6 mt-2" onSubmit={handleSubmit}>
      <div className="group">
        <label className="block text-[15px] font-bold text-gray-400 mb-1 group-focus-within:text-gray-600 transition-colors">
          Email của bạn
        </label>
        <div className="relative">
            <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border-b-[1.5px] border-gray-300 py-1.5 focus:outline-none focus:border-[#E31D1C] transition-colors placeholder-gray-400 text-gray-800"
            required
            />
        </div>
      </div>

      <div className="group">
        <label className="block text-[15px] font-bold text-gray-400 mb-1 group-focus-within:text-gray-600 transition-colors">
          Nhập mật khẩu
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border-b-[1.5px] border-gray-300 py-1.5 focus:outline-none focus:border-[#E31D1C] transition-colors placeholder-gray-400 text-gray-800 pr-10"
            required
          />
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowPassword(!showPassword);
            }}
            className="absolute right-0 top-1 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {/* <div className="text-right mt-1">
            <button type="button" className="text-sm text-gray-800 hover:underline">
            Quên mật khẩu?
            </button>
        </div> */}
      </div>

      <div className="group">
        <label className="block text-[15px] font-bold text-gray-400 mb-1 group-focus-within:text-gray-600 transition-colors">
          Mã xác nhận
        </label>
        <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="flex-1 w-full order-2 sm:order-1">
                 <input
                    ref={captchaRef}
                    type="text"
                    value={captchaInput}
                    onChange={handleCaptchaInput}
                    className="w-full border-b-[1.5px] border-gray-300 py-1.5 focus:outline-none focus:border-[#E31D1C] transition-colors placeholder-gray-400 text-gray-800 text-center sm:text-left"
                    required
                    placeholder="Nhập mã xác nhận"
                  />
            </div>
            <div className="flex items-center justify-center gap-3 w-full sm:w-auto order-1 sm:order-2">
                <div className="border border-gray-200 rounded p-1 bg-gray-50 select-none">
                     <Captcha 
                        key={captchaKey}
                        charNum={4}
                        onChange={handleChangeCaptcha} 
                        width={160}
                        height={50}
                        fontSize={24}
                        className="cursor-pointer"
                     />
                </div>
                <button
                    type="button"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleRefreshCaptcha();
                    }}
                    className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
                    title="Đổi mã khác"
                >
                    <RefreshCw size={18} />
                </button>
            </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-[#E31D1C] hover:bg-[#c91918] text-white font-bold py-3 rounded text-[16px] transition-all shadow-sm mt-2 disabled:opacity-50"
      >
        {isLoading ? "Đang xử lý..." : "Đăng nhập"}
      </button>




    </form>
    </>
  );
};
