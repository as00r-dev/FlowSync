# FlowSync AI

FlowSync AI is an enterprise-wide coordination layer that integrates both automated and manual signals to provide verifiable, role-specific insights across engineering, design, and business teams.

## Overview

FlowSync AI eliminates manual status reporting and provides verifiable insights through a proactive chatbot and automated digests, while explicitly supporting non-CI/CD environments and extending value to non-engineering teams.

## Tech Stack

- **API & Event Processing**: Node.js (TypeScript)
- **Context Graph**: Neo4j
- **Metadata & Audit Log**: PostgreSQL
- **Caching**: Redis
- **Data Processing/ML**: Python
- **Frontend**: SvelteKit
- **API Layer**: GraphQL (Apollo Server)
- **Infrastructure**: Kubernetes (EKS/GKE)
- **Message Queue**: Kafka
- **Monitoring**: Prometheus, Grafana, ELK Stack

## Project Structure

This is a monorepo organized into the following directories:

- `apps/` - Runnable services (API gateway, workers, frontend)
- `packages/` - Shared internal libraries
- `libs/` - Language-specific libraries (Python confidence engine)
- `infrastructure/` - Infrastructure as Code (Kubernetes, Terraform)
- `docs/` - Documentation and architecture decisions
- `scripts/` - Utility scripts for development and deployment

## Development Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start required services:
   ```bash
   docker-compose up -d
   ```

3. Configure environment variables:
   Copy the `.env.example` file to `.env` and update the values as needed:
   ```bash
   cp .env.example .env
   ```
   
   For GitHub OAuth, you'll need to:
   - Create a GitHub OAuth App at https://github.com/settings/developers
   - Set Homepage URL to `http://localhost:5173`
   - Set Authorization callback URL to `http://localhost:4000/auth/github/callback`
   - Update the `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` in your `.env` file

4. Run the development server:
   ```bash
   npm run dev
   ```

## Documentation

- [Product Requirements Document](./Docs/PRD.md)
- [Technical Proposal](./Docs/technical_proposal.md)
- [Design Proposal](./Docs/design_proposal.md)
- [Project Management Proposal](./Docs/project_management_proposal.md)