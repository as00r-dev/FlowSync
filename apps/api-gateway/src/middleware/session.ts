import session from 'express-session';
import { pool } from '@flowsync/database';

// Session store using PostgreSQL
class PostgreSQLStore extends session.Store {
  async get(sid: string, callback: (err: any, session?: session.SessionData | null) => void) {
    try {
      const client = await pool.connect();
      try {
        const result = await client.query(
          'SELECT sess FROM sessions WHERE sid = $1 AND expire > NOW()',
          [sid]
        );
        
        if (result.rows.length > 0) {
          callback(null, result.rows[0].sess);
        } else {
          callback(null, null);
        }
      } finally {
        client.release();
      }
    } catch (error) {
      callback(error);
    }
  }

  async set(sid: string, session: session.SessionData, callback?: (err?: any) => void) {
    try {
      const client = await pool.connect();
      try {
        // Calculate expiration time (30 days from now)
        const expire = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        
        await client.query(
          `INSERT INTO sessions (sid, sess, expire)
           VALUES ($1, $2, $3)
           ON CONFLICT (sid) DO UPDATE
           SET sess = $2, expire = $3`,
          [sid, session, expire]
        );
        
        callback && callback();
      } finally {
        client.release();
      }
    } catch (error) {
      callback && callback(error);
    }
  }

  async destroy(sid: string, callback?: (err?: any) => void) {
    try {
      const client = await pool.connect();
      try {
        await client.query('DELETE FROM sessions WHERE sid = $1', [sid]);
        callback && callback();
      } finally {
        client.release();
      }
    } catch (error) {
      callback && callback(error);
    }
  }
}

// Create session middleware
export const sessionMiddleware = session({
  store: new PostgreSQLStore(),
  secret: process.env.SESSION_SECRET || 'flowsync-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  },
});