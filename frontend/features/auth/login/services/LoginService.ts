import axiosInstance from "@/shared/lib/axios";
import { LoginPayload, LoginResponse } from "../types/LoginType";

export const loginUser = async (
  payload: LoginPayload
): Promise<LoginResponse<null>> => {
  const res = await axiosInstance.post<LoginResponse<null>>(
    "/auth/login",
    payload
  );
  return res.data;
};

export const getCaptcha = async (
  email?: string
): Promise<{
  captchaId?: string;
  captchaImage?: string;
  lockInfo?: {
    locked: boolean;
    lockUntil?: number;
    lockReason?: string;
    lockCount?: number;
  };
}> => {
  const res = await axiosInstance.post("/auth/captcha", { email });
  // Backend trả về data hoặc lockInfo
  return {
    captchaId: res.data.data?.captchaId,
    captchaImage: res.data.data?.captchaImage,
    lockInfo: res.data.lockInfo,
  };
};
