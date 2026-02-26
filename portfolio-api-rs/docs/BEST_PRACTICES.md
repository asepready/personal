# Best Practice — API Rust (portfolio-api-rs)

Dokumen ini menjadi acuan struktur, konvensi, keamanan, dan testing untuk pengembangan dan code review. Selaras dengan [portfolio-api](../portfolio-api) (Lumen) dan [REVIEW_API.md](REVIEW_API.md).

---

## 1. Struktur kode

- **Modul:** `handlers`, `response`, `openapi`, `auth`, `state`, `db`, `models`. Router dan wiring di `lib.rs`; entrypoint di `main.rs`.
- **Handler** hanya menangani HTTP: extract request, panggil logic/query, return response. Jangan menaruh query atau logic panjang langsung di handler; kelak bisa dipindah ke modul `services` jika perlu.
- **State:** Semua akses DB lewat `AppState::pool`; gunakan `AppState::without_db()` di test.

---

## 2. Format respons

- Selalu pakai **`json_success`** / **`json_error`** dari `src/response.rs`.
- Bentuk JSON selaras Lumen: `{ "data": ..., "message": "...", "errors": ... }`.
  - **Sukses:** `data` berisi payload, `errors: null`.
  - **Error:** `data: null`, `message` pesan umum, `errors` opsional (mis. validasi per field).
- Jangan mengembalikan JSON response ad-hoc; konsisten pakai helper tersebut.

---

## 3. Handler dan penanganan error

- **Extractors:** Gunakan `State<AppState>`, `Path<T>`, `Json<T>`, `HeaderMap` (bila perlu auth). Urutan bebas; Axum menyelesaikan dependency.
- **DB error:** Log dengan `tracing::error!(...)`, lalu return `json_error("Database error", None, StatusCode::INTERNAL_SERVER_ERROR)`. Jangan expose detail error DB (query, exception message) ke client.
- **Not found:** Return `json_error("... not found", None, StatusCode::NOT_FOUND)`.
- **Unauthorized:** Gunakan `auth::require_auth(option_user)` dan return 401 (lihat bagian Auth).

---

## 4. Auth

- Endpoint yang dilindungi: panggil `auth::resolve_user_from_headers(&state, &headers).await`. Jika `None`, panggil `auth::require_auth(option_user)` dan return `Err(response)` (401).
- Jangan mengirim **password** atau **api_token** di response (termasuk list user, show user). Hanya field publik (id, full_name, username, dll.) yang boleh di-expose.

---

## 5. Validasi input

- Validasi di handler (atau helper terpisah): field wajib, kosong, max length, format (mis. email).
- **Gagal validasi:** Return `StatusCode::UNPROCESSABLE_ENTITY` (422) dan `json_error("Validation failed", Some(errors), ...)` dengan `errors` berbentuk object per field (selaras Lumen), mis. `{ "email": ["Invalid email"], "name": ["Required"] }`.

---

## 6. Keamanan

- **CORS:** Di production jangan pakai `Any`. Baca `CORS_ORIGINS` dari env (mis. comma-separated list) dan set `allow_origin` sesuai; dev boleh tetap permisif.
- **Env:** Rahasia (DB password, API key, token) hanya dari environment atau secret manager; jangan hardcode.
- **Rate limit:** Untuk POST `/api/contact` dan POST `/api/login` rencanakan throttle per IP (mis. 5 req/menit) agar tidak disalahgunakan.

---

## 7. OpenAPI (Swagger)

- Setiap **endpoint baru** wajib:
  1. Tambah `#[utoipa::path(...)]` di handler (method, path, params, responses).
  2. Daftarkan handler di `src/openapi.rs` pada `paths(...)` dalam `ApiDoc`.
- Response type yang memakai `chrono::NaiveDate` / `NaiveDateTime` jangan derive `ToSchema` (utoipa belum mendukung); dokumentasikan status code dan deskripsi saja.

---

## 8. Testing

- **Integration test** di `tests/api_test.rs`: pakai `AppState::without_db()` untuk tes tanpa DB. Assert status code dan body minimal (ada `data` dan/atau `message` sesuai kasus).
- Untuk endpoint baru (GET/POST yang kritikal), tambah test minimal yang memastikan status dan bentuk respons.

---

## 9. Deploy

- **Env production:** `PORT`, `RUST_LOG`, `DB_*` atau `DATABASE_URL`, `CONTACT_OWNER_USER_ID` (opsional untuk contact). Set **CORS:** `CORS_ORIGINS` (jangan Any).
- **Container:** Gunakan `Containerfile` di root proyek; jangan embed `.env` atau rahasia ke dalam image. Env disuntik saat runtime.

---

## Referensi

- [REVIEW_API.md](REVIEW_API.md) — status review dan rekomendasi (CORS, validasi contact, trailing slash).
- [README.md](../README.md) — setup, env, dan cara menjalankan.
