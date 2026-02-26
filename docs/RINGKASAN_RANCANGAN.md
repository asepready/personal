# Ringkasan Rancangan Proyek

Dokumen ini merangkum rancangan (plan) yang telah dibuat untuk proyek portfolio, beserta status implementasi yang relevan.

---

## Rancangan utama (yang tercakup dalam dokumentasi)

| Rancangan | Ringkasan | Status / dokumen |
|-----------|-----------|-------------------|
| **Dokumentasi menyeluruh** | Indeks dokumentasi di `docs/`, arsitektur stack, perilaku publikasi (publik vs admin), pembaruan README root. | Implementasi: [README.md](README.md) (indeks), [ARSITEKTUR.md](ARSITEKTUR.md), [PUBLIKASI_WEB.md](PUBLIKASI_WEB.md). |
| **Perancangan admin** | Login & current user, auto-fill user_id, form/list relasi dengan nama (bukan ID), menu sidebar dropdown per kelompok (terbuka saat halaman aktif). | Implementasi didokumentasikan di [PERANCANGAN_ADMIN.md](PERANCANGAN_ADMIN.md). |
| **Publikasi ke web** | Request tanpa token hanya mendapat blog posts dan projects dengan `is_published = true`; admin dengan token melihat semua (termasuk draft). Dukungan is_published untuk Projects di API dan admin. | Implementasi di API (BlogPostController, ProjectController) dan admin (resourceConfig projects); perilaku di [PUBLIKASI_WEB.md](PUBLIKASI_WEB.md). |
| **Perbaikan review admin** | (1) Dashboard: link Edit post terbaru membuka modal edit via `?edit=id`. (2) Contact messages: tampil body pesan (nama, email, subjek, pesan) read-only di form. (3) Filter: select dari API (users, skills, blog-posts, dll.). (4) Users: field username dan password di form dengan dukungan API. | Implementasi tersebar di ResourcePage, resourceConfig, Dashboard, UserController. |
| **Admin bergaya CMS** | Menu berkelompok, dashboard berorientasi konten (post terbaru, draft/published), workflow Draft/Published di list, preview post, (opsional) media library. | Sebagian tumpang tindih dengan fitur yang sudah ada (menu dropdown, preview di resourceConfig blog-posts); pengembangan lanjutan (dashboard CMS, media) dapat mengacu rancangan ini. |

---

## Rancangan lain (referensi)

Rancangan tambahan yang pernah dibuat (mis. di Cursor Plans) dan dapat dipakai sebagai acuan pengembangan:

- **UI/UX:** tema dark/light, UI/UX admin, UI/UX portfolio web.
- **API & audit:** review API, audit ISO 27001 (hasil: [AUDIT_REPORT_ISO27001.md](AUDIT_REPORT_ISO27001.md)).
- **Auth:** login admin username/password, fitur auth.
- **Deploy:** deploy ke Podman (hasil: [DEPLOY.md](../DEPLOY.md)), panduan Podman/K8s.
- **Lain:** form post admin, perbaikan portfolio API, filter/retry/responsif admin, rapikan struktur proyek.

---

## Alur dari rancangan ke dokumentasi

1. **Rancangan** — Disusun (mis. di Cursor Plans atau dokumen sementara).
2. **Implementasi** — Perubahan kode di portfolio-api, portfolio-admin, portfolio-web.
3. **Dokumentasi** — Hasil dan keputusan dicatat di `docs/` (PERANCANGAN_ADMIN, ARSITEKTUR, PUBLIKASI_WEB, AUDIT_REPORT_ISO27001) dan README subproyek.
4. **Indeks** — [docs/README.md](README.md) dan [README.md](../README.md) menghubungkan semua dokumen.

**Diagram dan ERD:** Diagram arsitektur stack, Entity Relationship Diagram (ERD) database, alur publikasi, alur admin, dan alur deploy tersedia di [DIAGRAM_DAN_ERD.md](DIAGRAM_DAN_ERD.md) (format Mermaid).

Untuk daftar lengkap dokumen proyek, lihat [Indeks Dokumentasi](README.md).
