# Deploy — Personal Branding (Podman + Alpine)

Image berbasis **Alpine Linux**. Build dari **root proyek**.

## Prasyarat

- Podman (atau Docker) terpasang
- Proyek API dan Web sudah siap (minimal `api/cmd/server/main.go` ada, `web` sudah bisa `npm run build`)

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
# API — port 8080
podman run -d --name personal-api -p 8080:8080 personal-api

# Web — port 80
podman run -d --name personal-web -p 80:80 personal-web
```

Jika API butuh koneksi MariaDB (env):

```powershell
podman run -d --name personal-api -p 8080:8080 -e DB_DSN="user:pass@tcp(host:3306)/dbname" personal-api
```

Atau gunakan file env:

```powershell
podman run -d --name personal-api -p 8080:8080 --env-file api/.env personal-api
```

### MariaDB (jika pakai container)

```powershell
podman run -d --name mariadb -e MARIADB_ROOT_PASSWORD=secret -e MARIADB_DATABASE=personal -p 3306:3306 mariadb:latest
```

Lalu jalankan API dengan `DB_DSN` yang mengarah ke IP/host MariaDB (mis. `host.docker.internal` di Windows/macOS atau nama container jika pakai pod/network yang sama).

### Cek

- Web: http://localhost  
- API: http://localhost:8080/health (atau endpoint yang Anda buat)

### Stop & hapus

```powershell
podman stop personal-api personal-web
podman rm personal-api personal-web
```

## Opsi: Pod / network bersama

Agar frontend bisa proxy ke API lewat nama host:

```powershell
podman network create personal-net
podman run -d --name personal-api --network personal-net -p 8080:8080 personal-api
podman run -d --name personal-web --network personal-net -p 80:80 personal-web
```

Di Nginx, konfigurasi `proxy_pass http://personal-api:8080` bisa dipakai dengan menambah file konfigurasi custom (volume mount) atau image turunan yang menimpa `default.conf`.

## Referensi

- Langkah inisialisasi proyek: [doc/SETUP-COMMANDS.md](../doc/SETUP-COMMANDS.md)
- ToDo & fase pengembangan: [ToDo.md](../ToDo.md)
