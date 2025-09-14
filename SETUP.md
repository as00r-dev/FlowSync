# FlowSync AI - Setup Guide

This guide will help you set up and run the FlowSync AI application locally.

## Prerequisites

1. Node.js (version 18 or higher)
2. PostgreSQL (version 12 or higher)
3. A GitHub account for OAuth testing

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd flowsync-ai
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set up Environment Variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in the required values:

```env
# GitHub OAuth Configuration
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_CALLBACK_URL=http://localhost:3000/api/auth/github/callback

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=flowsync
DB_USER=flowsync_user
DB_PASSWORD=flowsync_password

# Session Configuration
SESSION_SECRET=your_session_secret_key

# Environment
NODE_ENV=development
```

### 4. Set up GitHub OAuth Application

1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Click "New OAuth App"
3. Fill in the form:
   - Application name: FlowSync AI (Development)
   - Homepage URL: http://localhost:3000
   - Authorization callback URL: http://localhost:3000/api/auth/github/callback
4. Click "Register application"
5. Copy the Client ID and generate a new Client Secret
6. Update your `.env.local` file with these values

### 5. Set up PostgreSQL Database

Create a database and user:

```sql
CREATE DATABASE flowsync;
CREATE USER flowsync_user WITH PASSWORD 'flowsync_password';
GRANT ALL PRIVILEGES ON DATABASE flowsync TO flowsync_user;
```

### 6. Initialize Database Tables

```bash
npm run db:init
```

### 7. Test Configuration (Optional)

Verify your configuration is correct:

```bash
npm run config:test
```

Test database connection and initialization:

```bash
npm run db:test
```

### 8. Run the Development Server

```bash
npm run dev
```

### 9. Open the Application

Visit `http://localhost:3000` in your browser.

## Testing the GitHub OAuth Flow

1. Click the "Sign up with GitHub" button on the landing page
2. You'll be redirected to GitHub for authentication
3. After authenticating, you'll be redirected back to the dashboard
4. Your GitHub profile information will be displayed

## Project Structure

```
frontend/
├── app/
│   ├── api/
│   │   └── auth/
│   │       ├── github/
│   │       │   └── route.ts          # GitHub OAuth initiation
│   │       └── logout/
│   │           └── route.ts          # Logout endpoint
│   ├── dashboard/
│   │   └── page.tsx                  # Dashboard page
│   ├── lib/
│   │   ├── db/
│   │   │   ├── connection.ts         # Database connection
│   │   │   ├── user.ts               # User model
│   │   │   ├── session.ts            # Session model
│   │   │   └── init.ts               # Database initialization
│   │   ├── config.ts                 # Configuration
│   │   ├── session.ts                # Session management
│   │   └── auth.ts                   # Authentication utilities
│   ├── page.tsx                      # Landing page
│   └── layout.tsx                    # Root layout
├── components/                       # React components
├── styles/                           # Global styles
└── public/                           # Static assets

backend/                              # Legacy backend directory (not currently used)
Docs/                                 # Project documentation
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  github_id BIGINT UNIQUE NOT NULL,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  avatar_url TEXT,
  name VARCHAR(255),
  bio TEXT,
  location VARCHAR(255),
  company VARCHAR(255),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### Sessions Table
```sql
CREATE TABLE sessions (
  id VARCHAR(128) PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_accessed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NOT NULL,
  ip_address VARCHAR(45),
  user_agent TEXT
);
```

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run the linter
- `npm run db:init` - Initialize database tables
- `npm run db:test` - Test database connection and initialization
- `npm run config:test` - Test configuration values

## Troubleshooting

### Database Connection Issues

1. Ensure PostgreSQL is running
2. Verify database credentials in `.env.local`
3. Check that the database and user exist

### GitHub OAuth Issues

1. Ensure `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` are set correctly
2. Verify the callback URL matches exactly what's registered with GitHub
3. Check that the application is running on `http://localhost:3000`

### Environment Variables Not Loading

1. Ensure you're using `.env.local` (not `.env`)
2. Restart the development server after changing environment variables