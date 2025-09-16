# Fixing Next.js Dev Server Port Issue

## Problem
When running `npm run dev` for the FlowSync web application, the Next.js development server was starting on port 3004 instead of the expected port 3000, even though port 3000 appeared to be free.

## Root Cause Analysis
Upon investigation, I found that the issue was caused by orphaned `next-server` processes that were still running and occupying ports 3000-3004, even though they weren't visible in a standard process list. This commonly happens when:
1. The development server is not stopped properly (e.g., using Ctrl+C only once instead of twice)
2. The system crashes or is interrupted while the server is running
3. Docker containers or other processes are still holding onto the ports

## Solution Implemented

### 1. Identify Orphaned Processes
I used the following commands to identify processes using the ports:
```bash
# Check for processes using port 3000
netstat -tulpn | grep :3000

# Check for all next-server processes
ps aux | grep next-server
```

### 2. Kill Orphaned Processes
I killed all orphaned next-server processes using:
```bash
# Kill specific process by PID (replace XXXXX with actual PID)
kill -9 XXXXX

# Or kill all next-server processes at once
pkill -f next-server
```

### 3. Verify Ports Are Free
After killing the processes, I verified that the ports were free:
```bash
# Check if port 3000 is free
netstat -tulpn | grep :3000
```

### 4. Restart the Dev Server
With the ports now free, I restarted the development server:
```bash
cd apps/web-app
npm run dev
```

The server now correctly starts on port 3000 as expected.

## Prevention Measures

To prevent this issue from recurring, I recommend:

### 1. Proper Server Shutdown
Always stop the development server properly by using Ctrl+C twice to ensure the process terminates cleanly.

### 2. Check for Running Processes
Before starting the development server, check if there are any existing processes:
```bash
ps aux | grep next-server
```

### 3. Use Process Management Tools
For development, consider using a process manager like PM2 to better manage processes.

## Documentation Updates

I've updated the following documentation files to reflect this fix:

1. `Docs/Implementation/Epics/Foundation-Core-Platform/User-Stories/1.1-GitHub-OAuth-Signup/ad_hoc.md` - Added a section on the dev server port issue and fix
2. `Docs/Implementation/Epics/Foundation-Core-Platform/User-Stories/1.1-GitHub-OAuth-Signup/troubleshooting-port-issue.md` - Created a comprehensive troubleshooting guide for port issues

## Verification

I verified the fix by:
1. Running `npm run dev` and confirming the server starts on port 3000
2. Accessing `http://localhost:3000` in a browser to ensure the application loads correctly
3. Testing the GitHub OAuth flow to ensure authentication works properly

The fix is now complete and the development server starts on the correct port.