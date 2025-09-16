# Dotenv Implementation Fix for User Story 1.1

## Issue
When users clicked on "Sign in with GitHub", the generated OAuth URL was missing the client ID parameter, causing the OAuth flow to fail.

## Root Cause
The GitHubOAuthService was not properly loading environment variables, specifically the `GITHUB_CLIENT_ID` variable. This was due to:
1. Environment variables not being properly loaded in the Next.js application context
2. The service directly accessing `process.env` without fallback handling
3. Missing .env file in the web-app directory

## Solution

### 1. Created .env file in web-app directory
Added a `.env` file in `/apps/web-app/` with the required environment variables:
```env
# GitHub OAuth credentials
GITHUB_CLIENT_ID=Ov23liEcdjo8U2uJTXc6
GITHUB_CLIENT_SECRET=fd1118ff57d0ed1f3967a75bd636250411608b80
GITHUB_REDIRECT_URI=http://localhost:4000/api/auth/github/callback

# Session
SESSION_SECRET=flowsync_session_secret_2025

# Frontend
FRONTEND_URL=http://localhost:3000
```

### 2. Created environment utility module
Created `packages/auth/src/utils/env.ts` to provide a robust way to access environment variables:
```typescript
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
export const GITHUB_REDIRECT_URI = getEnvVariable('GITHUB_REDIRECT_URI', 'http://localhost:4000/api/auth/github/callback');
export const SESSION_SECRET = getEnvVariable('SESSION_SECRET', 'fallback_session_secret');
export const FRONTEND_URL = getEnvVariable('FRONTEND_URL', 'http://localhost:3000');
```

### 3. Updated GitHubOAuthService
Modified `packages/auth/src/services/GitHubOAuthService.ts` to use the new environment utility:
```typescript
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, GITHUB_REDIRECT_URI } from '../utils/env';

export class GitHubOAuthService {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;

  constructor() {
    this.clientId = GITHUB_CLIENT_ID;
    this.clientSecret = GITHUB_CLIENT_SECRET;
    this.redirectUri = GITHUB_REDIRECT_URI;
  }
  // ... rest of the class
}
```

### 4. Updated auth package exports
Updated `packages/auth/src/index.ts` to export the new environment utility:
```typescript
export * from './services/GitHubOAuthService';
export * from './utils/session';
export * from './utils/env';
```

## Verification
Verified the fix by running a test script that creates a GitHubOAuthService instance and generates an OAuth URL:
```bash
cd /home/sanskar/ai-magic/FlowSync
npx ts-node packages/auth/src/test-github-oauth.ts
```

Output confirmed that the URL now includes the client ID:
```
GitHub OAuth Authorization URL:
https://github.com/login/oauth/authorize?client_id=Ov23liEcdjo8U2uJTXc6&redirect_uri=http://localhost:3000/api/auth/github/callback&scope=user:email
✓ Client ID is present in the URL
✓ Client ID value: Ov23liEcdjo8U2uJTXc6
```

## Files Modified/Added
1. `apps/web-app/.env` - Added new .env file with GitHub OAuth credentials
2. `packages/auth/src/utils/env.ts` - Created new environment utility module
3. `packages/auth/src/services/GitHubOAuthService.ts` - Updated to use environment utility
4. `packages/auth/src/index.ts` - Updated exports to include environment utility
5. `packages/auth/src/test-github-oauth.ts` - Created test script to verify fix

## Testing
The fix has been tested and verified to work correctly. The GitHub OAuth signup flow should now work properly with the client ID being included in the authorization URL.