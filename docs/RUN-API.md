# Cara menjalankan API

API backend (Go) di folder **`api/`**. Semua perintah di bawah dijalankan dari folder **`api/`**.

---

## 1. Persyaratan

- **Go 1.21+**
- **MySQL/MariaDB** (opsional; tanpa DB, API tetap jalan untuk `/health`, `/status`, `/login`, `/admin`; `/api/skills` mengembalikan 503)

---

## 2. Konfigurasi

Salin contoh env dan isi nilai:

```bash
cd api
cp configs/.env.example configs/.env
```

Edit **`api/configs/.env`**:

- **PORT** — port server (default `8080`)
- **DB_DSN** atau (**DB_USER**, **DB_PASSWORD**, **DB_HOST**, **DB_PORT**, **DB_NAME**) — koneksi database
- **ADMIN_USERNAME**, **ADMIN_PASSWORD** — kredensial login admin
- **JWT_SECRET** — minimal 32 karakter untuk tanda-tangan JWT

Detail: [api/configs/README.md](../api/configs/README.md), [docs/api/README.md](api/README.md).

---

## 3. Database (opsional)

Jika pakai MySQL/MariaDB:

1. Buat database dan user (lihat [docs/api/DATABASE-SETUP.md](api/DATABASE-SETUP.md)).
2. Set variabel DB di `.env` (DB_DSN atau DB_USER, DB_PASSWORD, DB_NAME, dll.).
3. Jalankan migrasi:

```bash
cd api
go run ./cmd/migrate
```

Rollback satu versi:

```bash
go run ./cmd/migrate --down
```

---

## 4. Menjalankan server

Dari folder **`api/`**:

```bash
go run ./cmd/server
```

Atau pakai Makefile:

```bash
make run
```

Server listen di **`http://localhost:8080`** (atau sesuai **PORT** di `.env`).

Cek:

- Health: **http://localhost:8080/health**
- Status: **http://localhost:8080/status**

---

## 5. Perintah lain (dari folder `api/`)

| Perintah | Deskripsi |
|----------|-----------|
| `make run` | Jalankan API server |
| `make build` | Build binary `bin/server` dan `bin/migrate` |
| `make test` | Jalankan unit test (`api/tests`) |
| `make migrate` | Migrasi database (up) |
| `make migrate-down` | Rollback migrasi terakhir |

---

## 6. Build binary (produksi)

```bash
cd api
make build
```

Output: **`api/bin/server`**, **`api/bin/migrate`**. Jalankan dengan:

```bash
./bin/server
```

Pastikan **`configs/.env`** (atau variabel env) tersedia di lingkungan jalannya.

---

Dokumentasi lengkap API: [api/docs/](../api/docs/README.md).
