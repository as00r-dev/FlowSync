#!/bin/bash

# Check if Docker is installed
if ! command -v docker &> /dev/null
then
    echo "Docker is not installed."
    echo ""
    echo "Please install Docker to run the required services:"
    echo "  - Visit: https://docs.docker.com/get-docker/"
    echo ""
    echo "Alternatively, you can install the required services manually:"
    echo "  - PostgreSQL (localhost:5432)"
    echo "  - Redis (localhost:6379)"
    echo "  - Neo4j (localhost:7474, 7687)"
    echo "  - Kafka (localhost:9092)"
    exit 1
fi

echo "Docker is installed."
echo "Docker version: $(docker --version)"

# Check if Docker Compose is installed
if command -v docker-compose &> /dev/null
then
    echo "Docker Compose (standalone) is installed."
    echo "Docker Compose version: $(docker-compose --version)"
elif docker compose version &> /dev/null
then
    echo "Docker Compose (plugin) is installed."
    echo "Docker Compose version: $(docker compose version)"
else
    echo "Docker Compose is not installed."
    echo ""
    echo "Please install Docker Compose:"
    echo "  - Visit: https://docs.docker.com/compose/install/"
    exit 1
fi

echo ""
echo "You can start the services with:"
echo "  ./scripts/start-services.sh"