// Load environment variables from root
import { config } from 'dotenv';
config({ path: '../../../FlowSync/.env' });

import { GitHubOAuthService } from './services/GitHubOAuthService';

async function testGitHubOAuthConfig() {
  try {
    console.log('Testing GitHub OAuth configuration...');
    
    // Check environment variables
    console.log('GITHUB_CLIENT_ID:', process.env.GITHUB_CLIENT_ID ? 'SET' : 'NOT SET');
    console.log('GITHUB_CLIENT_SECRET:', process.env.GITHUB_CLIENT_SECRET ? 'SET' : 'NOT SET');
    console.log('GITHUB_REDIRECT_URI:', process.env.GITHUB_REDIRECT_URI || 'NOT SET');
    
    const oauthService = new GitHubOAuthService();
    
    // Test that client ID and secret are set
    const clientId = (oauthService as any).clientId;
    const clientSecret = (oauthService as any).clientSecret;
    const redirectUri = (oauthService as any).redirectUri;
    
    console.log('Service Client ID:', clientId ? 'SET' : 'NOT SET');
    console.log('Service Client Secret:', clientSecret ? 'SET' : 'NOT SET');
    console.log('Service Redirect URI:', redirectUri);
    
    // Test authorization URL generation
    const authUrl = oauthService.getAuthorizationUrl();
    console.log('Authorization URL:', authUrl);
    
    console.log('GitHub OAuth configuration test completed');
  } catch (error) {
    console.error('GitHub OAuth configuration test failed:', error);
  }
}

testGitHubOAuthConfig();