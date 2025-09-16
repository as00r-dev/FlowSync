import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getUserFromSession } from '@flowsync/auth'

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
  
  // For protected paths, check if user is authenticated
  const sessionId = request.cookies.get('sessionId')?.value
  
  if (!sessionId) {
    // Redirect to home page if not authenticated
    return NextResponse.redirect(new URL('/', request.url))
  }
  
  try {
    // Try to get user from session
    const user = await getUserFromSession(sessionId)
    
    if (!user) {
      // If session is invalid, clear the cookie and redirect to home
      const response = NextResponse.redirect(new URL('/', request.url))
      response.cookies.set('sessionId', '', { 
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 0,
        path: '/'
      })
      return response
    }
    
    // User is authenticated, allow the request
    return NextResponse.next()
  } catch (error) {
    console.error('Error checking authentication:', error)
    // Redirect to home page on error
    return NextResponse.redirect(new URL('/', request.url))
  }
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