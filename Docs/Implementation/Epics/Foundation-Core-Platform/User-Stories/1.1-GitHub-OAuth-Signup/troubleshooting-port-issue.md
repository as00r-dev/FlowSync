# Troubleshooting Guide: Next.js Dev Server Port Issues

## Issue
When running `npm run dev`, the Next.js development server starts on port 3004 (or another port) instead of the expected port 3000.

## Symptoms
- Next.js dev server starts on an unexpected port (e.g., 3004, 3005, etc.)
- Console shows messages like:
  ```
  ⚠ Port 3000 is in use, trying 3001 instead.
  ⚠ Port 3001 is in use, trying 3002 instead.
  ```

## Root Cause
The issue is caused by orphaned `next-server` processes that are still running and occupying the ports, even though they may not be visible in a standard process list.

## Solution

### 1. Identify and Kill Orphaned Processes
```bash
# Find processes using the ports
netstat -tulpn | grep :3000

# Kill specific process by PID (replace XXXXX with actual PID)
kill -9 XXXXX

# Or kill all next-server processes
pkill -f next-server
```

### 2. Verify Ports Are Free
```bash
# Check if port 3000 is free
netstat -tulpn | grep :3000

# Should return no output if port is free
```

### 3. Restart the Dev Server
```bash
cd apps/web-app
npm run dev
```

## Prevention

### 1. Always Stop Dev Server Properly
Instead of using Ctrl+C, use Ctrl+C twice to ensure the process stops cleanly.

### 2. Check for Running Processes Before Starting
Before starting the dev server, always check if there are any existing processes:
```bash
ps aux | grep next-server
```

### 3. Use Process Managers
For development, consider using a process manager like PM2 to better manage processes.

## Alternative Solutions

### 1. Specify a Different Port
If you need to run multiple instances or prefer a different port:
```bash
npm run dev -- -p 3001
```

### 2. Use Environment Variable
Set the PORT environment variable:
```bash
PORT=3001 npm run dev
```

## Additional Notes
- This issue is more common on Linux systems where processes may not always terminate cleanly
- Docker containers can also hold onto ports, so ensure containers are properly stopped if using Docker
- IDEs or other development tools might spawn background processes that occupy ports

## Resolution Status
✅ Issue resolved: Killed orphaned next-server processes (PID 290939 and others) that were holding onto port 3000. After cleaning up these processes, the Next.js dev server now correctly starts on port 3000 as expected.