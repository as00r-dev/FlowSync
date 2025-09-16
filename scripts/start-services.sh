#!/bin/bash

# Check if Docker is installed
if ! command -v docker &> /dev/null
then
    echo "Docker is not installed."
    echo ""
    echo "Please install Docker and Docker Compose to run the required services:"
    echo ""
    echo "For Ubuntu/Debian:"
    echo "  sudo apt update"
    echo "  sudo apt install docker.io docker-compose"
    echo "  sudo usermod -aG docker \$USER"
    echo ""
    echo "For other systems, follow the official Docker installation guide:"
    echo "  https://docs.docker.com/get-docker/"
    echo ""
    echo "After installing Docker, you can start the services with:"
    echo "  docker-compose up -d"
    echo ""
    echo "Alternatively, you can install the required services manually:"
    echo "  - PostgreSQL"
    echo "  - Redis"
    echo "  - Neo4j"
    echo "  - Kafka"
    exit 1
fi

# Check if Docker Compose is installed
if command -v docker-compose &> /dev/null
then
    echo "Starting services with docker-compose..."
    docker-compose up -d
elif command -v docker &> /dev/null && docker compose version &> /dev/null
then
    echo "Starting services with docker compose..."
    docker compose up -d
else
    echo "Docker Compose is not installed."
    echo ""
    echo "Please install Docker Compose:"
    echo ""
    echo "For Ubuntu/Debian:"
    echo "  sudo apt install docker-compose"
    echo ""
    echo "For other systems, follow the official Docker Compose installation guide:"
    echo "  https://docs.docker.com/compose/install/"
    exit 1
fi