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

## Session Management Implementation

- Implemented proper session management using PostgreSQL sessions table
- Created session utilities in the auth package:
  - `createSession` - Creates a new session for a user
  - `getSession` - Retrieves a session by ID
  - `deleteSession` - Deletes a session by ID
  - `getUserFromSession` - Gets user information from a session
- Updated API routes to use session management:
  - `/api/auth/me` now properly returns user information based on session
  - `/api/auth/logout` now properly destroys sessions and clears cookies
  - `/api/auth/github/callback` now creates sessions and sets cookies after successful OAuth
- Implemented middleware to protect routes and check authentication status
- Updated frontend components to handle authentication properly:
  - Home page redirects authenticated users to dashboard
  - Dashboard page shows access denied message for unauthenticated users
  - Added proper error handling for OAuth failures

## Docker Kafka Configuration Issue and Fix

- Encountered "ContainerConfig" KeyError when running `npm run docker:start`
- Issue was caused by incorrect Kafka configuration using KRaft mode
- Fixed by:
  1. Switching from Kafka KRaft mode to traditional Zookeeper-based configuration
  2. Using specific, compatible versions of Kafka (3.2.3) and Zookeeper (3.8)
  3. Simplifying environment variables for proper configuration
  4. Cleaning up all existing containers and volumes with `docker-compose down -v`
- Verified all services are now working correctly:
  - Kafka: Topic creation, message production and consumption working
  - PostgreSQL: Database connectivity working
  - Redis: Ping command working
  - Neo4j: HTTP endpoint responding
  - Zookeeper: Running and connected to Kafka
- The `npm run docker:start` command now works without errors

## Dev Server Port Issue and Fix

- Encountered issue where `npm run dev` was starting on port 3004 instead of port 3000
- Root cause was orphaned next-server processes still running and occupying the ports
- Fixed by:
  1. Identifying and killing all orphaned next-server processes with `pkill -f next-server`
  2. Verifying ports were free with `netstat -tulpn | grep :3000`
  3. Restarting the dev server which now correctly starts on port 3000
- Added troubleshooting documentation for future reference

## Dotenv Implementation Issue and Fix

- Encountered issue where GitHub OAuth URL was missing client ID when users clicked "Sign in with GitHub"
- Root cause was improper loading of environment variables in the Next.js application context
- Fixed by:
  1. Creating a `.env` file in the `apps/web-app/` directory with GitHub OAuth credentials
  2. Creating an environment utility module (`packages/auth/src/utils/env.ts`) to provide robust access to environment variables
  3. Updating the `GitHubOAuthService` to use the new environment utility
  4. Adding proper exports in the auth package to make the environment utility available
- Verified fix by running a test script that confirmed the GitHub OAuth URL now includes the client ID
- Added comprehensive documentation and troubleshooting guide for future reference

## NPM Workspace Error and Service Startup Issues

- Encountered npm workspace error: `npm error code ENOWORKSPACES` when running `npm run dev`
- Also encountered port conflicts where API Gateway was failing to start on port 4000
- Root causes:
  1. NPM workspace error due to newer npm version (11.6.0) not supporting workspace commands properly
  2. Port conflicts from orphaned processes still occupying ports 3000 and 4000
- Fixed by:
  1. Cleaning up orphaned processes using `lsof -ti:3000,3001,4000 | xargs kill -9` and `pkill` commands
  2. Verified services are actually starting correctly despite npm workspace error
  3. Documented workaround and long-term prevention strategies
- Added comprehensive troubleshooting guide for npm workspace issues