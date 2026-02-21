# Setup & Quick Start

## Persyaratan

- Go 1.21+
- MySQL/MariaDB (opsional; API bisa jalan tanpa DB untuk `/health`, `/status`, `/login`, `/admin`)

## Langkah

### 1. Konfigurasi

Salin contoh env dan isi nilai (lihat [CONFIG.md](CONFIG.md)):

```bash
cp configs/.env.example configs/.env
# Edit configs/.env: PORT, DB_DSN, ADMIN_*, JWT_SECRET, dsb.
```

### 2. Database (opsional)

Jika memakai MySQL:

1. Buat database dan user.
2. Set `DB_DSN` di `.env` (format: `user:password@tcp(host:3306)/dbname?parseTime=true`).
3. Jalankan migrasi:

```bash
go run ./cmd/migrate
```

Rollback migrasi terakhir:

```bash
go run ./cmd/migrate --down
```

### 3. Jalankan server

```bash
go run ./cmd/server
```

Atau pakai Makefile:

```bash
make run
```

Server listen di `http://localhost:8080` (atau `PORT` di env).

### 4. Tes

```bash
go test ./tests/... -v -count=1
# atau
make test
```

### 5. Build binary

```bash
make build
# Output: bin/server, bin/migrate
```

## Ringkasan perintah

| Perintah | Deskripsi |
|----------|-----------|
| `make run` | Jalankan API server |
| `make build` | Build `bin/server` dan `bin/migrate` |
| `make test` | Jalankan unit test |
| `make migrate` | Migrasi database (up) |
| `make migrate-down` | Rollback migrasi terakhir |

Semua perintah di atas dijalankan dari folder **`api/`**.
