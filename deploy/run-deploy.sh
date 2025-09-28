#!/bin/bash
# run-deploy.sh
# 2025-08-18 | CR
#

remove_server_mounts() {
    if [ -d "../server/mcp-server" ]; then
        echo "Removing mcp-server mount from ../server"
        rm -rf ../server/mcp-server
    else
        echo "no mcp-server mount found in ../server"
    fi
    if [ -d "../server/saved_models" ]; then
        echo "Removing server saved_models mount from ../server"
        rm -rf ../server/saved_models
    else
        echo "no saved_models mount found in ../server"
    fi
    if [ -d "../mcp-server/lib" ]; then
        echo "Removing lib mount from ../mcp-server"
        rm -rf ../mcp-server/lib
    else
        echo "no lib mount found in ../mcp-server"
    fi
}

remove_symlink_for_external_model() {
    if [ -d "../saved_models_" ]; then
        echo "Removing symlink for external model path: $EXTERNAL_MODEL_PATH"
        rm -f ../saved_models
        mv ../saved_models_ ../saved_models
    else
        echo "no symlink for external model path found in ../saved_models_"
    fi
}

create_symlink_for_external_model() {
    if [ ! -z "$EXTERNAL_MODEL_PATH" ]; then
        echo "Creating symlink for external model path: $EXTERNAL_MODEL_PATH"
        if [ ! -d "../saved_models_" ]; then
            mv ../saved_models ../saved_models_
        else
            rm -rf ../saved_models
        fi
        ln -s "$EXTERNAL_MODEL_PATH" ../saved_models
    fi
}

load_envs() {
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
}

# This must be executed always at the script end to rename the saved_models_ directory to saved_models and remove the symlink to the external model path
clean_up_function() {
    remove_symlink_for_external_model
    remove_server_mounts
}
# We don't want to remove the mounts at the end of the script because we want to doit only for "down" action
# trap clean_up_function EXIT

create_docker_images() {
    echo "Creating docker images..."
    if ! sh ./docker_images/build_docker_images.sh
    then
        echo "Error creating docker images"
        exit 1
    fi
}

load_envs

APP_NAME_LOWERCASE=$(echo "$APP_NAME" | tr '[:upper:]' '[:lower:]')
APP_NAME_LOWERCASE=$(echo "$APP_NAME_LOWERCASE" | tr '[:blank:]' '_')

ACTION=$1
if [ -z "$ACTION" ]; then
    echo "Error: No action specified"
    exit 1
fi
if [ "$ACTION" = "restart" ]; then
    echo "Restarting services..."
    docker compose --project-name ${APP_NAME_LOWERCASE} restart
    exit 0
elif [ "$ACTION" = "run" ]; then
    create_symlink_for_external_model
    create_docker_images
    echo "Starting services..."
    if ! docker network create my_shared_network
    then
        echo "my_shared_network already exists"
    fi
    docker compose --project-name ${APP_NAME_LOWERCASE} up -d
    exit 0
elif [ "$ACTION" = "down" ]; then
    echo "Stopping services..."
    if ! docker compose --project-name ${APP_NAME_LOWERCASE} down
    then
        echo "Error stopping services... skipping clean up function"
    fi
    clean_up_function
    exit 0
elif [ "$ACTION" = "logs" ]; then
    echo "Showing logs..."
    docker compose --project-name ${APP_NAME_LOWERCASE} logs
    exit 0
elif [ "$ACTION" = "logs-f" ]; then
    echo "Showing logs..."
    docker compose --project-name ${APP_NAME_LOWERCASE} logs -f
    exit 0
else
    echo "Error: Invalid action specified"
    exit 1
fi
