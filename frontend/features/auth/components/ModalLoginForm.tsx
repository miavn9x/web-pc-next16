"use client";

import { useLogin } from "@/features/auth/login/hooks/useLogin";
import { userService } from "@/features/auth/shared/services/user.service";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { useAuthModal } from "../shared/contexts/AuthModalContext";

export const ModalLoginForm = () => {
  const router = useRouter();
  const { closeModal } = useAuthModal();
  const { mutate: login, isLoading } = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
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
        <div className="text-right mt-1">
            <button type="button" className="text-sm text-gray-800 hover:underline">
            Quên mật khẩu?
            </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-[#E31D1C] hover:bg-[#c91918] text-white font-bold py-3 rounded text-[16px] transition-all shadow-sm mt-2 disabled:opacity-50"
      >
        {isLoading ? "Đang xử lý..." : "Đăng nhập"}
      </button>

      <div className="relative flex flex-col items-center justify-center mt-3 gap-2">
        <span className="text-sm text-gray-500">
          Hoặc tiếp tục bằng
        </span>
        <div className="flex gap-3">
             <button type="button" className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-all">
               <img src="https://file.hstatic.net/200000420363/file/ic-gg_2eba4fbd380244c18aad0e4fc87117c8.png" alt="Google" className="w-full h-full object-contain"/>
             </button>
             <button type="button" className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-all">
               <img src="https://file.hstatic.net/200000420363/file/ic-fb_e1bf39a1ca4f4629ad03c7346769811c.png" alt="Facebook" className="w-full h-full object-contain"/>
             </button>
        </div>
      </div>
    </form>
    </>
  );
};
