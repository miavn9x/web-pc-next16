import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  // Protect Admin Routes
  if (pathname.startsWith("/wfourtech")) {
    if (!accessToken && !refreshToken) {
      return NextResponse.redirect(
        new URL("/tai-khoan/dang-nhap", request.url)
      );
    }
  }

  // Auth pages (login/register) - Redirect to home if already logged in
  if (
    pathname.startsWith("/tai-khoan/dang-nhap") ||
    pathname.startsWith("/tai-khoan/dang-ky")
  ) {
    if (accessToken || refreshToken) {
      // Optional: Redirect to home or dashboard depending on role?
      // For now, let's just keep them on the page or redirect to home to avoid loops if logic is complex
      // return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/wfourtech/:path*", "/tai-khoan/:path*"],
};
