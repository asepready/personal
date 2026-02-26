# Indeks Dokumentasi Proyek

Daftar dokumen di folder `docs/` dan dokumen penting di luar folder, beserta ringkasan isi dan untuk siapa dokumen tersebut berguna.

---

## Dokumen di folder docs/

### [CHANGELOG.md](CHANGELOG.md)

**Catatan perubahan proyek**: perubahan penting pada API, admin, dan dokumentasi (migration, fitur editor Mermaid, pembaruan diagram & SRS). Berguna untuk **developer** dan **tech lead** yang ingin melacak perubahan terbaru.

---

### [SRS-PORTFOLIO.md](SRS-PORTFOLIO.md)

**Spesifikasi kebutuhan perangkat lunak** untuk aplikasi web portfolio: kebutuhan fungsional (FR), non-fungsional (NFR), batasan, dan antarmuka. Dokumen dirapikan dengan **daftar isi**, **tabel ringkasan FR/NFR** untuk referensi cepat, dan format heading konsisten. Berperan sebagai **Product Vision & Backlog** dan dasar perancangan/implementasi/pengujian. Berguna untuk **stakeholder**, **tech lead**, dan **developer**.

---

### [RINGKASAN_RANCANGAN.md](RINGKASAN_RANCANGAN.md)

Ringkasan rancangan dan rencana pengembangan (backlog fitur utama) yang menghubungkan kebutuhan di SRS dengan dokumen desain dan implementasi. Berguna untuk **tech lead** dan **developer** yang ingin konteks rencana pengembangan lintas sprint.

---

### [ARSITEKTUR.md](ARSITEKTUR.md)

**Gambaran arsitektur** stack: komponen (portfolio-api, portfolio-admin, portfolio-web, database), diagram konteks dan lapisan, tabel komponen, serta ringkasan akses (tanpa token vs dengan token). Dilengkapi daftar isi dan referensi ke [DIAGRAM_DAN_ERD.md](DIAGRAM_DAN_ERD.md) untuk diagram lengkap. Berguna untuk **developer baru** dan **tech lead** yang ingin paham sistem secara keseluruhan sebelum menyentuh kode.

---

### [DIAGRAM_DAN_ERD.md](DIAGRAM_DAN_ERD.md)

**Diagram lengkap** dalam format Mermaid: (1) Arsitektur sistem (konteks klien–API–DB, lapisan, deploy container), (2) **Entity Relationship Diagram (ERD)** database, (3) **Diagram urutan (sequence)** — login admin, form kontak, publish blog, GET blog publik, (4) **Flowchart** — alur publikasi, admin login/auto-fill, user flow pengunjung, admin CRUD, (5) **Diagram state** — status blog/project (draft/published), status pesan (unread/read), (6) **Diagram class** (ringkas) entitas domain. Berguna untuk **developer** dan **tech lead** yang perlu gambaran visual model data dan alur sistem.

---

### [RANCANGAN_WEB_UI_UX.md](RANCANGAN_WEB_UI_UX.md)

Rancangan UI/UX **portfolio-web** (publik): konsep "Clean & Content-First Professional", style guide, wireframe (Navbar, Hero, Timeline, Skills, Projects, Blog, Kontak), rekomendasi teknis (Tailwind, Framer Motion, react-hook-form + Zod), struktur kode, checklist SRS. Berguna untuk **developer frontend** dan **designer** yang mengerjakan situs publik.

---

### [RANCANGAN_ADMIN_UI_UX.md](RANCANGAN_ADMIN_UI_UX.md)

Rancangan UI/UX **panel admin**: konsep "Clean Data-Driven Dashboard", layout Sidebar + Header + Main, Dashboard, DataTable (TanStack Table, StatusBadge, kebab menu), Form CRUD (FormBadge, RelationalSelect, auto-slug), Messages Inbox, dark mode. Berguna untuk **developer** yang mengerjakan atau memelihara admin.

---

### [PERANCANGAN_ADMIN.md](PERANCANGAN_ADMIN.md)

Perancangan dan implementasi fitur Admin: login dan current user, auto-fill user_id saat buat konten, form relasi sebagai select (nama bukan ID), list tampilan relasi dengan nama, menu sidebar dropdown per kelompok (terbuka saat halaman aktif). Termasuk diagram alur dan referensi file. Melengkapi [RANCANGAN_ADMIN_UI_UX.md](RANCANGAN_ADMIN_UI_UX.md). Berguna untuk **developer** yang mengerjakan atau memelihara admin.

---

### [PUBLIKASI_WEB.md](PUBLIKASI_WEB.md)

Perilaku API untuk request publik vs admin: GET blog-posts dan GET projects tanpa token hanya mengembalikan item yang dipublikasi; dengan token admin mendapat semua. Tabel endpoint, referensi controller, dan diagram singkat. Mengikat rancangan API ke kebutuhan publikasi konten. Berguna untuk **developer** dan **QA** yang perlu memastikan siapa melihat data apa.

---

### [ALUR_KONTEN_POST.md](ALUR_KONTEN_POST.md)

Alur konten blog post dari dua sisi: pengunjung (portfolio-web) dan admin (portfolio-admin). Menjelaskan langkah demi langkah bagaimana post dibuat sebagai draft, dipublish, difilter oleh API (is_published, auth()->check()), lalu muncul di daftar dan detail blog publik, lengkap dengan diagram alur. Mewakili dokumentasi fitur hasil satu atau beberapa Sprint. Berguna untuk **developer**, **QA**, dan **penulis konten** yang ingin memahami siklus hidup post end-to-end.

---

### [AUDIT_REPORT_ISO27001.md](AUDIT_REPORT_ISO27001.md)

Laporan audit keamanan informasi (API & admin) mengacu kontrol Annex A ISO/IEC 27001:2022. Checklist per kontrol, bukti, dan rekomendasi. Menjadi artefak kualitas untuk Sprint Review dan hardening. Berguna untuk **auditor keamanan**, **compliance**, dan **developer** yang menindaklanjuti temuan.

---

### [PANDUAN_DOKUMENTASI_RPL.md](PANDUAN_DOKUMENTASI_RPL.md)

Panduan dokumentasi RPL/SDLC: tahap Analisis Kebutuhan (BRD, SRS, User Story, MoSCoW), Perancangan (SDD, ERD, UML, API), Implementasi (README, Changelog), Pengujian (Test Plan, UAT), Deployment & Maintenance (Deployment Guide, User Manual). Memetakan dokumen proyek ke tiap tahap SDLC dan ke artefak Scrum, serta mencatat celah/rekomendasi. Berguna untuk **mahasiswa RPL**, **tech lead**, **QA**, dan **dosen/penguji** yang ingin struktur dokumen mengacu standar SDLC dan Scrum.

---

## Dokumen di luar folder docs/

| Dokumen | Lokasi | Isi | Untuk siapa |
|---------|--------|-----|-------------|
| **Deploy (container)** | [DEPLOY.md](../DEPLOY.md) | Build dan jalankan stack dengan Podman/Docker Compose; migrasi DB; akses service. | DevOps, developer yang deploy |
| **Root project** | [README.md](../README.md) | Struktur proyek, cara jalankan dari root (install, build, dev), link ke dokumentasi. | Semua |
| **Setup API** | [portfolio-api/README.md](../portfolio-api/README.md) | Persyaratan, env, migrate, token, Swagger, testing. | Developer backend |
| **Setup Admin** | [portfolio-admin/README.md](../portfolio-admin/README.md) | Setup, scripts, fitur admin. | Developer frontend admin |
| **Setup Web** | [portfolio-web/README.md](../portfolio-web/README.md) | Setup, scripts, halaman publik. | Developer frontend web |

---

## Mulai dari mana?

- Ingin **perubahan terbaru proyek** → baca [CHANGELOG.md](CHANGELOG.md).
- Ingin **gambaran kebutuhan & ruang lingkup sistem** → baca [SRS-PORTFOLIO.md](SRS-PORTFOLIO.md).
- Ingin **ringkasan rencana dan backlog fitur** → baca [RINGKASAN_RANCANGAN.md](RINGKASAN_RANCANGAN.md).
- Ingin **gambaran sistem secara teknis** → baca [ARSITEKTUR.md](ARSITEKTUR.md).
- Ingin **diagram dan ERD** → baca [DIAGRAM_DAN_ERD.md](DIAGRAM_DAN_ERD.md).
- Ingin **UI/UX web publik** → baca [RANCANGAN_WEB_UI_UX.md](RANCANGAN_WEB_UI_UX.md).
- Ingin **UI/UX panel admin** → baca [RANCANGAN_ADMIN_UI_UX.md](RANCANGAN_ADMIN_UI_UX.md).
- Ingin **detail fitur admin (perilaku)** → baca [PERANCANGAN_ADMIN.md](PERANCANGAN_ADMIN.md).
- Ingin **publik vs admin API** → baca [PUBLIKASI_WEB.md](PUBLIKASI_WEB.md).
- Ingin **alur konten blog post end-to-end** → baca [ALUR_KONTEN_POST.md](ALUR_KONTEN_POST.md).
- Ingin **audit keamanan** → baca [AUDIT_REPORT_ISO27001.md](AUDIT_REPORT_ISO27001.md).
- Ingin **panduan dokumentasi RPL/SDLC & mapping Scrum** → baca [PANDUAN_DOKUMENTASI_RPL.md](PANDUAN_DOKUMENTASI_RPL.md).
- Ingin **jalankan / deploy** → [README.md](../README.md) dan [DEPLOY.md](../DEPLOY.md); setup per app di README masing-masing subproyek.
