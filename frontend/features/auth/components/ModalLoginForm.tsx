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

  // Initial IP Check
  useEffect(() => {
    // Fetch captcha (check IP lock) on mount
    fetchCaptchaWithEmail("");
  }, []);

  // Server-side Captcha State
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaImage, setCaptchaImage] = useState("");
  const [captchaId, setCaptchaId] = useState("");
  const [isFetchingCaptcha, setIsFetchingCaptcha] = useState(false);

  // Refs for native validation
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const captchaRef = useRef<HTMLInputElement>(null);

  // Polling interval ref
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch captcha with email (check lock first)
  const fetchCaptchaWithEmail = async (emailValue: string) => {
    if (isFetchingCaptcha) return;
    setIsFetchingCaptcha(true);
    try {
      const data = await getCaptcha(emailValue);

      // Check if locked
      if (data.lockInfo?.locked) {
        // Locked → Set lock state, clear captcha
        setLocalLockUntil(data.lockInfo.lockUntil || null);
        setLockReason(data.lockInfo.lockReason || null);
        setLockCount(data.lockInfo.lockCount || 0);
        setCaptchaImage("");
        setCaptchaId("");
        setCaptchaInput("");

        // Timeout to auto-refresh after lock expires
        scheduleUnlock(data.lockInfo.lockUntil);
      } else {
        // Not locked → Show captcha
        setCaptchaId(data.captchaId || "");
        setCaptchaImage(data.captchaImage || "");
        setLocalLockUntil(null);
        setLockReason(null);
      }
    } catch (error: any) {
      if (error?.response?.status === 429) {
        // Ignore specific 429s or show specific message
        // toast.error("Thao tác quá nhanh. Vui lòng đợi!");
      } else {
        console.error("Captcha fetch error", error);
      }
    } finally {
      setIsFetchingCaptcha(false);
    }
  };

  // Schedule auto-refresh when lock expires
  const scheduleUnlock = (lockUntilStr?: string | number) => {
    if (!lockUntilStr) return;
    const lockUntil = new Date(lockUntilStr).getTime();
    const now = Date.now();
    const delay = Math.max(0, lockUntil - now) + 1000; // +1s safety buffer

    if (pollingIntervalRef.current) clearTimeout(pollingIntervalRef.current);

    pollingIntervalRef.current = setTimeout(() => {
      setLocalLockUntil(null);
      // Re-fetch captcha to confirm unlock (pass current email or empty)
      fetchCaptchaWithEmail(emailRef.current?.value || "");
    }, delay);
  };

  const stopPolling = () => {
    if (pollingIntervalRef.current) {
      clearTimeout(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  };

  // Cleanup polling on unmount
  useEffect(() => {
    return () => stopPolling();
  }, []);

  // Debounced email check
  useEffect(() => {
    // Only fetch when email is valid format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      // Invalid email format but not empty -> maybe wait?
      // For now just clear if invalid
      setCaptchaImage("");
      return;
    }

    // If email is empty, we don't fetch automatically UNLESS it's the initial mount check (handled separately)
    // But if user clears email, we might want to reset?
    if (!email) {
      // Optional: fetch generic captcha (IP check)
      // fetchCaptchaWithEmail("");
      return;
    }

    // Debounce 500ms
    const timer = setTimeout(() => {
      fetchCaptchaWithEmail(email);
    }, 500);

    return () => clearTimeout(timer);
  }, [email]);

  const handleCaptchaInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCaptchaInput(e.target.value);
    e.target.setCustomValidity("");
  };

  const handleRefreshCaptcha = () => {
    if (isFetchingCaptcha || !email) return;
    setCaptchaInput("");
    fetchCaptchaWithEmail(email);
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
  const [lockReason, setLockReason] = useState<string | null>(null);
  const [lockCount, setLockCount] = useState<number>(0);

  // Check if locked
  const isLocked = localLockUntil !== null && Date.now() < localLockUntil;

  // Countdown timer
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (localLockUntil) {
      setNow(Date.now());

      const interval = setInterval(() => {
        const currentTime = Date.now();
        setNow(currentTime);

        if (currentTime >= localLockUntil) {
          setLocalLockUntil(null);
          // Auto-refresh captcha when lock expires (polling will handle this)
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

      // Thành công -> Xóa lock state
      setLocalLockUntil(null);
      stopPolling();

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
        const lockData =
          error.response.data.data || error.response.data.lockInfo;
        if (lockData?.lockUntil) {
          setLocalLockUntil(lockData.lockUntil);
          setLockReason(lockData.lockReason);
          setCaptchaImage("");
          setCaptchaId("");
          scheduleUnlock(lockData.lockUntil);
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
