"use client";

import { useRegister } from "@/features/auth/register/hooks/useRegister";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

interface ModalRegisterFormProps {
    onSuccess?: () => void;
}

export const ModalRegisterForm = ({ onSuccess }: ModalRegisterFormProps) => {
    const { register, error: registerError } = useRegister();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        firstName: "",
        lastName: ""
    });
    
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
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
