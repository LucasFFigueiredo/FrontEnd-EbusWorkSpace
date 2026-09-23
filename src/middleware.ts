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
      const payloadBase64Url = token.split(".")[1];
      const base64 = payloadBase64Url.replace(/-/g, "+").replace(/_/g, "/");
      const decodedJson = Buffer.from(base64, "base64").toString("utf-8");
      JSON.parse(decodedJson); // Just validate it's JSON
    } catch (error) {
      console.error("[Middleware] Erro ao decodificar JWT:", error);

      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("ebus_token");
      return response;
    }
  }

  const response = NextResponse.next();

  if (request.cookies.has("ebus_sector_updated")) {
    response.cookies.delete("ebus_sector_updated");
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};