import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // For demo purposes, we'll allow access to sign-in and static assets
  const publicPaths = ["/sign-in"]
  const isPublicPath = publicPaths.some((path) => request.nextUrl.pathname.startsWith(path))

  // For demo purposes, we'll consider the user authenticated if they're not on a public path
  const isAuthenticated = !isPublicPath

  // If the user is not authenticated and trying to access a protected route,
  // redirect them to the sign-in page
  if (!isAuthenticated && !isPublicPath) {
    return NextResponse.redirect(new URL("/sign-in", request.url))
  }

  // If the user is authenticated and trying to access the sign-in page,
  // redirect them to the home page
  if (isAuthenticated && isPublicPath) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}

