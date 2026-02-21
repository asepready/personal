# Langkah-Langkah Inisialisasi Proyek — Personal Branding SysAdmin

Referensi struktur: [ToDo.md](../ToDo.md).  
Stack: **API** (Golang + MariaDB), **Web** (Vue.js), **Deploy** (Podman, image Alpine).

---

## Prasyarat

- **Go** 1.21+ — [go.dev/dl](https://go.dev/dl/)
- **Node.js** 18+ (LTS) — [nodejs.org](https://nodejs.org/)
- **Podman** (atau Docker) — [podman.io](https://podman.io/)
- **Git**

Cek versi:

```powershell
go version
node -v
podman --version
git --version
```

---

## 1. Inisialisasi Repo & Struktur Folder

Jalankan dari **root proyek** (mis. `c:\laragon\www\personal`).

### 1.1 Buat folder utama

```powershell
mkdir api, web, doc, deploy
```

### 1.2 Struktur API (Backend Golang)

```powershell
cd api
mkdir -p cmd/server, internal/handlers, internal/models, internal/database, internal/middleware, internal/config, pkg/utils
```

Windows (tanpa `-p`):

```powershell
New-Item -ItemType Directory -Force -Path cmd\server, internal\handlers, internal\models, internal\database, internal\middleware, internal\config, pkg\utils
```

### 1.3 Inisialisasi Go module

Masih di folder `api`:

```powershell
go mod init github.com/<username>/personal/api
```

Ganti `<username>` dengan nama organisasi/user GitHub Anda.

### 1.4 Struktur Web (Frontend Vue.js)

Kembali ke root, lalu buat proyek Vue resmi (Vite + Vue 3):

```powershell
cd ..
npm create vue@latest
```

Pilih opsi (untuk minimal & cepat):

- Project name: **web** (atau gunakan nama lain; jika sudah ada folder `web`, buat di subfolder lain lalu pindahkan isinya)
- TypeScript: **No** (atau Yes jika diinginkan)
- JSX: **No**
- Vue Router: **Yes**
- Pinia: **No** (atau Yes)
- Vitest / E2E: **No**
- ESLint: **Yes** (opsional)
- **Tanpa** tambahan (minimal)

Atau non-interaktif (template minimal):

```powershell
npm create vue@latest web -- --default
```

Atau dengan template paling minimal (bare):

```powershell
npm create vue@latest web -- --bare
```

Di PowerShell, jika `--` bermasalah:

```powershell
npm create vue@latest web '--' --default
```

Setelah scaffold selesai:

```powershell
cd web
npm install
```

### 1.5 Sesuaikan struktur Vue dengan ToDo (opsional)

Struktur resmi Vite: `src/` berisi `components`, `assets`, `App.vue`, `main.js`.  
Tambahkan folder **pages** untuk route-based views:

```powershell
mkdir src\pages
```

`index.html` di Vue/Vite ada di **root** proyek `web/`, bukan di `src/` — ini sesuai dokumentasi resmi Vite.

### 1.6 Instalasi tema minimalis (Pico CSS)

Tetap di folder `web`:

```powershell
npm install @picocss/pico
```

Aktifkan tema: di `web/src/main.js` (atau `main.ts`), tambahkan:

```javascript
import '@picocss/pico/css/pico.min.css'
```

Atau di `web/src/assets/main.css`:

```css
@import '@picocss/pico/css/pico.min.css';
```

Lalu pastikan file CSS ini di-import di `main.js`:

```javascript
import './assets/main.css'
```

Pico CSS: semantic HTML, dark/light mode, responsif, tanpa dependensi — cocok untuk tema minimalis yang cepat.

### 1.7 Struktur Doc & Deploy

Dari root:

```powershell
mkdir doc\api, doc\web
mkdir deploy\api, deploy\web
```

Struktur akhir mengacu ke ToDo.md:

```
personal/
├── api/
│   ├── cmd/server/
│   ├── internal/{handlers,models,database,middleware,config}/
│   ├── pkg/utils/
│   └── go.mod
├── web/
│   ├── src/{components,pages,assets}/
│   ├── index.html
│   └── package.json
├── doc/{api,web}/ + README.md
└── deploy/{api,web}/ + README.md
```

---

## 2. API (Golang): File Awal

### 2.1 Entrypoint

Buat `api/cmd/server/main.go`:

```go
package main

import (
	"log"
	"net/http"
)

func main() {
	http.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte(`{"status":"ok"}`))
	})
	log.Fatal(http.ListenAndServe(":8080", nil))
}
```

### 2.2 Cek build

```powershell
cd api
go build -o bin/server ./cmd/server
.\bin\server
```

Di terminal lain: `curl http://localhost:8080/health` → `{"status":"ok"}`.

### 2.3 Driver MariaDB/MySQL

```powershell
go get github.com/go-sql-driver/mysql
```

Koneksi dan migrasi bisa diletakkan di `internal/database/` dan konfigurasi di `internal/config/` (baca dari env).

---

## 3. Web (Vue): Jalankan dev

```powershell
cd web
npm run dev
```

Buka URL yang ditampilkan (biasanya `http://localhost:5173`).  
Build produksi:

```powershell
npm run build
```

Output di `web/dist/` (untuk deploy ke nginx/container).

---

## 4. Deploy dengan Podman (Alpine)

Image dasar: **Alpine**.  
Asumsi: kode API di `api/`, hasil build web di `web/dist/`.

### 4.1 Build image API

Dari **root proyek**:

```powershell
podman build -f deploy/api/Dockerfile -t personal-api .
```

Atau dari folder `api` dengan context root:

```powershell
podman build -f ../deploy/api/Dockerfile -t personal-api ..
```

### 4.2 Build image Web (setelah `npm run build`)

```powershell
cd web
npm run build
cd ..
podman build -f deploy/web/Dockerfile -t personal-web .
```

### 4.3 Jalankan container

```powershell
# MariaDB (jika pakai container)
podman run -d --name mariadb -e MARIADB_ROOT_PASSWORD=secret -e MARIADB_DATABASE=personal -p 3306:3306 mariadb:latest

# API (port 8080)
podman run -d --name api -p 8080:8080 --env-file api/.env personal-api

# Web (port 80)
podman run -d --name web -p 80:80 personal-web
```

Ganti `--env-file` dan env (DB_DSN, dll) sesuai `internal/config`.

### 4.4 Stop & hapus

```powershell
podman stop api web mariadb
podman rm api web mariadb
```

Detail Dockerfile dan opsi lanjutan ada di [deploy/README.md](../deploy/README.md).

---

## Ringkasan Perintah (Copy-Paste)

```powershell
# 1. Folder & Go
mkdir api, web, doc, deploy
cd api
New-Item -ItemType Directory -Force -Path cmd\server, internal\handlers, internal\models, internal\database, internal\middleware, internal\config, pkg\utils
go mod init github.com/<username>/personal/api

# 2. Vue (dari root)
cd ..
npm create vue@latest web -- --default
cd web
npm install
npm install @picocss/pico
mkdir src\pages

# 3. Doc & Deploy
cd ..
New-Item -ItemType Directory -Force -Path doc\api, doc\web, deploy\api, deploy\web
```

Setelah itu: isi `api/cmd/server/main.go`, konfigurasi Pico di `web/src`, lalu build & deploy dengan Podman seperti di atas.
