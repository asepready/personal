# Laporan Audit Keamanan Informasi — API & Admin (ISO/IEC 27001:2022)

**Ruang lingkup:** portfolio-api (Lumen), portfolio-admin (React/Vite)  
**Referensi:** Rencana Audit API dan Admin (Standar ISO 27001)  
**Tanggal pelaksanaan:** 2026-02-26

---

## 1. Ringkasan eksekutif

Audit mengacu pada kontrol Annex A ISO/IEC 27001:2022 yang relevan dengan aplikasi web. Sebagian besar kontrol **sesuai** dengan bukti yang diperiksa. Temuan utama: **observasi** untuk audit log keamanan, monitoring, dan kerentanan dependensi npm (moderate); **rekomendasi** untuk production (APP_DEBUG=false, CORS, HTTPS) didokumentasikan dalam checklist deployment.

---

## 2. Checklist per kontrol dan bukti

### A.5.2 — Pembagian tanggung jawab (information security roles)

| Pertanyaan | Ya/Tidak | Bukti |
|------------|----------|--------|
| Pemisahan peran admin vs publik? | Ya | `portfolio-api/routes/web.php`: route public (GET, POST /api/contact) vs group `middleware => auth` untuk mutasi dan GET contact-messages. |
| Akses data sensitif dibatasi? | Ya | Contact-messages dan semua mutasi memerlukan Bearer token (AuthServiceProvider). |

**Temuan:** Conform. Tidak ada RBAC (semua token admin setara); dokumentasikan untuk perluasan nanti.

---

### A.8.5 — Keamanan autentikasi

| Pertanyaan | Ya/Tidak | Bukti |
|------------|----------|--------|
| Kredensial disimpan aman? | Ya | `User`: `password` di `$hidden`. LoginController: `Hash::check()`. Seeder: `Hash::make('password')`. |
| Proteksi brute force? | Ya | `web.php`: login dalam group `throttle:10,1` (10 percobaan per menit). |
| Token kuat? | Ya | LoginController: `Str::random(60)` untuk api_token. |
| Token di klien? | Ya | portfolio-admin/src/auth.js: sessionStorage, kunci `portfolio_admin_token`. |
| Pesan error login generik? | Ya | LoginController baris 30: "Kredensial tidak valid" (tidak membedakan username tidak ada vs password salah). |
| Tidak ada log password/token? | Ya | Tidak ada pemanggilan Log dengan password/token di LoginController atau AuthServiceProvider. |

**Temuan:** Conform. Rekomendasi: production jangan pakai password default seeder.

---

### A.8.8 — Manajemen kerentanan teknis

| Pertanyaan | Ya/Tidak | Bukti |
|------------|----------|--------|
| Dependensi tercatat? | Ya | API: composer.lock. Admin: package-lock.json. |
| composer audit | Ya | Dijalankan: "No security vulnerability advisories found." (portfolio-api). |
| npm audit | Observasi | 2 moderate: esbuild (GHSA-67mh-4wv8-2f99), mempengaruhi vite; fix tersedia via npm audit fix --force (breaking). |

**Temuan:** API conform. Admin: observasi — 2 moderate pada dev dependency (esbuild/vite); jadwalkan pemantauan dan pertimbangkan upgrade vite saat tersedia tanpa breaking change. Rekomendasi: jadwalkan audit berkala dan dokumentasikan di prosedur; opsional integrasi CI (composer audit, npm audit).

---

### A.8.9 — Konfigurasi manajemen

| Pertanyaan | Ya/Tidak | Bukti |
|------------|----------|--------|
| Rahasia tidak hardcode? | Ya | API: .env.example (DB_*, APP_KEY, CORS_ORIGINS). Admin: VITE_API_URL dari env. |
| .env tidak di-commit? | Ya | portfolio-api/.gitignore berisi `.env`. |
| Debug dikontrol env? | Ya | Handler.php: `env('APP_DEBUG', false)` mengontrol pesan 500; production = "Internal server error". |
| CORS dari env? | Ya | CorsMiddleware: CORS_ORIGINS dari env; .env.example daftar eksplisit (localhost:3000, 3001). |

**Temuan:** Conform. Rekomendasi: pastikan production set APP_DEBUG=false, CORS_ORIGINS spesifik (bukan *).

---

### A.8.15 — Logging (audit log)

| Pertanyaan | Ya/Tidak | Bukti |
|------------|----------|--------|
| Log akses/audit endpoint sensitif? | Tidak | Tidak ada logging terstruktur untuk login sukses/gagal atau akses contact-messages di kode. Lumen: LOG_CHANNEL=stack (log aplikasi standar). |

**Temuan:** Observasi. Rekomendasi: (1) Jangan log kredensial/token. (2) Pertimbangkan log kejadian keamanan: login gagal (tanpa detail), login sukses (user id), akses contact-messages; retensi sesuai A.8.10.

---

### A.8.16 — Monitoring (kejadian keamanan)

| Pertanyaan | Ya/Tidak | Bukti |
|------------|----------|--------|
| Pemantauan kegagalan auth / penyalahgunaan? | Tidak | Rate limit mengurangi brute force; tidak ada alerting atau agregasi. |

**Temuan:** Observasi. Rekomendasi: tetapkan prosedur siapa memantau log, frekuensi, dan tindakan untuk pola mencurigakan (banyak 401, spike request).

---

### A.8.23 — Filtering (web / transfer informasi)

| Pertanyaan | Ya/Tidak | Bukti |
|------------|----------|--------|
| Input divalidasi? | Ya | Semua controller mutasi dan PublicContactController, LoginController memakai Validator::make dan validated(); aturan max length, email, url, exists. |
| Output aman (tidak bocor)? | Ya | Handler: production hanya "Internal server error". User: password, api_token di $hidden. |
| CORS aman? | Ya | CorsMiddleware: origin dari env; method dan header dibatasi. |

**Temuan:** Conform. Rekomendasi: production pastikan CORS_ORIGINS hanya domain sah; tidak gunakan *.

---

### A.8.24 — Penggunaan kriptografi

| Pertanyaan | Ya/Tidak | Bukti |
|------------|----------|--------|
| Password di-hash kuat? | Ya | Hash::make / Hash::check (bcrypt). |
| HTTPS production? | N/A (infrastruktur) | Tidak ada enforcement di kode; bergantung proxy/deployment. |

**Temuan:** Conform untuk kriptografi aplikasi. Rekomendasi: dokumentasikan bahwa akses production hanya via HTTPS; konfigurasi HSTS dan redirect HTTP→HTTPS di server/proxy.

---

### A.8.25 — Keamanan dalam siklus hidup pengembangan

| Pertanyaan | Ya/Tidak | Bukti |
|------------|----------|--------|
| Tinjauan keamanan sebelum rilis? | Kebijakan | Di luar kode; untuk audit tetapkan prosedur (checklist atau review fokus auth/input). |
| Environment production terpisah? | Harus dipastikan | APP_ENV, .env; deployment. |

**Temuan:** Observasi. Rekomendasi: dokumentasikan prosedur release (branch, review, checklist: validasi input, tidak ada rahasia di kode, env production).

---

### A.8.26 — Keamanan aplikasi

| Pertanyaan | Ya/Tidak | Bukti |
|------------|----------|--------|
| Endpoint sensitif butuh auth? | Ya | web.php: mutasi dan GET contact-messages dalam group middleware auth. |
| Admin mengirim token? | Ya | api.js: authHeaders() menambah Bearer; handleRes pada 401: clearToken + redirect /login. |
| Tes 401 untuk protected? | Ya | ApiTest.php: api_users_store_returns_401_without_token, api_contact_messages_store_returns_401_without_token. |

**Temuan:** Conform. Rekomendasi: pertahankan tes otomatis 401; tambah tes login gagal/sukses jika belum ada.

---

## 3. Tindak lanjut prioritas

| Prioritas | Tindak lanjut | Kontrol |
|-----------|----------------|---------|
| Tinggi | Production: APP_DEBUG=false, APP_KEY set, CORS_ORIGINS spesifik (bukan *). | A.8.9, A.8.23 |
| Tinggi | Dokumentasikan dan terapkan HTTPS (HSTS, redirect) untuk API dan Admin. | A.8.24 |
| Sedang | Jadwalkan pemeriksaan kerentanan dependensi (composer audit, npm audit); tangani 2 moderate npm (esbuild/vite) sesuai kebijakan. | A.8.8 |
| Sedang | Pertimbangkan audit log kejadian keamanan (login sukses/gagal, akses contact-messages) tanpa log kredensial/token. | A.8.15 |
| Sedang | Tetapkan prosedur pemantauan log dan respons terhadap kejadian mencurigakan. | A.8.16 |
| Rendah | Dokumentasikan prosedur release dan checklist keamanan (code review). | A.8.25 |

---

## 4. Checklist deployment (production)

Gunakan checklist ini sebelum atau saat deploy production:

- [ ] **API:** APP_ENV=production, APP_DEBUG=false, APP_KEY di-set (php artisan key:generate jika perlu).
- [ ] **API:** CORS_ORIGINS berisi hanya origin Admin/Web yang sah (bukan *).
- [ ] **API:** DB_* mengarah ke database production; kredensial kuat.
- [ ] **API:** Password default seeder tidak dipakai; ganti password admin.
- [ ] **Admin:** VITE_API_URL mengarah ke URL API production (https).
- [ ] **Infrastruktur:** TLS untuk API dan Admin; HSTS dan redirect HTTP→HTTPS dikonfigurasi.
- [ ] **Repo:** .env tidak di-commit; .env.example tanpa nilai rahasia.

---

*Dokumen ini merupakan output pelaksanaan rencana audit; hasil dapat digunakan untuk perbaikan berkelanjutan dan pemetaan ke ISO 27001.*
