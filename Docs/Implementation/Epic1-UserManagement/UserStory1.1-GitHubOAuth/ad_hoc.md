# User Story 1.1: GitHub OAuth Sign-Up Ad Hoc Notes

## Unexpected Decisions and User Change Requests

1. **Technology Stack Change**: The original implementation was using plain HTML/CSS/JS for the frontend. The user has requested that we use Next.js with TypeScript and Tailwind CSS instead, which is a more modern and appropriate technology stack for this project. The backend implementation will be updated to work with Next.js API routes.

2. **Project Structure Change**: The project structure will be reorganized to follow Next.js conventions, moving from a traditional Express.js backend/frontend separation to a Next.js monorepo structure with API routes.

3. **Implementation Approach Change**: Instead of implementing a separate Express.js server, we'll use Next.js API routes for the backend functionality, which is more aligned with modern full-stack React development practices.