# CI/CD & Deploy

## Strategi hosting (penting)

Proyek punya **dua komponen** yang harus di-host terpisah:

| Komponen | Hosting | Catatan |
|----------|---------|--------|
| **Frontend (Web)** | GitHub Pages, Netlify, Cloudflare Pages | Hanya static (HTML/CSS/JS). CI saat ini deploy build ke **GitHub Pages**. |
| **Backend API (Go)** | **Bukan** GitHub Pages | GitHub Pages hanya static; proses/server Go tidak bisa jalan di sana. |

**Backend API** harus di-deploy ke salah satu:

- **PaaS (rekomendasi untuk mulai):** [Railway](https://railway.app), [Render](https://render.com), [Fly.io](https://fly.io), [Heroku](https://heroku.com). Connect repo atau upload binary, lalu set environment variables di dashboard.
- **VPS:** DigitalOcean, Linode, Vultr, dll. Build binary (`cd api && make build`), upload `api/bin/server` dan `api/bin/migrate`, jalankan migrasi sekali, lalu jalankan server (systemd/supervisor). Set env di server (file `.env` atau export).

### Environment variable di hosting backend

Wajib diatur di layanan tempat API berjalan (dashboard PaaS atau env di VPS):

| Variabel | Wajib | Keterangan |
|----------|--------|------------|
| `PORT` | Opsional | Port HTTP (default 8080). Banyak PaaS menyetel otomatis. |
| `DB_DSN` | Jika pakai DB | Atau gunakan `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`, `DB_NAME` (lihat `api/configs/.env.example`). |
| `ADMIN_USERNAME` | Ya (untuk login) | Username admin. |
| `ADMIN_PASSWORD` | Ya | Password admin. |
| `JWT_SECRET` | Ya | Minimal 32 karakter untuk tanda-tangan JWT. |
| `ALLOW_ORIGIN` | Jika frontend beda origin | URL asal frontend untuk CORS (mis. `https://username.github.io`). |

Tanpa env ini, API bisa jalan tetapi login/admin dan koneksi DB tidak berfungsi. Setelah deploy backend, set **`VITE_API_URL`** di build frontend ke URL API (mis. `https://api-anda.railway.app`) agar SPA memanggil API yang benar.

---

## GitHub Actions

Workflow: **`.github/workflows/ci-cd.yml`**

### CI (setiap push & pull request ke `main` / `master`)

| Job | Isi |
|-----|-----|
| **API (build + test)** | Checkout → Set up Go (cache) → `go build ./...` → **`go test ./tests/...`** (semua paket & fungsi di `api/tests`) |
| **Web (build)** | Checkout → Set up Node (npm cache) → `npm ci` → `npm run build` → upload artifact `web-dist` |
| **Enable auto-merge** | Hanya pada **pull request**: setelah API dan Web lulus, PR di-set **auto-merge** (squash) sehingga GitHub akan merge otomatis ketika semua required check selesai. |

Deploy **tidak** dijalankan pada pull request, hanya pada **push** ke `main`/`master`.

### CD (hanya pada push ke `main` / `master`)

| Job | Isi |
|-----|-----|
| **Deploy** | Setelah API + Web sukses → download artifact `web-dist` → deploy ke **GitHub Pages** |

### Mengaktifkan GitHub Pages

Workflow memakai `enablement: false` pada `configure-pages`. Jika job **Deploy (GitHub Pages)** gagal dengan error *"Resource not accessible by integration"* atau *"Get Pages site failed"*:

1. Buka repo → **Settings** → **Pages**.
2. Di **Build and deployment** > **Source** pilih **GitHub Actions** (bukan "Deploy from a branch").
3. Simpan. Lalu push ulang atau **Re-run jobs** di tab Actions.

Setelah Pages aktif dan workflow sukses, URL biasanya:  
`https://<username>.github.io/<repo>/`

### Base URL untuk Vite (opsional)

Jika situs di-host di subpath (mis. `https://user.github.io/personal/`), atur base di `web/vite.config.js`:

```js
export default defineConfig({
  base: '/personal/',  // ganti dengan nama repo
  // ...
})
```

Kalau repo Anda adalah **user.github.io** (situs utama), base bisa tetap `/`.

## Auto-merge pull request

Jika job **API (build + test)** dan **Web (build)** lulus di suatu PR, job **Enable auto-merge** akan menjalankan `gh pr merge --auto --squash` sehingga PR tersebut di-set merge otomatis (squash) setelah semua required check selesai.

- Pastikan repo mengizinkan **Squash and merge** (Settings → General → Pull Requests).
- Jika pakai branch protection, tambahkan status check **API (build + test)** dan **Web (build)** agar merge hanya saat CI lulus.

## Ringkasan

- **Hosting:** Frontend → GitHub Pages (atau Netlify/CF Pages). **Backend API (Go) → PaaS (Railway, Render, Fly.io) atau VPS** — wajib set env (`DB_DSN`, `JWT_SECRET`, `ADMIN_*`, `ALLOW_ORIGIN`) di hosting backend.
- **CI:** build + test API (`api/tests`), build Web; jalan di setiap push dan PR.
- **Auto-merge:** pada PR, setelah API & Web lulus, PR di-set auto-merge (squash).
- **CD:** deploy hasil build Web ke GitHub Pages; hanya saat push ke `main`/`master` dan setelah Pages di-set ke **GitHub Actions**.
