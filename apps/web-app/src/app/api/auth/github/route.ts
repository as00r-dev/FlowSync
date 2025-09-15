import { NextRequest, NextResponse } from 'next/server'
import { GitHubOAuthService } from '@flowsync/auth'

export async function GET(request: NextRequest) {
  try {
    const oauthService = new GitHubOAuthService()
    const authorizationUrl = oauthService.getAuthorizationUrl()
    return NextResponse.redirect(authorizationUrl)
  } catch (error: any) {
    console.error('Error initiating GitHub OAuth:', error)
    return NextResponse.json({ error: 'Failed to initiate GitHub OAuth', details: error.message }, { status: 500 })
  }
}