import { NextResponse } from "next/server";

export function middleware(req) {
  const userId = req.cookies.get("user_id")?.value;
  const role = req.cookies.get("role")?.value;
  const { pathname } = req.nextUrl;

  const isLoggedIn = Boolean(userId);

  if (pathname.startsWith("/admin")) {
    if (!isLoggedIn || role !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/profil") && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isLoggedIn && (pathname === "/login" || pathname === "/sign-up")) {
    return NextResponse.redirect(new URL("/profil", req.url));
  }

  return NextResponse.next();
}