#!/bin/sh
# load_envs.sh
# 2025-08-19 | CR


check_directories() {
    local directory_name="$1"
    if [ ! -d "$BASE_DIR/$directory_name" ]; then
        echo "Error: $directory_name directory not found: $BASE_DIR/$directory_name"
        exit 1
    fi
}

check_env_file() {
    local env_file=$1
    if [ ! -f $env_file ]; then
        echo "Error: .env file not found in '$env_file' directory"
        exit 1
    fi
}

load_env_file() {
    local env_file=$1
    set -o allexport; . $env_file; set +o allexport ;
}

SCRIPT_DIR=$(dirname "$0")
BASE_DIR="$SCRIPT_DIR/.."

if [ -z "$1" ]; then
    check_directories "client"
    check_directories "server"
    check_directories "mcp-server"

    check_env_file ../server/.env
    check_env_file ../client/.env
    check_env_file ../mcp-server/.env

    load_env_file ../server/.env
    load_env_file ../client/.env
    load_env_file ../mcp-server/.env
else
    check_env_file $1
    load_env_file $1
fi
