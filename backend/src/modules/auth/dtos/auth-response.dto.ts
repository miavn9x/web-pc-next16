import { LockReason } from '../schemas/account-lock.schema';

export class AuthResponse {
  // --- JWT Access Token ---
  accessToken?: string;

  // --- JWT Refresh Token ---
  refreshToken?: string;

  // --- Gợi ý hành vi xoá cookie từ phía client ---
  shouldClearCookie?: boolean;

  // --- Lock Information (Progressive Lockout) ---
  lockUntil?: number; // Timestamp khi hết khóa
  lockReason?: LockReason; // Lý do khóa (CAPTCHA hoặc PASSWORD)
  lockCount?: number; // Số lần bị lock
}
