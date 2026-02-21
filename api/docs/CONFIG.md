# Konfigurasi (Environment)

Variabel dibaca dari environment; di development bisa pakai file `.env` di folder `configs/` (load pakai `godotenv` di `cmd/server`).

**Contoh:** salin `configs/.env.example` → `configs/.env` lalu isi nilai.

## Variabel

| Variabel | Wajib | Default | Deskripsi |
|----------|-------|---------|-----------|
| `PORT` | Tidak | `8080` | Port HTTP server (1–65535). |
| `DB_DSN` | Tidak | (kosong) | DSN MySQL/MariaDB. Kosong = API jalan tanpa DB (skills 503, status database "disabled"). |
| `ADMIN_USERNAME` | Untuk login | — | Username admin (login). |
| `ADMIN_PASSWORD` | Untuk login | — | Password admin (login). |
| `JWT_SECRET` | Untuk login & /admin | — | Secret untuk tanda-tangan JWT (min 32 karakter, HS256). |
| `ALLOW_ORIGIN` | Tidak | (kosong) | Origin yang diizinkan CORS (mis. `https://frontend.example.com`). Kosong = tidak ada header CORS. |

## Format DSN

```
user:password@tcp(host:port)/dbname?parseTime=true
```

Contoh:

- Lokal: `root:password@tcp(127.0.0.1:3306)/personal?parseTime=true`
- Jangan commit `.env` yang berisi password/secret (gunakan `.gitignore`).

## Contoh .env minimal (development)

```env
PORT=8080
DB_DSN=root:password@tcp(localhost:3306)/personal?parseTime=true
ADMIN_USERNAME=admin
ADMIN_PASSWORD=change_me
JWT_SECRET=minimal_32_character_secret_for_jwt_signing
```

Dengan CORS (frontend di origin lain):

```env
ALLOW_ORIGIN=http://localhost:5173
```
