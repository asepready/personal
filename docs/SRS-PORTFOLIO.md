## Software Requirements Specification (SRS)

### Spesifikasi Kebutuhan Perangkat Lunak untuk Aplikasi Web Portfolio

Proyek: Aplikasi Web Portfolio Pribadi  
Versi: 1.0  
Tanggal: 26 Februari 2026

---

1. Pendahuluan

   1.1 Tujuan

   Dokumen Software Requirements Specification (SRS) ini menjelaskan kebutuhan perangkat lunak untuk **aplikasi web portfolio pribadi** yang terdiri dari `portfolio-api` (backend REST API), `portfolio-web` (situs publik untuk pengunjung), dan `portfolio-admin` (panel admin).

   Tujuan utama dokumen ini adalah:

   - Menjadi rujukan utama (single source of truth) bagi **developer**, **tester**, dan **stakeholder** mengenai fitur dan batasan sistem.
   - Menyediakan dasar formal untuk **perancangan**, **implementasi**, **pengujian**, dan **audit** (misal: tugas RPL atau compliance ISO 27001).
   - Mempermudah pemeliharaan dan pengembangan fitur baru di masa depan.

   1.2 Cakupan Produk

   Aplikasi ini adalah **aplikasi web** yang berfungsi sebagai portfolio online pribadi, dengan fitur utama:

   - Menampilkan informasi profil pemilik (user), pengalaman kerja, pendidikan, skills, proyek, blog post, sertifikasi, dan kontak.
   - Menyediakan **panel admin** untuk mengelola seluruh data tersebut melalui antarmuka web.
   - Menyediakan **REST API** yang menjadi penghubung antara frontend publik/admin dengan database.

   Cakupan tidak mencakup:

   - Aplikasi mobile native (Android/iOS).
   - Sistem pembayaran atau e-commerce.
   - Portal multi-tenant (lebih dari satu pemilik portfolio dalam satu instance).

   1.3 Definisi, Akronim, dan Istilah

   - **API**: Application Programming Interface, dalam konteks ini adalah REST API dari `portfolio-api`.
   - **REST API**: Antarmuka HTTP dengan metode standar (GET, POST, PUT, PATCH, DELETE).
   - **JWT / Token**: Token autentikasi (Bearer token) yang dikirim di header `Authorization` untuk mengakses endpoint admin.
   - **Admin**: Pengguna terautentikasi yang memiliki hak penuh untuk mengelola konten.
   - **Visitor / Pengunjung**: Pengguna publik yang mengakses portfolio tanpa autentikasi.
   - **CRUD**: Create, Read, Update, Delete.
   - **ERD**: Entity Relationship Diagram.
   - **NFR**: Non-Functional Requirement.
   - **FR**: Functional Requirement.

   1.4 Referensi

   Dokumen lain yang menjadi rujukan:

   - `docs/ARSITEKTUR.md` — Arsitektur stack portfolio.
   - `docs/DIAGRAM_DAN_ERD.md` — Diagram arsitektur dan ERD database.
   - `docs/PERANCANGAN_ADMIN.md` — Perancangan fitur admin (login, relasi, menu).
   - `docs/PUBLIKASI_WEB.md` — Perilaku API publik vs admin untuk blog-posts dan projects.
   - `docs/AUDIT_REPORT_ISO27001.md` — Laporan audit keamanan informasi.
   - `docs/PANDUAN_DOKUMENTASI_RPL.md` — Panduan struktur dokumentasi RPL.
   - `README.md` (root) dan `portfolio-api/README.md`, `portfolio-admin/README.md`, `portfolio-web/README.md` — Setup dan informasi teknis.

---

2. Deskripsi Umum

   2.1 Perspektif Produk

   Sistem portfolio ini terdiri dari beberapa komponen terpisah yang saling terhubung:

   - `portfolio-api`: Backend **Lumen (PHP)** yang menyediakan REST API, autentikasi token, dan seluruh operasi CRUD terhadap database **MySQL/MariaDB**.
   - `portfolio-web`: Frontend **React (Vite)** yang digunakan pengunjung untuk melihat portfolio, blog, dan mengirim pesan kontak.
   - `portfolio-admin`: Frontend **React (Vite)** yang digunakan admin untuk login, mengelola konten, dan melihat pesan kontak.
   - Database: Menyimpan entitas `users`, `experiences`, `educations`, `skills`, `projects`, `blog_posts`, `certifications`, `contact_messages`, `tags`, dan tabel pivot sesuai ERD.

   `portfolio-web` dan `portfolio-admin` **tidak langsung mengakses database**, tetapi berkomunikasi dengan `portfolio-api` melalui HTTP. Akses data dibedakan antara **publik** (tanpa token) dan **admin** (dengan Bearer token).

   2.2 Fitur Produk (Ringkas)

   F1. Halaman publik portfolio:

   - Menampilkan profil pemilik (nama lengkap, headline, lokasi, kontak publik).
   - Menampilkan daftar pengalaman kerja dan pendidikan.
   - Menampilkan daftar skills per kategori dan level kemahiran.
   - Menampilkan daftar proyek (dengan penanda featured) dan detail proyek.
   - Menampilkan daftar blog post dan halaman detail blog.
   - Menampilkan sertifikasi dan detail penerbitannya.
   - Menyediakan form kontak bagi pengunjung.

   F2. Panel admin:

   - Login admin dengan username/email dan password.
   - Dashboard ringkasan data (jumlah users, projects, blog posts, contact messages).
   - CRUD untuk semua entitas utama (users, experiences, educations, skill categories, skills, user skills, projects, project skills, blog posts, tags, post tags, certifications, contact messages).
   - Pengisian field relasi melalui dropdown (select) yang menampilkan nama, bukan ID.
   - Auto-fill `user_id` berdasarkan user yang sedang login saat membuat konten baru.
   - Navigasi sidebar dengan menu dropdown per kelompok (Utama, Konten, Portfolio, Skills, Lainnya).

   F3. Backend API:

   - Menyediakan endpoint publik dan admin untuk semua resource.
   - Membedakan hasil GET blog-posts dan projects antara publik dan admin (hanya publikasi vs semua).
   - Menyediakan endpoint kontak publik dengan rate limiting.
   - Menyediakan dokumentasi API dengan Swagger/OpenAPI.

   2.3 Karakteristik Pengguna

   - **Pengunjung (Visitor)**:
     - Profil: user umum yang mengakses portfolio melalui browser (desktop/mobile).
     - Tujuan: melihat informasi profil, pengalaman, proyek, blog, dan menghubungi pemilik melalui form kontak.
     - Hak akses: hanya endpoint publik (GET data yang dipublikasi, POST contact).

   - **Admin (Pemilik Portfolio)**:
     - Profil: pemilik portfolio atau orang yang diberi hak untuk mengelola konten.
     - Tujuan: mengelola seluruh data portfolio dan membaca pesan kontak.
     - Hak akses: endpoint admin (CRUD penuh) dengan autentikasi Bearer token.

   2.4 Batasan-Batasan

   - **Platform**:
     - Aplikasi ini ditujukan untuk dijalankan di lingkungan server dengan **PHP 8.1+**, **Composer 2.2+**, dan **MySQL/MariaDB**.
     - Frontend (web & admin) menggunakan **Node.js/npm** untuk build dan dev server.
   - **Browser**:
     - Target utama: browser modern (Chrome, Firefox, Edge, Safari) dengan dukungan ES6 dan fetch API.
     - Dukungan untuk versi lawas Internet Explorer tidak menjadi target.
   - **Koneksi**:
     - Aplikasi mengasumsikan koneksi internet yang stabil; tidak ada mode offline khusus.
   - **Multi-tenant**:
     - Sistem dirancang untuk **satu pemilik portfolio** per instance (single user utama); multi-tenant di luar cakupan.

   2.5 Asumsi dan Dependensi

   - Server production akan dikonfigurasi dengan **HTTPS** (TLS) dan konfigurasi CORS yang benar.
   - File konfigurasi rahasia (`.env` untuk API, `.env` untuk frontend) tidak dikomit ke repository dan dikelola terpisah.
   - Database telah dikonfigurasi dengan user dan password yang kuat, dan melakukan backup berkala.
   - Admin memahami cara menggunakan panel admin untuk mengelola konten.

---

3. Kebutuhan Sistem (Specific Requirements)

   3.1 Kebutuhan Fungsional (Functional Requirements)

   Kebutuhan fungsional diberi kode **FR-XX**.

   3.1.1 Autentikasi dan Otorisasi Admin

   - **FR-01** — Sistem harus menyediakan endpoint login admin yang memverifikasi kredensial (username/email dan password) dan mengembalikan token autentikasi (Bearer token) beserta informasi user yang login.
   - **FR-02** — Sistem harus menyimpan token autentikasi admin di sisi klien (admin) secara aman (misalnya di sessionStorage) dan menambahkannya ke header `Authorization: Bearer <token>` pada setiap request yang memerlukan hak admin.
   - **FR-03** — Sistem harus membatasi endpoint CRUD tertentu (mutasi data dan akses contact-messages) sehingga hanya dapat diakses jika request memuat token yang valid.
   - **FR-04** — Sistem harus memberikan respon 401 (Unauthorized) jika request ke endpoint terlindungi tidak menyertakan token yang valid.

   3.1.2 Manajemen User dan Profil

   - **FR-05** — Sistem harus menyediakan endpoint untuk mengelola entitas `users` (create, read, update, delete) bagi admin.
   - **FR-06** — Sistem harus menampilkan informasi user utama pada halaman publik (nama lengkap, headline, lokasi, email publik, dan foto profil bila ada).
   - **FR-07** — Saat admin menambah konten baru (misal: experience, project, blog post), sistem harus secara otomatis mengisi `user_id` dengan ID user yang sedang login.

   3.1.3 Manajemen Pengalaman Kerja (Experiences)

   - **FR-08** — Sistem harus menyediakan CRUD experiences bagi admin, mencakup nama perusahaan, posisi, tanggal mulai/selesai, dan penanda apakah masih aktif.
   - **FR-09** — Halaman publik harus dapat menampilkan daftar pengalaman kerja user secara kronologis.

   3.1.4 Manajemen Pendidikan (Educations)

   - **FR-10** — Sistem harus menyediakan CRUD educations bagi admin, mencakup nama institusi, jenjang, bidang studi, tanggal mulai/selesai, dan penanda apakah masih aktif.
   - **FR-11** — Halaman publik harus dapat menampilkan daftar pendidikan user secara kronologis.

   3.1.5 Manajemen Skill dan Kategori

   - **FR-12** — Sistem harus menyediakan CRUD `skill_categories` bagi admin untuk mengelompokkan skill.
   - **FR-13** — Sistem harus menyediakan CRUD `skills` beserta kategorinya dan tingkat level (misal: beginner/advanced).
   - **FR-14** — Sistem harus menyediakan CRUD `user_skills` yang menghubungkan user dengan skill tertentu, lengkap dengan tingkat kemahiran dan tahun pengalaman.
   - **FR-15** — Halaman publik harus dapat menampilkan daftar skills per kategori, level, dan atribut relevan lainnya.

   3.1.6 Manajemen Proyek (Projects)

   - **FR-16** — Sistem harus menyediakan CRUD `projects` bagi admin, mencakup judul, slug, penanda `is_published`, tanggal publikasi, dan penanda featured.
   - **FR-17** — Sistem harus menyediakan CRUD `project_skills` untuk menghubungkan projects dengan skills terkait.
   - **FR-18** — Halaman publik harus menampilkan daftar projects yang hanya mencakup projects dengan `is_published = true`.
   - **FR-19** — Halaman detail project harus dapat diakses melalui slug untuk projects yang dipublikasi; jika project belum dipublikasi, pengunjung non-admin harus mendapat respon 404.

   3.1.7 Manajemen Blog Posts dan Tags

   - **FR-20** — Sistem harus menyediakan CRUD `blog_posts` bagi admin, mencakup judul, slug, konten, penanda `is_published`, dan tanggal publikasi.
   - **FR-21** — Sistem harus menyediakan CRUD `tags` dan `post_tags` untuk mengelola tag dan relasinya dengan blog posts.
   - **FR-22** — Halaman publik harus menampilkan daftar blog posts yang hanya mencakup posts dengan `is_published = true`.
   - **FR-23** — Halaman detail blog post harus dapat diakses melalui slug untuk posts yang dipublikasi; jika blog post belum dipublikasi, pengunjung non-admin harus mendapat respon 404.

   3.1.8 Manajemen Sertifikasi (Certifications)

   - **FR-24** — Sistem harus menyediakan CRUD `certifications` bagi admin, mencakup nama sertifikasi, penerbit, tanggal terbit, dan tanggal kadaluarsa (opsional).
   - **FR-25** — Halaman publik harus menampilkan daftar sertifikasi user.

   3.1.9 Form Kontak dan Pesan (Contact Messages)

   - **FR-26** — Sistem harus menyediakan endpoint publik `POST /api/contact` untuk menerima pesan dari pengunjung (name, email, subject, message).
   - **FR-27** — Sistem harus menyimpan setiap pesan kontak ke entitas `contact_messages` dan mengaitkannya dengan user pemilik portfolio.
   - **FR-28** — Sistem harus menyediakan antarmuka di admin untuk melihat daftar contact messages, menandai sebagai dibaca/tidak dibaca, dan melihat detail setiap pesan.

   3.1.10 Panel Admin (UI)

   - **FR-29** — Panel admin harus menyediakan halaman login, dashboard, dan halaman CRUD untuk setiap resource utama.
   - **FR-30** — Panel admin harus menampilkan field relasi (misal user, kategori, skill) dalam bentuk dropdown yang menampilkan nama (bukan ID) dan mengirim ID ke API saat disimpan.
   - **FR-31** — Panel admin harus menampilkan kolom relasi di tabel list menggunakan nama relasi (misal `user.full_name`, `category.name`) jika tersedia di response API.
   - **FR-32** — Menu sidebar admin harus mengelompokkan resource ke dalam beberapa grup (Utama, Konten, Portfolio, Skills, Lainnya) dan menyorot halaman aktif.

   3.1.11 Situs Publik (UI)

   - **FR-33** — Situs publik harus menyediakan halaman: Home, Tentang, Pengalaman, Pendidikan, Skills, Proyek (daftar + detail), Blog (daftar + detail), Sertifikasi, dan Kontak.
   - **FR-34** — Form kontak pada situs publik harus memvalidasi input wajib sebelum mengirim ke API.
   - **FR-35** — Situs publik harus hanya menampilkan projek dan blog posts yang telah dipublikasi (`is_published = true`).

   3.1.12 Dokumentasi API

   - **FR-36** — Sistem harus menyediakan dokumentasi API dalam format OpenAPI 3 yang dapat diakses melalui endpoint `/docs` (Swagger UI) dan `/docs/openapi.yaml`.

   3.2 Kebutuhan Non-Fungsional (Non-Functional Requirements)

   Kebutuhan non-fungsional diberi kode **NFR-XX**.

   3.2.1 Performa

   - **NFR-01** — Waktu respon rata-rata untuk permintaan GET dari frontend ke API pada lingkungan normal harus **≤ 1 detik** untuk operasi sederhana (misal list dengan pagination standar).
   - **NFR-02** — Waktu pemuatan awal halaman frontend (web dan admin) pada koneksi broadband yang wajar sebaiknya **≤ 3 detik**.
   - **NFR-03** — Sistem harus mampu menangani setidaknya **puluhan hingga ratusan** pengunjung per hari untuk kasus penggunaan portfolio pribadi tanpa degradasi kinerja signifikan.

   3.2.2 Keamanan

   - **NFR-04** — Password user harus disimpan dengan algoritma hash yang kuat (misalnya bcrypt), tidak dalam bentuk plain text.
   - **NFR-05** — Sistem harus membatasi percobaan login dengan mekanisme **rate limiting** (misalnya 10 percobaan per menit per IP) untuk mengurangi risiko brute force.
   - **NFR-06** — Endpoint kontak publik harus dilindungi dengan rate limiting untuk mencegah spam (misalnya 5 request per menit per IP).
   - **NFR-07** — Informasi sensitif seperti password dan token tidak boleh ditulis ke dalam log aplikasi.
   - **NFR-08** — Konfigurasi CORS harus membatasi origin hanya pada domain frontend yang sah di lingkungan production.
   - **NFR-09** — Aplikasi production harus dijalankan melalui **HTTPS** dengan sertifikat TLS yang valid.

   3.2.3 Ketersediaan dan Keandalan

   - **NFR-10** — Sistem harus dirancang sedemikian rupa sehingga downtime yang direncanakan (maintenance) dapat diminimalkan dan dikomunikasikan.
   - **NFR-11** — Data penting (termasuk contact messages, blog posts, projects, certifications) harus disertakan dalam kebijakan backup database berkala pada tingkat infrastruktur.

   3.2.4 Usability

   - **NFR-12** — Antarmuka situs publik dan admin harus responsif dan dapat digunakan dengan nyaman pada perangkat desktop dan mobile.
   - **NFR-13** — Label dan teks pada form harus jelas dan konsisten, sehingga admin dan pengunjung memahami data yang perlu diisi.
   - **NFR-14** — Navigasi di admin harus terorganisir dalam grup menu yang logis (Utama, Konten, Portfolio, Skills, Lainnya).

   3.2.5 Maintainability

   - **NFR-15** — Kode backend dan frontend harus mengikuti standar penulisan yang wajar (PSR untuk PHP, praktik umum React) sehingga mudah dibaca dan diperluas.
   - **NFR-16** — Terdapat **test otomatis** untuk API (PHPUnit) yang mencakup skenario dasar (auth, CRUD utama, kontak, status kode) untuk membantu regression testing.
   - **NFR-17** — Dokumentasi (README, dokumen di `docs/`) harus diperbarui ketika ada perubahan besar pada arsitektur atau behavior endpoint.

   3.2.6 Portability dan Deployment

   - **NFR-18** — Sistem harus dapat dijalankan melalui **container** menggunakan Podman/Docker Compose sesuai panduan `DEPLOY.md`.
   - **NFR-19** — Variabel lingkungan (APP_ENV, APP_DEBUG, DB_*, CORS_ORIGINS, VITE_API_URL, dll.) harus dapat dikonfigurasi tanpa mengubah kode aplikasi.

   3.3 Kebutuhan Antarmuka Eksternal

   3.3.1 Antarmuka Pengguna (User Interface)

   - **IF-01** — Situs publik harus menyediakan navigasi utama ke halaman Home, Tentang, Pengalaman, Pendidikan, Skills, Proyek, Blog, Sertifikasi, dan Kontak.
   - **IF-02** — Panel admin harus menyediakan sidebar dengan grup menu dan halaman login, dashboard, serta halaman resource.
   - **IF-03** — Form input (baik di web maupun admin) harus memberikan umpan balik validasi ketika field wajib tidak diisi atau format salah (misalnya email tidak valid).

   3.3.2 Antarmuka API (System Interface)

   - **IF-04** — Frontend (web & admin) harus berkomunikasi dengan API melalui HTTP/HTTPS menggunakan JSON sebagai format pertukaran data.
   - **IF-05** — Endpoint API harus mengembalikan kode status HTTP standar (200, 201, 400, 401, 404, 422, 429, 500) dan payload JSON dengan struktur konsisten (misalnya `{ data: ..., message: ..., errors: ... }` sesuai implementasi).
   - **IF-06** — Dokumentasi API (Swagger UI) harus mencerminkan endpoint aktual dan diperbarui ketika ada perubahan signifikan.

---

4. Arsitektur dan Desain Teknis (Ringkas)

   4.1 Stack Teknologi

   - **Backend**: Lumen 10 (PHP 8.1+), REST API, autentikasi Bearer token.
   - **Database**: MySQL / MariaDB, dengan ERD seperti pada `docs/DIAGRAM_DAN_ERD.md`.
   - **Frontend Admin**: React 18 dengan Vite (`portfolio-admin`).
   - **Frontend Web**: React 18 dengan Vite (`portfolio-web`).
   - **Container/Orkestrasi**: Podman/Docker Compose (`compose.yaml`).

   4.2 Gambaran Arsitektur

   Secara garis besar:

   - Pengunjung mengakses `portfolio-web` yang memanggil `portfolio-api` untuk mendapatkan data publik.
   - Admin mengakses `portfolio-admin`, login ke `portfolio-api`, lalu melakukan CRUD data.
   - `portfolio-api` menjadi satu-satunya komponen yang langsung berkomunikasi dengan database.

   Detail diagram alur dan relasi tabel terdapat di:

   - `docs/ARSITEKTUR.md`
   - `docs/DIAGRAM_DAN_ERD.md`

   4.3 Matriks Kebutuhan

   | ID    | Kebutuhan                                         | Prioritas | Status  |
   |-------|----------------------------------------------------|----------|---------|
   | FR-01 | Endpoint login admin dan token autentikasi         | Tinggi   | Wajib   |
   | FR-16 | CRUD projects dan flag publish                     | Tinggi   | Wajib   |
   | FR-20 | CRUD blog posts dan publish/draft                  | Tinggi   | Wajib   |
   | FR-26 | Endpoint form kontak publik dengan penyimpanan     | Tinggi   | Wajib   |
   | FR-33 | Halaman-halaman utama situs publik                 | Tinggi   | Wajib   |
   | NFR-04| Password di-hash dengan algoritma yang kuat        | Tinggi   | Wajib   |
   | NFR-08| CORS dibatasi ke origin frontend yang sah          | Sedang   | Disarankan |
   | NFR-18| Dukungan deploy via container (Compose)            | Sedang   | Disarankan |

---

Lampiran (Opsional)

- A.1 ERD detail — lihat `docs/DIAGRAM_DAN_ERD.md`.
- A.2 Rincian perilaku publik vs admin untuk blog-posts dan projects — lihat `docs/PUBLIKASI_WEB.md`.
- A.3 Ringkasan audit keamanan dan kontrol terkait — lihat `docs/AUDIT_REPORT_ISO27001.md`.
