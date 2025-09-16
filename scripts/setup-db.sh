#!/bin/bash

# Database setup script for manual installation

echo "Setting up FlowSync database..."

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null
then
    echo "PostgreSQL is not installed."
    echo "Please install PostgreSQL before running this script."
    echo "For Ubuntu/Debian: sudo apt install postgresql postgresql-contrib"
    exit 1
fi

# Default database configuration
DB_USER="flowsync"
DB_PASSWORD="flowsync"
DB_NAME="flowsync_dev"
DB_HOST="localhost"
DB_PORT="5432"

echo "Creating database and user..."
sudo -u postgres psql << EOF
CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';
CREATE DATABASE $DB_NAME OWNER $DB_USER;
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;
EOF

if [ $? -eq 0 ]; then
    echo "Database setup completed successfully!"
    echo ""
    echo "Please update your .env file with the following values:"
    echo "POSTGRES_USER=$DB_USER"
    echo "POSTGRES_PASSWORD=$DB_PASSWORD"
    echo "POSTGRES_DB=$DB_NAME"
    echo "POSTGRES_HOST=$DB_HOST"
    echo "POSTGRES_PORT=$DB_PORT"
else
    echo "Database setup failed. Please check the error messages above."
    exit 1
fi