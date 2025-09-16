# Dockerfile for FlowSync Web App
# Based on the technical proposal specification

# Use the official Node.js 18 image as the base
FROM node:18-alpine AS base

# Set the working directory
WORKDIR /app

# Copy package files for the entire monorepo
COPY package.json ./
COPY packages/ ./packages/
COPY apps/ ./apps/

# Install all dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN npm run build --workspace=@flowsync/web-app

# Expose the port the app runs on
EXPOSE 3000

# Start the Next.js application
CMD ["npm", "run", "start", "--workspace=@flowsync/web-app"]