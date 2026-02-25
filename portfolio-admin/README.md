# Portfolio Admin

Dashboard admin untuk mengelola data portfolio (CRUD). Mengonsumsi API Lumen (`api-portfolio`).

## Setup

1. `npm install`
2. Salin `.env.example` ke `.env` dan isi `VITE_API_URL` jika API tidak di-proxy.
3. Jalankan API di `http://localhost:8000`, lalu `npm run dev`. Admin berjalan di port 3001; request ke `/api/*` di-proxy ke API.

## Scripts

- `npm run dev` — development (port 3001)
- `npm run build` — build production
- `npm run preview` — preview build

## Fitur

- **Login**: placeholder (tanpa auth sampai API mendukung).
- **Dashboard**: ringkasan jumlah Users, Projects, Blog Posts, Contact Messages.
- **CRUD** untuk: Users, Experiences, Educations, Skill Categories, Skills, User Skills, Projects, Project Skills, Blog Posts, Tags, Post Tags, Certifications, Contact Messages.
- Contact Messages: list + edit (tandai dibaca); tidak ada tombol Tambah.
