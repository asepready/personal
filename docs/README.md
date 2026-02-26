# Indeks Dokumentasi Proyek

Daftar dokumen di folder `docs/` dan dokumen penting di luar folder, beserta ringkasan isi dan untuk siapa dokumen tersebut berguna.

---

## Dokumen di folder docs/

### [ARSITEKTUR.md](ARSITEKTUR.md)

Gambaran stack (portfolio-api, portfolio-admin, portfolio-web, database), diagram alur klien–API, tabel komponen, serta ringkasan akses (tanpa token vs dengan token). Berguna untuk **developer baru** dan **tech lead** yang ingin paham sistem secara keseluruhan sebelum menyentuh kode.

---

### [PERANCANGAN_ADMIN.md](PERANCANGAN_ADMIN.md)

Perancangan dan implementasi fitur Admin: login dan current user, auto-fill user_id saat buat konten, form relasi sebagai select (nama bukan ID), list tampilan relasi dengan nama, menu sidebar dropdown per kelompok (terbuka saat halaman aktif). Termasuk diagram alur dan referensi file. Berguna untuk **developer** yang mengerjakan atau memelihara admin.

---

### [PUBLIKASI_WEB.md](PUBLIKASI_WEB.md)

Perilaku API untuk request publik vs admin: GET blog-posts dan GET projects tanpa token hanya mengembalikan item yang dipublikasi; dengan token admin mendapat semua. Tabel endpoint, referensi controller, dan diagram singkat. Berguna untuk **developer** dan **QA** yang perlu memastikan siapa melihat data apa.

---

### [AUDIT_REPORT_ISO27001.md](AUDIT_REPORT_ISO27001.md)

Laporan audit keamanan informasi (API & admin) mengacu kontrol Annex A ISO/IEC 27001:2022. Checklist per kontrol, bukti, dan rekomendasi. Berguna untuk **auditor keamanan**, **compliance**, dan **developer** yang menindaklanjuti temuan.

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

- Ingin **gambaran sistem** → baca [ARSITEKTUR.md](ARSITEKTUR.md).
- Ingin **detail fitur admin** → baca [PERANCANGAN_ADMIN.md](PERANCANGAN_ADMIN.md).
- Ingin **publik vs admin API** → baca [PUBLIKASI_WEB.md](PUBLIKASI_WEB.md).
- Ingin **audit keamanan** → baca [AUDIT_REPORT_ISO27001.md](AUDIT_REPORT_ISO27001.md).
- Ingin **jalankan / deploy** → [README.md](../README.md) dan [DEPLOY.md](../DEPLOY.md); setup per app di README masing-masing subproyek.
