# CI/CD & Deploy

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

Workflow memakai `enablement: true` pada `configure-pages` sehingga Pages bisa aktif otomatis. Jika job **Deploy (GitHub Pages)** tetap gagal dengan error *"Get Pages site failed"* atau *"Not Found"*:

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

- **CI:** build + test API (`api/tests`), build Web; jalan di setiap push dan PR.
- **Auto-merge:** pada PR, setelah API & Web lulus, PR di-set auto-merge (squash).
- **CD:** deploy hasil build Web ke GitHub Pages; hanya saat push ke `main`/`master` dan setelah Pages di-set ke **GitHub Actions**.
