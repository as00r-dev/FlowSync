import axios from 'axios';
import { UserModel, User } from '@flowsync/database';
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, GITHUB_REDIRECT_URI } from '../utils/env';

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
    this.clientId = GITHUB_CLIENT_ID;
    this.clientSecret = GITHUB_CLIENT_SECRET;
    this.redirectUri = GITHUB_REDIRECT_URI;
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

      console.log('GitHub exchangeCodeForToken response:', response.data);

      if (response.data.error) {
        throw new Error(`GitHub API error: ${response.data.error_description}`);
      }

      return response.data.access_token;
    } catch (error: any) {
      console.error('Error exchanging code for token:', error);
      
      // Handle specific error cases
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        throw new Error(`GitHub API error: ${error.response.status} - ${error.response.statusText}`);
      } else if (error.request) {
        // The request was made but no response was received
        throw new Error('No response received from GitHub API');
      } else {
        // Something happened in setting up the request that triggered an Error
        throw new Error(`Error setting up request: ${error.message}`);
      }
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

      console.log('GitHub getUserInfo response:', response.data);
      console.log('Access token used for getUserInfo:', accessToken);

      return {
        id: response.data.id,
        login: response.data.login,
        email: response.data.email,
        avatar_url: response.data.avatar_url,
      };
    } catch (error: any) {
      console.error('Error fetching user info:', error);
      
      // Handle specific error cases
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (error.response.status === 401) {
          throw new Error('Invalid access token');
        } else if (error.response.status === 403) {
          throw new Error('Access to GitHub API forbidden');
        }
        throw new Error(`GitHub API error: ${error.response.status} - ${error.response.statusText}`);
      } else if (error.request) {
        // The request was made but no response was received
        throw new Error('No response received from GitHub API');
      } else {
        // Something happened in setting up the request that triggered an Error
        throw new Error(`Error setting up request: ${error.message}`);
      }
    }
  }

  /**
   * Handle the OAuth callback and create/update user
   */
  async handleOAuthCallback(code: string): Promise<User> {
    try {
      // Exchange code for access token
      const accessToken = await this.exchangeCodeForToken(code);
      
      // Get user information from GitHub
      const githubUser = await this.getUserInfo(accessToken);
      console.log('GitHub User Info:', githubUser);

      // Check if user already exists
      let user = await UserModel.findByGithubId(githubUser.id);
      console.log('User from DB (findByGithubId):', user);

      if (user) {
        // Update existing user
        // In a real implementation, we would update the user's information
        return user;
      } else {
        // Create new user
        try {
          user = await UserModel.create({
            github_id: githubUser.id,
            username: githubUser.login,
            email: githubUser.email,
            avatar_url: githubUser.avatar_url,
          });
          console.log('New User Created:', user);
        } catch (dbError) {
          console.error('Error creating user in database:', dbError);
          throw dbError; // Re-throw to propagate
        }

        return user;
      }
    } catch (error) {
      console.error('Error handling OAuth callback:', error);
      throw error;
    }
  }
}