#!/usr/bin/env sh
# Run migrations. Usage: ./scripts/migrate.sh [--down]
set -e
cd "$(dirname "$0")/.."
if [ "$1" = "--down" ]; then
  go run ./cmd/migrate --down
else
  go run ./cmd/migrate
fi
