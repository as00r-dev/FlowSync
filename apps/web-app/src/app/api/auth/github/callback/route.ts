import { NextRequest, NextResponse } from 'next/server'
import { GitHubOAuthService } from '@flowsync/auth'

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
    
    // TODO: Implement session management for Next.js
    // For now, we'll redirect to the home page
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000'
    return NextResponse.redirect(frontendUrl)
  } catch (error: any) {
    console.error('Error handling GitHub OAuth callback:', error)
    
    // Redirect to frontend with error parameter
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000'
    const errorMessage = encodeURIComponent(error.message || 'Unknown error')
    return NextResponse.redirect(`${frontendUrl}?error=oauth_failed&message=${errorMessage}`)
  }
}