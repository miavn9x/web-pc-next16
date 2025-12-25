import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { parseJwt } from "./shared/utlis/jwt.utils";

export default function proxy(request: NextRequest) {
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
    // console.log("[PROXY DEBUG] Accessing /wfourtech");
    // console.log(
    //   "[PROXY DEBUG] accessToken:",
    //   accessToken ? "EXISTS" : "MISSING"
    // );
    // console.log(
    //   "[PROXY DEBUG] refreshToken:",
    //   refreshToken ? "EXISTS" : "MISSING"
    // );

    if (!accessToken) {
      // console.log("[PROXY DEBUG] No accessToken, checking refreshToken...");
      // If no access token but refresh token exists, let client handle refresh
      if (refreshToken) {
        // console.log("[PROXY DEBUG] Has refreshToken, allowing through");
        return NextResponse.next();
      }
      // console.log("[PROXY DEBUG] No tokens, redirecting to home");
      return handleUnauthorized();
    }

    try {
      const payload = parseJwt(accessToken);
      // console.log("[PROXY DEBUG] JWT Payload:", payload);
      const allowedRoles = ["admin", "employment", "cskh"];

      // Check if user has at least one required role
      const hasRole =
        payload.roles &&
        Array.isArray(payload.roles) &&
        payload.roles.some((role: string) => allowedRoles.includes(role));

      // console.log("[PROXY DEBUG] Has required role:", hasRole);

      if (!hasRole) {
        // console.log("[PROXY DEBUG] Role check failed, redirecting");
        return handleUnauthorized();
      }

      // console.log("[PROXY DEBUG] All checks passed, allowing access");
    } catch (e) {
      // console.error("[PROXY DEBUG] JWT parse error:", e);
      return handleUnauthorized();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/wfourtech/:path*"],
};
