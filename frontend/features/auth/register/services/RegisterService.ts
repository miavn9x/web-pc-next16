// --- 📦 RegisterService: Gửi yêu cầu đăng ký người dùng mới ---
import axiosInstance from "@/shared/lib/axios";
import { RegisterPayload, RegisterResponse } from "../types/RegisterTypes";

export async function register(
  payload: RegisterPayload
): Promise<RegisterResponse> {
  const res = await axiosInstance.post<RegisterResponse>(
    "/auth/register",
    payload
  );

  return res.data;
}
