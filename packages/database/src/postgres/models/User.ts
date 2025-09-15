import { pool } from './client';

export interface User {
  id?: number;
  github_id: number;
  username: string;
  email?: string;
  avatar_url?: string;
  created_at?: Date;
  updated_at?: Date;
}

export class UserModel {
  static async create(userData: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `INSERT INTO users (github_id, username, email, avatar_url)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [userData.github_id, userData.username, userData.email, userData.avatar_url]
      );
      
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  static async findByGithubId(githubId: number): Promise<User | null> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM users WHERE github_id = $1',
        [githubId]
      );
      
      return result.rows.length > 0 ? result.rows[0] : null;
    } finally {
      client.release();
    }
  }

  static async findByUsername(username: string): Promise<User | null> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM users WHERE username = $1',
        [username]
      );
      
      return result.rows.length > 0 ? result.rows[0] : null;
    } finally {
      client.release();
    }
  }
}