# Rancangan UI/UX Portfolio Web (Publik)

Dokumentasi ini merangkum rancangan desain antarmuka untuk **portfolio-web** dengan konsep **"Clean & Content-First Professional"**: fokus pada keterbacaan, navigasi yang mudah, dan menonjolkan karya (projects/blog) tanpa gangguan visual berlebihan. Sesuai NFR-12 (responsif), NFR-13 (mudah digunakan), dan pemisahan konten publik vs admin.

---

## Tujuan

- **Kesan pertama yang kuat dan cepat** (NFR-02: loading cepat).
- **Keterbacaan (readability)** dan navigasi mudah.
- **Menonjolkan karya** (projects, blog) tanpa gangguan visual berlebihan.
- **Responsif** dan **aksesibel** (kontras teks–background cukup tinggi).

---

## 1. Style Guide & Design System (NFR-15)

Sebelum implementasi halaman, aturan visual berikut diterapkan agar konsisten.

| Aspek | Spesifikasi |
|-------|-------------|
| **Primary** | Deep Indigo `#4F46E5` (Tailwind indigo-600) — profesional, teknologi, terpercaya. |
| **Background Light** | Off-White `#F9FAFB` (Tailwind gray-50) — mengurangi ketegangan mata. |
| **Background Dark** | Slate Dark `#0F172A` (Tailwind slate-900). |
| **Typography Heading** | Plus Jakarta Sans atau Inter (modern, geometris, mudah dibaca). |
| **Typography Body** | Inter atau DM Sans. |
| **Shape Radius** | 8px untuk kartu; 9999px (pill) untuk tombol/chips. |
| **Shadow** | Soft shadow (shadow-lg, shadow-indigo-500/10) untuk kedalaman. |

---

## 2. Layout Halaman (Wireframe)

### A. Navbar (Global)

- **Posisi:** Fixed top, efek glassmorphism (transparan/blur saat scroll).
- **Isi:** Logo/Nama → Home, About, Portfolio, Blog, Contact → Dark Mode Toggle (ikon matahari/bulan).
- **Perilaku:** Scroll ke bawah → navbar mengecil sedikit dan background menjadi buram.
- **Mobile:** Hamburger menu; link dengan underline teranimasi atau perubahan warna halus saat hover.

### B. Hero Section (Home)

- **Layout:** Split 50/50 (desktop), stack (mobile).
- **Kiri:** H1 "Hi, I'm [Nama]", headline singkat (mis. Fullstack Developer \| UI Enthusiast), paragraf singkat, CTA "Lihat Proyek" dan "Kontak Saya".
- **Kanan:** Foto profil berkualitas tinggi dengan efek blob shape atau glassmorphism.
- **UX:** Animasi fade-in up saat halaman dimuat (mis. Framer Motion); kontras teks–background memadai.

### C. Pengalaman & Pendidikan (Timeline) — FR-09, FR-11

- **Konsep:** Vertical timeline.
- **Layout:** Garis vertikal di tengah (atau kiri di mobile); titik (nodes) = periode; kartu selang-seling kiri/kanan (zig-zag) di desktop.
- **Kartu:** Header = Nama Perusahaan/Institusi (bold) + periode (abu-abu); sub-header = posisi/jabatan; body = deskripsi singkat; logo perusahaan (jika ada di DB) di pojok kiri atas.
- **UX:** Scroll reveal saat kartu masuk viewport.

### D. Skills — FR-12, FR-15

- **Jangan:** Progress bar (subjektif/kurang akurat).
- **Konsep:** Tech stack chips/badges dikelompokkan per kategori (Frontend, Backend, Tools, Soft Skills).
- **UI:** Setiap skill = pill/chip dengan logo teknologi (React, PHP, Docker, dll.).
- **Interaksi:** Hover → chip sedikit membesar; tooltip menampilkan "Level: Advanced" atau "Experience: X Years" (dari data user_skills).

### E. Projects (Showcase) — FR-16, FR-18, FR-35

- **Featured:** 3 proyek terbaik di atas dengan layout besar (1 kolom penuh atau grid 2 kolom); gambar cover besar; overlay gelap + teks putih saat hover.
- **Grid:** Proyek lain = masonry grid atau grid 3 kolom responsif. Kartu: thumbnail → judul → deskripsi singkat (2–3 baris) → tags teknologi → "View Detail" & "Repository". Hanya tampilkan item dengan `is_published === true` (FR-35).
- **Detail project:** Header dengan gambar besar; kiri = deskripsi lengkap, tantangan, solusi; kanan = sidebar (Role, Tahun, Link Live, Link Repo, Tech Stack). Hover pada gambar: zoom halus.

### F. Blog (Content Hub) — FR-20, FR-22

- **Layout:** Card grid bersih; fokus tipografi judul.
- **Kartu:** Tag kategori (pojok kiri atas), judul (H2), ringkasan, metadata (tanggal publikasi, estimasi baca "X min read").
- **Reading mode (detail):** Max-width konten ~65–75 karakter; font serif untuk body (elegan/editorial); line-height longgar (1.6). Sidebar (desktop): Table of Contents (sticky, aktif menandai bagian yang dibaca), Related Posts, Tags.

### G. Sertifikasi & Kontak — FR-24, FR-26, FR-34

- **Sertifikasi:** Daftar kartu dengan logo penerbit (AWS, Google); jika banyak, horizontal scroll (carousel) halus; ikon "Download Certificate" jika URL tersedia.
- **Kontak:** Bagian jelas di footer atau halaman terpisah. Form: input besar, **floating labels** (label naik saat diketik). **Validasi real-time** (format email, required) — gunakan react-hook-form + Zod (FR-34). Social links (LinkedIn, GitHub, Twitter/Instagram) ikon besar di samping form. Background footer gelap (Slate-900).

---

## 3. Rekomendasi Teknis (React/Vite)

| Aspek | Library |
|-------|---------|
| **Styling** | Tailwind CSS (responsif, dark mode bawaan). |
| **Komponen UI** | Headless UI atau Radix UI (modal, dropdown, dialog aksesibel) + Heroicons atau Lucide React. |
| **Animasi** | Framer Motion (transisi, hover, scroll reveal). |
| **Formatting** | React Markdown (render konten blog), date-fns (format tanggal). |

---

## 4. Struktur Kode (portfolio-web)

```
src/
├── components/
│   ├── layout/
│   │   ├── Navbar.jsx      // Sticky, glassmorphism, scroll listener
│   │   └── Footer.jsx      // Form kontak & social links
│   ├── ui/
│   │   ├── Button.jsx      // Primary, Outline, Ghost
│   │   ├── Card.jsx        // Wrapper kartu proyek/blog
│   │   ├── Badge.jsx       // Skills & tags
│   │   └── Timeline.jsx    // Experience/Education
│   └── sections/
│       ├── Hero.jsx
│       ├── Skills.jsx
│       └── ProjectsGrid.jsx
├── pages/
│   ├── Home.jsx
│   ├── Projects.jsx        // FR-18
│   ├── ProjectDetail.jsx   // FR-19
│   ├── Blog.jsx            // FR-22
│   └── BlogPost.jsx        // FR-23
├── hooks/
│   ├── useDarkMode.js
│   └── useScrollReveal.js
└── App.jsx
```

---

## 5. Checklist UI/UX (SRS)

| ID | Persyaratan | Implementasi |
|----|-------------|-------------|
| NFR-12 | Responsif | Tailwind `md:w-1/2`, `lg:w-1/3`; Navbar → Hamburger di mobile. |
| FR-34 | Validasi form kontak | react-hook-form + Zod (email, required); pesan validasi real-time. |
| FR-35 | Published only | ProjectsGrid: `data.filter(item => item.is_published === true)`. |
| NFR-01 | Performa | React.lazy untuk halaman detail (code splitting); gambar WebP. |

---

## 6. Alur User (User Flow)

1. Visitor masuk → Hero bersih → langsung paham siapa Anda.
2. Scroll → Timeline pengalaman → klik "Lihat Proyek".
3. Halaman Proyek → grid → hover "E-Commerce" → lihat tech stack → klik "Detail".
4. Baca detail → tertarik → scroll ke footer → klik LinkedIn atau isi Form Kontak.

---

## Referensi

- Kebutuhan fungsional/non-fungsional: [SRS-PORTFOLIO.md](SRS-PORTFOLIO.md).
- Arsitektur stack: [ARSITEKTUR.md](ARSITEKTUR.md).
- Perilaku publikasi (is_published): [PUBLIKASI_WEB.md](PUBLIKASI_WEB.md).
