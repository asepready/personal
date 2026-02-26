# Rancangan UI/UX Panel Admin — Clean Data-Driven Dashboard

Dokumentasi ini merangkum rancangan desain dan implementasi **panel admin** portfolio dengan konsep **"Clean Data-Driven Dashboard"**: efisiensi, produktivitas, dan kenyamanan bagi admin tanpa antarmuka yang rumit. Ruang lingkup: **portfolio-admin** (React/Vite) dan integrasi dengan portfolio-api.

**Lihat juga:** [PERANCANGAN_ADMIN.md](PERANCANGAN_ADMIN.md) untuk detail implementasi login, auto-fill user_id, relasi form/list, dan sidebar. [RANCANGAN_WEB_UI_UX.md](RANCANGAN_WEB_UI_UX.md) untuk rancangan UI/UX situs publik.

---

## Tujuan

- **Panel admin yang bersih dan data-driven** untuk mengelola konten portfolio (projects, blog, skills, experience, certifications, messages, users).
- **Navigasi cepat & area kerja luas** (FR-32, NFR-14) dengan layout Sidebar + Header + Main.
- **Produktif & nyaman dipakai lama** dengan dark mode berbasis Slate (NFR-12) dan komponen yang modern (data table, form, inbox).

---

## Ringkasan Perbedaan UX: Web (Publik) vs Admin (Internal)

| Fitur | Portfolio Web (Publik) | Portfolio Admin (Internal) |
| --- | --- | --- |
| **Tujuan Utama** | Showcase & Estetika | Efisiensi & Produktivitas |
| **Navigasi** | Scroll & Storytelling | Sidebar & Breadcrumbs |
| **Tabel** | Grid/Masonry (Visual) | Data Table (Dense & Informative) |
| **Warna** | Berani & Kreatif | Netral & Kontras Tinggi |
| **Input** | Hanya Kontak (Validasi) | CRUD Lengkap (Dropdowns, Rich Text) |

Desain ini memastikan admin nyaman mengelola konten tanpa tersesat dalam antarmuka yang rumit.

---

## 1. Layout Struktur Utama

**Pola:** Sidebar + Header + Main Content (layout klasik dengan sentuhan modern).

- **Sidebar (kiri)**
  - Logo admin di atas.
  - Menu dikelompokkan: **Utama** (Dashboard), **Konten** (Blog Posts, Tags, Messages), **Portfolio** (Users, Experiences, Educations, Projects, Certifications), **Skills** (Skill Categories, Skills, User Skills, Project Skills), **Lainnya** (Contact Messages).
  - **Collapsible**: bisa disusutkan jadi ikon saja (state + localStorage) untuk memberi ruang lebih lebar pada tabel.
- **Header (top bar)**
  - Pencarian global (cari project/blog berdasarkan judul).
  - Ikon notifikasi (badge jumlah pesan kontak belum dibaca).
  - Profil admin (dropdown: Profile, Logout).
  - **Breadcrumb** di bawah: contoh `Dashboard / Projects / Edit`.
- **Main Content**
  - Area kerja untuk tabel, form, atau detail data.

---

## 2. Dashboard (Halaman Utama)

- **Kartu statistik** (grid atas):
  - Total Projects (angka + subteks "+ X Bulan Ini").
  - Published Posts (angka + "Draft: Y").
  - New Messages (angka + "Unread: Z" + indikator visual).
- **Quick Actions** di bawah: tombol "+ Tulis Blog Baru", "+ Tambah Project", dll.
- Data dari endpoint ringkasan atau agregasi (mis. `useAdminSummary`).

---

## 3. Data Tables (Halaman List)

- **Library:** TanStack Table (React Table) — tabel kompleks, sortable, filterable.
- **Status badge:** Published = hijau (`bg-green-100 text-green-800`), Draft = kuning (`bg-yellow-100 text-yellow-800`).
- **Relasi:** Kolom Author/User menampilkan **nama**, bukan ID (FR-31).
- **Action column:** Tombol **kebab (titik tiga)** per baris → dropdown: Edit, Duplicate, Delete (Headless UI Menu). Hindari tombol Edit/Hapus besar per baris.
- **Pagination:** Pojok kanan bawah, jelas (page, per_page terhubung API).

---

## 4. Form CRUD (Create/Edit)

- **user_id (FR-07):** Field disembunyikan; tampilkan badge "Posting sebagai: [Nama Anda]" di pojok kanan atas form.
- **Dropdown relasi (FR-30):** React Select (creatable, multi) atau MUI Autocomplete untuk Skills, Categories, Tags — searchable, tampilan chips (pill dengan x).
- **Slug:** Auto-generate dari judul (lowercase, spasi → dash); tetap bisa diedit manual (track `slugDirty`).
- **Validasi:** React Hook Form + Zod (minimal re-render, validasi deklaratif).
- **Rich Text (Blog):** Editor Markdown (@uiw/react-md-editor) dengan preview live. Blok kode **Mermaid** (flowchart, sequence, ERD, state, class) di-render sebagai diagram di preview; tema diagram mengikuti dark/light mode. Bukan `<textarea>` biasa.

---

## 5. Inbox Pesan Kontak (Messages)

- **Layout dua kolom** (seperti email client ringan):
  - **Kiri:** List pesan + tombol "Mark all Read". Setiap item: subject, pengirim, waktu. Pesan belum dibaca: background lebih terang atau teks tebal.
  - **Kanan:** Detail pesan (Subject, From, isi) + aksi "Reply to Email" (mailto), "Mark as Read".
- Jumlah unread dipakai untuk badge notifikasi di header dan di menu Sidebar (FR-28).

---

## 6. Dark Mode & Kontras (NFR-12)

- **Palet dark:** Background Slate 900 (`#0f172a`), kartu/tabel Slate 800 (`#1e293b`), teks abu terang & muted. Primary accent Deep Indigo (`#4f46e5`) selaras dengan portfolio-web.
- Toggle tema (matahari/bulan) di header; preferensi disimpan di localStorage; komponen pakai CSS variables.

---

## 7. Rekomendasi Komponen Teknis (React)

| Aspek | Library |
| --- | --- |
| **Layout & Shell** | Tailwind CSS + Headless UI (Sidebar responsif, Dropdown) |
| **Tabel Data** | TanStack Table (`@tanstack/react-table`) |
| **Formulir** | React Hook Form + Zod |
| **Dropdown relasi** | React Select (creatable, multi) atau MUI Autocomplete |
| **Rich Text (Blog)** | Tiptap atau React Quill |

---

## Struktur Kode (Admin)

- `portfolio-admin/src/components/AdminLayout.jsx` — Shell: Sidebar, Header, Main (Outlet). Sidebar & dropdown profil memakai Headless UI.
- `portfolio-admin/src/components/ui/` — DataTable, StatusBadge, RowActionsMenu, RelationalSelect, FormBadge.
- `portfolio-admin/src/pages/` — Dashboard, ResourcePage (generik CRUD/list), MessagesInbox, Login.
- `portfolio-admin/src/hooks/` — useAdminSummary (agregasi statistik & unread messages).
- `portfolio-admin/src/theme.js` — init & toggle tema dark/light (localStorage); CSS variables di `index.css`.

---

## Langkah Implementasi Bertahap

1. **Shell layout admin** — Tailwind + Headless UI; AdminLayout dengan Sidebar collapsible, Header (search placeholder, notif badge, profile dropdown Headless UI Menu, breadcrumb), Main outlet.
2. **Dashboard** — Kartu statistik (Total Projects, Published Posts + Draft, New Messages + Unread) + quick actions (+ Tulis Blog Baru, + Tambah Project); data dari `useAdminSummary`.
3. **DataTable & list pages** — TanStack Table di komponen `DataTable`; StatusBadge, RowActionsMenu (Headless UI Menu); pagination kanan bawah; terapkan di ResourcePage untuk Projects, Blog, dll.
4. **Form CRUD** — FormBadge "Posting sebagai ...", RelationalSelect (react-select searchable), auto-slug dari title (slugDirty), user_id dari session; Rich text blog dengan editor yang ada (mis. Markdown).
5. **Messages Inbox** — Halaman `/messages` (MessagesInbox): dua kolom (list kiri, detail kanan), Mark all Read, Reply to Email (mailto), Mark as Read; badge unread di header.
6. **Dark mode** — Palet Slate 900/800 di CSS variables; theme toggle di header (dan sidebar); `theme.js` + `data-theme` di `<html>`.

---

Rancangan ini selaras dengan SRS: FR-07, FR-28, FR-30, FR-31, FR-32, NFR-12, NFR-14, NFR-15.
