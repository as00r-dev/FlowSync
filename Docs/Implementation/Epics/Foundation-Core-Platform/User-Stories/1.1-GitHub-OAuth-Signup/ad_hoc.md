# User Story 1.1: GitHub OAuth Signup - Ad Hoc Notes

## Change Requests and Decisions

This file will track any ad hoc decisions, change requests, or unexpected issues encountered during the implementation of the GitHub OAuth signup feature.

## Initial Planning Notes

- Will follow the existing project structure as outlined in the technical proposal
- Will use the apps/web-app directory for frontend components
- Will use the apps/api-gateway for authentication endpoints
- User data will be stored in PostgreSQL as specified in the technical proposal

## GitHub OAuth Configuration

- GitHub OAuth URLs clarified:
  - Homepage URL: `http://localhost:3000`
  - Authorization callback URL: `http://localhost:3000/api/auth/github/callback`
- These URLs should be used when configuring the GitHub OAuth App

## Next.js Implementation

- Replaced SvelteKit frontend with Next.js 14+ App Router as specified in updated technical proposal
- Implemented App Router structure with route groups for dashboard
- Created API routes for authentication endpoints
- Implemented client-side hooks for authentication state management
- Configured Tailwind CSS for styling
- Set up proper TypeScript configuration for Next.js