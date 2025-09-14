# GitHub OAuth Endpoints

## Overview
This document lists the required GitHub OAuth endpoints for the authentication flow.

## OAuth Endpoints

### 1. Authorization Endpoint
- **URL**: `https://github.com/login/oauth/authorize`
- **Method**: GET
- **Parameters**:
  - `client_id` (required): The client ID you received from GitHub
  - `redirect_uri` (required): The URL in your app where users will be sent after authorization
  - `scope` (optional): A space-delimited list of scopes
  - `state` (recommended): An unguessable random string to protect against CSRF attacks
  - `allow_signup` (optional): Whether to allow signup on GitHub during OAuth (default: true)

### 2. Token Endpoint
- **URL**: `https://github.com/login/oauth/access_token`
- **Method**: POST
- **Headers**:
  - `Accept: application/json`
- **Parameters**:
  - `client_id` (required): The client ID you received from GitHub
  - `client_secret` (required): The client secret you received from GitHub
  - `code` (required): The code you received in the redirect
  - `redirect_uri` (required): The URL in your app where users will be sent after authorization

### 3. User API Endpoint
- **URL**: `https://api.github.com/user`
- **Method**: GET
- **Headers**:
  - `Authorization: token {access_token}`
  - `Accept: application/vnd.github.v3+json`

### 4. User Emails API Endpoint
- **URL**: `https://api.github.com/user/emails`
- **Method**: GET
- **Headers**:
  - `Authorization: token {access_token}`
  - `Accept: application/vnd.github.v3+json`

## Scopes Required

For basic user information:
- `user:email` - Access user email addresses (to get private email addresses)

## OAuth Flow Steps

1. Redirect user to Authorization Endpoint
2. GitHub redirects back to your redirect_uri with a code parameter
3. Exchange code for access token using Token Endpoint
4. Use access token to fetch user information from User API Endpoint
5. Use access token to fetch user emails from User Emails API Endpoint (if needed)