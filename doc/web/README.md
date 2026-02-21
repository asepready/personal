# Dokumentasi Web (Frontend)

Stack: **Vue 3**, **Vue Router**, **Vite**, **Tailwind CSS**.

## Struktur

- `src/pages/` — halaman per route (Home, About, Skills, Projects, Blog, Contact, Status, Login, Admin)
- `src/components/` — Layout (header, nav, dark mode)
- `src/composables/useAuth.js` — state login & token
- `src/router/index.js` — route + guard `requiresAuth` untuk /admin

## Script

- `npm run dev` — development (proxy `/api` → backend)
- `npm run build` — build produksi ke `dist/`
- `npm run preview` — preview build

## Konten statis

- **CV:** Letakkan `cv.pdf` di `web/public/` agar tombol "Download CV" di Home berfungsi (Phase 3 ToDo). PDF sebaiknya tanpa password.
- **Sitemap (Phase 6):** Edit `web/public/sitemap.xml` — ganti `https://yoursite.com` dengan URL production Anda.

## Env

- `VITE_API_URL` — base URL API jika frontend dan API beda origin (mis. `https://api.yoursite.com`). Jika kosong, request pakai path relatif `/api/...` (proxy di dev, rewrite di prod).

Referensi: [ToDo.md](../../ToDo.md), [deploy/README.md](../../deploy/README.md).
