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
- **Frontend**: Next.js 14+ (App Router)
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

### Option 1: Using Docker (Recommended)

1. Install Docker and Docker Compose V2:
   - Follow the official Docker installation guide for your system: https://docs.docker.com/get-docker/
   - Ensure Docker Compose V2 is installed (usually as `docker compose` without a hyphen). If not, you can install it manually:
     ```bash
     DOCKER_CONFIG=${DOCKER_CONFIG:-$HOME/.docker} && mkdir -p $DOCKER_CONFIG/cli-plugins \
     && curl -SL https://github.com/docker/compose/releases/download/v2.24.5/docker-compose-linux-x86_64 -o $DOCKER_CONFIG/cli-plugins/docker-compose \
     && chmod +x $DOCKER_CONFIG/cli-plugins/docker-compose
     ```

2. Install monorepo dependencies:
   ```bash
   npm install
   ```

3. Start required services (using Docker Compose V2):
   ```bash
   docker compose up -d --build
   ```

4. Configure environment variables:
   Copy the `.env.example` file to `.env` in the project root and update the values as needed:
   ```bash
   cp .env.example .env
   ```
   
   For GitHub OAuth, you'll need to:
   - Create a GitHub OAuth App at `https://github.com/settings/developers`
   - Set Homepage URL to `http://localhost:3000`
   - Set Authorization callback URL to `http://localhost:4000/auth/github/callback` (for the API Gateway)
   - Update the `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` in your project's `.env` file.
   - Ensure the `docker-compose.yml` uses `env_file: ./.env` for services that need these variables.

5. Run the development server (for the web-app, API gateway is handled by Docker Compose):
   ```bash
   # This command is for running the web-app locally if not using Docker for it.
   # If you are using 'docker compose up -d --build' for the web-app, you don't need to run 'npm run dev' separately.
   # npm run dev --workspace=@flowsync/web-app
   ```
   
   The Next.js frontend will be available at `http://localhost:3000` and the API Gateway at `http://localhost:4000`.

## Documentation

- [Product Requirements Document](./Docs/PRD.md)
- [Technical Proposal](./Docs/technical_proposal.md)
- [Design Proposal](./Docs/design_proposal.md)
- [Project Management Proposal](./Docs/project_management_proposal.md)