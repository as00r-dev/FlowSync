import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  // List of public paths that don't require authentication
  const publicPaths = [
    '/',
    '/api/auth/github',
    '/api/auth/github/callback',
    '/api/auth/me', // This is accessed by the frontend to check auth status
  ]
  
  // Check if the request is for a public path
  const isPublicPath = publicPaths.some(path => request.nextUrl.pathname === path)
  
  if (isPublicPath) {
    return NextResponse.next()
  }
  
  // For protected paths, check if user is authenticated by checking for sessionId cookie
  const sessionId = request.cookies.get('sessionId')?.value
  
  if (!sessionId) {
    // Redirect to home page if not authenticated
    return NextResponse.redirect(new URL('/', request.url))
  }
  
  // User has a session cookie, allow the request to proceed
  // The actual authentication check will happen in the API routes
  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}