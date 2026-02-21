#!/usr/bin/env sh
# Run migrations up (default) or down. Usage: ./scripts/migrate.sh [--down]
set -e
cd "$(dirname "$0")/.."
if [ "$1" = "--down" ]; then
  go run ./cmd/migrate --down
else
  go run ./cmd/migrate
fi
