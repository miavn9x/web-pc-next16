import { register } from "@/features/auth/register/services/RegisterService";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCurrentUser } from "../../shared/hooks/useCurrentUser";
import { RegisterPayload, RegisterResponse } from "../types/RegisterTypes";

export function useRegister() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const userService = useCurrentUser();

  const registerUser = async (payload: RegisterPayload) => {
    setLoading(true);
    setError(null);
    try {
      const response: RegisterResponse = await register(payload);

      if (response.errorCode === null) {
        // useCurrentUser returns { user, loading, error }
        // We need to access user.roles
        const roles = userService.user?.roles;
        if (!roles) {
          router.replace("/tai-khoan/dang-nhap");
          return;
        }
        const isAdmin = roles.some((r: string) => r !== "user");
        router.replace(isAdmin ? "/wfourtech" : "/");
      } else {
        setError(response.message || "Đăng ký thất bại");
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Lỗi không xác định khi đăng ký"
      );
    } finally {
      setLoading(false);
    }
  };

  return { register: registerUser, loading, error };
}
