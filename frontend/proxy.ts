import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { parseJwt } from "@/shared/utlis/jwt.utils";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  // Protect Admin Routes
  if (pathname.startsWith("/wfourtech")) {
    if (!accessToken) {
      // If no access token but refresh token exists, let client handle refresh
      if (refreshToken) {
        return NextResponse.next();
      }
      // No tokens -> Redirect Home
      return NextResponse.redirect(new URL("/", request.url));
    }

    try {
      const payload = parseJwt(accessToken);
      if (
        !payload.roles ||
        !payload.roles.some((role: string) =>
          ["admin", "employment", "cskh"].includes(role)
        )
      ) {
        // Logged in but not admin -> Redirect Home
        return NextResponse.redirect(new URL("/", request.url));
      }
    } catch (e) {
      // Invalid token -> Redirect Home
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/wfourtech/:path*"],
};
