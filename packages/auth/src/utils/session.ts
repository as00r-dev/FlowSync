import { pool } from '@flowsync/database';
import { User } from '@flowsync/database/src/postgres/models/User';
import { v4 as uuidv4 } from 'uuid';

// Session interface
export interface Session {
  sid: string;
  userId: number;
  expiresAt: Date;
}

// Create a new session
export async function createSession(userId: number): Promise<Session> {
  const client = await pool.connect();
  try {
    // Generate a unique session ID
    const sid = uuidv4();
    
    // Set expiration to 24 hours from now
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    
    // Insert the session into the database
    await client.query(
      'INSERT INTO sessions (sid, sess, expire) VALUES ($1, $2, $3)',
      [sid, JSON.stringify({ userId }), expiresAt]
    );
    
    return {
      sid,
      userId,
      expiresAt
    };
  } finally {
    client.release();
  }
}

// Get session by ID
export async function getSession(sid: string): Promise<Session | null> {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'SELECT sid, sess, expire FROM sessions WHERE sid = $1 AND expire > NOW()',
      [sid]
    );
    
    if (result.rows.length === 0) {
      return null;
    }
    
    const row = result.rows[0];
    return {
      sid: row.sid,
      userId: row.sess.userId,
      expiresAt: row.expire
    };
  } finally {
    client.release();
  }
}

// Delete session by ID
export async function deleteSession(sid: string): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query('DELETE FROM sessions WHERE sid = $1', [sid]);
  } finally {
    client.release();
  }
}

// Get user from session
export async function getUserFromSession(sid: string): Promise<User | null> {
  const session = await getSession(sid);
  if (!session) {
    return null;
  }
  
  const client = await pool.connect();
  try {
    const result = await client.query(
      'SELECT * FROM users WHERE id = $1',
      [session.userId]
    );
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return result.rows[0];
  } finally {
    client.release();
  }
}