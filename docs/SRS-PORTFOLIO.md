# Software Requirements Specification (SRS)

**Spesifikasi Kebutuhan Perangkat Lunak untuk Aplikasi Web Portfolio**

| | |
|---|---|
| **Proyek** | Aplikasi Web Portfolio Pribadi |
| **Versi** | 1.0 |
| **Tanggal** | 26 Februari 2026 |

---

## Daftar Isi

1. [Pendahuluan](#1-pendahuluan)
2. [Deskripsi Umum](#2-deskripsi-umum)
3. [Kebutuhan Sistem](#3-kebutuhan-sistem)
4. [Arsitektur dan Desain Teknis](#4-arsitektur-dan-desain-teknis)
5. [Lampiran](#5-lampiran)

---

## 1. Pendahuluan

### 1.1 Tujuan

Dokumen Software Requirements Specification (SRS) ini menjelaskan kebutuhan perangkat lunak untuk **aplikasi web portfolio pribadi** yang terdiri dari:

- **portfolio-api** — Backend REST API (Lumen/PHP)
- **portfolio-web** — Situs publik untuk pengunjung (React/Vite)
- **portfolio-admin** — Panel admin untuk pengelola konten (React/Vite)

Tujuan dokumen:

- Menjadi **rujukan utama** bagi developer, tester, dan stakeholder mengenai fitur dan batasan sistem.
- Menyediakan dasar untuk **perancangan**, **implementasi**, **pengujian**, dan **audit** (RPL, ISO 27001).
- Mempermudah pemeliharaan dan pengembangan fitur baru.

### 1.2 Cakupan Produk

**Termasuk:**

- Menampilkan profil pemilik, pengalaman kerja, pendidikan, skills, proyek, blog post, sertifikasi, dan kontak.
- Panel admin untuk mengelola seluruh data melalui antarmuka web.
- REST API sebagai penghubung frontend–database.

**Tidak termasuk:**

- Aplikasi mobile native (Android/iOS).
- Sistem pembayaran atau e-commerce.
- Portal multi-tenant (satu instance = satu pemilik portfolio).

### 1.3 Definisi dan Akronim

| Istilah | Definisi |
|--------|----------|
| **API** | Application Programming Interface; dalam konteks ini REST API dari portfolio-api. |
| **REST API** | Antarmuka HTTP dengan metode standar (GET, POST, PUT, PATCH, DELETE). |
| **Token / Bearer token** | Token autentikasi di header `Authorization` untuk akses admin. |
| **Admin** | Pengguna terautentikasi dengan hak penuh mengelola konten. |
| **Visitor / Pengunjung** | Pengguna publik tanpa autentikasi. |
| **CRUD** | Create, Read, Update, Delete. |
| **FR** | Functional Requirement. |
| **NFR** | Non-Functional Requirement. |

### 1.4 Referensi

| Dokumen | Isi |
|---------|-----|
| [ARSITEKTUR.md](ARSITEKTUR.md) | Arsitektur stack portfolio. |
| [DIAGRAM_DAN_ERD.md](DIAGRAM_DAN_ERD.md) | Diagram arsitektur, ERD, sequence, flowchart, state, class. |
| [PERANCANGAN_ADMIN.md](PERANCANGAN_ADMIN.md) | Perancangan fitur admin (login, relasi, menu). |
| [PUBLIKASI_WEB.md](PUBLIKASI_WEB.md) | Perilaku API publik vs admin (blog-posts, projects). |
| [AUDIT_REPORT_ISO27001.md](AUDIT_REPORT_ISO27001.md) | Laporan audit keamanan informasi. |
| [PANDUAN_DOKUMENTASI_RPL.md](PANDUAN_DOKUMENTASI_RPL.md) | Panduan struktur dokumentasi RPL. |
| README (root & per subproyek) | Setup dan informasi teknis. |

---

## 2. Deskripsi Umum

### 2.1 Perspektif Produk

Sistem terdiri dari komponen terpisah yang saling terhubung:

| Komponen | Peran |
|----------|--------|
| **portfolio-api** | Backend Lumen (PHP): REST API, autentikasi token, CRUD terhadap MySQL/MariaDB. |
| **portfolio-web** | Frontend React (Vite): pengunjung melihat portfolio, blog, mengirim pesan kontak. |
| **portfolio-admin** | Frontend React (Vite): admin login, mengelola konten, melihat pesan kontak. |
| **Database** | Menyimpan users, experiences, educations, skills, projects, blog_posts, certifications, contact_messages, tags, dan tabel pivot. |

**Penting:** portfolio-web dan portfolio-admin **tidak mengakses database langsung**; semua komunikasi melalui portfolio-api. Akses dibedakan: **publik** (tanpa token) vs **admin** (dengan Bearer token).

### 2.2 Fitur Produk (Ringkas)

| Area | Fitur |
|------|--------|
| **F1. Situs publik** | Profil, pengalaman, pendidikan, skills, proyek (daftar + detail), blog (daftar + detail), sertifikasi, form kontak. |
| **F2. Panel admin** | Login, dashboard ringkasan, CRUD semua resource, dropdown relasi (nama bukan ID), auto-fill user_id, sidebar dengan grup menu. |
| **F3. Backend API** | Endpoint publik & admin, filter is_published untuk blog-posts/projects, rate limiting kontak, dokumentasi Swagger/OpenAPI. |

### 2.3 Karakteristik Pengguna

| Role | Profil | Tujuan | Hak akses |
|------|--------|--------|-----------|
| **Pengunjung (Visitor)** | User umum, browser desktop/mobile. | Melihat profil, pengalaman, proyek, blog; mengirim pesan kontak. | Hanya endpoint publik: GET data yang dipublikasi, POST contact. |
| **Admin** | Pemilik portfolio atau pihak yang diberi hak. | Mengelola seluruh data; membaca pesan kontak. | CRUD penuh dengan Bearer token. |

### 2.4 Batasan

| Aspek | Batasan |
|-------|---------|
| **Platform** | Server: PHP 8.1+, Composer 2.2+, MySQL/MariaDB. Frontend: Node.js/npm untuk build. |
| **Browser** | Target: browser modern (Chrome, Firefox, Edge, Safari); ES6, fetch API. IE tidak didukung. |
| **Koneksi** | Dianggap koneksi internet stabil; tidak ada mode offline khusus. |
| **Multi-tenant** | Satu pemilik portfolio per instance; multi-tenant di luar cakupan. |

### 2.5 Asumsi dan Dependensi

- Production memakai **HTTPS** dan CORS dikonfigurasi dengan benar.
- File rahasia (`.env`) tidak di-commit; dikelola terpisah.
- Database di-backup berkala; user dan password kuat.
- Admin mampu menggunakan panel admin untuk mengelola konten.

---

## 3. Kebutuhan Sistem

### 3.1 Kebutuhan Fungsional (FR)

Kebutuhan fungsional diberi kode **FR-XX**. Tabel ringkasan untuk referensi cepat:

| ID | Ringkasan |
|----|-----------|
| FR-01 | Endpoint login admin; kembalikan token + info user. |
| FR-02 | Simpan token di klien; kirim di header Authorization. |
| FR-03 | Endpoint CRUD & contact-messages hanya dengan token valid. |
| FR-04 | Respon 401 jika request terlindungi tanpa token valid. |
| FR-05 | CRUD users bagi admin. |
| FR-06 | Tampilkan profil user di halaman publik (nama, headline, lokasi, email, foto). |
| FR-07 | Auto-isi user_id dengan user login saat admin buat konten baru. |
| FR-08 | CRUD experiences (perusahaan, posisi, tanggal, is_current). |
| FR-09 | Halaman publik: daftar pengalaman kerja kronologis. |
| FR-10 | CRUD educations (institusi, jenjang, bidang, tanggal, is_current). |
| FR-11 | Halaman publik: daftar pendidikan kronologis. |
| FR-12 | CRUD skill_categories. |
| FR-13 | CRUD skills + kategori + level. |
| FR-14 | CRUD user_skills (user–skill, kemahiran, tahun pengalaman). |
| FR-15 | Halaman publik: daftar skills per kategori & level. |
| FR-16 | CRUD projects (judul, slug, is_published, published_at, is_featured). |
| FR-17 | CRUD project_skills (hubungan project–skill). |
| FR-18 | Halaman publik: daftar projects hanya is_published = true. |
| FR-19 | Detail project by slug untuk yang published; 404 untuk draft (publik). |
| FR-20 | CRUD blog_posts (judul, slug, konten, is_published, published_at). |
| FR-21 | CRUD tags dan post_tags. |
| FR-22 | Halaman publik: daftar blog hanya is_published = true. |
| FR-23 | Detail blog by slug untuk yang published; 404 untuk draft (publik). |
| FR-24 | CRUD certifications. |
| FR-25 | Halaman publik: daftar sertifikasi user. |
| FR-26 | POST /api/contact (publik) untuk name, email, subject, message. |
| FR-27 | Simpan pesan ke contact_messages, kaitkan ke user. |
| FR-28 | Admin: daftar contact messages, mark read/unread, detail. |
| FR-29 | Admin: halaman login, dashboard, CRUD tiap resource. |
| FR-30 | Admin: field relasi = dropdown nama (simpan ID ke API). |
| FR-31 | Admin: kolom relasi di list = nama (user.full_name, category.name). |
| FR-32 | Admin: sidebar grup (Utama, Konten, Portfolio, Skills, Lainnya), sorot aktif. |
| FR-33 | Situs publik: Home, Tentang, Pengalaman, Pendidikan, Skills, Proyek, Blog, Sertifikasi, Kontak. |
| FR-34 | Form kontak: validasi input wajib sebelum kirim. |
| FR-35 | Situs publik: hanya tampilkan projects & blog posts is_published = true. |
| FR-36 | Dokumentasi API OpenAPI 3: /docs (Swagger UI), /docs/openapi.yaml. |

#### 3.1.1 Autentikasi dan Otorisasi Admin

- **FR-01** — Endpoint login admin memverifikasi kredensial (username/email, password) dan mengembalikan token + informasi user.
- **FR-02** — Token disimpan di klien (mis. sessionStorage) dan dikirim di header `Authorization: Bearer <token>` untuk request admin.
- **FR-03** — Endpoint CRUD (mutasi) dan akses contact-messages hanya dapat diakses dengan token valid.
- **FR-04** — Respon **401 Unauthorized** jika request ke endpoint terlindungi tanpa token valid.

#### 3.1.2 Manajemen User dan Profil

- **FR-05** — CRUD users bagi admin.
- **FR-06** — Halaman publik menampilkan profil user (nama lengkap, headline, lokasi, email publik, foto profil).
- **FR-07** — Saat admin menambah konten baru (experience, project, blog post, dll.), sistem mengisi `user_id` dengan ID user yang login.

#### 3.1.3–3.1.8 (Experiences, Educations, Skills, Projects, Blog, Certifications)

Rincian FR-08 s.d. FR-25 mengikuti tabel ringkasan di atas: CRUD di admin, tampilan kronologis/per kategori di publik, serta aturan is_published untuk projects dan blog posts (hanya yang published tampil di publik; detail by slug mengembalikan 404 untuk draft).

#### 3.1.9 Form Kontak dan Pesan

- **FR-26** — Endpoint publik `POST /api/contact` menerima name, email, subject, message.
- **FR-27** — Pesan disimpan ke `contact_messages` dan dikaitkan ke user pemilik portfolio.
- **FR-28** — Admin dapat melihat daftar pesan, menandai dibaca/tidak dibaca, dan melihat detail.

#### 3.1.10 Panel Admin (UI)

- **FR-29** — Halaman login, dashboard, dan CRUD untuk setiap resource utama.
- **FR-30** — Field relasi dalam bentuk dropdown yang menampilkan **nama** (bukan ID); ID yang dikirim ke API.
- **FR-31** — Kolom relasi di tabel list menampilkan nama (mis. `user.full_name`, `category.name`) dari response API.
- **FR-32** — Sidebar mengelompokkan menu (Utama, Konten, Portfolio, Skills, Lainnya) dan menyorot halaman aktif.

#### 3.1.11 Situs Publik (UI)

- **FR-33** — Halaman: Home, Tentang, Pengalaman, Pendidikan, Skills, Proyek (daftar + detail), Blog (daftar + detail), Sertifikasi, Kontak.
- **FR-34** — Form kontak memvalidasi input wajib (dan format, mis. email) sebelum mengirim.
- **FR-35** — Hanya menampilkan projects dan blog posts dengan `is_published = true`.

#### 3.1.12 Dokumentasi API

- **FR-36** — Dokumentasi API format OpenAPI 3: endpoint `/docs` (Swagger UI) dan `/docs/openapi.yaml`.

---

### 3.2 Kebutuhan Non-Fungsional (NFR)

Kebutuhan non-fungsional diberi kode **NFR-XX**. Tabel ringkasan:

| ID | Kategori | Ringkasan |
|----|----------|-----------|
| NFR-01 | Performa | Respon GET rata-rata ≤ 1 detik (operasi sederhana). |
| NFR-02 | Performa | Waktu muat awal halaman frontend ≤ 3 detik (broadband wajar). |
| NFR-03 | Performa | Menangani puluhan–ratusan pengunjung/hari tanpa degradasi signifikan. |
| NFR-04 | Keamanan | Password di-hash (bcrypt), bukan plain text. |
| NFR-05 | Keamanan | Rate limiting login (mis. 10 percobaan/menit/IP). |
| NFR-06 | Keamanan | Rate limiting endpoint kontak (mis. 5 request/menit/IP). |
| NFR-07 | Keamanan | Password dan token tidak ditulis ke log. |
| NFR-08 | Keamanan | CORS membatasi origin ke domain frontend sah (production). |
| NFR-09 | Keamanan | Production dijalankan via HTTPS (TLS valid). |
| NFR-10 | Ketersediaan | Downtime direncanakan diminimalkan dan dikomunikasikan. |
| NFR-11 | Ketersediaan | Backup database berkala untuk data penting. |
| NFR-12 | Usability | Antarmuka responsif (desktop & mobile). |
| NFR-13 | Usability | Label dan teks form jelas dan konsisten. |
| NFR-14 | Usability | Navigasi admin terorganisir dalam grup menu logis. |
| NFR-15 | Maintainability | Kode mengikuti standar (PSR PHP, praktik React). |
| NFR-16 | Maintainability | Test otomatis API (PHPUnit) untuk skenario dasar. |
| NFR-17 | Maintainability | Dokumentasi diperbarui saat perubahan besar arsitektur/endpoint. |
| NFR-18 | Deployment | Dapat dijalankan dengan container (Podman/Docker Compose). |
| NFR-19 | Deployment | Variabel lingkungan dikonfigurasi tanpa ubah kode. |

---

### 3.3 Kebutuhan Antarmuka Eksternal

#### Antarmuka Pengguna (UI)

| ID | Kebutuhan |
|----|-----------|
| **IF-01** | Situs publik: navigasi ke Home, Tentang, Pengalaman, Pendidikan, Skills, Proyek, Blog, Sertifikasi, Kontak. |
| **IF-02** | Panel admin: sidebar dengan grup menu; halaman login, dashboard, resource. |
| **IF-03** | Form (web & admin): umpan balik validasi saat field wajib kosong atau format salah (mis. email). |

#### Antarmuka API (System Interface)

| ID | Kebutuhan |
|----|-----------|
| **IF-04** | Frontend berkomunikasi dengan API via HTTP/HTTPS, format JSON. |
| **IF-05** | API mengembalikan kode status HTTP standar (200, 201, 400, 401, 404, 422, 429, 500) dan payload JSON konsisten. |
| **IF-06** | Dokumentasi Swagger mencerminkan endpoint aktual dan diperbarui saat perubahan signifikan. |

---

## 4. Arsitektur dan Desain Teknis

### 4.1 Stack Teknologi

| Lapisan | Teknologi |
|---------|-----------|
| **Backend** | Lumen 10 (PHP 8.1+), REST API, autentikasi Bearer token. |
| **Database** | MySQL / MariaDB. ERD: [DIAGRAM_DAN_ERD.md](DIAGRAM_DAN_ERD.md). |
| **Frontend Admin** | React 18, Vite (`portfolio-admin`). |
| **Frontend Web** | React 18, Vite (`portfolio-web`). |
| **Container** | Podman/Docker Compose (`compose.yaml`). |

### 4.2 Gambaran Arsitektur

- **Pengunjung** → portfolio-web → portfolio-api (GET publik).
- **Admin** → portfolio-admin → login ke portfolio-api → CRUD dengan token.
- **portfolio-api** satu-satunya yang mengakses database.

Diagram lengkap (arsitektur, sequence, flowchart, state, class): [DIAGRAM_DAN_ERD.md](DIAGRAM_DAN_ERD.md). Ringkasan arsitektur: [ARSITEKTUR.md](ARSITEKTUR.md).

### 4.3 Matriks Kebutuhan (Contoh Prioritas)

| ID | Kebutuhan | Prioritas | Status |
|----|-----------|-----------|--------|
| FR-01 | Login admin & token | Tinggi | Wajib |
| FR-16 | CRUD projects & publish | Tinggi | Wajib |
| FR-20 | CRUD blog posts & publish/draft | Tinggi | Wajib |
| FR-26 | Endpoint form kontak | Tinggi | Wajib |
| FR-33 | Halaman utama situs publik | Tinggi | Wajib |
| NFR-04 | Password hash kuat | Tinggi | Wajib |
| NFR-08 | CORS dibatasi | Sedang | Disarankan |
| NFR-18 | Deploy container | Sedang | Disarankan |

---

## 5. Lampiran

| Lampiran | Isi |
|----------|-----|
| **A.1** | ERD & diagram lengkap → [DIAGRAM_DAN_ERD.md](DIAGRAM_DAN_ERD.md). |
| **A.2** | Perilaku publik vs admin (blog-posts, projects) → [PUBLIKASI_WEB.md](PUBLIKASI_WEB.md). |
| **A.3** | Audit keamanan & kontrol → [AUDIT_REPORT_ISO27001.md](AUDIT_REPORT_ISO27001.md). |
