import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const uid = request.cookies.get("uid")?.value;
  const role = request.cookies.get("role")?.value;

  // Allow auth routes
  if (pathname.startsWith("/auth")) {
    return NextResponse.next();
  }

  // Not logged in
  if (!uid || !role) {
    return NextResponse.redirect(
      new URL("/auth/login", request.url)
    );
  }

  // Role guards
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

export const config = {
  matcher: ["/dashboard/:path*", "/orders/:path*"],
};
