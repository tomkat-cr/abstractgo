#!/bin/bash
# mcp-server-entrypoint.sh
# 2025-08-24 | CR

cd /code
pip install --upgrade pip
pip install --no-cache-dir --upgrade -r /code/requirements.txt

if [ "${MCP_INSPECTOR}" = "1" ]; then
    # Install Node.js
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
    # Install MCP Inspector
    npm install -g @modelcontextprotocol/inspector
    # Run MCP Server
    npx @modelcontextprotocol/inspector \
        python mcp_server.py
else
    python mcp_server.py # && tail -f /dev/null
fi
