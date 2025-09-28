#!/bin/bash
# server-entrypoint.sh
# 2025-08-22 | CR

install_server_dependencies() {
    cd /code/api
    pip install --upgrade pip
    pip install --no-cache-dir --upgrade -r /code/requirements.txt
}

load_envs() {
    set -e
    echo ""
    echo "Loading environment variables from /code/.env"
    sh /code/load_envs.sh /code/.env
}

run_server() {
    cd /code && uvicorn api.main:app --host 0.0.0.0 --port 8000 --env-file /code/.env
}

load_envs
# install_server_dependencies
run_server && wait
