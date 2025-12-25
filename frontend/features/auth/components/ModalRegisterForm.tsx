"use client";

import { useRegister } from "@/features/auth/register/hooks/useRegister";
import { Eye, EyeOff, RefreshCw } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useAuthModal } from "../shared/contexts/AuthModalContext";
import { getCaptcha } from "@/features/auth/login/services/LoginService";

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
    
    // Server-side Captcha State
    const [captchaInput, setCaptchaInput] = useState("");
    const [captchaImage, setCaptchaImage] = useState("");
    const [captchaId, setCaptchaId] = useState("");

    // Lockout State
    const [localLockUntil, setLocalLockUntil] = useState<number | null>(null);
    const [now, setNow] = useState(Date.now());

    // Load from LocalStorage on mount
    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedLock = localStorage.getItem("register_lock_until");
            if (storedLock) setLocalLockUntil(Number(storedLock));
        }
    }, []);

    // Check local lock
    const isLocked = localLockUntil !== null && now < localLockUntil;

    // Timer Effect
    useEffect(() => {
        if (localLockUntil) {
            setNow(Date.now());
            const interval = setInterval(() => {
                const currentTime = Date.now();
                setNow(currentTime);
                if (currentTime >= localLockUntil) {
                    setLocalLockUntil(null);
                    localStorage.removeItem("register_lock_until");
                }
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [localLockUntil]);

    // Refs for native validation
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const captchaRef = useRef<HTMLInputElement>(null);
    const firstNameRef = useRef<HTMLInputElement>(null);
    const lastNameRef = useRef<HTMLInputElement>(null);

    const fetchCaptcha = async () => {
        try {
            const data = await getCaptcha();
            setCaptchaId(data.captchaId);
            setCaptchaImage(data.captchaImage);
        } catch (error: any) {
             if (error?.response?.status === 429) {
                // If fetching captcha is throttled, it means user is locked
                // We can't really get the lockUntil here easily without standardized error response for GET,
                // but usually the main lock comes from POST. 
                toast.error("Vui lòng đợi một chút trước khi thử lại.");
            } else {
                toast.error("Không thể tải mã xác nhận. Vui lòng thử lại.");
            }
        }
    };

    useEffect(() => {
        fetchCaptcha();
    }, []);

    const handleRefreshCaptcha = () => {
        setCaptchaInput("");
        fetchCaptcha();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Clear custom validity when user types
        e.target.setCustomValidity("");
    };

    const validateField = (name: string, value: string) => {
        let error = "";
        const ref = {
            firstName: firstNameRef,
            lastName: lastNameRef,
            email: emailRef,
            password: passwordRef,
        }[name];

        if (!ref?.current) return;

        switch (name) {
            case "firstName":
            case "lastName":
                // Vietnamese name regex: letters and spaces only, no numbers or special chars
                if (/\d/.test(value)) {
                    error = "Tên không được chứa số.";
                } else if (!/^[a-zA-Z\u00C0-\u024F\u1E00-\u1EFF\s]*$/.test(value)) {
                     error = "Tên chỉ được chứa chữ cái và khoảng trắng.";
                }
                break;
            case "email":
                const allowedDomains = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "icloud.com"];
                const emailDomain = value.split("@")[1]?.toLowerCase();
                const isEmailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
                
                if (!value) {
                     error = "Vui lòng nhập email.";
                } else if (!isEmailFormat) {
                    error = "Email không hợp lệ. Vui lòng kiểm tra lại.";
                } else if (!allowedDomains.includes(emailDomain)) {
                    error = `Hệ thống chỉ hỗ trợ các loại email: ${allowedDomains.map(d => "@" + d).join(", ")}`;
                }
                break;
            case "password":
                // 8-32 chars, Uppercase, Special char
                const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9a-zA-Z]).{8,32}$/;
                if (!passwordRegex.test(value)) {
                    error = "Mật khẩu phải từ 8-32 ký tự, có ít nhất 1 chữ hoa và 1 ký tự đặc biệt (!@#$&*)";
                }
                break;
        }

        ref.current.setCustomValidity(error);
        if (error) ref.current.reportValidity();
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        validateField(e.target.name, e.target.value);
    };

    const handleCaptchaInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCaptchaInput(e.target.value);
        e.target.setCustomValidity("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation();

         // Check lock
        if (isLocked) {
            toast.error("Bạn đã nhập sai quá nhiều lần. Vui lòng chờ mở khóa.");
            return;
        }

        // 1. Validate Email (Popular domains)
        const allowedDomains = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "icloud.com"];
        const emailDomain = formData.email.split("@")[1]?.toLowerCase();
        
        // Basic format check
        const isEmailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
        
        if (!isEmailFormat) {
            if (emailRef.current) {
                emailRef.current.setCustomValidity("Email không hợp lệ. Vui lòng kiểm tra lại.");
                emailRef.current.reportValidity();
            }
            return;
        }

        // Domain check
        if (!allowedDomains.includes(emailDomain)) {
             if (emailRef.current) {
                emailRef.current.setCustomValidity(`Hệ thống chỉ hỗ trợ các loại email: ${allowedDomains.map(d => "@" + d).join(", ")}`);
                emailRef.current.reportValidity();
            }
            return;
        }

        // 2. Validate Password
        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9a-zA-Z]).{8,32}$/;
        if (!passwordRegex.test(formData.password)) {
            if (passwordRef.current) {
                passwordRef.current.setCustomValidity("Mật khẩu phải từ 8-32 ký tự, có ít nhất 1 chữ hoa và 1 ký tự đặc biệt (!@#$&*)");
                passwordRef.current.reportValidity();
            }
            return;
        }
        
        // 3. Check Captcha Input exists
        if (!captchaInput.trim()) {
            if (captchaRef.current) {
                captchaRef.current.setCustomValidity("Vui lòng nhập mã xác nhận.");
                captchaRef.current.reportValidity();
            }
            return;
        }

        try {
            const success = await register({
                email: formData.email,
                password: formData.password,
                firstName: formData.firstName,
                lastName: formData.lastName,
                captchaCode: captchaInput,
                captchaId
            });
            
            // Chỉ đóng modal/chuyển tab khi thực sự thành công (trả về true)
            if (success === true) {
                // Clear lock on success
                setLocalLockUntil(null);
                localStorage.removeItem("register_lock_until");
                
                toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
                if (onSuccess) onSuccess();
            }
        } catch (error: any) {
             // Handle Errors similar to Login
             handleRefreshCaptcha(); // Refresh captcha on error
             
             // Handle Backend Lock Error
             if (error?.response?.data?.errorCode === 'AUTH_LOCKED') {
                const lockUntil = error.response.data.lockUntil; // timestamp returned from BE
                if (lockUntil) {
                    setLocalLockUntil(lockUntil);
                    localStorage.setItem("register_lock_until", String(lockUntil));
                    toast.error(error.response.data.message);
                    return;
                }
             }

             const errorMessage = error?.response?.data?.message || "Đăng ký thất bại.";

             if (errorMessage.toLowerCase().includes("mã xác nhận") || errorMessage.toLowerCase().includes("captcha")) {
                 if (captchaRef.current) {
                     captchaRef.current.setCustomValidity(errorMessage);
                     captchaRef.current.reportValidity();
                 }
             } else if (errorMessage.toLowerCase().includes("email")) {
                  if (emailRef.current) {
                     emailRef.current.setCustomValidity(errorMessage);
                     emailRef.current.reportValidity();
                 }
             } else {
                 toast.error(errorMessage);
             }
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
                        ref={lastNameRef}
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={isLocked}
                        className="w-full border-b-[1.5px] border-gray-300 py-1.5 focus:outline-none focus:border-[#E31D1C] transition-colors placeholder-gray-400 text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                        required
                    />
                </div>

                <div className="group flex-1">
                    <label className="block text-[15px] font-bold text-gray-400 mb-1 group-focus-within:text-gray-600 transition-colors">Tên</label>
                    <input 
                        ref={firstNameRef}
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={isLocked}
                        className="w-full border-b-[1.5px] border-gray-300 py-1.5 focus:outline-none focus:border-[#E31D1C] transition-colors placeholder-gray-400 text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
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
                    onBlur={handleBlur}
                    disabled={isLocked}
                    className="w-full border-b-[1.5px] border-gray-300 py-1.5 focus:outline-none focus:border-[#E31D1C] transition-colors placeholder-gray-400 text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
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
                        onBlur={handleBlur}
                        disabled={isLocked}
                        className="w-full border-b-[1.5px] border-gray-300 py-1.5 focus:outline-none focus:border-[#E31D1C] transition-colors placeholder-gray-400 text-gray-800 pr-10 disabled:opacity-50 disabled:cursor-not-allowed"
                        required
                    />
                     <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setShowPassword(!showPassword);
                        }}
                        disabled={isLocked}
                        className="absolute right-0 top-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
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
                            onChange={(e) => {
                                handleCaptchaInput(e);
                                e.target.setCustomValidity("");
                            }}
                            disabled={isLocked}
                            className="w-full border-b-[1.5px] border-gray-300 py-1.5 focus:outline-none focus:border-[#E31D1C] transition-colors placeholder-gray-400 text-gray-800 text-center sm:text-left disabled:opacity-50 disabled:cursor-not-allowed"
                            required
                            placeholder="Nhập mã xác nhận"
                          />
                    </div>
                    <div className="flex items-center justify-center gap-3 w-full sm:w-auto order-1 sm:order-2">
                        <div 
                          className="border border-gray-200 rounded p-1 bg-gray-50 select-none cursor-pointer min-w-[120px] min-h-[40px]"
                          onClick={!isLocked ? handleRefreshCaptcha : undefined}
                          title="Nhấn để đổi hình khác"
                          dangerouslySetInnerHTML={{ __html: captchaImage }}
                        />
                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleRefreshCaptcha();
                            }}
                            disabled={isLocked}
                            className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Đổi mã khác"
                        >
                            <RefreshCw size={18} />
                        </button>
                    </div>
                </div>
            </div>

            <button
                type="submit"
                disabled={isLocked}
                className="w-full bg-[#E31D1C] hover:bg-[#c91918] text-white font-bold py-3 rounded text-[16px] transition-all shadow-sm mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLocked 
                 ? `Tạm khóa (${Math.ceil((localLockUntil! - now) / 1000)}s)`
                 : "Đăng ký"}
            </button>
            


        </form>
        </>
    );
};
