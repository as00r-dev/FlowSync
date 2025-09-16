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

1. Install Docker and Docker Compose:
   - For Ubuntu/Debian:
     ```bash
     sudo apt update
     sudo apt install docker.io docker-compose
     sudo usermod -aG docker $USER
     ```
   - For other systems, follow the official Docker installation guide:
     https://docs.docker.com/get-docker/

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start required services:
   ```bash
   docker-compose up -d
   ```

4. Configure environment variables:
   Copy the `.env.example` file to `.env` and update the values as needed:
   ```bash
   cp .env.example .env
   ```
   
   For GitHub OAuth, you'll need to:
   - Create a GitHub OAuth App at https://github.com/settings/developers
   - Set Homepage URL to `http://localhost:3000`
   - Set Authorization callback URL to `http://localhost:3000/api/auth/github/callback`
   - Update the `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` in your `.env` file

5. Run the development server:
   ```bash
   npm run dev
   ```
   
   The Next.js frontend will be available at `http://localhost:3000`

### Option 2: Without Docker (Manual Installation)

If you prefer not to use Docker, you can install the required services manually:

1. Install the required services:
   - PostgreSQL: https://www.postgresql.org/download/
   - Redis: https://redis.io/download/
   - Neo4j: https://neo4j.com/download/
   - Kafka: https://kafka.apache.org/quickstart

2. Configure each service according to the connection details in `docker-compose.yml`:
   - PostgreSQL: localhost:5432
   - Redis: localhost:6379
   - Neo4j: localhost:7474 (browser), localhost:7687 (Bolt)
   - Kafka: localhost:9092

3. Install dependencies:
   ```bash
   npm install
   ```

4. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
   Update the database connection details in the `.env` file to match your local installations.

5. Run the development server:
   ```bash
   npm run dev
   ```

## Documentation

- [Product Requirements Document](./Docs/PRD.md)
- [Technical Proposal](./Docs/technical_proposal.md)
- [Design Proposal](./Docs/design_proposal.md)
- [Project Management Proposal](./Docs/project_management_proposal.md)