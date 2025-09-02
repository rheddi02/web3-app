// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Read session from NextAuth (Google sign-in included)
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Not signed in
  if (!token) {
    if (
      pathname.startsWith("/dashboard") ||
      pathname.startsWith("/admin") ||
      pathname === "/"
    ) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  }

  // Already signed in
  if (pathname === "/login") {
    if (token.role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    } else {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  // Role-based redirects
  if (pathname.startsWith("/admin") && token.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (pathname.startsWith("/dashboard") && token.role === "ADMIN") {
    return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/dashboard/:path*", "/admin/:path*"],
};
