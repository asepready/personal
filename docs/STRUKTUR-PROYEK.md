# Struktur Proyek — File Berdasarkan Fungsinya

Dokumen ini memetakan lokasi file di repository berdasarkan **fungsi** (apa peran setiap folder/file).

---

## Ringkasan

- **Backend (API):** Go, di dalam folder `api/`
- **Frontend (Web):** Vue 3 + Vite, di dalam folder `web/`
- **Root:** Kode aplikasi Go sepenuhnya di `api/`. Folder template yang tidak dipakai telah dihapus.

---

## 1. Backend (API) — `api/`

### Entry point & executable
| Lokasi | Fungsi |
|--------|--------|
| `api/cmd/server/main.go` | Jalankan HTTP server, daftar route, middleware |
| `api/cmd/migrate/main.go` | CLI untuk menjalankan migrasi database |

### Konfigurasi
| Lokasi | Fungsi |
|--------|--------|
| `api/configs/.env.example` | Contoh variabel lingkungan (copy ke `.env`) |
| `api/configs/.env` | Nilai aktual (jangan di-commit) |
| `api/internal/config/config.go` | Baca env, konfigurasi app (DB, JWT, CORS, dll.) |

### Database
| Lokasi | Fungsi |
|--------|--------|
| `api/internal/database/database.go` | Koneksi DB, pool |
| `api/internal/database/migrate.go` | Logika migrasi (up/down) |
| `api/internal/database/table.sql` | Referensi schema (bukan migrasi) |
| `api/internal/database/migrations/001_initial.up.sql` | Migrasi: buat tabel |
| `api/internal/database/migrations/001_initial.down.sql` | Migrasi: rollback |

### Model data
| Lokasi | Fungsi |
|--------|--------|
| `api/internal/models/models.go` | Struct Go (User, Skill, dsb.) untuk DB & API |

### Handler (HTTP)
| Lokasi | Fungsi |
|--------|--------|
| `api/internal/handlers/health.go` | Health check (liveness/readiness) |
| `api/internal/handlers/status.go` | Status page (uptime, dll.) |
| `api/internal/handlers/auth.go` | Login, register, token |
| `api/internal/handlers/admin.go` | Endpoint admin (perlu auth) |
| `api/internal/handlers/skills.go` | CRUD skills (public + admin) |

### Middleware
| Lokasi | Fungsi |
|--------|--------|
| `api/internal/middleware/middleware.go` | Kumpulan middleware (recovery, logging, dll.) |
| `api/internal/middleware/auth.go` | Verifikasi JWT, inject user ke context |
| `api/internal/middleware/cors.go` | CORS headers |

### Utilitas (bisa dipakai ulang)
| Lokasi | Fungsi |
|--------|--------|
| `api/pkg/utils/utils.go` | Helper umum (response JSON, error, dll.) |

### Tes
| Lokasi | Fungsi |
|--------|--------|
| `api/internal/handlers/*_test.go` | Unit test handler |
| `api/internal/middleware/auth_test.go` | Unit test middleware auth |

### Script & build
| Lokasi | Fungsi |
|--------|--------|
| `api/scripts/run.sh` | Jalankan server (dev) |
| `api/scripts/build.sh` | Build binary |
| `api/scripts/migrate.sh` | Jalankan migrasi |
| `api/scripts/test.sh` | Jalankan tes |
| `api/Makefile` | Target make (run, build, migrate, test) |

### Dokumentasi API
| Lokasi | Fungsi |
|--------|--------|
| `api/docs/README.md` | Penjelasan singkat entry point, DB, layout |

---

## 2. Frontend (Web) — `web/`

### Entry & app
| Lokasi | Fungsi |
|--------|--------|
| `web/src/main.js` | Entry Vue, mount app |
| `web/src/App.vue` | Root component, router-view |
| `web/src/style.css` | Global CSS (Tailwind, tema) |

### Routing
| Lokasi | Fungsi |
|--------|--------|
| `web/src/router/index.js` | Definisi route, guard `requiresAuth` untuk /admin |

### Halaman (per route)
| Lokasi | Fungsi |
|--------|--------|
| `web/src/pages/Home.vue` | Beranda |
| `web/src/pages/About.vue` | Tentang |
| `web/src/pages/Skills.vue` | Daftar skills |
| `web/src/pages/Projects.vue` | Proyek / portfolio |
| `web/src/pages/Blog.vue` | Daftar blog |
| `web/src/pages/BlogPost.vue` | Satu artikel blog |
| `web/src/pages/Contact.vue` | Kontak |
| `web/src/pages/Status.vue` | Status / uptime (Phase 5 ToDo) |
| `web/src/pages/Login.vue` | Login |
| `web/src/pages/Admin.vue` | Area admin (perlu auth) |
| `web/src/pages/NotFound.vue` | 404 (Phase 6 ToDo: custom 404) |

### Komponen
| Lokasi | Fungsi |
|--------|--------|
| `web/src/components/Layout.vue` | Layout (header, nav, dark mode) |

### State & logic
| Lokasi | Fungsi |
|--------|--------|
| `web/src/composables/useAuth.js` | State login, token, logout |

### Aset & publik
| Lokasi | Fungsi |
|--------|--------|
| `web/src/assets/` | Gambar/ikon untuk dipakai di komponen (e.g. vue.svg) |
| `web/public/` | File statis (sitemap.xml, cv.pdf) — tidak di-process Vite |

### Build output
| Lokasi | Fungsi |
|--------|--------|
| `web/dist/` | Hasil `npm run build` (deploy ke hosting) |

### Konfigurasi
| Lokasi | Fungsi |
|--------|--------|
| `web/package.json` | Dependensi, script (dev, build, preview) |
| `VITE_API_URL` (env) | Base URL API jika beda origin |

---

## 3. Root & folder umum (template Standard Go Layout)

Folder berikut mengikuti template; yang **aktif dipakai** hanya beberapa.

### Dokumentasi
| Lokasi | Fungsi |
|--------|--------|
| `README.md` | Template Standard Go Project Layout (bisa diganti jadi doc proyek Anda) |
| `ToDo.md` | Rencana fase (Phase 1–6) — fondasi sampai easter eggs |
| `docs/README.md` | Indeks dokumentasi proyek |
| `docs/SETUP-COMMANDS.md` | Command line: init, deploy (Podman, dll.) |
| `docs/web/README.md` | Doc frontend (stack, struktur, script, env) |
| `docs/STRUKTUR-PROYEK.md` | **Dokumen ini** — file berdasarkan fungsi |

### CI/CD
| Lokasi | Fungsi |
|--------|--------|
| `.github/workflows/ci.yml` | GitHub Actions: build API + Web pada push/PR ke main |

### Konfigurasi repo
| Lokasi | Fungsi |
|--------|--------|
| `.gitignore` | File/folder yang diabaikan Git |
| `.editorconfig` | Gaya indentasi, line ending |
| `.gitattributes` | Atribut Git (e.g. line ending) |
| `Makefile` | Target make di level root (jika ada) |
| `go.mod` | Module Go di root (jika dipakai; saat ini modul Go ada di `api/go.mod`) |

### Folder lain di root
| Lokasi | Fungsi |
|--------|--------|
| `docs/` | **Dipakai** — lihat tabel Dokumentasi di atas |
| `vendor/` | Opsional: dependensi Go (`go mod vendor`); bisa di-.gitignore |

---

## 4. Alur singkat

- **Development:**  
  - API: `cd api && make run` (atau `./scripts/run.sh`).  
  - Web: `cd web && npm run dev` (proxy `/api` ke backend).
- **Build:**  
  - API: `cd api && make build`.  
  - Web: `cd web && npm run build` → hasil di `web/dist/`.
- **Deploy:**  
  - API: binary + `.env` + migrasi.  
  - Web: deploy isi `web/dist/` ke static hosting (Netlify, Cloudflare Pages, dll.).  
  - CI: `.github/workflows/ci.yml` memastikan API dan Web bisa di-build.

Referensi rencana: [ToDo.md](../ToDo.md).
