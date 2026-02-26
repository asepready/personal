# Ringkasan Rancangan Proyek

Dokumen ini merangkum rancangan (plan) yang telah dibuat untuk proyek portfolio, beserta status implementasi yang relevan.

**Perubahan kode dan dokumentasi terbaru** dicatat di [CHANGELOG.md](CHANGELOG.md).

---

## Rancangan utama (yang tercakup dalam dokumentasi)

| Rancangan | Ringkasan | Status / dokumen |
|-----------|-----------|-------------------|
| **Dokumentasi menyeluruh** | Indeks dokumentasi di `docs/`, arsitektur stack, perilaku publikasi (publik vs admin), pembaruan README root. | [SRS-PORTFOLIO.md](SRS-PORTFOLIO.md), [README.md](README.md), [ARSITEKTUR.md](ARSITEKTUR.md), [PUBLIKASI_WEB.md](PUBLIKASI_WEB.md). |
| **Rancangan UI/UX Web (publik)** | Konsep "Clean & Content-First Professional": style guide, Hero, Navbar (sticky/glassmorphism), Timeline, Skills (chips), Projects (featured + grid), Blog & reading mode, Sertifikasi & Kontak (floating labels, validasi). Tech: Tailwind, Headless/Radix, Framer Motion, react-hook-form + Zod. | Rancangan: [RANCANGAN_WEB_UI_UX.md](RANCANGAN_WEB_UI_UX.md). Implementasi mengacu struktur komponen dan checklist NFR-12, FR-34, FR-35, NFR-01. |
| **Rancangan UI/UX Admin** | Konsep "Clean Data-Driven Dashboard": layout Sidebar + Header + Main, Dashboard (kartu statistik + quick actions), DataTable (TanStack Table, StatusBadge, kebab menu), Form CRUD (FormBadge, RelationalSelect, auto-slug), Messages Inbox dua kolom, dark mode Slate 900/800. | Rancangan: [RANCANGAN_ADMIN_UI_UX.md](RANCANGAN_ADMIN_UI_UX.md). Implementasi: portfolio-admin (AdminLayout, DataTable, MessagesInbox, useAdminSummary, theme). |
| **Perancangan admin (perilaku)** | Login & current user, auto-fill user_id, form/list relasi dengan nama (bukan ID), menu sidebar dropdown per kelompok (terbuka saat halaman aktif). | [PERANCANGAN_ADMIN.md](PERANCANGAN_ADMIN.md). |
| **Publikasi ke web** | Request tanpa token hanya mendapat blog posts dan projects dengan `is_published = true`; admin dengan token melihat semua (termasuk draft). | API + admin (resourceConfig); [PUBLIKASI_WEB.md](PUBLIKASI_WEB.md). |
| **Perbaikan review admin** | Dashboard link Edit via `?edit=id`, contact messages read-only di form, filter select dari API, users username/password. | ResourcePage, resourceConfig, Dashboard, UserController. |

---

## Rancangan lain (referensi)

- **UI/UX:** Rancangan lengkap web publik di [RANCANGAN_WEB_UI_UX.md](RANCANGAN_WEB_UI_UX.md), admin di [RANCANGAN_ADMIN_UI_UX.md](RANCANGAN_ADMIN_UI_UX.md); tema dark/light di kedua aplikasi.
- **API & audit:** review API, audit ISO 27001 → [AUDIT_REPORT_ISO27001.md](AUDIT_REPORT_ISO27001.md).
- **Auth:** login admin username/password didokumentasikan di [PERANCANGAN_ADMIN.md](PERANCANGAN_ADMIN.md).
- **Deploy:** Podman/Docker Compose → [DEPLOY.md](../DEPLOY.md).
- **Lain:** filter/retry/responsif admin, rapikan struktur proyek.

---

## Alur dari rancangan ke dokumentasi

1. **Kebutuhan & visi** — Diformalkan di [SRS-PORTFOLIO.md](SRS-PORTFOLIO.md) dan diringkas sebagai backlog fitur di dokumen ini.
2. **Rancangan / desain detail** — Dipecah menjadi arsitektur, ERD, alur, dan perancangan fitur: [ARSITEKTUR.md](ARSITEKTUR.md), [DIAGRAM_DAN_ERD.md](DIAGRAM_DAN_ERD.md), [PERANCANGAN_ADMIN.md](PERANCANGAN_ADMIN.md), [PUBLIKASI_WEB.md](PUBLIKASI_WEB.md), [ALUR_KONTEN_POST.md](ALUR_KONTEN_POST.md).
3. **Implementasi** — Perubahan kode di portfolio-api, portfolio-admin, portfolio-web sesuai rancangan.
4. **Pengujian & audit** — Hasil pengujian dan audit dicatat, misalnya di [AUDIT_REPORT_ISO27001.md](AUDIT_REPORT_ISO27001.md) dan panduan testing di `portfolio-api/README.md`.
5. **Deployment** — Cara menjalankan dan merilis stack didokumentasikan di [DEPLOY.md](../DEPLOY.md) dan konfigurasi terkait (misalnya `compose.yaml`).
6. **Indeks & panduan RPL** — [docs/README.md](README.md) dan [PANDUAN_DOKUMENTASI_RPL.md](PANDUAN_DOKUMENTASI_RPL.md) menghubungkan semua dokumen dan memetakan ke tahap SDLC/Scrum.

**Diagram dan ERD:** Diagram arsitektur stack, Entity Relationship Diagram (ERD) database, alur publikasi, alur admin, dan alur deploy tersedia di [DIAGRAM_DAN_ERD.md](DIAGRAM_DAN_ERD.md) (format Mermaid).

Untuk daftar lengkap dokumen proyek, lihat [Indeks Dokumentasi](README.md).
