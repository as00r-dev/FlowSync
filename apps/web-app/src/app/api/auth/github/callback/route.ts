import { NextRequest, NextResponse } from 'next/server'
import { GitHubOAuthService } from '@flowsync/auth'
import { createSession } from '@flowsync/auth'

// Force the use of Node.js runtime instead of edge runtime
export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    
    if (!code) {
      return NextResponse.json({ error: 'Missing authorization code' }, { status: 400 })
    }
    
    // Handle the OAuth callback
    const oauthService = new GitHubOAuthService()
    const user = await oauthService.handleOAuthCallback(code)
    
    // Create a session for the user
    const session = await createSession(user.id!)
    
    // Redirect to the dashboard with session cookie
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000'
    const response = NextResponse.redirect(`${frontendUrl}/dashboard`)
    response.cookies.set('sessionId', session.sid, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/'
    })
    
    return response
  } catch (error: any) {
    console.error('Error handling GitHub OAuth callback:', error)
    
    // Redirect to frontend with error parameter
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000'
    const errorMessage = encodeURIComponent(error.message || 'Unknown error')
    return NextResponse.redirect(`${frontendUrl}?error=oauth_failed&message=${errorMessage}`)
  }
}