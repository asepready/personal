# Deploy Portfolio Stack dengan Podman

Stack: Lumen API (`portfolio-api`), **Rust API** (`portfolio-api-rs`), MariaDB, frontend visitor (`portfolio-web`), frontend admin (`portfolio-admin`). Semua dijalankan sebagai container; orkestrasi via Podman (atau Docker) Compose.

## Prasyarat

- Podman (atau Docker) dan Podman Compose (`podman-compose` atau `docker compose`)
- Di Windows: pastikan proyek ada di path yang bisa diakses (mis. `c:\laragon\www`)

## 1. Siapkan env

```bash
cd portfolio-api
cp .env.example.podman .env.podman
# Edit .env.podman: isi APP_KEY (generate dengan: php -r "echo 'base64:'.base64_encode(random_bytes(32));"), sesuaikan DB_* / MYSQL_ROOT_PASSWORD bila perlu.
```

Jangan commit `.env.podman` (berisi rahasia).

## 2. Build dan jalankan dengan Compose

Dari **root workspace** (folder yang berisi `portfolio-api`, `portfolio-web`, `portfolio-admin`, `compose.yaml`):

```bash
podman-compose up -d --build
# atau
docker compose up -d --build
```

- **db**: MariaDB di port 3306 (data persisten di bind mount `./data`)
- **api**: Lumen di http://localhost:8000 (Swagger: http://localhost:8000/docs)
- **api-rs**: Rust/Axum API di http://localhost:8001 (Swagger: http://localhost:8001/docs)
- **web**: Visitor di http://localhost:3000 (proxy `/api` ke backend)
- **admin**: Admin di http://localhost:3001 (proxy `/api` ke backend)

## 3. Migrasi database

Setelah container `api` dan `db` jalan:

```bash
podman exec portfolio-api php artisan migrate --force
# Opsional: seed
podman exec portfolio-api php artisan db:seed --force
```

## 4. Build dan run per service (tanpa Compose)

### Hanya API + DB (satu pod)

```bash
# Buat pod
podman pod create --name portfolio-pod -p 8000:8000 -p 3306:3306

# Jalankan DB
podman run -d --name portfolio-db --pod portfolio-pod \
  -e MYSQL_ROOT_PASSWORD=secret \
  -e MYSQL_DATABASE=personal_portfolio \
  -e MYSQL_USER=portfolio \
  -e MYSQL_PASSWORD=portfolio_pass \
  -v portfolio-db-data:/var/lib/mysql \
  mariadb:10.11

# Tunggu DB siap (mis. 10 detik), lalu build dan jalankan API
cd portfolio-api
podman build -t portfolio-api -f Containerfile .
podman run -d --name portfolio-api --pod portfolio-pod \
  -e DB_HOST=portfolio-db \
  -e DB_DATABASE=personal_portfolio \
  -e DB_USERNAME=portfolio \
  -e DB_PASSWORD=portfolio_pass \
  --env-file .env.podman \
  portfolio-api

# Migrasi
podman exec portfolio-api php artisan migrate --force
```

### Hanya API Rust + DB (tanpa Compose)

```bash
podman pod create --name portfolio-rs-pod -p 8001:8000 -p 3306:3306

podman run -d --name portfolio-db --pod portfolio-rs-pod \
  -e MYSQL_ROOT_PASSWORD=secret \
  -e MYSQL_DATABASE=personal_portfolio \
  -e MYSQL_USER=portfolio \
  -e MYSQL_PASSWORD=portfolio_pass \
  -v portfolio-db-data:/var/lib/mysql \
  mariadb:10.11

# Tunggu DB siap (~10s), lalu:
cd portfolio-api-rs
podman build -t portfolio-api-rs -f Containerfile .
podman run -d --name portfolio-api-rs --pod portfolio-rs-pod \
  -e DB_HOST=portfolio-db \
  -e DB_DATABASE=personal_portfolio \
  -e DB_USERNAME=portfolio \
  -e DB_PASSWORD=portfolio_pass \
  -e PORT=8000 \
  portfolio-api-rs
```

Rust API tidak butuh migrasi terpisah (skema DB sama dengan Lumen; jalankan migrasi sekali pakai Lumen jika perlu).

### Build image frontend (opsional)

```bash
cd portfolio-web
podman build -t portfolio-web -f Containerfile .
# Jalankan dengan proxy ke API (pastikan API bisa diakses dari host, atau gunakan compose)
podman run -d --name portfolio-web -p 3000:80 --add-host=host.containers.internal:host-gateway portfolio-web
# Jika nginx proxy ke api:8000, perlu satu network; lebih mudah pakai compose.
```

## 5. Akses

| Service   | URL                         |
|----------|-----------------------------|
| API (Lumen) | http://localhost:8000    |
| API (Rust)  | http://localhost:8001    |
| Swagger (Lumen) | http://localhost:8000/docs |
| Swagger (Rust)  | http://localhost:8001/docs |
| Visitor  | http://localhost:3000      |
| Admin    | http://localhost:3001      |

Untuk pakai **Rust API** sebagai backend production, arahkan frontend ke `http://localhost:8001` (atau set `VITE_API_URL` ke URL api-rs).

## 6. Stop dan hapus

```bash
podman-compose down
# Volume DB tetap ada. Hapus volume: podman-compose down -v
```
