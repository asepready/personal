# Review API Rust (portfolio-api-rs)

**Tanggal:** 2026-02-27  
**Ruang lingkup:** Struktur, routing, respons, OpenAPI, keamanan dasar, dan testing.

---

## 1. Ringkasan

| Aspek | Status | Catatan |
|-------|--------|---------|
| Struktur & routing | Baik | App diekstrak ke `lib::app()` untuk binary + test; route `/`, `/docs`, `/api/users`, `/api/contact` jelas. |
| Format respons | Baik | `ApiResponse` / `ApiError` (data, message, errors) selaras dengan portfolio-api (Lumen) dan OpenAPI. |
| OpenAPI / Swagger | Baik | utoipa + Swagger UI di `/docs`, spec di `/docs/openapi.json`. |
| CORS | Perhatian | Saat ini `Any` (dev); production sebaiknya pakai `CORS_ORIGINS` dari env seperti Lumen. |
| Validasi input | Belum | POST /api/contact belum validasi (panjang, format email); rencana: validasi + 422. |
| Auth & rate limit | Belum | Belum ada Bearer auth, login, throttle; sesuai roadmap setelah resource lengkap. |
| Testing | Baik | 6 integration test (root, users, users/:id, 404, contact, docs); `cargo test` lulus. |

---

## 2. Struktur kode

- **src/lib.rs** — `app()` (router + CORS + Swagger), mod handlers, openapi, response.
- **src/main.rs** — tracing, bind, `axum::serve(listener, app())`.
- **src/handlers.rs** — root, users_index, users_show, contact_create; semua dengan `#[utoipa::path]`.
- **src/response.rs** — ApiResponse\<T>, ApiError, json_success, json_error.
- **src/openapi.rs** — ApiDoc (info, servers, tags, paths).
- **tests/api_test.rs** — 6 tes endpoint (status + body minimal).

---

## 3. Endpoint yang dites

| Test | Endpoint | Harapan | Hasil |
|------|----------|---------|--------|
| get_root_returns_200_and_version | GET / | 200, body punya version, name | OK |
| get_api_users_returns_200_and_data_message | GET /api/users | 200, data + message | OK |
| get_api_users_id_returns_200_for_valid_id | GET /api/users/1 | 200, data.id = 1 | OK |
| get_api_users_0_returns_404 | GET /api/users/0 | 404, message "User not found" | OK |
| post_api_contact_returns_201 | POST /api/contact | 201, data + message | OK |
| get_docs_returns_html | GET /docs | 200, content-type text/html | OK |

---

## 4. Rekomendasi

1. **Production:** Batasi CORS dengan env (mis. `CORS_ORIGINS`), jangan `Any`.
2. **Validasi:** Tambah validasi untuk POST /api/contact (max length, format email); respons 422 dengan `errors` per field.
3. **Konsistensi Lumen:** Opsional: selalu kirim `"errors": null` pada sukses dan `"data": null` pada error agar JSON 100% sama dengan Lumen.
4. **Trailing slash:** Opsional: redirect GET /docs/ → /docs agar sama dengan Lumen.
5. **Roadmap:** Auth (Bearer), rate limit (contact, login), resource lengkap (experiences, projects, blog-posts, dll.).

---

## 5. Menjalankan test

```bash
cd portfolio-api-rs
cargo test
```

---

*Review selesai. Untuk audit keamanan mendalam, gunakan [AUDIT_REPORT_ISO27001.md](../../docs/AUDIT_REPORT_ISO27001.md).*
