# Portfolio Web (Visitor)

Frontend portfolio untuk pengunjung. Mengonsumsi API Lumen (`portfolio-api`).

## Setup

1. `npm install`
2. Salin `.env.example` ke `.env` dan isi `VITE_API_URL` jika API tidak di-proxy (mis. `http://localhost:8000`).
3. Untuk development dengan proxy: jalankan API di `http://localhost:8000` (mis. `php artisan serve` di folder portfolio-api), lalu `npm run dev`. Request ke `/api/*` akan di-proxy ke API.

## Scripts

- `npm run dev` — development (port 3000)
- `npm run build` — build production
- `npm run preview` — preview build

## Halaman

Home, Tentang, Pengalaman, Pendidikan, Skills, Proyek (+ detail), Blog (+ detail), Sertifikasi, Kontak.
