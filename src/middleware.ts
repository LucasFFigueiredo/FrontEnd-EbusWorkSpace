import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicRoutes = ["/login", "/api/auth/login", "/api/auth/logout"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get("ebus_token")?.value;
  const isPublicRoute = publicRoutes.includes(pathname);

  if (!token && !isPublicRoute) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("returnUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (token && pathname === "/login") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (token) {
    try {
      const payloadBase64 = token.split(".")[1];
      const decodedJson = Buffer.from(payloadBase64, "base64").toString("utf-8");
      const decoded = JSON.parse(decodedJson);

      const hasSectorInToken = !!decoded.sector;
      const hasSectorUpdatedCookie = request.cookies.has("ebus_sector_updated");
      const hasSector = hasSectorInToken || hasSectorUpdatedCookie;

      if (!hasSector && pathname !== "/select-department" && !pathname.startsWith("/api/")) {
        return NextResponse.redirect(new URL("/select-department", request.url));
      }

      if (hasSector && pathname === "/select-department") {
        return NextResponse.redirect(new URL("/", request.url));
      }
    } catch (error) {
      console.error("[Middleware] Erro ao decodificar JWT:", error);

      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("ebus_token");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
