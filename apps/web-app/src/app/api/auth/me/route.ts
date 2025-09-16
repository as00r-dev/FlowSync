import { NextRequest, NextResponse } from 'next/server'
import { getUserFromSession } from '@flowsync/auth'

// Force the use of Node.js runtime instead of edge runtime
export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    // Get session ID from cookies
    const sessionId = request.cookies.get('sessionId')?.value;
    
    if (!sessionId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    
    // Get user from session
    const user = await getUserFromSession(sessionId);
    
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    
    return NextResponse.json({ user });
  } catch (error: any) {
    console.error('Error fetching user info:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}