import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { parseJwt } from "./shared/utlis/jwt.utils";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  // Function to handle unauthorized access
  const handleUnauthorized = () => {
    const url = new URL("/", request.url);
    const response = NextResponse.redirect(url);
    // Set a short-lived cookie to signal the client to open the login modal
    response.cookies.set("auth_modal_trigger", "login", {
      path: "/",
      maxAge: 10, // 10 seconds is enough for the client to read it after redirect
      sameSite: "lax",
    });
    return response;
  };

  // Protect Admin Routes
  if (pathname.startsWith("/wfourtech")) {
    if (!accessToken) {
      // If no access token but refresh token exists, let client handle refresh
      if (refreshToken) {
        return NextResponse.next();
      }
      return handleUnauthorized();
    }

    try {
      const payload = parseJwt(accessToken);
      const allowedRoles = ["admin", "employment", "cskh"];

      // Check if user has at least one required role
      const hasRole =
        payload.roles &&
        Array.isArray(payload.roles) &&
        payload.roles.some((role: string) => allowedRoles.includes(role));

      if (!hasRole) {
        return handleUnauthorized();
      }
    } catch (e) {
      return handleUnauthorized();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/wfourtech/:path*"],
};
