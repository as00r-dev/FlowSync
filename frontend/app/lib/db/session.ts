// Session model
import pool from './connection';

export interface Session {
  id: string;
  user_id: number;
  created_at: Date;
  last_accessed_at: Date;
  expires_at: Date;
  ip_address: string | null;
  user_agent: string | null;
}

export class SessionModel {
  // Create the sessions table
  static async createTable(): Promise<void> {
    const query = `
      CREATE TABLE IF NOT EXISTS sessions (
        id VARCHAR(128) PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        last_accessed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP NOT NULL,
        ip_address VARCHAR(45),
        user_agent TEXT
      )
    `;
    
    try {
      await pool.query(query);
      console.log('Sessions table created successfully');
    } catch (err) {
      console.error('Error creating sessions table:', err);
      throw err;
    }
  }

  // Create a new session
  static async create(sessionData: Omit<Session, 'created_at' | 'last_accessed_at'>): Promise<Session> {
    const query = `
      INSERT INTO sessions (id, user_id, expires_at, ip_address, user_agent)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    
    const values = [
      sessionData.id,
      sessionData.user_id,
      sessionData.expires_at,
      sessionData.ip_address,
      sessionData.user_agent
    ];
    
    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (err) {
      console.error('Error creating session:', err);
      throw err;
    }
  }

  // Find session by ID
  static async findById(id: string): Promise<Session | null> {
    const query = 'SELECT * FROM sessions WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  // Update last accessed time
  static async updateLastAccessed(id: string): Promise<Session | null> {
    const query = `
      UPDATE sessions 
      SET last_accessed_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;
    
    try {
      const result = await pool.query(query, [id]);
      return result.rows[0] || null;
    } catch (err) {
      console.error('Error updating session last accessed time:', err);
      throw err;
    }
  }

  // Delete session
  static async delete(id: string): Promise<void> {
    const query = 'DELETE FROM sessions WHERE id = $1';
    await pool.query(query, [id]);
  }

  // Delete expired sessions
  static async deleteExpired(): Promise<number> {
    const query = 'DELETE FROM sessions WHERE expires_at < CURRENT_TIMESTAMP';
    const result = await pool.query(query);
    return result.rowCount;
  }
}