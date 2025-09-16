import express from 'express';
import { GitHubOAuthService } from '@flowsync/auth';
import { sessionMiddleware } from '../middleware/session';

const router = express.Router();
const githubOAuthService = new GitHubOAuthService();

// GitHub OAuth initiation route
router.get('/github', (req, res) => {
  try {
    const authorizationUrl = githubOAuthService.getAuthorizationUrl();
    res.redirect(authorizationUrl);
  } catch (error: any) {
    console.error('Error initiating GitHub OAuth:', error);
    res.status(500).json({ error: 'Failed to initiate GitHub OAuth', details: error.message });
  }
});

// GitHub OAuth callback route
router.get('/github/callback', async (req, res) => {
  try {
    const { code } = req.query;
    
    if (!code || typeof code !== 'string') {
      return res.status(400).json({ error: 'Missing authorization code' });
    }
    
    // Handle the OAuth callback
    const user = await githubOAuthService.handleOAuthCallback(code);
    
    // Store user in session
    (req.session as any).userId = user.id;
    (req.session as any).user = user;
    
    // Redirect to frontend app
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(frontendUrl);
  } catch (error: any) {
    console.error('Error handling GitHub OAuth callback:', error);
    
    // Redirect to frontend with error parameter
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(`${frontendUrl}?error=oauth_failed&message=${encodeURIComponent(error.message || 'Unknown error')}`);
  }
});

// Logout route
router.post('/logout', (req, res) => {
  req.session?.destroy(() => {
    // Session destroyed
  });
  res.json({ message: 'Logged out successfully' });
});

// Get current user route
router.get('/me', (req, res) => {
  if (!(req.session as any).userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  
  res.json({
    user: (req.session as any).user
  });
});

export default router;