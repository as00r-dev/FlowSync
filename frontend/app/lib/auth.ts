// Utility function to get current user from session
import { cookies } from 'next/headers';
import { SessionManager } from './session';
import { UserModel } from './db/user';

export async function getCurrentUser() {
  const cookieStore = cookies();
  const sessionId = cookieStore.get('session_id')?.value;
  
  if (!sessionId) {
    return null;
  }
  
  const sessionData = await SessionManager.getSession(sessionId);
  
  if (!sessionData) {
    return null;
  }
  
  const user = await UserModel.findById(sessionData.userId);
  
  return user;
}