import { GitHubOAuthService } from './services/GitHubOAuthService';

async function testGitHubOAuth() {
  try {
    console.log('Testing GitHub OAuth service...');
    
    const oauthService = new GitHubOAuthService();
    
    // Test authorization URL generation
    const authUrl = oauthService.getAuthorizationUrl();
    console.log('Authorization URL:', authUrl);
    
    console.log('GitHub OAuth service test completed successfully');
  } catch (error) {
    console.error('GitHub OAuth service test failed:', error);
  }
}

testGitHubOAuth();