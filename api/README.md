# API (Go)

Backend API mengikuti **Standard Go Project Layout** ([golang-standards/project-layout](https://github.com/golang-standards/project-layout)).

## Struktur folder

```
.
├── cmd/                    # Main applications
│   ├── server/             # API server (entry point)
│   └── migrate/            # CLI migrasi database
├── internal/               # Private application code (tidak di-import project lain)
│   ├── config/             # Konfigurasi dari environment
│   ├── database/           # Koneksi DB, migrasi, schema
│   ├── handlers/           # HTTP handlers
│   ├── middleware/         # CORS, auth, security headers
│   └── models/             # Domain struct
├── pkg/                    # Library yang aman di-import project lain
│   └── utils/
├── configs/                # Template konfigurasi (e.g. .env.example)
├── scripts/                # Script build, test, run (sh)
├── docs/                   # Dokumentasi tambahan
├── test/                   # Tes integrasi (external test)
├── go.mod
├── go.sum
└── Makefile
```

| Folder      | Kegunaan (standard) |
|------------|----------------------|
| **cmd/**   | Entry point aplikasi; minimal code, panggil internal/pkg. |
| **internal/** | Kode privat; hanya bisa di-import oleh tree project ini. |
| **pkg/**   | Kode yang boleh dipakai project lain. |
| **configs/** | File konfigurasi sample (tidak rahasia). |
| **scripts/** | Script otomasi (build, deploy, test). |
| **docs/**  | Design doc, runbook. |
| **test/**  | Tes integrasi / data tes (di luar paket internal). |

## Setup

1. Salin config sample:
   ```bash
   cp configs/.env.example .env
   ```
2. Edit `.env`: isi `DB_DSN`, `ADMIN_PASSWORD`, `JWT_SECRET` (min. 32 karakter).

## Menjalankan

```bash
# Server
make run
# atau
go run ./cmd/server

# Migrasi (buat tabel)
make migrate
# Rollback satu migrasi
make migrate-down
```

## Testing

```bash
make test
```

- **Unit test**: `internal/handlers/*_test.go`, `internal/middleware/*_test.go`
- **Integrasi**: `test/integration_test.go` (full stack tanpa DB nyata)

## Build

```bash
make build
# Binary: bin/server, bin/migrate
```

## Referensi

- [Standard Go Project Layout](https://github.com/golang-standards/project-layout)
- [Go: Organizing a module](https://go.dev/doc/modules/layout)
