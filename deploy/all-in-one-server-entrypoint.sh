#!/bin/bash
# server-entrypoint.sh
# 2025-08-22 | CR

install_server_dependencies() {
    cd /code
    pip install --upgrade pip
    pip install --no-cache-dir --upgrade -r /code/requirements.txt
}

install_mcp_server_dependencies() {
    cd /code/mcp-server
    pip install --no-cache-dir --upgrade -r /code/mcp-server/requirements.txt
}

run_server() {
    cd /code && uvicorn api.main:app --host 0.0.0.0 --port 8000 --reload --reload-dir /code --env-file /code/.env
}

run_mcp_server() {
    cd /code/mcp-server && python mcp_server.py
}

echo ""
echo "Loading environment variables from /code/.env"
sh /code/load_envs.sh /code/.env
echo ""
echo "Loading environment variables from /code/mcp-server/.env"
sh /code/load_envs.sh /code/mcp-server/.env
echo ""

install_server_dependencies
install_mcp_server_dependencies
run_server & run_mcp_server & wait
