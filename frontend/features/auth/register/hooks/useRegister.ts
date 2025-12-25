import { register } from "@/features/auth/register/services/RegisterService";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCurrentUser } from "../../shared/hooks/useCurrentUser";
import { RegisterPayload, RegisterResponse } from "../types/RegisterTypes";

export function useRegister() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // const userService = useCurrentUser();

  const registerUser = async (payload: RegisterPayload): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response: RegisterResponse = await register(payload);

      if (response.errorCode === null) {
        // Registration success
        return true;
      } else {
        const msg = response.message || "Đăng ký thất bại";
        setError(msg);
        throw new Error(msg); // Throw loginal error to be caught by component
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err.message ||
        "Lỗi không xác định khi đăng ký";
      setError(msg);
      throw err; // Propagate error to component
    } finally {
      setLoading(false);
    }
  };

  return { register: registerUser, loading, error };
}
