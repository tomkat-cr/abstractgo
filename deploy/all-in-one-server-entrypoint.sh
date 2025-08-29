#!/bin/bash
# server-entrypoint.sh
# 2025-08-22 | CR

load_envs() {
    set -e
    echo ""
    echo "Loading environment variables from /code/.env"
    sh /code/load_envs.sh /code/.env
    echo ""
    echo "Loading environment variables from /code/mcp-server/.env"
    sh /code/load_envs.sh /code/mcp-server/.env
    echo ""
}

install_server_dependencies() {
    cd /code
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

run_mcp_server() {
    cd /code/mcp-server && python mcp_server.py
}

install_all_dependencies() {
    set -e
    echo "Installing all dependencies (not from individual requirements files)"
    echo ""

    pip install --no-cache-dir --upgrade \
        "fastapi>=0.116.1,<0.117.0" \
        "transformers>=4.55.3,<5.0.0" \
        "uvicorn>=0.35.0,<0.36.0" \
        "python-multipart>=0.0.20,<0.0.21" \
        "torch>=2.8.0,<3.0.0" \
        "litellm>=1.75.9,<2.0.0" \
        "safetensors>=0.6.2,<0.7.0" \
        "peft>=0.17.1,<0.18.0" \
        "fastmcp>=2.11.3,<3.0.0"

    echo ""
    echo "All dependencies installed"
    echo ""
}

install_server_dependencies() {
    cd /code
    pip install --upgrade pip
    pip install --no-cache-dir --upgrade -r /code/requirements.txt
}


load_envs

# Now we are using Docker containers for each service, so we don't need to install dependencies here
# # install_server_dependencies
# # install_mcp_server_dependencies
# install_all_dependencies

run_server & run_mcp_server & wait
