import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  /* ================= PUBLIC ROUTES ================= */

  // ✅ Allow anyone to track a package (NO LOGIN)
  if (pathname === "/track") {
    return NextResponse.next();
  }

  // ✅ Allow auth pages
  if (pathname.startsWith("/auth")) {
    return NextResponse.next();
  }

  /* ================= AUTH CHECK ================= */

  const uid = request.cookies.get("uid")?.value;
  const role = request.cookies.get("role")?.value;

  // ❌ Not logged in
  if (!uid || !role) {
    return NextResponse.redirect(
      new URL("/auth/login", request.url)
    );
  }

  /* ================= ROLE GUARDS ================= */

  if (pathname.startsWith("/dashboard/admin") && role !== "admin") {
    return NextResponse.redirect(
      new URL("/unauthorized", request.url)
    );
  }

  if (pathname.startsWith("/dashboard/rider") && role !== "rider") {
    return NextResponse.redirect(
      new URL("/unauthorized", request.url)
    );
  }

  if (
    pathname.startsWith("/dashboard/customer") &&
    role !== "customer"
  ) {
    return NextResponse.redirect(
      new URL("/unauthorized", request.url)
    );
  }

  return NextResponse.next();
}

/* ================= MATCHER ================= */

export const config = {
  matcher: [
    "/track",
    "/auth/:path*",
    "/dashboard/:path*",
  ],
};
