# Deploy ke Podman (microservice)

Deploy aplikasi sebagai **microservice** dengan Podman (atau Docker): **API (Go)**, **Web (Vue + nginx)**, dan **MariaDB**.

---

## Arsitektur

```
                    ┌─────────────┐
                    │   Browser   │
                    └──────┬──────┘
                           │ :8080
                    ┌──────▼──────┐
                    │    web      │  nginx (static + proxy)
                    │  (frontend) │  /api, /login, /admin → api:8081
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
       ┌──────▼──────┐     │     ┌─────▼─────┐
       │     api     │     │     │    db     │
       │  (Go :8081) │◄────┘     │ (MariaDB) │
       └──────┬──────┘           └───────────┘
              │
              └──────────────────► db:3306
```

| Service | Image | Port | Keterangan |
|--------|--------|------|------------|
| **web** | personal-web (Vue build + nginx) | 8080→80 | SPA + reverse proxy ke API |
| **api** | personal-api (Go binary) | 8081 (internal) | Backend, hanya diakses dari web |
| **db** | mariadb:11 | 3306 (internal) | Database |

---

## Persyaratan

- **Podman** (atau Docker) + **Podman Compose** / **Docker Compose**
  - Windows: [Podman Desktop](https://podman-desktop.io/) atau WSL2 + Podman
  - Linux: `podman`, `podman-compose` (atau `podman compose` v4.1+)

---

## Cara deploy

### 1. Siapkan env (opsional)

```bash
cp .env.podman.example .env
# Edit .env: DB_PASSWORD, ADMIN_PASSWORD, JWT_SECRET
```

Tanpa file `.env`, compose memakai nilai default di `compose.yaml` (kurang aman untuk production).

### 2. Build dan jalankan

Dari **root proyek** (folder yang berisi `compose.yaml`):

```bash
# Build image dan jalankan semua service
podman-compose up -d --build
# atau (Podman 4.1+):
podman compose up -d --build
```

### 3. Migrasi database (pertama kali)

Setelah container **api** dan **db** jalan, jalankan migrasi sekali (image API sudah menyertakan binary `migrate`):

```bash
# Ganti changeme jika Anda set DB_PASSWORD di .env. Nama network: personal_default (atau <folder>_default)
podman run --rm --network personal_default \
  -e DB_DSN="personal:changeme@tcp(personal-db:3306)/personal?parseTime=true" \
  personal-api:latest /app/migrate
```

Jika nama network berbeda, cek: `podman network ls` lalu gunakan nama yang ada (biasanya `<nama_folder>_default`).

Atau dari dalam container api yang sudah jalan (env sudah ter-set dari compose):

```bash
podman exec personal-api /app/migrate
```

### 4. Akses aplikasi

- **Frontend (SPA):** http://localhost:8080  
- API hanya diakses lewat nginx (same-origin), tidak perlu buka port 8081 ke host.

### 5. Log dan stop

```bash
# Log
podman-compose logs -f

# Stop
podman-compose down
# Hapus volume DB (data hilang):
podman-compose down -v
```

---

## Build manual (tanpa compose)

```bash
# API
podman build -t personal-api:latest -f api/Containerfile api/

# Web
podman build -t personal-web:latest -f web/Containerfile web/
```

---

## Variabel lingkungan (compose)

| Variabel | Default | Keterangan |
|----------|---------|------------|
| `DB_PASSWORD` | changeme | Password user DB `personal` |
| `DB_ROOT_PASSWORD` | rootsecret | Password root MariaDB |
| `ADMIN_USERNAME` | admin | Username login admin |
| `ADMIN_PASSWORD` | admin | Password login admin (ganti di production) |
| `JWT_SECRET` | (32 char) | Secret JWT (min 32 karakter) |
| `ALLOW_ORIGIN` | (kosong) | CORS; kosongkan jika pakai proxy same-origin |

---

## Troubleshooting

- **Web tidak bisa akses API:** Pastikan service **api** dan **web** satu network (`personal`). Cek: `podman network inspect personal_default`.
- **DB connection refused di api:** Tunggu healthcheck **db** lulus. Cek: `podman ps` (state **healthy**). Bisa juga coba restart: `podman-compose restart api`.
- **Port 8080 sudah dipakai:** Ubah di `compose.yaml` pada service **web**: `ports: - "8888:80"`.
