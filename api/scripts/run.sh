#!/usr/bin/env sh
# Run API server (loads .env from project root).
set -e
cd "$(dirname "$0")/.."
go run ./cmd/server
