// Session management utility for Next.js
import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';
import { SessionModel } from './db/session';

export interface SessionData {
  userId: number;
  expiresAt: Date;
}

export class SessionManager {
  static async createSession(userId: number): Promise<string> {
    const sessionId = uuidv4();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    
    await SessionModel.create({
      id: sessionId,
      user_id: userId,
      expires_at: expiresAt,
      ip_address: null, // TODO: Get IP address
      user_agent: null  // TODO: Get user agent
    });
    
    return sessionId;
  }
  
  static async getSession(sessionId: string): Promise<SessionData | null> {
    const session = await SessionModel.findById(sessionId);
    
    if (!session) {
      return null;
    }
    
    // Check if session has expired
    if (session.expires_at < new Date()) {
      await SessionModel.delete(sessionId);
      return null;
    }
    
    // Update last accessed time
    await SessionModel.updateLastAccessed(sessionId);
    
    return {
      userId: session.user_id,
      expiresAt: session.expires_at
    };
  }
  
  static async deleteSession(sessionId: string): Promise<void> {
    await SessionModel.delete(sessionId);
  }
}