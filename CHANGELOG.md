# CHANGELOG

All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/) and [Keep a Changelog](http://keepachangelog.com/).


## [Unreleased] - Date

### Added

### Changed

### Fixed

### Removed


## [1.1.0] - 2025-08-28

### Added
- Enable HTTP Transport in MCP server:
    - Modified mcp_server.py to conditionally run the server with HTTP transport based on the new environment variable.
    - Refined README instructions for local live version setup in MCP Clients.
    - Added real life example of how to use the MCP server in the README.
- Enhance deployment scripts and configurations:
    - Fix: delayer server container build process: Added a function to install all dependencies (server + mcp server) in the server service entrypoint script.
    - Added MCP_HTTP_TRANSPORT environment variable to docker-compose and .env.example files.
    - Fix: Modified Nginx configuration for correct proxy path
    - Fix: updated run-deploy.sh to improve cleanup functions for server mounts and symlinks, and the cleanup function is called only in the "down" action.
- New Docker images to reduce deployment time:
    - Dockerfile_python_node: Python, Node.js, Torch, Safetensors, Litellm, FastAPI, and FastMCP
    - Dockerfile_python_only: Python, Torch, Safetensors, Litellm, FastAPI, and FastMCP

### Changed
- Client: the timeout was increased to 3 seconds to avoid the "Network error" processing PDF files in the UI.
- Final Report: Add the linkedin profiles to the team members and typos/inconsistencies fixes.


## [1.0.0] - 2025-08-20

### Added
- Project ideation and initial development.
