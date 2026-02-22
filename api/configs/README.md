# Konfigurasi (configs)

File **`configs/.env`** dipakai oleh **server**, **migrate**, dan **test**. Format mengikuti **`.env.example`**. Salin: `cp .env.example .env` lalu isi nilai.

## Format .env (sama untuk server, migrate, test)

- **Lokasi:** `api/configs/.env`
- **Server:** `go run ./cmd/server` — load `configs/.env`, koneksi DB dari `config.Load()`
- **Migrasi:** `go run ./cmd/migrate` — load `configs/.env`, DSN dari `config.Load()`
- **Test:** `go test ./tests/...` — init load `configs/.env`, DSN dari `config.Load()` (TestDatabaseConnection skip jika DSN kosong)

## Database: DSN atau komponen terpisah

**Opsi 1 — Satu string:** set `DB_DSN=user:password@tcp(host:port)/dbname?parseTime=true`

**Opsi 2 — Pisah:** set `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`, `DB_NAME`. Jika `DB_DSN` kosong, DSN dibangun otomatis. Contoh:

```env
DB_USER=personal
DB_PASSWORD=A$ep*467
DB_HOST=localhost
DB_PORT=3306
DB_NAME=personal
```

Password dengan karakter khusus (`$`, `*`, `@`, `#`, dll.) aman: DSN dibangun pakai `mysql.Config.FormatDSN()` sehingga driver yang mengurus encoding.

**Jika koneksi tetap gagal (mis. Laragon):**
- Coba **DB_HOST=127.0.0.1** instead of `localhost` (atau sebaliknya).
- Di MySQL pastikan user punya hak untuk host yang dipakai: `'user'@'localhost'` dan/atau `'user'@'127.0.0.1'`.
- Nilai di `.env` bisa pakai kutip jika ada spasi: `DB_PASSWORD="pass word"` — kutip akan di-trim saat dibaca.

## Panduan kekuatan password

Gunakan untuk **ADMIN_PASSWORD** dan **password di DB_DSN** (user database):

| Aspek | Anjuran | Alasan |
|-------|---------|--------|
| **Panjang** | Minimal 12–16 karakter | Semakin panjang, waktu retas naik secara eksponensial. |
| **Huruf besar & kecil** | aB, Ab, dll. | Menambah variasi karakter di tiap posisi. |
| **Angka** | 0–9 | Memecah pola kata kamus. |
| **Simbol** | @, #, $, !, *, dll. | Mengecoh algoritma pencarian pola sederhana. |

**Contoh kuat:** `MyP@ssw0rd#2024!` (16 karakter, huruf besar/kecil, angka, simbol).

**Contoh lemah:** `admin123`, `password` — jangan dipakai di production.

## Variabel

Lihat **`.env.example`** untuk daftar variabel. Ringkasan: `PORT`; `DB_DSN` atau (`DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`, `DB_NAME`); `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `JWT_SECRET`, `ALLOW_ORIGIN`.

Jangan commit `.env` yang berisi nilai asli ke Git.
