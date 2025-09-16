import { pool, initializeDatabase } from './postgres';

async function testDatabase() {
  try {
    console.log('Testing database connection...');
    
    // Initialize database schema
    await initializeDatabase();
    
    // Test connection
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT NOW()');
      console.log('Database connection successful:', result.rows[0].now);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Database connection failed:', error);
  }
}

testDatabase();