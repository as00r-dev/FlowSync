# User Data Model

## Overview
This document defines the user data model for storing user information in PostgreSQL.

## Table: users

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Unique identifier for the user |
| github_id | BIGINT | UNIQUE, NOT NULL | GitHub user ID |
| username | VARCHAR(255) | NOT NULL | GitHub username |
| email | VARCHAR(255) | UNIQUE | User's email address (may be null if not provided by GitHub) |
| avatar_url | TEXT |  | URL to user's GitHub avatar |
| name | VARCHAR(255) |  | User's full name (if provided by GitHub) |
| bio | TEXT |  | User's bio (if provided by GitHub) |
| location | VARCHAR(255) |  | User's location (if provided by GitHub) |
| company | VARCHAR(255) |  | User's company (if provided by GitHub) |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | When the user record was created |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | When the user record was last updated |

## Indexes
- Primary key on `id`
- Unique index on `github_id`
- Unique index on `email` (where email is not null)
- Index on `username`

## Notes
- All user data comes from GitHub OAuth API
- We follow GDPR compliance by only storing necessary user information
- Email may be null if user has not made their email public on GitHub
- Timestamps use UTC