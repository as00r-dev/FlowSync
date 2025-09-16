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

## Docker Setup and Permission Issues

- Encountered Docker permission denied error when running `npm run docker:start`
- Error was caused by user not being in the docker group
- Added comprehensive permission checking to start-services.sh script
- Updated check-docker.sh script to validate Docker permissions
- Provided clear instructions for fixing Docker permission issues:
  1. Run `sudo usermod -aG docker $USER`
  2. Log out and log back in, or run `newgrp docker`
- Added npm scripts for easier Docker management:
  - `npm run docker:check` - Check Docker installation and permissions
  - `npm run docker:start` - Start services with proper error handling
  - `npm run db:setup` - Set up database for manual installation
- Updated README.md with comprehensive setup instructions for both Docker and manual installation