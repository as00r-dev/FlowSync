// User model
import pool from './connection';

export interface User {
  id: number;
  github_id: number;
  username: string;
  email: string | null;
  avatar_url: string | null;
  name: string | null;
  bio: string | null;
  location: string | null;
  company: string | null;
  created_at: Date;
  updated_at: Date;
}

export class UserModel {
  // Create the users table
  static async createTable(): Promise<void> {
    const query = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        github_id BIGINT UNIQUE NOT NULL,
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE,
        avatar_url TEXT,
        name VARCHAR(255),
        bio TEXT,
        location VARCHAR(255),
        company VARCHAR(255),
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    try {
      await pool.query(query);
      console.log('Users table created successfully');
    } catch (err) {
      console.error('Error creating users table:', err);
      throw err;
    }
  }

  // Find user by GitHub ID
  static async findByGithubId(githubId: number): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE github_id = $1';
    const result = await pool.query(query, [githubId]);
    return result.rows[0] || null;
  }

  // Find user by ID
  static async findById(id: number): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  // Create a new user
  static async create(userData: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
    const query = `
      INSERT INTO users (github_id, username, email, avatar_url, name, bio, location, company)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    
    const values = [
      userData.github_id,
      userData.username,
      userData.email,
      userData.avatar_url,
      userData.name,
      userData.bio,
      userData.location,
      userData.company
    ];
    
    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (err) {
      console.error('Error creating user:', err);
      throw err;
    }
  }

  // Update user information
  static async update(id: number, userData: Partial<Omit<User, 'id' | 'github_id' | 'created_at' | 'updated_at'>>): Promise<User> {
    const query = `
      UPDATE users 
      SET username = $1, email = $2, avatar_url = $3, name = $4, bio = $5, location = $6, company = $7, updated_at = CURRENT_TIMESTAMP
      WHERE id = $8
      RETURNING *
    `;
    
    const values = [
      userData.username,
      userData.email,
      userData.avatar_url,
      userData.name,
      userData.bio,
      userData.location,
      userData.company,
      id
    ];
    
    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (err) {
      console.error('Error updating user:', err);
      throw err;
    }
  }
}