# Catatan Perubahan Proyek (Changelog)

Dokumen ini mencatat perubahan penting pada kode dan dokumentasi proyek portfolio. Untuk rincian teknis tiap modul, lihat README di masing-masing subproyek.

---

## 2026-02-26 (Perubahan terbaru)

### API (portfolio-api)

- **Blog post: kolom `excerpt` diperluas**  
  Migration `2026_02_26_200000_change_blog_posts_excerpt_to_text`: kolom `excerpt` di tabel `blog_posts` diubah dari `VARCHAR(255)` menjadi `TEXT` agar mendukung ringkasan panjang. Setelah pull, jalankan:
  ```bash
  php artisan migrate
  ```
- **Validasi BlogPostController**  
  - `excerpt`: `nullable|string|max:65535`  
  - `content`: `required|string|max:16777215` (store), `sometimes|string|max:16777215` (update)  
  Mengurangi risiko error saat menyimpan konten atau excerpt panjang.

### Admin (portfolio-admin)

- **Preview Markdown + Mermaid di editor blog**  
  Editor konten blog (Markdown) kini merender diagram **Mermaid** di panel preview. Blok kode dengan ` ```mermaid ` akan ditampilkan sebagai diagram (flowchart, sequence, ERD, state, class). Tema diagram mengikuti dark/light mode admin. Dependensi: `mermaid`.

### Dokumentasi

- **Diagram lengkap** ([DIAGRAM_DAN_ERD.md](DIAGRAM_DAN_ERD.md)): ditambah diagram urutan (sequence), flowchart alur pengunjung & admin CRUD, diagram state (draft/published, unread/read), diagram class (ringkas), dan arsitektur lapisan.
- **SRS** ([SRS-PORTFOLIO.md](SRS-PORTFOLIO.md)): dirapikan dengan daftar isi, tabel ringkasan FR/NFR, dan format heading konsisten.
- **Arsitektur** ([ARSITEKTUR.md](ARSITEKTUR.md)): dilengkapi daftar isi dan referensi ke dokumen diagram.
- **Rancangan UI/UX**  
  - [RANCANGAN_WEB_UI_UX.md](RANCANGAN_WEB_UI_UX.md): rancangan situs publik (Clean & Content-First Professional).  
  - [RANCANGAN_ADMIN_UI_UX.md](RANCANGAN_ADMIN_UI_UX.md): rancangan panel admin (Clean Data-Driven Dashboard), termasuk dukungan Mermaid di editor blog.
- **Indeks** ([README.md](README.md)): ditambah entri untuk RANCANGAN_WEB_UI_UX, RANCANGAN_ADMIN_UI_UX, dan CHANGELOG.

---

## Sebelumnya

- **Admin:** Layout Sidebar + Header + Main, Dashboard (statistik + quick actions), DataTable (TanStack Table, StatusBadge, kebab menu), Form CRUD (FormBadge, RelationalSelect, auto-slug), Messages Inbox dua kolom, dark mode Slate 900/800.  
- **API:** Autentikasi Bearer token, filter `is_published` untuk blog-posts dan projects (publik vs admin).  
- **Dokumentasi:** SRS, ARSITEKTUR, ERD, PUBLIKASI_WEB, PERANCANGAN_ADMIN, ALUR_KONTEN_POST, DEPLOY.

---

Untuk daftar dokumen lengkap, lihat [Indeks Dokumentasi](README.md).
