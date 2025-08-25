.PHONY: install build dev start clean test lint ssl-certs-creation

# Show help
help:
	@echo "Available commands:"
	@echo "  install    - Install npm dependencies"
	@echo "  dev        - Run server in development mode"
	@echo "  start      - Run server in production mode"
	@echo "  clean      - Remove node_modules and package-lock.json"
	@echo "  reinstall  - Clean and reinstall dependencies"
	@echo "  test       - Run tests"
	@echo "  lint       - Run linter"
	@echo "  help       - Show this help message"

# Install dependencies
install:
	poetry install

# Build the project (if needed for production)
build:
	poetry export -f requirements.txt --output requirements.txt --without-hashes

# Run in development mode with nodemon
dev: start_up
	bash ./run_mcp_server.sh

run: dev

start_up:
	bash ./link_common_assets.sh link

shut_down:
	bash ./link_common_assets.sh unlink

run-mcp-inspector: start_up
	MCP_INSPECTOR=1 bash ./run_mcp_server.sh

# Run in production mode
start:
	poetry run python mcp_server.py

# Clean node_modules and package-lock.json
clean:
	rm -rf .venv
	rm -rf lib
	rm -rf __pycache__
	rm -rf .pytest_cache
	rm -rf .mypy_cache
	rm -rf .ruff_cache
	rm -rf .coverage
	rm -rf .coverage.*
	rm -rf .pytest_cache
	rm -rf .ruff_cache

# Reinstall dependencies
reinstall: clean install

# Run tests (when implemented)
test:
	poetry run pytest

# Run linter (when implemented)
lint:
	poetry run flake8

requirements: build
