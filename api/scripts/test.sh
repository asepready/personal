#!/usr/bin/env sh
# Run all tests (unit + integration). Run from repo root or scripts/.
set -e
cd "$(dirname "$0")/.."
go test ./internal/... ./testing/... -v -count=1
