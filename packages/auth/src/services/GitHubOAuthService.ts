import axios from 'axios';
import { UserModel, User } from '@flowsync/database';

export interface GitHubUser {
  id: number;
  login: string;
  email?: string;
  avatar_url?: string;
}

export class GitHubOAuthService {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;

  constructor() {
    this.clientId = process.env.GITHUB_CLIENT_ID || '';
    this.clientSecret = process.env.GITHUB_CLIENT_SECRET || '';
    this.redirectUri = process.env.GITHUB_REDIRECT_URI || 'http://localhost:5173/auth/callback';
  }

  /**
   * Generate the GitHub OAuth URL for authentication
   */
  getAuthorizationUrl(): string {
    const scope = 'user:email';
    return `https://github.com/login/oauth/authorize?client_id=${this.clientId}&redirect_uri=${this.redirectUri}&scope=${scope}`;
  }

  /**
   * Exchange the authorization code for an access token
   */
  async exchangeCodeForToken(code: string): Promise<string> {
    try {
      const response = await axios.post(
        'https://github.com/login/oauth/access_token',
        {
          client_id: this.clientId,
          client_secret: this.clientSecret,
          code,
          redirect_uri: this.redirectUri,
        },
        {
          headers: {
            Accept: 'application/json',
          },
        }
      );

      if (response.data.error) {
        throw new Error(`GitHub API error: ${response.data.error_description}`);
      }

      return response.data.access_token;
    } catch (error) {
      console.error('Error exchanging code for token:', error);
      throw new Error('Failed to exchange code for token');
    }
  }

  /**
   * Get user information from GitHub using the access token
   */
  async getUserInfo(accessToken: string): Promise<GitHubUser> {
    try {
      const response = await axios.get('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return {
        id: response.data.id,
        login: response.data.login,
        email: response.data.email,
        avatar_url: response.data.avatar_url,
      };
    } catch (error) {
      console.error('Error fetching user info:', error);
      throw new Error('Failed to fetch user information from GitHub');
    }
  }

  /**
   * Handle the OAuth callback and create/update user
   */
  async handleOAuthCallback(code: string): Promise<User> {
    // Exchange code for access token
    const accessToken = await this.exchangeCodeForToken(code);
    
    // Get user information from GitHub
    const githubUser = await this.getUserInfo(accessToken);
    
    // Check if user already exists
    let user = await UserModel.findByGithubId(githubUser.id);
    
    if (user) {
      // Update existing user
      // In a real implementation, we would update the user's information
      return user;
    } else {
      // Create new user
      user = await UserModel.create({
        github_id: githubUser.id,
        username: githubUser.login,
        email: githubUser.email,
        avatar_url: githubUser.avatar_url,
      });
      
      return user;
    }
  }
}