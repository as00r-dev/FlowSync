# Dockerfile for FlowSync API Gateway
# Based on the technical proposal specification

# Use the official Node.js 18 image as the base
FROM node:18-alpine AS base

# Set the working directory
WORKDIR /app

# Copy package.json for the entire monorepo
COPY package.json ./
COPY turbo.json ./

# Copy the specific packages that api-gateway depends on
COPY packages/auth ./packages/auth/
COPY packages/database ./packages/database/
COPY packages/common ./packages/common/
COPY apps/api-gateway ./apps/api-gateway/

# Install all dependencies
RUN npm install --workspace=@flowsync/api-gateway

COPY . .

# Build the API Gateway application
RUN npm run build --workspace=@flowsync/api-gateway

# Expose the port the app runs on
EXPOSE 4000

# Start the API Gateway application
CMD ["npm", "run", "start", "--workspace=@flowsync/api-gateway"]