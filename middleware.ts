
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const COOKIE_NAME = process.env.SESSION_COOKIE_NAME || "session";
const PUBLIC_PATHS = ["/login","/api/auth/signin","/api/auth/signout","/api/auth/session","/favicon.ico","/robots.txt","/sitemap.xml"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith("/_next") || pathname.startsWith("/static") || PUBLIC_PATHS.some(p=> pathname===p || pathname.startsWith(p))) {
    return NextResponse.next();
  }
  const hasSession = Boolean(req.cookies.get(COOKIE_NAME)?.value);
  if (!hasSession) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }
  if (hasSession && pathname === "/login") {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"] };
