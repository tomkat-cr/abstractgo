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
dev:
	poetry run python api/main.py

run: dev

# Run in production mode
start:
	poetry run python api/main.py

# Clean node_modules and package-lock.json
clean:
	rm -rf .venv

# Reinstall dependencies
reinstall: clean install

# Run tests (when implemented)
test:
	poetry run pytest

# Run linter (when implemented)
lint:
	poetry run flake8

requirements: build
