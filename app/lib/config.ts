// Environment variables configuration
export const config = {
  // GitHub OAuth configuration
  github: {
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL,
  },
  
  // Database configuration
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'flowsync',
    user: process.env.DB_USER || 'flowsync_user',
    password: process.env.DB_PASSWORD || 'flowsync_password',
  },
  
  // Session configuration
  session: {
    secret: process.env.SESSION_SECRET || 'flowsync-secret-key',
  },
};