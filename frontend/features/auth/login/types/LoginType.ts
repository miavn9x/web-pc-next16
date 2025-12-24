export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse<T = any> {
  message: string;
  data: T | null;
  errorCode: string | null;
}
