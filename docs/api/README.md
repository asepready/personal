# Dokumentasi API

Backend: **Go** (net/http), **MySQL/MariaDB** (opsional). Server tetap jalan tanpa database; endpoint yang butuh DB mengembalikan `503` jika DB tidak dikonfigurasi atau gagal.

## Dokumen di folder ini

| Dokumen | Isi |
|---------|-----|
| [DATABASE-SETUP.md](DATABASE-SETUP.md) | Membuat database dan user MySQL/MariaDB (CREATE DATABASE, CREATE USER, GRANT). |
| [DATABASE.md](DATABASE.md) | Schema, tabel, migrasi, DSN, kode terkait, test koneksi. |

---

## Endpoint

| Method | Path | Auth | Deskripsi |
|--------|------|------|-----------|
| GET | `/health` | — | Health check |
| GET | `/status` | — | Uptime + status database |
| GET | `/api/skills` | — | Daftar skills (dari DB) |
| POST | `/login` | — | Login admin → JWT |
| GET | `/admin` | Bearer JWT | Area admin (protected) |

Semua response JSON memakai header `Content-Type: application/json`. Method selain yang tercantum mengembalikan `405 Method Not Allowed` (plain text).

---

### GET /health

- **Response 200:** `{"status":"ok"}`
- Method lain: `405`

---

### GET /status

- **Response 200:**  
  `{"status":"ok","uptime_seconds":<int64>,"database":"ok"|"disabled"|"error"}`
- `database`: `ok` = terhubung, `disabled` = DB tidak dikonfigurasi, `error` = Ping gagal
- Method lain: `405`

---

### GET /api/skills

- **Response 200:** `{"skills":[{"id":<int64>,"category_id":<int>,"name":"...","level":"...","icon_url":<string|null>,"category":"..."}, ...]}`
- **Response 503:** `{"error":"database not configured"}` — DB tidak di-set atau nil
- **Response 500:** `{"error":"query failed"}` — error saat query
- Method lain: `405`

---

### POST /login

- **Request body (JSON):** `{"username":"...","password":"..."}`
- **Response 200:** `{"token":"<jwt>"}`
- **Response 400:** body invalid/bukan JSON → plain text `invalid body`
- **Response 401:** kredensial salah → plain text `invalid credentials`
- **Response 503:** login belum dikonfigurasi (ADMIN_USERNAME/ADMIN_PASSWORD/JWT_SECRET kosong) → plain text `login not configured`
- **Response 500:** error pembuatan token → plain text `token error`
- Method lain: `405`

---

### GET /admin

- **Header:** `Authorization: Bearer <token>` (JWT dari POST /login)
- **Response 200:** `{"message":"Admin area"}`
- **Response 401:** tidak ada header / token invalid → plain text `missing authorization` atau `invalid token`
- **Response 503:** auth belum dikonfigurasi (JWT_SECRET kosong) → plain text `auth not configured`
- Method lain: `405`

---

### Admin CRUD (semua butuh header `Authorization: Bearer <token>`)

**GET/POST/PUT/DELETE /admin/skill-categories** — Kelola tabel `skill_categories`.

- **GET** — list: `{"categories":[{"id", "name", "slug", "sort_order"}, ...]}`
- **POST** — create: body `{"name","slug","sort_order"}` → 201 `{"id", "name", "slug", "sort_order"}`
- **PUT** — update: body `{"id", "name", "slug", "sort_order"}` → 200
- **DELETE** — query `?id=<id>` → 200 `{"deleted": id}`

**GET/POST/PUT/DELETE /admin/skills** — Kelola tabel `skills`.

- **GET** — list: `{"skills":[{"id", "category_id", "name", "level", "icon_url", "category"}, ...]}`
- **POST** — create: body `{"category_id", "name", "level", "icon_url"}` → 201
- **PUT** — update: body `{"id", "category_id", "name", "level", "icon_url"}` → 200
- **DELETE** — query `?id=<id>` → 200 `{"deleted": id}`

---

## Konfigurasi (env)

Server dan migrate membaca env dari **`api/configs/.env`** (dan `.env` di working directory). Variabel:

| Variabel | Deskripsi | Default / perilaku |
|----------|-----------|--------------------|
| `PORT` | Port HTTP server | 8080 |
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

- **Login:** `POST /login` dengan body `{"username":"...","password":"..."}`. Jika cocok dengan `ADMIN_USERNAME`/`ADMIN_PASSWORD`, response berisi `{"token":"..."}` (JWT, expiry 24 jam).
- **Admin:** kirim header `Authorization: Bearer <token>` untuk `GET /admin`. Token divalidasi dengan `JWT_SECRET`.

---

## Middleware (urutan)

1. **CORS** — set header CORS jika `ALLOW_ORIGIN` di-set; OPTIONS → 204.
2. **SecurityHeaders** — header keamanan (X-Content-Type-Options, dll.).
3. **RequireAuth** — hanya untuk `/admin`; cek Bearer JWT.

---

## Referensi lain

- [docs/RUN-API.md](../RUN-API.md) — cara menjalankan API
- [docs/DEPLOY.md](../DEPLOY.md) — CI/CD, deploy
- [api/README.md](../../api/README.md) — quick start & perintah make
