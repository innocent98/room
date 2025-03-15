import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Define public paths that don't require authentication
  const publicPaths = [
    "/",
    "/auth/sign-in",
    "/auth/sign-up",
    "/auth/forgot-password",
    "/auth/verify-request",
    "/auth/verify-success",
    "/api/auth",
    "/api/register",
    // "/api/forms",
    // "/form",
    "/help",
    "/privacy",
    "/pricing",
    "/terms",
    "/about",
  ];

  // Check if the path is public
  const isPublicPath = publicPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  // Explicitly check for the form view dynamic route (strict)
  const isFormViewRoute = /^\/form\/[^\/]+\/view$/.test(pathname);
   // Match ONLY /api/forms/{id}/view (strict)
   const isFormsApiViewRoute = /^\/api\/forms\/[^\/]+\/view$/.test(pathname);
   // Match ONLY /api/forms/{id}/responses (strict)
   const isFormsApiResponseRoute = /^\/api\/forms\/[^\/]+\/responses$/.test(pathname);

  // If it's a public path or the form view route, allow access
  if (isPublicPath || isFormViewRoute || isFormsApiViewRoute || isFormsApiResponseRoute) {
    return NextResponse.next();
  }

  // Get the session token
  const token = await getToken({ req: request });

  // If there's no token and the path is not public, redirect to sign-in
  if (!token) {
    const signInUrl = new URL("/auth/sign-in", request.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Allow access to protected routes if authenticated
  return NextResponse.next();
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /_next (Next.js internals)
     * 2. /api/auth (NextAuth.js API routes)
     * 3. /static (public files)
     * 4. /favicon.ico, /robots.txt (static files)
     */
    "/((?!_next|static|favicon.ico|robots.txt).*)",
  ],
};
