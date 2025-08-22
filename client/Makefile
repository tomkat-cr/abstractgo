.PHONY: install build dev start clean test lint preview


# Show help
help:
	@echo "Available commands:"
	@echo "  install       - Install npm dependencies"
	@echo "  build         - Build for production"
	@echo "  dev           - Run client in development mode"
	@echo "  start         - Alias for dev command"
	@echo "  preview       - Preview production build"
	@echo "  clean         - Remove node_modules, package-lock.json, and dist"
	@echo "  reinstall     - Clean and reinstall dependencies"
	@echo "  build-preview - Build and preview production version"
	@echo "  test          - Run tests"
	@echo "  lint          - Run linter"
	@echo "  help          - Show this help message"

# Install dependencies
install:
	npm install

# Build for production
build:
	bash ./run-client.sh build

# Run in development mode
dev:
	bash ./run-client.sh run

# Alias for dev (common pattern)
start: dev
run: dev

# Preview production build
preview:
	bash ./run-client.sh preview

# Clean node_modules, package-lock.json, and dist
clean:
	rm -rf node_modules package-lock.json dist

# Reinstall dependencies
reinstall: clean install

# Run tests (when implemented)
test:
	npm test

# Run linter (when implemented)
lint:
	npm run lint

# Build and preview
build-preview: build preview
