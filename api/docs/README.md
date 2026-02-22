# Dokumentasi API

Dokumentasi proyek backend API (Go).

| Dokumen | Isi |
|---------|-----|
| [SETUP.md](SETUP.md) | Quick start: menjalankan server, migrasi, tes |
| [API.md](API.md) | Endpoint HTTP (method, path, auth, response) |
| [CONFIG.md](CONFIG.md) | Variabel lingkungan (`.env`) |
| [DATABASE.md](DATABASE.md) | Schema, migrasi, referensi tabel |
| [TESTS.md](TESTS.md) | Unit test: cara menjalankan dan cakupan |

## Layout singkat

- **Entry point:** `cmd/server/main.go` — daftar route & middleware.
- **Handler:** `internal/handlers/` — health, status, auth, skills; `internal/handlers/admin/` — overview, categories, skills (CRUD).
- **Middleware:** `internal/middleware/` — CORS, security headers, JWT auth.
- **Database:** `internal/database/` — koneksi, migrasi, schema referensi `table.sql`.
- **Unit test:** `tests/` — black-box test untuk handlers & middleware.

Referensi layout: [Standard Go Project Layout](https://github.com/golang-standards/project-layout).
