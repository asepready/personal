#!/usr/bin/env sh
# Run API server. Loads .env from project root. Run from repo root or scripts/.
set -e
cd "$(dirname "$0")/.."
go run ./cmd/server
