#!/usr/bin/env sh
# Build server and migrate binaries. Run from repo root or scripts/.
set -e
cd "$(dirname "$0")/.."
go build -o bin/server ./cmd/server
go build -o bin/migrate ./cmd/migrate
echo "OK: bin/server, bin/migrate"
