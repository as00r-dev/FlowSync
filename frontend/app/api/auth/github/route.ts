// GitHub OAuth initiation route
import { NextRequest } from 'next/server';
import { config } from '@/app/lib/config';

export async function GET(request: NextRequest) {
  const githubAuthURL = `https://github.com/login/oauth/authorize?client_id=${config.github.clientID}&redirect_uri=${config.github.callbackURL}&scope=user:email`;
  
  return Response.redirect(githubAuthURL);
}