// Middleware to protect routes
import { NextRequest, NextFetchEvent } from 'next/server';
import { getCurrentUser } from '@/app/lib/auth';

export async function middleware(request: NextRequest, event: NextFetchEvent) {
  // For now, we'll implement a simple check
  // In a production environment, we would implement more robust session validation
  const sessionId = request.cookies.get('session_id')?.value;
  
  // If accessing the dashboard and no session, redirect to home
  if (request.nextUrl.pathname.startsWith('/dashboard') && !sessionId) {
    return Response.redirect(new URL('/', request.url));
  }
  
  return null;
}

export const config = {
  matcher: ['/dashboard/:path*'],
};