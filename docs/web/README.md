# Dokumentasi Web (Frontend)

Stack: **Vue 3**, **Vue Router**, **Vite**, **Tailwind CSS**.

## Struktur

- `src/pages/` — halaman per route (Home, About, Skills, Projects, Blog, Contact, Status, Login, Admin)
- `src/components/` — Layout (header, nav, dark mode)
- `src/composables/useAuth.js` — state login & token
- `src/composables/useApi.js` — base URL API & helper `skillsUrl()`, `loginUrl()`, `statusUrl()`, `adminUrl()`
- `src/router/index.js` — route + guard `requiresAuth` untuk area admin (path frontend /admin)

## Script

- `npm run dev` — development; proxy mengirim `/api` ke backend (default `http://localhost:8081`); semua endpoint API di `/api/` dan `/api/admin/`
- `npm run build` — build produksi ke `dist/`
- `npm run preview` — preview build

## Konten statis & aset

- **CV:** Letakkan `cv.pdf` di `web/public/`. Ukuran **≤ 5 MB** (CI gagal jika lebih). PDF tanpa password. Lihat [docs/ASSETS-AND-IMAGES.md](../ASSETS-AND-IMAGES.md).
- **Gambar:** Gunakan WebP/AVIF; diagram topologi ekspor SVG atau WebP. Skrip: `npm run optimize:images` (konversi PNG/JPG → WebP di `public/` dan `src/assets/`). Lihat [docs/ASSETS-AND-IMAGES.md](../ASSETS-AND-IMAGES.md).
- **Social preview (OG):** Letakkan gambar **1200×630 px** di `web/public/og-image.png`; meta OG/Twitter ada di `index.html`. Ganti `yoursite.com` dengan URL production. Lihat [docs/SEO-SOCIAL.md](../SEO-SOCIAL.md).
- **Sitemap (Phase 6):** Edit `web/public/sitemap.xml` — ganti `https://yoursite.com` dengan URL production Anda.

## Graceful degradation (API down)

Jika backend API tidak tersedia (maintenance, error, atau CORS), halaman **Skills**, **Projects**, **Blog**, dan **BlogPost** tidak menampilkan error kosong atau loading tanpa akhir. Logika: `try { fetch(api) } catch { useFallback = true }`; jika `!r.ok` juga set fallback. Data fallback (JSON statis di dalam kode) ditampilkan dan pesan “API tidak tersedia; menampilkan data contoh.” ditampilkan. Fallback ada di: `Skills.vue`, `Projects.vue`, `Blog.vue`, `BlogPost.vue`.

## Env

- **`VITE_API_URL`** — Base URL backend jika frontend dan API beda origin (mis. `https://api.yoursite.com`). Jika kosong, request pakai path relatif (`/api/skills`, `/api/login`, `/api/status`, `/api/admin`, dll.). Di dev, Vite proxy meneruskan `/api` ke `http://localhost:8081`; di production pastikan reverse proxy atau CORS mengarahkan `/api` ke backend.

Referensi: [ToDo.md](../../ToDo.md), [STRUKTUR-PROYEK.md](../STRUKTUR-PROYEK.md).
