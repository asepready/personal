# Deploy — Personal Branding (Podman + Alpine)

Image berbasis **Alpine Linux**. Build dari **root proyek**.

## Prasyarat

- Podman (atau Docker) terpasang
- Proyek API dan Web sudah siap (minimal `api/cmd/server/main.go` ada, `web` sudah bisa `npm run build`)

**Catatan:** `.dockerignore` di root dipakai agar `api/.env` dan `node_modules` tidak ikut ke context/image.

## Build image

Dari **root** (`c:\laragon\www\personal`):

```powershell
# API (Golang → binary di Alpine)
podman build -f deploy/api/Dockerfile -t personal-api .

# Web (Vue build di container, hasilnya di Nginx Alpine)
podman build -f deploy/web/Dockerfile -t personal-web .
```

## Menjalankan container

### Standalone (tanpa compose)

```powershell
# API — port 8080 (nama "api" dipakai agar container web bisa proxy ke backend)
podman run -d --name api -p 8080:8080 personal-api

# Web — port 80
podman run -d --name personal-web -p 80:80 personal-web
```

Jika API butuh koneksi MariaDB (env):

```powershell
podman run -d --name api -p 8080:8080 -e DB_DSN="user:pass@tcp(host:3306)/dbname" personal-api
```

Atau gunakan file env (jalan di host, bukan di dalam image):

```powershell
podman run -d --name api -p 8080:8080 --env-file api/.env personal-api
```

**CORS:** Jika frontend di domain/origin lain memanggil API, set env `ALLOW_ORIGIN` (mis. `https://yoursite.com`).

### MariaDB (jika pakai container)

```powershell
podman run -d --name mariadb -e MARIADB_ROOT_PASSWORD=secret -e MARIADB_DATABASE=personal -p 3306:3306 mariadb:latest
```

Lalu jalankan API dengan `DB_DSN` yang mengarah ke IP/host MariaDB (mis. `host.docker.internal` di Windows/macOS atau nama container jika pakai pod/network yang sama).

### Cek

- Web: http://localhost  
- API: http://localhost:8080/api/health (atau http://localhost:8081/api/health jika backend standalone)

### Stop & hapus

```powershell
podman stop api personal-web
podman rm api personal-web
```

## Opsi: Network bersama (proxy /api ke backend)

Image web memakai proxy `/api/` → `http://api:8080/`. Buat network dan jalankan container API dengan nama **api**:

```powershell
podman network create personal-net
podman run -d --name api --network personal-net -p 8080:8080 personal-api
podman run -d --name personal-web --network personal-net -p 80:80 personal-web
```

Akses http://localhost; request ke `/api/*` akan di-proxy ke backend (api:8080 atau api:8081).

## Referensi

- Langkah inisialisasi proyek: [docs/SETUP-COMMANDS.md](../docs/SETUP-COMMANDS.md)
- ToDo & fase pengembangan: [ToDo.md](../ToDo.md)
