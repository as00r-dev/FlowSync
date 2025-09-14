// Logout API route
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { SessionManager } from '@/app/lib/session';

export async function POST(request: NextRequest) {
  const cookieStore = cookies();
  const sessionId = cookieStore.get('session_id')?.value;
  
  if (sessionId) {
    await SessionManager.deleteSession(sessionId);
  }
  
  const response = new Response(null, {
    status: 302,
    headers: {
      'Location': '/',
    }
  });
  
  response.cookies.delete('session_id');
  
  return response;
}