import { initializeDatabase } from './app/lib/db/init';

async function init() {
  await initializeDatabase();
  console.log('Database initialized');
  process.exit(0);
}

init().catch(console.error);