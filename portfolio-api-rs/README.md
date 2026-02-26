# Personal Portfolio API (Axum/Rust)

REST API untuk portfolio pribadi (users, experiences, educations, skills, projects, blog posts, certifications, contact messages). Dibangun dengan **Axum** (Rust) dan didokumentasikan dengan **OpenAPI 3** serta **Swagger UI**, mengikuti standar dokumentasi yang sama dengan [portfolio-api](../portfolio-api) (Lumen).

- **Publik (tanpa auth):** Semua `GET` untuk resource di atas, dan **POST /api/contact** (form kontak pengunjung, rate limited).
- **Admin (perlu auth):** Semua `POST`/`PUT`/`PATCH`/`DELETE` untuk resource, serta semua endpoint **contact-messages**. Gunakan header `Authorization: Bearer <token>`.

**Deploy ke Podman/Docker:** Lihat [DEPLOY.md](../DEPLOY.md) di root workspace untuk Containerfile dan langkah deploy.

---

## Persyaratan & Versi

| Komponen   | Versi        |
| ---------- | ------------ |
| **Rust**   | 1.75+ (edition 2021) |
| **Axum**   | 0.7.x        |
| **OpenAPI**| 3.0 (utoipa) |
| **Database** | MySQL atau MariaDB (sama seperti portfolio-api) |

---

## Setup

1. **Clone repositori** dan masuk ke folder:

   ```bash
   cd c:\container\personal\portfolio-api-rs
   ```

2. **Pastikan Rust terpasang:**

   ```bash
   rustc --version
   cargo --version
   ```

3. **Salin environment:**

   ```bash
   copy .env.example .env
   ```

   (Di Linux/macOS: `cp .env.example .env`)

4. **Konfigurasi database** (sama seperti portfolio-api):  
   Buat database MySQL/MariaDB (mis. `personal_portfolio`) dan jalankan migration dari [portfolio-api](../portfolio-api) (`php artisan migrate`). Isi di `.env`:
   - `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`  
   Atau set `DATABASE_URL=mysql://user:pass@host:3306/db`.  
   Jika tidak dikonfigurasi, API tetap jalan dengan mode tanpa DB (response users kosong/placeholder).

5. **Build dan jalankan:**

   ```bash
   cargo build --release
   cargo run
   ```

   Atau untuk development:

   ```bash
   cargo run
   ```

   Server berjalan di **http://localhost:8000** (atau nilai `PORT` di `.env`).

---

## Database

Koneksi MySQL/MariaDB mengikuti dokumentasi portfolio-api (Lumen):

- **Variabel env:** `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` (lihat `.env.example`).
- **Override:** `DATABASE_URL=mysql://user:password@host:3306/database`.
- **Schema:** Gunakan migration dari portfolio-api; tabel `users` (dan nanti experiences, projects, dll.) sama.
- **Tanpa DB:** Jika koneksi gagal, API tetap jalan; GET /api/users mengembalikan list kosong, GET /api/users/:id mengembalikan placeholder untuk id valid.

---

## Menjalankan Server

```bash
cargo run
```

- **Base URL:** http://localhost:8000  
- **Base URL API:** http://localhost:8000/api  
- **Dokumentasi (Swagger UI):** http://localhost:8000/docs  

---

## Dokumentasi API (OpenAPI 3 / Swagger UI)

OpenAPI 3 dan Swagger UI disediakan untuk menjelajah dan mencoba endpoint.

### Cara mengakses

- **Swagger UI** (explore & try API):  
  **GET** `/docs`  
  Contoh: http://localhost:8000/docs  

- **Spesifikasi OpenAPI 3 (JSON):**  
  **GET** `/docs/openapi.json`  
  Contoh: http://localhost:8000/docs/openapi.json  

Format respons API mengikuti standar yang sama dengan portfolio-api (Lumen):

- **Sukses:** `{ "data": ..., "message": "...", "errors": null }` (status 200/201).
- **Error:** `{ "data": null, "message": "...", "errors": ... }` (401, 404, 422, 429, 500).

Detail path, request/response, dan kode 401/429 ada di Swagger UI (`/docs`).

---

## Endpoint API (prefix: `/api`)

- **Publik (tanpa token):**  
  `GET` users, experiences, educations, skill-categories, skills, user-skills, projects, project-skills, blog-posts, tags, post-tags, certifications (index + show).  
  `POST /api/contact` (body: name, email, subject, message; rate limit 5/menit per IP).
- **Admin (header `Authorization: Bearer <token>`):**  
  `POST`, `PUT`, `PATCH`, `DELETE` untuk resource di atas, serta semua akses ke **contact-messages**.

Saat ini implementasi menyediakan **placeholder** untuk: `GET /`, `GET /api/users`, `GET /api/users/:id`, `POST /api/contact`. Endpoint lain dan koneksi database dapat ditambah mengikuti struktur yang sama.

---

## Struktur proyek

| Path | Isi |
|------|-----|
| `src/main.rs` | Entrypoint, router, CORS, binding |
| `src/handlers.rs` | Handler HTTP + anotasi `#[utoipa::path]` |
| `src/response.rs` | Format `ApiResponse` / `ApiError` (data, message, errors) |
| `src/openapi.rs` | Definisi OpenAPI (utoipa `ApiDoc`) |
| `Cargo.toml` | Dependensi (axum, utoipa, utoipa-swagger-ui, tower-http, dll.) |

---

## Test

```bash
cargo test
```

- **Unit tests** (di `src/response.rs` dan `src/openapi.rs`): format `ApiResponse`/`ApiError`, serialisasi JSON, helper `json_success`/`json_error`, serta info & paths di OpenAPI spec.
- **Integration tests** (`tests/api_test.rs`): GET `/`, GET `/api/users`, GET `/api/users/1`, GET `/api/users/0` (404), POST `/api/contact`, GET `/docs`.

Detail di [docs/REVIEW_API.md](docs/REVIEW_API.md).

---

## Ringkasan

- **Setup:** clone → copy `.env` → set DB_* (atau DATABASE_URL) → `cargo run`
- **Env:** `PORT`, `RUST_LOG`, `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` (atau `DATABASE_URL`).
- **Jalankan:** `cargo run` → http://localhost:8000
- **Dokumentasi:** `/docs` (Swagger UI), `/docs/openapi.json` (OpenAPI 3)

## License

Proyek open-source (MIT). Axum: [github.com/tokio-rs/axum](https://github.com/tokio-rs/axum).
