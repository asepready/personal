#!/usr/bin/env sh
# Run all tests (unit + integration).
set -e
cd "$(dirname "$0")/.."
go test ./internal/... ./test/... -v -count=1
