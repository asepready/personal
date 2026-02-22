# Personal / Portfolio

Situs personal/portfolio dengan **backend API (Go)** dan **frontend (Vue 3 + Vite)**.

---

## Ringkasan

| Bagian   | Teknologi        | Folder   |
|----------|------------------|----------|
| Backend  | Go 1.21+, MySQL  | `api/`   |
| Frontend | Vue 3, Vite, Tailwind | `web/`   |

- **API:** Health, status, login (JWT), endpoint publik (skills, projects, posts), dan area admin (CRUD kategori & skills).
- **Web:** SPA dengan halaman Beranda, About, Skills, Projects, Blog, Contact, Status, serta dashboard admin (login terlebih dahulu).

---

## Persyaratan

- **Go 1.21+** (untuk API)
- **Node.js 18+** (untuk frontend)
- **MySQL/MariaDB** (opsional; tanpa DB, API tetap jalan untuk health/status/login; data skills/projects/posts memerlukan DB)

---

## Menjalankan di development

### 1. Backend (API)

```bash
cd api
cp configs/.env.example configs/.env
# Edit configs/.env: PORT, DB_*, ADMIN_USERNAME, ADMIN_PASSWORD, JWT_SECRET

# Opsional: migrasi database
go run ./cmd/migrate

# Jalankan server (default http://localhost:8080)
go run ./cmd/server
# atau: make run
```

Cek: [http://localhost:8080/health](http://localhost:8080/health), [http://localhost:8080/status](http://localhost:8080/status).

### 2. Frontend (Web)

```bash
cd web
npm install
npm run dev
```

Frontend di [http://localhost:5173](http://localhost:5173). Vite mem-proxy `/api`, `/login`, dan `/admin` ke backend (port 8080).

---

## Struktur proyek

```
personal/
├── api/                    # Backend Go
│   ├── cmd/
│   │   ├── server/         # Entry point HTTP server
│   │   └── migrate/        # CLI migrasi database
│   ├── configs/            # .env (dari .env.example)
│   ├── internal/
│   │   ├── config/         # Baca env
│   │   ├── database/      # Koneksi DB, migrasi
│   │   ├── handlers/      # HTTP handlers (auth, skills, projects, posts, admin)
│   │   ├── middleware/    # CORS, security headers, RequireAuth (JWT)
│   │   └── models/        # Struct data
│   ├── tests/             # Unit test
│   └── go.mod
│
├── web/                    # Frontend Vue
│   ├── src/
│   │   ├── pages/         # Halaman (Home, About, Skills, Blog, admin/…)
│   │   ├── components/    # Layout, AdminLayout
│   │   ├── composables/   # useAuth, useApi
│   │   └── router/        # Route + guard requiresAuth untuk /admin
│   ├── index.html
│   ├── vite.config.js     # Proxy ke backend
│   └── package.json
│
├── docs/                   # Dokumentasi
│   ├── STRUKTUR-PROYEK.md # Pemetaan file berdasarkan fungsi
│   ├── RUN-API.md         # Cara jalankan API
│   └── api/               # Doc endpoint, DB, env
│
└── README.md               # File ini
```

---

## Build & deploy

- **Backend API:** `cd api && make build` → binary di `api/bin/server` (dan `bin/migrate`). **Tidak bisa di-host di GitHub Pages** (hanya static). Deploy ke PaaS (Railway, Render, Fly.io, Heroku) atau VPS; wajib set environment variable (`PORT`, `DB_DSN`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `JWT_SECRET`, `ALLOW_ORIGIN`) di layanan tersebut. Detail: [docs/DEPLOY.md](docs/DEPLOY.md).
- **Frontend:** `cd web && npm run build` → output di `web/dist/`. Deploy isi `dist/` ke static hosting (GitHub Pages, Netlify, Cloudflare Pages). Untuk production, set `VITE_API_URL` ke URL backend API jika beda origin.

---

## Endpoint API (ringkas)

| Method | Path | Auth | Fungsi |
|--------|------|------|--------|
| GET | `/health` | — | Health check |
| GET | `/status`, `/api/status` | — | Uptime & status DB |
| POST | `/login` | — | Login admin → JWT |
| GET | `/api/skills` | — | Daftar skills |
| GET | `/api/projects`, `/api/projects/:slug` | — | Daftar & detail proyek |
| GET | `/api/posts`, `/api/posts/:slug` | — | Daftar & detail blog |
| GET | `/admin` | Bearer JWT | Overview admin |
| GET/POST/PUT/DELETE | `/admin/skill-categories` | Bearer JWT | CRUD kategori skill |
| GET/POST/PUT/DELETE | `/admin/skills` | Bearer JWT | CRUD skills |

Token JWT berlaku 7 hari. Konfigurasi env (PORT, DB, ADMIN_*, JWT_SECRET, CORS): **api/configs/.env.example** dan **docs/api/README.md**.

---

## Dokumentasi lebih lanjut

- [docs/DEPLOY.md](docs/DEPLOY.md) — **Strategi hosting** (frontend vs backend), env backend, CI/CD & GitHub Pages
- [docs/STRUKTUR-PROYEK.md](docs/STRUKTUR-PROYEK.md) — Lokasi file berdasarkan fungsi (backend & frontend)
- [docs/RUN-API.md](docs/RUN-API.md) — Menjalankan API, migrasi, Makefile
- [api/README.md](api/README.md) — Quick start & endpoint API
- [docs/api/README.md](docs/api/README.md) — Endpoint detail, konfigurasi env, database
- [docs/web/README.md](docs/web/README.md) — Stack & struktur frontend
