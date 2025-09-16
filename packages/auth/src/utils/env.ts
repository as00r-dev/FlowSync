/**
 * Utility function to get environment variables with fallback values
 * This ensures that environment variables are properly loaded in all environments
 */

export function getEnvVariable(name: string, fallback: string = ''): string {
  // First try to get from process.env
  if (typeof process !== 'undefined' && process.env && process.env[name]) {
    return process.env[name];
  }
  
  // If not found, return the fallback
  return fallback;
}

// Export commonly used environment variables
export const GITHUB_CLIENT_ID = getEnvVariable('GITHUB_CLIENT_ID');
export const GITHUB_CLIENT_SECRET = getEnvVariable('GITHUB_CLIENT_SECRET');
export const GITHUB_REDIRECT_URI = getEnvVariable('GITHUB_REDIRECT_URI', 'http://localhost:4000/auth/github/callback');
export const SESSION_SECRET = getEnvVariable('SESSION_SECRET', 'fallback_session_secret');
export const FRONTEND_URL = getEnvVariable('FRONTEND_URL', 'http://localhost:3000');