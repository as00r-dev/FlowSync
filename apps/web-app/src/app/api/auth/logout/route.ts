import { NextRequest, NextResponse } from 'next/server'
import { deleteSession } from '@flowsync/auth'

export async function POST(request: NextRequest) {
  try {
    // Get session ID from cookies
    const sessionId = request.cookies.get('sessionId')?.value;
    
    if (sessionId) {
      // Delete the session
      await deleteSession(sessionId);
    }
    
    // Create response with cookie cleared
    const response = NextResponse.json({ message: 'Logged out successfully' });
    response.cookies.set('sessionId', '', { 
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 0,
      path: '/'
    });
    
    return response;
  } catch (error: any) {
    console.error('Error logging out:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}