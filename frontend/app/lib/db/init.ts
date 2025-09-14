// Test database initialization
import { UserModel } from '@/app/lib/db/user';
import { SessionModel } from '@/app/lib/db/session';

export async function initializeDatabase() {
  try {
    await UserModel.createTable();
    await SessionModel.createTable();
    console.log('Database tables created successfully');
  } catch (err) {
    console.error('Error initializing database:', err);
  }
}