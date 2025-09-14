// GitHub OAuth callback route
import { NextRequest } from 'next/server';
import { config } from '@/app/lib/config';
import { UserModel } from '@/app/lib/db/user';
import { SessionManager } from '@/app/lib/session';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  
  if (!code) {
    return new Response('Authorization code not found', { status: 400 });
  }
  
  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        client_id: config.github.clientID,
        client_secret: config.github.clientSecret,
        code: code,
        redirect_uri: config.github.callbackURL
      })
    });
    
    const tokenData = await tokenResponse.json();
    
    if (!tokenData.access_token) {
      return new Response('Failed to obtain access token', { status: 400 });
    }
    
    // Fetch user data from GitHub
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `token ${tokenData.access_token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    
    const githubUser = await userResponse.json();
    
    // Fetch user emails from GitHub
    const emailsResponse = await fetch('https://api.github.com/user/emails', {
      headers: {
        'Authorization': `token ${tokenData.access_token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    
    const emails = await emailsResponse.json();
    const primaryEmail = emails.find((email: any) => email.primary)?.email || null;
    
    // Check if user already exists in database
    let user = await UserModel.findByGithubId(githubUser.id);
    
    if (user) {
      // User exists, update their information
      user = await UserModel.update(user.id, {
        username: githubUser.login,
        email: primaryEmail,
        avatar_url: githubUser.avatar_url,
        name: githubUser.name,
        bio: githubUser.bio,
        location: githubUser.location,
        company: githubUser.company
      });
    } else {
      // User doesn't exist, create new user
      user = await UserModel.create({
        github_id: githubUser.id,
        username: githubUser.login,
        email: primaryEmail,
        avatar_url: githubUser.avatar_url,
        name: githubUser.name,
        bio: githubUser.bio,
        location: githubUser.location,
        company: githubUser.company
      });
    }
    
    // Create session for user
    const sessionId = await SessionManager.createSession(user.id);
    
    // Set cookie with session ID
    const response = new Response(null, {
      status: 302,
      headers: {
        'Location': '/dashboard',
      }
    });
    
    response.cookies.set('session_id', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });
    
    return response;
  } catch (error) {
    console.error('Error during GitHub OAuth callback:', error);
    return new Response('Authentication failed', { status: 500 });
  }
}