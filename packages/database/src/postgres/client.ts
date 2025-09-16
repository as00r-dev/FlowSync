import { Pool, PoolConfig } from 'pg';

// Database configuration
const config: PoolConfig = {
  user: process.env.POSTGRES_USER || 'flowsync',
  password: process.env.POSTGRES_PASSWORD || 'flowsync',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
  database: process.env.POSTGRES_DB || 'flowsync_dev',
};

// Create a PostgreSQL connection pool
export const pool = new Pool(config);

// Initialize the database schema
export async function initializeDatabase() {
  const client = await pool.connect();
  try {
    // Create users table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        github_id INTEGER UNIQUE NOT NULL,
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255),
        avatar_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create sessions table for session management
    await client.query(`
      CREATE TABLE IF NOT EXISTS sessions (
        sid VARCHAR(128) PRIMARY KEY,
        sess JSON NOT NULL,
        expire TIMESTAMP(6) WITH TIME ZONE NOT NULL
      )
    `);
    
    // Create indexes
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_users_github_id ON users(github_id);
      CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
      CREATE INDEX IF NOT EXISTS idx_sessions_expire ON sessions(expire);
    `);
    
    console.log('Database initialized successfully');
  } finally {
    client.release();
  }
}