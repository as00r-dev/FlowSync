import { GitHubOAuthService } from '@flowsync/auth';

// Test the GitHub OAuth URL generation
const oauthService = new GitHubOAuthService();
const authUrl = oauthService.getAuthorizationUrl();

console.log('GitHub OAuth Authorization URL:');
console.log(authUrl);

// Check if client ID is present
if (authUrl.includes('client_id=')) {
  console.log('✓ Client ID is present in the URL');
} else {
  console.log('✗ Client ID is missing from the URL');
}

// Extract client ID from URL
const clientIdMatch = authUrl.match(/client_id=([^&]*)/);
if (clientIdMatch && clientIdMatch[1]) {
  console.log('✓ Client ID value:', clientIdMatch[1]);
} else {
  console.log('✗ Unable to extract Client ID from URL');
}