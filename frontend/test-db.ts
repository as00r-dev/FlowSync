// Test database connection and initialization
import { initializeDatabase } from './app/lib/db/init';
import pool from './app/lib/db/connection';

async function test() {
  try {
    // Test database connection
    const result = await pool.query('SELECT NOW()');
    console.log('Database connection successful:', result.rows[0]);
    
    // Initialize database tables
    await initializeDatabase();
    console.log('Database initialization completed');
    
    // Close the pool
    await pool.end();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

test();