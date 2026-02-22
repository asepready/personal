# API — Backend personal/portfolio

Backend HTTP (Go) untuk situs personal: health, status, auth (JWT), area admin, dan data skills dari database.

## Stack

- **Go 1.21+**
- **MySQL/MariaDB** (opsional; API bisa jalan tanpa DB)
- **JWT** (HS256) untuk login & route protected

## Quick start

```bash
# Konfigurasi (copy dan isi .env)
cp configs/.env.example configs/.env

# Jalankan server (default http://localhost:8080)
go run ./cmd/server
# atau
make run
```

Dengan database: set `DB_DSN` di `.env`, lalu jalankan migrasi:

```bash
go run ./cmd/migrate
```

## Endpoint utama

| Method | Path | Auth | Fungsi |
|--------|------|------|--------|
| GET | `/health` | — | Health check `{"status":"ok"}` |
| GET | `/status` | — | Uptime + status database |
| POST | `/login` | — | Login admin → JWT |
| GET | `/api/skills` | — | Daftar skills (dari DB) |
| GET | `/admin` | Bearer JWT | Area admin |

Detail request/response dan konfigurasi: **[docs/api/README.md](../docs/api/README.md)**.

## Konfigurasi

Variabel penting di `.env`: `PORT`, `DB_DSN` (atau `DB_USER`+`DB_NAME`), `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `JWT_SECRET`, `ALLOW_ORIGIN` (CORS).  
Penjelasan lengkap: **[docs/api/README.md](../docs/api/README.md#konfigurasi-env)**.

## Perintah

Semua perintah di bawah dijalankan dari **folder `api/`** (bukan dari `web/` atau root repo):

| Perintah | Deskripsi |
|----------|-----------|
| `make run` | Jalankan server |
| `make build` | Build `bin/server` dan `bin/migrate` |
| `make test` | Unit test (`tests/`) — **jalankan dari folder api/** |
| `make migrate` | Migrasi DB (up) |
| `make migrate-down` | Rollback migrasi |

## Dokumentasi

Dokumentasi API ada di **`docs/api/`** dan **`docs/`**:

- [docs/api/README.md](../docs/api/README.md) — endpoint, request/response, konfigurasi env
- [docs/api/DATABASE.md](../docs/api/DATABASE.md) — schema & migrasi
- [docs/api/DATABASE-SETUP.md](../docs/api/DATABASE-SETUP.md) — buat database & user MySQL
- [docs/README.md](../docs/README.md) — indeks docs
- [docs/RUN-API.md](../docs/RUN-API.md) — cara jalankan API
- [docs/DEPLOY.md](../docs/DEPLOY.md) — CI/CD & deploy
