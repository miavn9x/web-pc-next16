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

export const getCaptcha = async (): Promise<{
  captchaId: string;
  captchaImage: string;
}> => {
  const res = await axiosInstance.post("/auth/captcha");
  return res.data.data;
};
