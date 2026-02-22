# Phase 4: Security & Privacy — Implementasi Go + Vue.js

Panduan konkret apa yang harus diimplementasi di **Go (API)** dan **Vue.js (frontend)** untuk Phase 4.

---

## Keterbatasan: Frontend di GitHub Pages (penting)

Jika **frontend** di-host di **GitHub Pages**, Anda **tidak punya kontrol** atas konfigurasi server (Apache/Nginx) yang melayani file statis. GitHub Pages hanya mengirim file; Anda tidak bisa mengatur **HTTP response headers** (mis. `Strict-Transport-Security`, `X-Frame-Options`) secara server-side untuk halaman HTML/JS/CSS yang dilayani dari GitHub Pages.

| Di mana header berlaku | Siapa yang mengatur | Cara implementasi |
|------------------------|---------------------|-------------------|
| **Respons API** (request ke backend Go) | **Backend Anda** | Middleware Go menambahkan semua security headers (HSTS, X-Frame-Options, CSP, dll.) pada setiap response API. |
| **Halaman SPA** (HTML/JS dari GitHub Pages) | **GitHub** (server) + **Anda** (hanya lewat dokumen) | Server: GitHub yang set HTTPS dan header mereka. Anda **hanya bisa** memakai **`<meta http-equiv="...">`** di `index.html` (mis. CSP). Header seperti HSTS atau X-Frame-Options **tidak bisa** Anda set untuk halaman statis di GitHub Pages. |

**Kesimpulan:**

- **Backend (Go):** Pastikan middleware menangani semua security headers, karena **request ke API** akan sampai ke server Anda — di situlah header berlaku.
- **Frontend (GitHub Pages):** Andalkan **CSP lewat meta tag** di `web/index.html`. Pastikan CSP di Vue/SPA sudah benar (termasuk `connect-src` ke origin API jika beda domain).
- **Opsional — Custom domain + Cloudflare:** Jika frontend pakai custom domain di GitHub Pages, Anda bisa menaruh **Cloudflare (gratis)** di depannya: Cloudflare bisa menambahkan **Security Headers** dan **HSTS** untuk domain Anda sebelum traffic sampai ke GitHub Pages.

---

## 1. HTTPS / SSL & HSTS

| Lokasi | Status | Catatan |
|--------|--------|--------|
| **Go API** | ✅ | Middleware `SecurityHeaders` sudah set `Strict-Transport-Security` bila request lewat HTTPS (`X-Forwarded-Proto: https`). |
| **Hosting** | ✅ | GitHub Pages / Netlify/Cloudflare otomatis HTTPS. Pastikan API di belakang reverse proxy dengan HTTPS. |
| **HSTS untuk halaman SPA** | Terbatas | Di GitHub Pages Anda tidak bisa set header HSTS server-side. GitHub sendiri melayani lewat HTTPS. Jika pakai custom domain, Cloudflare di depan dapat menambahkan HSTS. |

Tidak perlu kode tambahan di repo jika production sudah HTTPS. HSTS untuk **response API** tetap di-set oleh middleware Go bila request lewat HTTPS.

---

## 2. Security Headers — Backend (Go API)

Header ini berlaku untuk **respons API** (setiap request ke backend Go). Karena API di-host di server Anda (PaaS/VPS), Anda punya kontrol penuh. Semua di **`api/internal/middleware/middleware.go`** (middleware `SecurityHeaders`).

| Header | Nilai | Status |
|--------|--------|--------|
| `X-Content-Type-Options` | `nosniff` | ✅ |
| `X-Frame-Options` | `DENY` | ✅ |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | ✅ |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains; preload` | ✅ (jika HTTPS) |
| `Content-Security-Policy` | Lihat bawah | ✅ (disesuaikan) |
| `X-Powered-By` | Dihapus | ✅ |
| `Server` | Dihapus / dikosongkan | ✅ `w.Header().Set("Server", "")` di middleware |
| `Permissions-Policy` | Opsional | Bisa tambah untuk batasi akses browser (camera, mic, dll). |

**CSP di API:**  
CSP pada response API hanya berlaku untuk dokumen yang memuat response tersebut. Untuk SPA Vue yang di-serve dari domain lain (mis. GitHub Pages), CSP yang berlaku adalah yang di **halaman HTML** (meta tag atau header dari host). Di Go cukup pakai policy ketat untuk response API; untuk frontend lihat bagian Vue.

---

## 3. CSP untuk Frontend (Vue / SPA) — meta tag saja di GitHub Pages

SPA di-serve dari **static host** (GitHub Pages, dll.). Karena **GitHub Pages tidak mengizinkan custom response headers**, satu-satunya cara mengatur CSP untuk halaman HTML Anda adalah **meta tag** di **`web/index.html`**. Pastikan implementasi CSP di Vue/SPA memakai meta tag ini (bukan mengandalkan header dari server):

```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://API_ORIGIN;">
```

- Ganti `https://API_ORIGIN` dengan origin API production (mis. `https://api.yoursite.com`). Jika frontend dan API same-origin (satu domain), `connect-src 'self'` cukup.
- Jika pakai inline script (mis. theme flash), `script-src` mungkin perlu `'unsafe-inline'` atau nonce (lebih rumit).

**Ringkas:**  
- **Go:** CSP di middleware berlaku untuk **response API** saja.  
- **Vue (GitHub Pages):** Hanya CSP lewat **meta tag** di `web/index.html`; sesuaikan `connect-src` dengan origin API production. X-Frame-Options / HSTS untuk halaman SPA tidak bisa Anda set di GitHub Pages — gunakan Cloudflare di depan jika pakai custom domain dan ingin header tambahan.

---

## 4. Kontak Aman (Vue)

| Item | Implementasi |
|------|--------------|
| **Tanpa form PHP** | ✅ Tidak dipakai. |
| **mailto:** | ✅ Halaman `Contact.vue` pakai `mailto:${email}`. **Yang harus dilakukan:** ganti `you@example.com` di `web/src/pages/Contact.vue` dengan email nyata. |
| **Form statis (opsional)** | Bisa pakai [Formspree](https://formspree.io) atau Netlify Forms: form HTML submit ke URL mereka, tidak perlu backend sendiri. Di Vue: form dengan `action="https://formspree.io/f/xxx"` dan `method="POST"` (bisa di Contact.vue). |
| **PGP/GPG** | ✅ Ada placeholder link ke `/pgp.asc` dan blok fingerprint. **Yang harus dilakukan:** export public key ke `web/public/pgp.asc`, ganti fingerprint di Contact.vue. |

Tidak ada perubahan wajib di Go; kontak sepenuhnya di frontend (mailto / form eksternal).

---

## 5. Privacy-Friendly Analytics (Vue)

Jangan pakai Google Analytics. Pilih salah satu:

| Layanan | Cara pakai di Vue |
|---------|-------------------|
| **Plausible** | Tambah script di `web/index.html`: `<script defer data-domain="yoursite.com" src="https://plausible.io/js/script.js"></script>`. |
| **Umami** | Self-host atau Umami Cloud; dapatkan script embed, tambah di `index.html`. |
| **Matomo (self-hosted)** | Pasang Matomo, dapatkan snippet, tambah di `index.html`. |

Agar tidak selalu aktif di dev, bisa pakai env (mis. `VITE_ANALYTICS_DOMAIN`) dan hanya inject script saat build production.

**Ringkas:** Satu script di `web/index.html` (atau conditional berdasarkan env), tanpa perubahan di Go.

---

## 6. Hide Server Info (Go)

Pastikan response API tidak membocorkan versi server:

| Tindakan | Lokasi |
|----------|--------|
| Hapus `X-Powered-By` | ✅ Sudah: `w.Header().Del(headerXPoweredBy)` di middleware. |
| Sembunyikan `Server` | Tambah di middleware: `w.Header().Set("Server", "")` agar header Server tidak menampilkan "Go-http-server/1.x". |

Jika pakai reverse proxy (Nginx, Caddy), pastikan juga proxy tidak mengirim header `Server` atau `X-Powered-By` ke client.

---

## Ceklis implementasi (Go + Vue)

- [x] **Go:** Middleware — `SecurityHeaders` set semua header (X-Content-Type-Options, X-Frame-Options, HSTS bila HTTPS, CSP, hapus X-Powered-By, `Server` kosong). Berlaku untuk **response API**.
- [x] **Vue:** `web/index.html` — CSP lewat **meta tag** (GitHub Pages tidak bisa set header server-side); sesuaikan `connect-src` dengan origin API production.
- [ ] **Vue:** `Contact.vue` — ganti `email` dan fingerprint; letakkan `pgp.asc` di `web/public/`.
- [ ] **Vue (opsional):** Formspree/Netlify form di Contact.vue jika ingin form selain mailto.
- [ ] **Vue (opsional):** Analytics (Plausible/Umami/Matomo) di `index.html` atau conditional via env.
- [ ] **Opsional:** Jika frontend pakai custom domain di GitHub Pages, pertimbangkan Cloudflare (gratis) di depan untuk menambahkan Security Headers dan HSTS pada halaman SPA.

Setelah itu, centang item Phase 4 di `ToDo.md` sesuai yang sudah dikerjakan.
