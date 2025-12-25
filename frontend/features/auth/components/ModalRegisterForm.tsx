"use client";

import { useRegister } from "@/features/auth/register/hooks/useRegister";
import { Eye, EyeOff, RefreshCw } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import Captcha from "react-captcha-code";
import { useAuthModal } from "../shared/contexts/AuthModalContext";

interface ModalRegisterFormProps {
    onSuccess?: () => void;
}

export const ModalRegisterForm = ({ onSuccess }: ModalRegisterFormProps) => {
    const { closeModal } = useAuthModal();
    const { register, error: registerError } = useRegister();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        firstName: "",
        lastName: ""
    });
    
    const [showPassword, setShowPassword] = useState(false);
    const [captchaCode, setCaptchaCode] = useState("");
    const [captchaInput, setCaptchaInput] = useState("");
    const [captchaKey, setCaptchaKey] = useState(0);

    // Refs for native validation
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const captchaRef = useRef<HTMLInputElement>(null);

    const handleChangeCaptcha = (code: string) => {
        setCaptchaCode(code);
    };

    const handleRefreshCaptcha = () => {
        setCaptchaKey(prev => prev + 1);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Clear custom validity when user types
        e.target.setCustomValidity("");
    };

    const handleCaptchaInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCaptchaInput(e.target.value);
        e.target.setCustomValidity("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation();

        // 1. Validate Email (@gmail.com)
        if (!formData.email.endsWith("@gmail.com")) {
            if (emailRef.current) {
                emailRef.current.setCustomValidity("Email phải có đuôi @gmail.com");
                emailRef.current.reportValidity();
            }
            return;
        }

        // 2. Validate Password (8-32 chars, Uppercase, Special char)
        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9a-zA-Z]).{8,32}$/;
        if (!passwordRegex.test(formData.password)) {
            if (passwordRef.current) {
                passwordRef.current.setCustomValidity("Mật khẩu phải từ 8-32 ký tự, có ít nhất 1 chữ hoa và 1 ký tự đặc biệt (!@#$&*)");
                passwordRef.current.reportValidity();
            }
            return;
        }
        
        // 3. Validate Captcha
        if (captchaInput !== captchaCode) {
            if (captchaRef.current) {
                captchaRef.current.setCustomValidity("Mã captcha không đúng! Vui lòng thử lại.");
                captchaRef.current.reportValidity();
            }
            // Auto reset
            handleRefreshCaptcha();
            setCaptchaInput("");
            return;
        }

        const success = await register({
            email: formData.email,
            password: formData.password,
            firstName: formData.firstName,
            lastName: formData.lastName
        });
        
        if (success) {
            toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
            onSuccess?.();
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
        <form className="flex flex-col gap-4 mt-2" onSubmit={handleSubmit}>
            <div className="flex gap-4">
                <div className="group flex-1">
                    <label className="block text-[15px] font-bold text-gray-400 mb-1 group-focus-within:text-gray-600 transition-colors">Họ</label>
                    <input 
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full border-b-[1.5px] border-gray-300 py-1.5 focus:outline-none focus:border-[#E31D1C] transition-colors placeholder-gray-400 text-gray-800"
                        required
                    />
                </div>

                <div className="group flex-1">
                    <label className="block text-[15px] font-bold text-gray-400 mb-1 group-focus-within:text-gray-600 transition-colors">Tên</label>
                    <input 
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full border-b-[1.5px] border-gray-300 py-1.5 focus:outline-none focus:border-[#E31D1C] transition-colors placeholder-gray-400 text-gray-800"
                        required
                    />
                </div>
            </div>

            <div className="group">
                <label className="block text-[15px] font-bold text-gray-400 mb-1 group-focus-within:text-gray-600 transition-colors">Email</label>
                <input
                    ref={emailRef}
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border-b-[1.5px] border-gray-300 py-1.5 focus:outline-none focus:border-[#E31D1C] transition-colors placeholder-gray-400 text-gray-800"
                    required
                />
            </div>

            <div className="group">
                <label className="block text-[15px] font-bold text-gray-400 mb-1 group-focus-within:text-gray-600 transition-colors">Mật khẩu</label>
                <div className="relative">
                    <input
                        ref={passwordRef}
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
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
                className="w-full bg-[#E31D1C] hover:bg-[#c91918] text-white font-bold py-3 rounded text-[16px] transition-all shadow-sm mt-4"
            >
                Đăng ký
            </button>
            

             {registerError && (
              <p className="text-red-500 text-xs mt-2 text-center">{registerError}</p>
            )}
        </form>
        </>
    );
};
