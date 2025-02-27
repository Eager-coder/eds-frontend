import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // For demonstration purposes only
  // In a real application, you would verify the token on the server
  // This is just a simple example to show the concept

  // Skip middleware for login page and API routes
  if (
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/api")
  ) {
    return NextResponse.next();
  }

  // Check for authentication cookie/token
  // In a real app, you'd verify a JWT token or session cookie
  const isAuthenticated = request.cookies.get("isAuthenticated")?.value === "true";

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
