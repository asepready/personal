# Makefile - Standard Go project commands
# Ref: https://github.com/golang-standards/project-layout

.PHONY: build test run migrate migrate-down help

build:
	go build -o bin/server ./cmd/server
	go build -o bin/migrate ./cmd/migrate
	@echo "OK: bin/server, bin/migrate"

test:
	go test ./internal/... ./testing/... -v -count=1

run:
	go run ./cmd/server

migrate:
	go run ./cmd/migrate

migrate-down:
	go run ./cmd/migrate --down

help:
	@echo "build         - build server and migrate binaries to bin/"
	@echo "test          - run unit and integration tests"
	@echo "run           - run API server"
	@echo "migrate       - run database migrations up"
	@echo "migrate-down  - rollback last migration"
