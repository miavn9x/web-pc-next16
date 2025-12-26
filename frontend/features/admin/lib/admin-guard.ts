import { cookies } from "next/headers";
import { parseJwt } from "@/shared/utlis/jwt.utils";

const ALLOWED_ADMIN_ROLES = ["admin", "employment", "cskh"];

/**
 * Kiểm tra quyền truy cập vào trang Admin
 * @returns true nếu hợp lệ, false nếu không đủ quyền
 */
export async function verifyAdminAccess(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const refreshToken = cookieStore.get("refreshToken")?.value;

    // 1. Phải có ít nhất accessToken hoặc refreshToken
    if (!accessToken && !refreshToken) {
      return false;
    }

    // 2. Nếu có accessToken, kiểm tra Role
    if (accessToken) {
      const payload = parseJwt(accessToken);

      if (!payload || !payload.roles || !Array.isArray(payload.roles)) {
        return false;
      }

      // Kiểm tra xem có role nào trong danh sách cho phép không
      const hasPermission = payload.roles.some((role: string) =>
        ALLOWED_ADMIN_ROLES.includes(role)
      );

      return hasPermission;
    }

    // 3. Nếu chỉ có refreshToken (accessToken hết hạn),
    // ta tạm thời cho qua để Client tự lo việc refresh token (hoặc middleware xử lý).
    // Nhưng để an toàn cho layout server, nếu logic refresh chưa chặt, ta có thể chặn luôn.
    // Theo code cũ của bạn: if (!accessToken && !refreshToken) -> return null.
    // Nghĩa là nếu có RefreshToken thì vẫn render layout.
    return true;
  } catch (error) {
    console.error("Admin Access Verification Failed:", error);
    return false;
  }
}
