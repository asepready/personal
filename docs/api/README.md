# Dokumentasi API

Backend: **Go** (net/http), **MySQL/MariaDB** (opsional). Server tetap jalan tanpa database; endpoint yang butuh DB mengembalikan `503` jika DB tidak dikonfigurasi atau gagal.

## Dokumen di folder ini

| Dokumen | Isi |
|---------|-----|
| [DATABASE-SETUP.md](DATABASE-SETUP.md) | Membuat database dan user MySQL/MariaDB (CREATE DATABASE, CREATE USER, GRANT). |
| [DATABASE.md](DATABASE.md) | Schema, tabel, migrasi, DSN, kode terkait, test koneksi. |

**Spesifikasi endpoint lengkap:** [api/docs/API.md](../../api/docs/API.md). **Swagger UI (interaktif):** `GET http://<host>/api/docs` — dokumentasi OpenAPI di browser.

---

## Endpoint (ringkas)

| Method | Path | Auth | Deskripsi |
|--------|------|------|-----------|
| GET | `/api/health` | — | Health check |
| GET | `/api/status` | — | Uptime + status database |
| POST | `/api/login` | — | Login admin → JWT |
| GET | `/api/skills` | — | Daftar skills |
| GET | `/api/projects`, `/api/projects/:slug` | — | Daftar & detail proyek |
| GET | `/api/posts`, `/api/posts/:slug` | — | Daftar & detail post (published) |
| GET | `/api/admin` | Bearer JWT | Overview admin |
| GET | `/api/admin/resources` | Bearer JWT | Schema resource CMS (list/form fields) |
| GET/POST/PUT/DELETE | `/api/admin/skill-categories` | Bearer JWT | CRUD kategori skill |
| GET/POST/PUT/DELETE | `/api/admin/skills` | Bearer JWT | CRUD skills |
| GET/POST/PUT/DELETE | `/api/admin/tools` (+ GET `/api/admin/tools/:id`) | Bearer JWT | CRUD tools |
| GET/POST/PUT/DELETE | `/api/admin/tags` (+ GET `/api/admin/tags/:id`) | Bearer JWT | CRUD tags |
| GET/POST/PUT/DELETE | `/api/admin/projects` (+ GET `/api/admin/projects/:id`) | Bearer JWT | CRUD projects |
| GET/POST/PUT/DELETE | `/api/admin/posts` (+ GET `/api/admin/posts/:id`) | Bearer JWT | CRUD posts |

Semua response JSON (`Content-Type: application/json`). Error: `{"error":"<pesan>"}`. Method tidak diizinkan → `405 Method Not Allowed`.

---

## Konfigurasi (env)

Server dan migrate membaca env dari **`api/configs/.env`** (dan `.env` di working directory). Variabel:

| Variabel | Deskripsi | Default / perilaku |
|----------|-----------|--------------------|
| `PORT` | Port HTTP server | 8081 |
| `DB_DSN` | Connection string MySQL. Kosong = jalan tanpa DB. | Bisa diganti pakai komponen di bawah |
| `DB_USER` | User MySQL (dipakai jika DB_DSN kosong) | — |
| `DB_PASSWORD` | Password MySQL | — |
| `DB_HOST` | Host MySQL | localhost |
| `DB_PORT` | Port MySQL | 3306 |
| `DB_NAME` | Nama database | — |
| `ADMIN_USERNAME` | Username untuk login | — |
| `ADMIN_PASSWORD` | Password untuk login | — |
| `JWT_SECRET` | Secret tanda-tangan JWT (min 32 karakter untuk HS256) | — |
| `ALLOW_ORIGIN` | CORS: nilai header `Access-Control-Allow-Origin` (kosong = CORS tidak di-set) | — |

Jika `DB_DSN` kosong, DSN dibangun dari `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`, `DB_NAME` (lihat [DATABASE.md](DATABASE.md)).

---

## Auth

- **Login:** `POST /api/login` dengan body `{"username":"...","password":"..."}`. Jika cocok dengan `ADMIN_USERNAME`/`ADMIN_PASSWORD`, response berisi `{"token":"..."}` (JWT, expiry 7 hari).
- **Admin:** kirim header `Authorization: Bearer <token>` untuk semua path `/api/admin/*`. Token divalidasi dengan `JWT_SECRET`.

---

## Middleware (urutan)

1. **CORS** — set header CORS jika `ALLOW_ORIGIN` di-set; OPTIONS → 204.
2. **SecurityHeaders** — header keamanan (X-Content-Type-Options, dll.).
3. **RequireAuth** — hanya untuk `/api/admin` dan subpath; cek Bearer JWT.

---

## Referensi lain

- [api/docs/API.md](../../api/docs/API.md) — **spesifikasi lengkap semua endpoint**
- [api/docs/](../../api/docs/) — SETUP, CONFIG, DATABASE, TESTS
- [docs/RUN-API.md](../RUN-API.md) — cara menjalankan API
- [docs/DEPLOY.md](../DEPLOY.md) — CI/CD, deploy
- [api/README.md](../../api/README.md) — quick start & perintah make
