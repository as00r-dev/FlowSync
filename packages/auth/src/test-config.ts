import { GitHubOAuthService } from './services/GitHubOAuthService';

async function testGitHubOAuthConfig() {
  try {
    console.log('Testing GitHub OAuth configuration...');
    
    const oauthService = new GitHubOAuthService();
    
    // Test that client ID and secret are set
    const clientId = (oauthService as any).clientId;
    const clientSecret = (oauthService as any).clientSecret;
    const redirectUri = (oauthService as any).redirectUri;
    
    console.log('Client ID:', clientId ? 'SET' : 'NOT SET');
    console.log('Client Secret:', clientSecret ? 'SET' : 'NOT SET');
    console.log('Redirect URI:', redirectUri);
    
    // Test authorization URL generation
    const authUrl = oauthService.getAuthorizationUrl();
    console.log('Authorization URL:', authUrl);
    
    console.log('GitHub OAuth configuration test completed');
  } catch (error) {
    console.error('GitHub OAuth configuration test failed:', error);
  }
}

testGitHubOAuthConfig();