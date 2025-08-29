#!/bin/bash
# mcp-server-entrypoint.sh
# 2025-08-24 | CR

MCP_DIR="${MCP_DIR:-/code}"
LOADENVS_DIR="${LOADENVS_DIR:-/code}"

MCP_INSPECTOR="${MCP_INSPECTOR:-0}"
MCP_INSPECTOR_PORT="${MCP_INSPECTOR_PORT:-8071}"
MCP_PROXY_PORT="${MCP_PROXY_PORT:-8072}"

export MCP_SERVER_PORT="${MCP_SERVER_PORT:-8080}"
export MCP_HTTP_TRANSPORT="${MCP_HTTP_TRANSPORT:-1}"

echo ""
echo "mcp-server-entrypoint.sh"
echo ""
echo "MCP_DIR: ${MCP_DIR}"
echo "LOADENVS_DIR: ${LOADENVS_DIR}"
echo ""
echo "MCP_INSPECTOR: ${MCP_INSPECTOR}"
echo "MCP_INSPECTOR_PORT: ${MCP_INSPECTOR_PORT}"
echo "MCP_PROXY_PORT: ${MCP_PROXY_PORT}"
echo "MCP_SERVER_PORT: ${MCP_SERVER_PORT}"
echo "MCP_HTTP_TRANSPORT: ${MCP_HTTP_TRANSPORT}"

install_mcp_server_dependencies() {
    cd ${MCP_DIR}
    pip install --upgrade pip
    pip install --no-cache-dir --upgrade -r ${MCP_DIR}/requirements.txt
}

load_envs() {
    set -e
    echo ""
    echo "Loading environment variables from ${MCP_DIR}/.env"
    sh ${LOADENVS_DIR}/load_envs.sh ${MCP_DIR}/.env
}

run_mcp_server() {
    cd /code
    if [ "${MCP_INSPECTOR}" = "1" ]; then

        # https://github.com/modelcontextprotocol/inspector
        # The inspector runs both an MCP Inspector (MCPI) client UI (default port 6274) and an MCP Proxy (MCPP) server (default port 6277).
        # Open the MCPI client UI in your browser to use the inspector. (These ports are derived from the T9 dialpad mapping of MCPI and MCPP respectively, as a mnemonic).
        # You can customize the ports if needed:
        # CLIENT_PORT=8080 SERVER_PORT=9000 npx @modelcontextprotocol/inspector node build/index.js

        # Run MCP Server with MCP Inspector
        HOST=0.0.0.0 CLIENT_PORT=${MCP_INSPECTOR_PORT} SERVER_PORT=${MCP_PROXY_PORT} \
            npx @modelcontextprotocol/inspector \
            python mcp_server.py
    else
        # Run MCP Server without MCP Inspector
        python mcp_server.py # && tail -f /dev/null
    fi
}

load_envs

# install_mcp_server_dependencies
run_mcp_server && wait
