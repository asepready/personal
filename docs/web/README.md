# Dokumentasi Web (Frontend)

Stack: **Vue 3**, **Vue Router**, **Vite**, **Tailwind CSS**.

## Struktur

- `src/pages/` — halaman per route (Home, About, Skills, Projects, Blog, Contact, Status, Login, Admin)
- `src/components/` — Layout (header, nav, dark mode)
- `src/composables/useAuth.js` — state login & token
- `src/composables/useApi.js` — base URL API & helper `skillsUrl()`, `loginUrl()`, `statusUrl()`, `adminUrl()`
- `src/router/index.js` — route + guard `requiresAuth` untuk /admin

## Script

- `npm run dev` — development; proxy mengirim `/api`, `/login`, `/status`, `/admin` ke backend (default `http://localhost:8080`)
- `npm run build` — build produksi ke `dist/`
- `npm run preview` — preview build

## Konten statis

- **CV:** Letakkan `cv.pdf` di `web/public/` agar tombol "Download CV" di Home berfungsi (Phase 3 ToDo). PDF sebaiknya tanpa password.
- **Sitemap (Phase 6):** Edit `web/public/sitemap.xml` — ganti `https://yoursite.com` dengan URL production Anda.

## Env

- **`VITE_API_URL`** — Base URL backend jika frontend dan API beda origin (mis. `https://api.yoursite.com`). Jika kosong, request pakai path relatif (`/api/skills`, `/login`, `/status`, `/admin`). Di dev, Vite proxy meneruskan ke `http://localhost:8080`; di production pastikan reverse proxy atau CORS mengarahkan path tersebut ke backend.

Referensi: [ToDo.md](../../ToDo.md), [STRUKTUR-PROYEK.md](../STRUKTUR-PROYEK.md).
