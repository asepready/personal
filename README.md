# Portfolio Stack

Stack portfolio pribadi: API (Lumen), situs pengunjung (React), dan panel admin (React).

## Struktur proyek

| Folder / file | Peran |
|---------------|--------|
| **portfolio-api** | Backend Lumen: REST API, auth, CRUD (users, blog posts, projects, skills, dll.). |
| **portfolio-admin** | Frontend admin (React + Vite): login, dashboard, CRUD, menu dropdown, relasi tampil nama. |
| **portfolio-web** | Frontend publik (React + Vite): halaman portfolio dan blog untuk pengunjung. |
| **docs/** | Dokumen proyek (perancangan admin, audit, dll.). |
| **compose.yaml** | Orkestrasi Podman/Docker: db, api, web, admin. |
| **DEPLOY.md** | Panduan deploy dengan Podman/Docker. |

## Menjalankan dari root (development)

### Dependency

```bash
npm run install:all
```

Memasang dependency untuk `portfolio-admin` dan `portfolio-web`. API memakai Composer: `cd portfolio-api && composer install`.

### Build frontend (production)

```bash
npm run build
```

Build `portfolio-admin` dan `portfolio-web`. Atau per app: `npm run build:admin`, `npm run build:web`.

### Development (hot reload)

Jalankan API dan DB terlebih dahulu (lihat [portfolio-api/README.md](portfolio-api/README.md) atau Compose). Lalu, dari root:

```bash
npm run dev:admin   # Admin di http://localhost:3001
npm run dev:web     # Web di http://localhost:3000
```

Jalankan di dua terminal jika ingin admin dan web sekaligus.

## Deploy (container)

Lihat [DEPLOY.md](DEPLOY.md) untuk build dan jalankan seluruh stack dengan Podman/Docker Compose.

## Dokumentasi

Dokumentasi menyeluruh ada di folder **docs/**; indeks lengkap: [docs/README.md](docs/README.md).

- [docs/ARSITEKTUR.md](docs/ARSITEKTUR.md) — Gambaran stack, alur akses, dan pembagian publik vs admin.
- [docs/PERANCANGAN_ADMIN.md](docs/PERANCANGAN_ADMIN.md) — Fitur admin: login, current user, relasi nama, menu dropdown.
- [docs/PUBLIKASI_WEB.md](docs/PUBLIKASI_WEB.md) — Perilaku API untuk publik vs admin (blog-posts, projects).
- [docs/AUDIT_REPORT_ISO27001.md](docs/AUDIT_REPORT_ISO27001.md) — Laporan audit keamanan (API & admin).
- [DEPLOY.md](DEPLOY.md) — Deploy stack dengan Podman/Docker Compose.

## Subproyek

- [portfolio-api/README.md](portfolio-api/README.md) — Setup dan jalankan API.
- [portfolio-admin/README.md](portfolio-admin/README.md) — Setup admin.
- [portfolio-web/README.md](portfolio-web/README.md) — Setup situs publik.
