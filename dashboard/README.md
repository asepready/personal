# Portfolio Admin

Dashboard admin untuk mengelola data portfolio (CRUD). Mengonsumsi API Lumen (`portfolio-api`).

## Setup

1. `npm install`
2. Salin `.env.example` ke `.env` dan isi `VITE_API_URL` jika API tidak di-proxy.
3. Jalankan API di `http://localhost:8000`, lalu `npm run dev`. Admin berjalan di port 3001; request ke `/api/*` di-proxy ke API.

## Scripts

- `npm run dev` — development (port 3001)
- `npm run build` — build production
- `npm run preview` — preview build

## Fitur

- **Login**: autentikasi via API; current user disimpan dan dipakai untuk auto-fill saat buat konten.
- **Dashboard**: ringkasan jumlah Users, Projects, Blog Posts, Contact Messages (dengan unread); quick actions (+ Tulis Blog Baru, + Tambah Project).
- **CRUD** untuk: Users, Experiences, Educations, Skill Categories, Skills, User Skills, Projects, Project Skills, Blog Posts, Tags, Post Tags, Certifications, Contact Messages.
- **Form relasi**: field relasi (User, Kategori, Skill, dll.) berupa dropdown searchable (React Select) yang menampilkan nama (bukan ID).
- **Editor blog**: konten blog dalam Markdown dengan **preview live**; blok kode **Mermaid** (flowchart, sequence, ERD, state, class) di-render sebagai diagram di preview. Tema diagram mengikuti dark/light mode.
- **List**: DataTable (TanStack Table), status badge (Published/Draft), kebab menu (Edit, Duplicate, Preview, Hapus), pagination kanan bawah; kolom relasi menampilkan nama.
- **Menu sidebar**: navigasi per kelompok (Utama, Konten, Portfolio, Skills, Lainnya) sebagai dropdown; sidebar collapsible; kelompok yang berisi halaman aktif terbuka otomatis.
- **Messages Inbox** (halaman `/messages`): dua kolom (list pesan + detail), Mark all Read, Reply to Email, Mark as Read; badge unread di header.
- **Dark mode**: palet Slate 900/800; toggle tema di header; preferensi disimpan di localStorage.
- Contact Messages (resource): list + edit (tandai dibaca); tidak ada tombol Tambah.

Detail perancangan dan referensi kode: [docs/PERANCANGAN_ADMIN.md](../docs/PERANCANGAN_ADMIN.md) dan [docs/RANCANGAN_ADMIN_UI_UX.md](../docs/RANCANGAN_ADMIN_UI_UX.md) di root proyek. Perubahan terbaru: [docs/CHANGELOG.md](../docs/CHANGELOG.md).
