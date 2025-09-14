# FlowSync AI - GitHub OAuth Implementation

This is the implementation of User Story 1.1: As a new user, I want to sign up using my GitHub OAuth account.

## Technology Stack

- **Frontend**: Next.js 14 with App Router, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, PostgreSQL
- **Authentication**: GitHub OAuth 2.0

## Quick Setup

For detailed setup instructions, see [SETUP.md](SETUP.md).

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   Copy `.env.example` to `.env.local` and fill in the required values.

3. **Set up PostgreSQL database**:
   Create a database and user with the credentials specified in `.env.local`.

4. **Initialize database tables**:
   ```bash
   npm run db:init
   ```

5. **Run the development server**:
   ```bash
   npm run dev
   ```

6. **Open the application**:
   Visit `http://localhost:3000` in your browser.

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

## OAuth Flow

1. User clicks "Sign up with GitHub" button
2. User is redirected to GitHub OAuth URL
3. User authenticates with GitHub
4. GitHub redirects back to callback URL with authorization code
5. Application exchanges code for access token
6. Application fetches user data from GitHub
7. Application creates/updates user in database
8. Application creates session and sets cookie
9. User is redirected to dashboard

## Security Considerations

- Sessions are stored server-side with secure, HTTP-only cookies
- GitHub client secret is stored in environment variables
- Database connections use parameterized queries to prevent SQL injection
- CSRF protection is implemented through GitHub's state parameter (to be fully implemented)