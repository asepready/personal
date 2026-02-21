# Dokumentasi API

Backend: **Golang** (net/http), **MariaDB/MySQL** (opsional).

## Dokumen

| Dokumen | Isi |
|---------|-----|
| [DATABASE-SETUP.md](DATABASE-SETUP.md) | **Membuat database dan user** MySQL/MariaDB (CREATE DATABASE, CREATE USER, GRANT). |
| [DATABASE.md](DATABASE.md) | Schema, tabel, migrasi, DSN, kode terkait, test koneksi. |

## Endpoint

| Method | Path     | Auth   | Deskripsi                    |
|--------|----------|--------|------------------------------|
| GET    | /health  | —      | Health check `{"status":"ok"}` |
| GET    | /status  | —      | Uptime + status database     |
| POST   | /login   | —      | Login admin → JWT            |
| GET    | /admin   | Bearer | Area admin (token required)   |

## Konfigurasi (env)

- `PORT` — port server (default 8080)
- `DB_DSN` — koneksi MariaDB/MySQL (kosong = jalan tanpa DB)
- `ADMIN_USERNAME` / `ADMIN_PASSWORD` — kredensial login
- `JWT_SECRET` — secret untuk tanda-tangan JWT
- `ALLOW_ORIGIN` — CORS origin (mis. `https://yoursite.com`)

## Auth

- **Login:** `POST /login` body `{"username":"...","password":"..."}` → `{"token":"..."}`.
- **Admin:** header `Authorization: Bearer <token>`.

Lihat juga: [SETUP-COMMANDS.md](../SETUP-COMMANDS.md), [DEPLOY.md](../DEPLOY.md).
