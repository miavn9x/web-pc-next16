import { Response } from 'express';

// --- 🍪 Thiết lập cookie chứa accessToken và refreshToken ---
export function setAuthCookies(
  res: Response,
  tokens: { accessToken?: string; refreshToken?: string },
  accessMaxAge: number,
  refreshMaxAge: number,
) {
  // Kiểm tra môi trường
  const isProd = process.env.NODE_ENV === 'production';

  // Cho phép dev dùng HTTPS (Tunnel) bằng cách set biến môi trường
  const forceSecure = process.env.FORCE_SECURE_COOKIE === 'true';

  // Tự động bật secure nếu:
  // 1. Đang ở Production, HOẶC
  // 2. Dev tự set FORCE_SECURE_COOKIE=true (khi dùng Tunnel)
  const useSecure = isProd || forceSecure;

  // SameSite: 'none' cần khi secure=true và cross-origin
  const sameSiteValue = useSecure ? 'none' : 'lax';

  if (tokens.refreshToken) {
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: useSecure,
      sameSite: sameSiteValue,
      maxAge: refreshMaxAge,
    });
  }

  if (tokens.accessToken) {
    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: useSecure,
      sameSite: sameSiteValue,
      maxAge: accessMaxAge,
    });
  }
}
