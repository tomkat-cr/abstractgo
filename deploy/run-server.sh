#!/bin/bash
# run-server.sh
# 2025-08-18 | CR
#
if [ ! -f ../server/.env ]; then
    echo "Error: .env file not found in 'server' directory"
    exit 1
fi
if [ ! -f ../client/.env ]; then
    echo "Error: .env file not found in 'client' directory"
    exit 1
fi
echo "Loading environment variables from ../server/.env"
set -o allexport; . ../server/.env; set +o allexport ;
echo "Loading environment variables from ../client/.env"
set -o allexport; . ../client/.env; set +o allexport ;

ACTION=$1
if [ -z "$ACTION" ]; then
    echo "Error: No action specified"
    exit 1
fi
if [ "$ACTION" = "restart" ]; then
    echo "Restarting services..."
    docker compose restart
    exit 0
elif [ "$ACTION" = "run" ]; then
    echo "Starting services..."
    if ! docker network create my_shared_network
    then
        echo "my_shared_network already exists"
    fi
    docker compose up -d
    exit 0
elif [ "$ACTION" = "down" ]; then
    echo "Stopping services..."
    docker compose down
    exit 0
else
    echo "Error: Invalid action specified"
    exit 1
fi
