# Troubleshooting Guide: NPM Workspace Error and Service Startup Issues

## Issue Description

When running `npm run dev` in a TurboRepo monorepo, users may encounter:
1. **NPM Workspace Error**: `npm error code ENOWORKSPACES` - `npm error This command does not support workspaces.`
2. **Port Conflicts**: Services fail to start because ports are already occupied by orphaned processes

## Root Causes

### 1. NPM Workspace Error
This error occurs with newer versions of npm (11+) when running npm commands within workspace packages. It doesn't prevent services from starting but causes the command to exit with an error.

### 2. Port Conflicts
Orphaned processes from previous runs continue to occupy ports (3000 for web app, 4000 for API gateway), preventing new instances from starting.

## Immediate Fix

### 1. Clean Up Orphaned Processes
```bash
# Kill any processes using common development ports
lsof -ti:3000,3001,4000 | xargs kill -9 2>/dev/null || true

# Kill any Next.js processes
pkill -f "next-server" || true
pkill -f "next dev" || true

# Kill any Node.js processes
pkill -f "nodemon" || true
```

### 2. Start Services
```bash
# From the root directory
npm run dev
```

Even if you see the npm workspace error, check if the services are actually running:
- Web App: http://localhost:3000
- API Gateway: http://localhost:4000/graphql

## Long-term Prevention

### 1. Proper Shutdown Procedure
- Always use `Ctrl+C` twice to ensure clean shutdown
- Avoid force quitting terminals or IDEs during development

### 2. Process Management
- Consider using PM2 for development: `npm install -g pm2`
- Use dedicated terminal sessions for each service
- Implement proper process cleanup in development scripts

### 3. Environment Configuration
Create a `.env` file in the root with proper port settings:
```
# Web App
PORT=3000

# API Gateway
API_GATEWAY_PORT=4000

# Database
POSTGRES_PORT=5432

# Redis
REDIS_PORT=6380
```

### 4. Docker Alternative
For a more isolated development environment, consider using Docker Compose for all services:
```bash
npm run docker:start
```

## Alternative Development Approaches

### 1. Run Services Individually
Instead of using `npm run dev`, run services individually:

```bash
# Terminal 1 - API Gateway
cd apps/api-gateway
npm run dev

# Terminal 2 - Web App
cd apps/web-app
npm run dev
```

### 2. Use Turbo Directly
```bash
# From root directory
npx turbo run dev
```

### 3. Use PM2 for Process Management
Install PM2 globally and create an ecosystem file:

```bash
npm install -g pm2
```

Create `ecosystem.config.js`:
```javascript
module.exports = {
  apps: [
    {
      name: 'flowsync-web-app',
      cwd: './apps/web-app',
      script: 'npm',
      args: 'run dev',
      env: {
        PORT: 3000
      }
    },
    {
      name: 'flowsync-api-gateway',
      cwd: './apps/api-gateway',
      script: 'npm',
      args: 'run dev',
      env: {
        PORT: 4000
      }
    }
  ]
};
```

Run with:
```bash
pm2 start ecosystem.config.js
```

## Verification Steps

### 1. Check Port Availability
```bash
# Check if ports are free
netstat -tulpn | grep :3000
netstat -tulpn | grep :4000
```

### 2. Verify Services Are Running
```bash
# Check if services are responding
curl -I http://localhost:3000
curl -I http://localhost:4000/graphql
```

### 3. Monitor Processes
```bash
# Check for running Node.js processes
ps aux | grep node
```

## Resolution Status

✅ **Issue Resolved**: 
1. Cleaned up orphaned processes that were occupying ports 3000 and 4000
2. Services now start correctly with API Gateway on port 4000 and Web App on port 3000
3. Documented workaround for npm workspace error (services still start despite the error)
4. Provided long-term prevention strategies

The GitHub OAuth signup functionality should now work correctly since both services are running on their expected ports.