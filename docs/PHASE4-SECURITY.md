# Phase 4: Security & Privacy — Implementasi Go + Vue.js

Panduan konkret apa yang harus diimplementasi di **Go (API)** dan **Vue.js (frontend)** untuk Phase 4.

---

## 1. HTTPS / SSL & HSTS

| Lokasi | Status | Catatan |
|--------|--------|--------|
| **Go API** | ✅ | Middleware `SecurityHeaders` sudah set `Strict-Transport-Security` bila request lewat HTTPS (`X-Forwarded-Proto: https`). |
| **Hosting** | ✅ | GitHub Pages / Netlify/Cloudflare otomatis HTTPS. Pastikan API di belakang reverse proxy dengan HTTPS. |

Tidak perlu kode tambahan di repo jika production sudah HTTPS.

---

## 2. Security Headers (Go API)

Semua di **`api/internal/middleware/middleware.go`** (middleware `SecurityHeaders`).

| Header | Nilai | Status |
|--------|--------|--------|
| `X-Content-Type-Options` | `nosniff` | ✅ |
| `X-Frame-Options` | `DENY` | ✅ |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | ✅ |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains; preload` | ✅ (jika HTTPS) |
| `Content-Security-Policy` | Lihat bawah | ✅ (disesuaikan) |
| `X-Powered-By` | Dihapus | ✅ |
| `Server` | Dihapus / dikosongkan | 🔲 → tambah `w.Header().Set("Server", "")` |
| `Permissions-Policy` | Opsional | Bisa tambah untuk batasi akses browser (camera, mic, dll). |

**CSP di API:**  
CSP pada response API hanya berlaku untuk dokumen yang memuat response tersebut. Untuk SPA Vue yang di-serve dari domain lain (mis. GitHub Pages), CSP yang berlaku adalah yang di **halaman HTML** (meta tag atau header dari host). Di Go cukup pakai policy ketat untuk response API; untuk frontend lihat bagian Vue.

---

## 3. CSP untuk Frontend (Vue / SPA)

SPA di-serve dari **static host** (GitHub Pages, dll.), jadi header HTTP dari host itu yang mengatur CSP untuk halaman. Karena GitHub Pages tidak mengizinkan custom response headers, gunakan **meta tag** di **`web/index.html`**:

```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://API_ORIGIN;">
```

- Ganti `https://API_ORIGIN` dengan origin API production (mis. `https://api.yoursite.com`). Jika frontend dan API same-origin (satu domain), `connect-src 'self'` cukup.
- Jika pakai inline script (mis. theme flash), `script-src` mungkin perlu `'unsafe-inline'` atau nonce (lebih rumit).

**Ringkas:**  
- **Go:** CSP di middleware tetap untuk response API.  
- **Vue:** Tambah CSP meta di `web/index.html` dan sesuaikan `connect-src` dengan origin API.

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

- [ ] **Go:** Middleware — tambah `w.Header().Set("Server", "")` di `SecurityHeaders`.
- [ ] **Vue:** `web/index.html` — tambah CSP meta; sesuaikan `connect-src` dengan origin API.
- [ ] **Vue:** `Contact.vue` — ganti `email` dan fingerprint; letakkan `pgp.asc` di `web/public/`.
- [ ] **Vue (opsional):** Formspree/Netlify form di Contact.vue jika ingin form selain mailto.
- [ ] **Vue (opsional):** Analytics (Plausible/Umami/Matomo) di `index.html` atau conditional via env.

Setelah itu, centang item Phase 4 di `ToDo.md` sesuai yang sudah dikerjakan.
