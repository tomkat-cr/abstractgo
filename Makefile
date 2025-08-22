# Manages Docker Compose services for production deployment

.PHONY: help up down restart logs build clean status

# Default target
help:
	cat Makefile

# Start all services
up:
	make build && cd deploy && make up && make logs-f

run: up

# Stop all services
down:
	cd deploy && make down

# Restart all services
restart:
	make build && cd deploy && make restart

# Restart all services
hard-restart:
	make build && cd deploy && make down && make up && make logs-f

# Show logs
logs:
	cd deploy && make logs

# Follow logs
logs-f:
	cd deploy && make logs-f

# Clean up - stop services and remove volumes
clean-docker:
	cd deploy && docker compose down -v
	docker system prune -f

# Show service status
status:
	docker compose ps

install:
	npm run install:all

build:
	npm run build

start:
	npm run start

dev:
	npm run dev

clean:
	npm run clean

list-scripts:
	npm run --workspace=abstractgo-server
	npm run --workspace=abstractgo-client

ssl-certs-creation:
	@echo "Creating SSL certificates"
	@bash ./scripts/local_ssl_certs_creation.sh
	
