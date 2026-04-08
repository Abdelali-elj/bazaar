import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtectedRoute = pathname.startsWith("/dashboard");

  // 1. Quick bypass for non-protected routes
  if (!isProtectedRoute) {
    return NextResponse.next({ request });
  }

  // 2. Demo Bypass - Fast path for admin testing
  const demoEmail = request.cookies.get("demo_user_email")?.value;
  if (demoEmail === "admin@gmail.com" || (demoEmail && demoEmail.endsWith("@bazaarstyle.ma"))) {
    return NextResponse.next({ request });
  }

  // 3. Firebase Session Cookie verification
  const sessionCookie = request.cookies.get("session")?.value;
  if (!sessionCookie) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  // If session cookie exists we allow through (full token verification in server actions)
  return NextResponse.next({ request });
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
