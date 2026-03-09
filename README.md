# Portfolio Stack

Stack portfolio pribadi: API (Lumen), situs pengunjung (React), dan panel admin (React).

## Struktur proyek

| Folder / file | Peran |
|---------------|--------|
| **api** | Backend Lumen: REST API, auth, CRUD (users, blog posts, projects, skills, dll.). |
| **dashboard** | Frontend admin (React + Vite): login, dashboard, CRUD, menu dropdown, relasi tampil nama. |
| **web** | Frontend publik (React + Vite): halaman portfolio dan blog untuk pengunjung. |
| **docs/** | Dokumen proyek (perancangan admin, audit, dll.). |
| **compose.yaml** | Orkestrasi Podman/Docker: db, api, web, admin. |
| **DEPLOY.md** | Panduan deploy dengan Podman/Docker. |

## Menjalankan dari root (development)

### Dependency

```bash
npm run install:all
```

Memasang dependency untuk `dashboard` dan `web`. API memakai Composer: `cd api && composer install`.

### Build frontend (production)

```bash
npm run build
```

Build `dashboard` dan `web`. Atau per app: `npm run build:admin`, `npm run build:web`.

### Development (hot reload)

Jalankan API dan DB terlebih dahulu (lihat [api/README.md](api/README.md) atau Compose). Lalu, dari root:

```bash
npm run dev:admin   # Admin di http://localhost:3001
npm run dev:web     # Web di http://localhost:3000
```

Jalankan di dua terminal jika ingin admin dan web sekaligus.

## Deploy (container)

Lihat [DEPLOY.md](DEPLOY.md) untuk build dan jalankan seluruh stack dengan Podman/Docker Compose.

## Dokumentasi

Dokumentasi menyeluruh ada di folder **docs/**; indeks lengkap: [docs/README.md](docs/README.md).

- [docs/SRS-PORTFOLIO.md](docs/SRS-PORTFOLIO.md) — Spesifikasi kebutuhan perangkat lunak (FR, NFR, batasan) untuk aplikasi web portfolio.
- [docs/RINGKASAN_RANCANGAN.md](docs/RINGKASAN_RANCANGAN.md) — Ringkasan rancangan proyek dan backlog fitur utama.
- [docs/ARSITEKTUR.md](docs/ARSITEKTUR.md) — Gambaran stack, alur akses, dan pembagian publik vs admin.
- [docs/DIAGRAM_DAN_ERD.md](docs/DIAGRAM_DAN_ERD.md) — Diagram arsitektur, ERD database, dan alur (Mermaid).
- [docs/RANCANGAN_WEB_UI_UX.md](docs/RANCANGAN_WEB_UI_UX.md) — Rancangan UI/UX situs publik (Clean & Content-First).
- [docs/RANCANGAN_ADMIN_UI_UX.md](docs/RANCANGAN_ADMIN_UI_UX.md) — Rancangan UI/UX panel admin (Clean Data-Driven Dashboard).
- [docs/PERANCANGAN_ADMIN.md](docs/PERANCANGAN_ADMIN.md) — Fitur admin: login, current user, relasi nama, menu dropdown.
- [docs/PUBLIKASI_WEB.md](docs/PUBLIKASI_WEB.md) — Perilaku API untuk publik vs admin (blog-posts, projects).
- [docs/ALUR_KONTEN_POST.md](docs/ALUR_KONTEN_POST.md) — Alur end-to-end konten blog post dari admin sampai tampil di web publik.
- [docs/AUDIT_REPORT_ISO27001.md](docs/AUDIT_REPORT_ISO27001.md) — Laporan audit keamanan (API & admin, ISO 27001:2022).
- [docs/AUDIT_PROJECT.md](docs/AUDIT_PROJECT.md) — Audit proyek (struktur, dokumentasi, dependensi, tooling).
- [docs/AUDIT_MENYELURUH.md](docs/AUDIT_MENYELURUH.md) — Audit menyeluruh (konsolidasi semua audit).
- [docs/AUDIT_API.md](docs/AUDIT_API.md) — Audit API (portfolio-api): routing, auth, validasi, testing.
- [docs/PANDUAN_DOKUMENTASI_RPL.md](docs/PANDUAN_DOKUMENTASI_RPL.md) — Panduan struktur dokumen RPL/SDLC, mapping ke artefak Scrum, dan peta dokumen proyek.
- [DEPLOY.md](DEPLOY.md) — Deploy stack dengan Podman/Docker Compose.

## Subproyek & struktur kode singkat

- [api/README.md](api/README.md) — Setup dan jalankan API.
- [dashboard/README.md](dashboard/README.md) — Setup admin.
- [web/README.md](web/README.md) — Setup situs publik.

**Struktur kode (high-level):**

- **api**: Lumen 10 dengan struktur standar Laravel/Lumen:
  - `app/Http/Controllers` untuk endpoint REST (publik dan admin).
  - `app/Models` untuk model Eloquent (users, projects, blog_posts, dll.).
  - `database/migrations` dan `database/seeders` untuk skema & data awal.
  - `tests` untuk PHPUnit (feature test endpoint utama).
- **dashboard**: React + Vite:
  - `src/pages` untuk halaman (Dashboard, Messages, CRUD resource).
  - `src/components` dan `src/components/ui` untuk layout, tabel, form, badge, dll.
  - `src/api.js` dan `src/auth.js` untuk komunikasi ke API dan auth.
- **web**: React + Vite:
  - `src/pages` untuk halaman publik (Home, About, Projects, Blog, Contact, dll.).
  - `src/components` dan `src/components/ui` untuk layout, header/footer, timeline, state loading/error.
  - `src/api.js` untuk konsumsi endpoint publik (`GET` resource, contact form).
