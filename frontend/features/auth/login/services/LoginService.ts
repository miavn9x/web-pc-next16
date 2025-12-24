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
