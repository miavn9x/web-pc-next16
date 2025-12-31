"use client";

import { useLogin } from "@/features/auth/login/hooks/useLogin";
import { getCaptcha } from "@/features/auth/login/services/LoginService";
import { userService } from "@/features/auth/shared/services/user.service";
import { Eye, EyeOff, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { useAuthModal } from "../shared/contexts/AuthModalContext";

export const ModalLoginForm = () => {
  const router = useRouter();
  const { closeModal } = useAuthModal();
  const { mutate: login, isLoading } = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Server-side Captcha State
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaImage, setCaptchaImage] = useState("");
  const [captchaId, setCaptchaId] = useState("");
  const [isFetchingCaptcha, setIsFetchingCaptcha] = useState(false);

  // Refs for native validation
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const captchaRef = useRef<HTMLInputElement>(null);

  // Ref để tránh fetch 2 lần trong React Strict Mode
  const hasFetched = useRef(false);

  const fetchCaptcha = async () => {
    if (isLoading || isFetchingCaptcha) return; // Prevent spam
    setIsFetchingCaptcha(true);
    try {
      const data = await getCaptcha();
      setCaptchaId(data.captchaId);
      setCaptchaImage(data.captchaImage);
    } catch (error: any) {
      // console.error("Failed to fetch captcha", error);
      if (error?.response?.status === 429) {
        toast.error("Thao tác quá nhanh. Vui lòng đợi!");
      } else {
        toast.error("Lỗi tải captcha.");
      }
    } finally {
      setIsFetchingCaptcha(false);
    }
  };

  useEffect(() => {
    if (!hasFetched.current) {
      fetchCaptcha();
      hasFetched.current = true;
    }
  }, []);

  const handleCaptchaInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCaptchaInput(e.target.value);
    e.target.setCustomValidity("");
  };

  const handleRefreshCaptcha = () => {
    if (isFetchingCaptcha) return;
    setCaptchaInput("");
    fetchCaptcha();
  };

  const validateEmail = (value: string) => {
    if (!emailRef.current) return;

    let error = "";
    const allowedDomains = [
      "gmail.com",
      "yahoo.com",
      "outlook.com",
      "hotmail.com",
      "icloud.com",
    ];
    const emailDomain = value.split("@")[1]?.toLowerCase();
    const isEmailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

    if (!value) {
      error = "Vui lòng nhập email.";
    } else if (!isEmailFormat) {
      error = "Email không hợp lệ. Vui lòng kiểm tra lại.";
    } else if (!allowedDomains.includes(emailDomain)) {
      error = `Hệ thống chỉ hỗ trợ các loại email: ${allowedDomains
        .map((d) => "@" + d)
        .join(", ")}`;
    }

    emailRef.current.setCustomValidity(error);
    if (error) emailRef.current.reportValidity();
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    validateEmail(e.target.value);
  };

  const [localLockUntil, setLocalLockUntil] = useState<number | null>(null);
  const [lockReason, setLockReason] = useState<string | null>(null); // 'CAPTCHA' or 'PASSWORD'
  const [lockCount, setLockCount] = useState<number>(0); // Số lần bị lock

  // Load from LocalStorage on mount (Chỉ để giữ trải nghiệm người dùng, không phải bảo mật chính)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedLock = localStorage.getItem("auth_lock_until");
      if (storedLock) setLocalLockUntil(Number(storedLock));
    }
  }, []);

  // Check local lock on mount/render
  const isLocked = localLockUntil !== null && Date.now() < localLockUntil;

  // Effect to clean up lock if expired
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (localLockUntil) {
      // Update immediately to avoid 1s delay
      setNow(Date.now());

      const interval = setInterval(() => {
        const currentTime = Date.now();
        setNow(currentTime); // Force re-render

        if (currentTime >= localLockUntil) {
          setLocalLockUntil(null);
          localStorage.removeItem("auth_lock_until");
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [localLockUntil]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Check lock
    if (isLocked) {
      toast.error("Bạn đã nhập sai quá nhiều lần. Vui lòng chờ mở khóa.");
      return;
    }

    // 1. Validate Email (Popular domains)
    const allowedDomains = [
      "gmail.com",
      "yahoo.com",
      "outlook.com",
      "hotmail.com",
      "icloud.com",
    ];
    const emailDomain = email.split("@")[1]?.toLowerCase();

    // Basic format check
    const isEmailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!isEmailFormat) {
      if (emailRef.current) {
        emailRef.current.setCustomValidity(
          "Email không hợp lệ. Vui lòng kiểm tra lại."
        );
        emailRef.current.reportValidity();
      }
      return;
    }

    // Domain check
    if (!allowedDomains.includes(emailDomain)) {
      if (emailRef.current) {
        emailRef.current.setCustomValidity(
          `Hệ thống chỉ hỗ trợ các loại email: ${allowedDomains
            .map((d) => "@" + d)
            .join(", ")}`
        );
        emailRef.current.reportValidity();
      }
      return;
    }

    // Check Captcha Input
    if (!captchaInput.trim()) {
      if (captchaRef.current) {
        captchaRef.current.setCustomValidity("Vui lòng nhập mã xác nhận.");
        captchaRef.current.reportValidity();
      }
      return;
    }

    try {
      // Gửi captcha code và id lên server để check
      const res = await login({
        email,
        password,
        captchaCode: captchaInput,
        captchaId,
      });

      // 2024 Fix: Backend now returns 200 OK with errorCode for Logic Errors (to hide 401 logs)
      // So we must check errorCode manually here if axios doesn't throw.
      if (res && (res as any).errorCode) {
        // Manually throw to trigger catch block with formatted error
        throw {
          response: {
            data: res,
          },
        };
      }

      // Thành công -> Xóa lock nếu có (logic local)
      setLocalLockUntil(null);
      localStorage.removeItem("auth_lock_until");

      toast.success("Đăng nhập thành công!");

      // Delay nhẹ để cookie được lưu hoàn toàn
      await new Promise((resolve) => setTimeout(resolve, 500));
      closeModal();

      // Dùng window.location.href thay vì router.push()
      // để đảm bảo cookie được gửi trong request tiếp theo
      window.location.href = "/wfourtech";
    } catch (error: any) {
      // Refresh captcha ngay lập tức vì code cũ đã bị hủy hoặc không hợp lệ
      handleRefreshCaptcha();

      // Handle Backend Lock Error
      if (error?.response?.data?.errorCode === "AUTH_LOCKED") {
        const lockUntil = error.response.data.lockUntil; // timestamp returned from BE
        if (lockUntil) {
          setLocalLockUntil(lockUntil);
          localStorage.setItem("auth_lock_until", String(lockUntil));
          toast.error(error.response.data.message);
          return;
        }
      }

      const errorMessage =
        error?.response?.data?.message ||
        "Đăng nhập thất bại. Kiểm tra lại thông tin.";

      // Nếu lỗi liên quan đến Captcha -> Hiển thị trên ô Captcha
      if (
        errorMessage.toLowerCase().includes("mã xác nhận") ||
        errorMessage.toLowerCase().includes("captcha")
      ) {
        if (captchaRef.current) {
          captchaRef.current.setCustomValidity(errorMessage);
          captchaRef.current.reportValidity();
        }
      } else if (
        errorMessage.toLowerCase().includes("mật khẩu") ||
        errorMessage.toLowerCase().includes("email")
      ) {
        // Nếu lỗi liên quan đến Mật khẩu/Email -> Báo vào ô mật khẩu
        if (passwordRef.current) {
          passwordRef.current.setCustomValidity(errorMessage);
          passwordRef.current.reportValidity();
        }
      } else {
        // Lỗi chung hoặc lỗi tài khoản -> Hiển thị notification chung
        setLoginError(errorMessage);
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
      <form className="flex flex-col gap-6 mt-2" onSubmit={handleSubmit}>
        {loginError && (
          <div className="bg-red-50 text-red-500 text-sm py-2 px-3 rounded border border-red-200 text-center">
            {loginError}
          </div>
        )}
        <div className="group">
          <label className="block text-[15px] font-bold text-gray-400 mb-1 group-focus-within:text-gray-600 transition-colors">
            Email của bạn
          </label>
          <div className="relative">
            <input
              ref={emailRef}
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                e.target.setCustomValidity("");
              }}
              onBlur={handleBlur}
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
              ref={passwordRef}
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                e.target.setCustomValidity(""); // Clear validation error
              }}
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
                onChange={(e) => {
                  handleCaptchaInput(e);
                  e.target.setCustomValidity(""); // Clear validation error
                }}
                className="w-full border-b-[1.5px] border-gray-300 py-1.5 focus:outline-none focus:border-[#E31D1C] transition-colors placeholder-gray-400 text-gray-800 text-center sm:text-left"
                required
                placeholder="Nhập mã xác nhận"
              />
            </div>
            <div className="flex items-center justify-center gap-3 w-full sm:w-auto order-1 sm:order-2">
              <div
                className="border border-gray-200 rounded  bg-gray-50 select-none cursor-pointer min-w-[110px] h-auto flex items-center justify-center [&>svg]:max-h-full [&>svg]:w-auto"
                onClick={handleRefreshCaptcha}
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
                disabled={isFetchingCaptcha}
                className={`text-gray-500 p-2 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  isFetchingCaptcha
                    ? "animate-spin"
                    : "hover:text-gray-700 hover:bg-gray-100"
                }`}
                title="Đổi mã khác"
              >
                <RefreshCw size={18} />
              </button>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || isLocked}
          className="w-full bg-[#E31D1C] hover:bg-[#c91918] text-white font-bold py-3 rounded text-[16px] transition-all shadow-sm mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLocked
            ? `Tạm khóa (${Math.ceil((localLockUntil! - now) / 1000)}s)`
            : isLoading
            ? "Đang xử lý..."
            : "Đăng nhập"}
        </button>
      </form>
    </>
  );
};
