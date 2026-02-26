# Design UI/UX — Portfolio Personal (Clean & Content-First Professional)

Dokumen ini mendefinisikan desain antarmuka dan pengalaman pengguna untuk portfolio personal, selaras dengan SRS (NFR-12 responsif, NFR-13 mudah digunakan) dan pemisahan konten publik vs admin.

---

## 1. Prinsip Desain

- **Content-First**: Keterbacaan dan informasi (proyek, blog, pengalaman) diutamakan; visual mendukung, tidak mendominasi.
- **Clean & Profesional**: Layout rapi, spacing konsisten, sedikit dekorasi; kesan matang dan kredibel.
- **Aksesibel**: Kontras teks/background minimal AA (WCAG), focus state jelas, label/form terhubung.
- **Responsif**: Mobile-first; breakpoints konsisten (sm: 640px, md: 768px, lg: 1024px, xl: 1280px).

---

## 2. Design Tokens

### 2.1 Warna (selaras dengan `index.css`)

| Token | Dark | Light | Penggunaan |
|-------|------|-------|------------|
| `--color-bg` | #0f0f12 | #f4f4f5 | Background halaman |
| `--color-surface` | #18181c | #ffffff | Kartu, navbar (setelah scroll), input |
| `--color-border` | #2a2a2e | #e4e4e7 | Border kartu, input, pemisah |
| `--color-text` | #e4e4e7 | #18181b | Teks utama |
| `--color-text-muted` | #a1a1aa | #71717a | Metadata, caption, secondary |
| `--color-primary` | #7c3aed | #6d28d9 | Link, CTA, aksen, active state |
| `--color-primary-hover` | #8b5cf6 | #5b21b6 | Hover link/CTA |

**Tambahan (opsional):**

- `--color-overlay`: rgba(0,0,0,0.5) — overlay gelap pada gambar proyek saat hover.
- `--color-glass`: rgba(255,255,255,0.08) / rgba(0,0,0,0.04) — glassmorphism navbar.

### 2.2 Tipografi

- **Font**: `--font-sans` (DM Sans) untuk UI; untuk **body blog post** gunakan **font serif** (mis. Lora, Source Serif Pro) agar nuansa editorial.
- **Skala**:
  - H1 (Hero): 2.25rem–2.5rem (36–40px), font-weight 700.
  - H2 (Section / Judul kartu): 1.5rem–1.75rem (24–28px), font-weight 700.
  - H3: 1.25rem (20px), font-weight 600.
  - Body: 1rem (16px), line-height 1.6; body blog: 1.125rem (18px), line-height 1.7.
  - Small / metadata: 0.875rem (14px), color `--color-text-muted`.

### 2.3 Spacing

- **Skala**: 4, 8, 12, 16, 24, 32, 48, 64 (px). Gunakan konsisten (mis. 8px base, kelipatan).
- **Container**: max-width 1100px (existing), padding horizontal 1.5rem; untuk **reading area blog** max-width ~720px (65–75 karakter).

### 2.4 Radius & Shadow

- **Radius**: kartu/button 8px; pill/badge 9999px; blob foto hero custom (SVG/CSS).
- **Shadow**: sangat halus (mis. 0 1px 3px rgba(0,0,0,0.08)) untuk kartu; hindari shadow berat.

---

## 3. Komponen Global

### 3.1 Navbar (Sticky)

- **Perilaku**:
  - Sticky top; saat di paling atas halaman: background transparan atau sangat tipis.
  - Setelah scroll: glassmorphism (backdrop-filter: blur(12px) + background semi-transparan + border-bottom tipis).
- **Layout**:
  - Kiri: logo/nama (link ke Home).
  - Kanan: menu (Home, About, Portfolio, Blog, Contact) + **Dark mode toggle** (ikon matahari/bulan).
- **Menu item**:
  - Hover: underline animasi (garis dari kiri ke kanan atau expand dari tengah), 150–200ms.
  - Active: warna `--color-primary`, underline atau bold.
- **Mobile**: Hamburger; saat dibuka, menu vertikal di bawah header (full-width), item stack.
- **Aksesibilitas**: `aria-current="page"` untuk halaman aktif; toggle tema dengan `aria-label` dan `title`.

### 3.2 Footer

- **Isi**: Link singkat (Privacy, optional), social links (LinkedIn, GitHub, Twitter/Instagram), copyright.
- **Style**: Background `--color-surface`, border-top `--color-border`; ikon social cukup besar (min 44px touch target).

---

## 4. Halaman & Section

### 4.1 Home — Hero Section

- **Layout**:
  - **Desktop**: Split 50/50 — Kiri: teks; Kanan: foto profil.
  - **Mobile**: Stack vertikal (teks dulu, lalu foto).
- **Kiri**:
  - "Hi, I'm [Name]" (H1).
  - Headline singkat (mis. "Fullstack Developer | UI Enthusiast") — small/medium, `--color-text-muted` atau teks biasa.
  - 1–2 kalimat value proposition (opsional).
  - CTA: **Lihat Proyek** (primary button), **Kontak Saya** (secondary/outline).
- **Kanan**:
  - Foto profil berkualitas tinggi; dibungkus container dengan **blob shape** (border-radius organik) atau **glassmorphism** ringan (blur + border).
- **Animasi**: Fade-in up pada load (teks + foto, sedikit stagger); hormati `prefers-reduced-motion`.
- **Kontras**: Pastikan teks terhadap background memenuhi AA.

**Mockup referensi (Hero + Navbar):** `C:\Users\Egov\.cursor\projects\c-container-personal\assets\portfolio-hero-navbar-mockup.png`

### 4.2 Home — Timeline Singkat (Preview)

- **Tujuan**: Preview pengalaman sebelum user klik "Lihat Proyek" atau "Tentang".
- **UI**: 2–4 entri terbaru; kartu kecil atau list dengan nama perusahaan, role, periode; link "Lihat semua" ke halaman About/Pengalaman.

### 4.3 About / Pengalaman & Pendidikan — Vertical Timeline

- **Layout**:
  - **Desktop**: Garis vertikal di tengah; node (titik) per entri; kartu selang-seling kiri–kanan (zig-zag).
  - **Mobile**: Garis di kiri; semua kartu di kanan garis.
- **Kartu**:
  - **Header**: Nama perusahaan/institusi (bold) + periode (abu-abu, kecil).
  - **Sub-header**: Posisi / jabatan / gelar.
  - **Body**: Deskripsi singkat (1–3 poin).
  - **Visual**: Logo perusahaan kiri atas (jika ada); placeholder inisial jika tidak.
- **Style**: Kartu background `--color-surface`, border tipis, shadow halus; spacing dalam kartu lega.

### 4.4 Skills — Tech Stack Chips

- **Tidak pakai progress bar.** Hanya chips/badges per kategori.
- **Kategori**: Frontend, Backend, Tools, Soft Skills (judul section kecil per grup).
- **Chip**: Pill-shaped; logo teknologi (jika ada) + nama; warna netral dengan aksen halus.
- **Interaksi**: Hover — chip sedikit membesar (scale 1.02–1.05); **tooltip** menampilkan "Level: Advanced" atau "Experience: 3 Years" (dari data user_skills).
- **Aksesibilitas**: Focus state jelas; tooltip accessible (bisa di-trigger keyboard, atau aria-label berisi level/experience).

### 4.5 Projects — Showcase

**Featured (3 proyek teratas):**

- Layout: 1 kolom penuh atau grid 2 kolom; kartu lebih besar.
- Gambar cover besar, aspect ratio konsisten (16:9 atau 4:3).
- Hover: Overlay gelap + teks putih (judul + satu kalimat).

**Grid (proyek lainnya):**

- Grid 3 kolom (desktop) → 2 (tablet) → 1 (mobile); tinggi kartu seragam.
- **Kartu**: Thumbnail → Judul → Deskripsi 2–3 baris (truncate) → Tags teknologi (chips kecil) → Tombol "View Detail" & "Repository".

**Halaman Detail Proyek:**

- **Header**: Gambar besar (hero image) lebar penuh atau dalam container.
- **Layout dua kolom (desktop)**:
  - **Kiri**: Deskripsi lengkap, Tantangan, Solusi (dan impact jika ada).
  - **Kanan**: Sidebar sticky — Role, Tahun, Link Live, Link Repo, Tech Stack (list/chips).
- **Mobile**: Konten utama dulu, lalu blok sidebar di bawah.

### 4.6 Blog — Content Hub

**Listing:**

- Grid kartu bersih (2–3 kolom desktop, 1 mobile).
- **Kartu**: Tag kategori (pojok kiri atas) → Judul (H2) → Ringkasan → Metadata (tanggal + "X min read").
- Tipografi judul menonjol; spacing konsisten.

**Halaman Detail Post (Reading Mode):**

- **Lebar baca**: max-width ~65–75 karakter (≈ 720–800px atau 45–50rem).
- **Body**: Font **serif**, 18–20px, line-height 1.6–1.75.
- **Struktur**: Judul → Metadata (tanggal, baca X min, kategori) → Konten (render dari API dengan React Markdown; sanitize).
- **Spacing**: Margin antar paragraf dan heading konsisten; blockquote/code block mudah dibedakan.

### 4.7 Sertifikasi

- **Tampilan**: Daftar kartu sederhana — logo penerbit, nama sertifikasi, penerbit/tahun, tombol "Download Certificate" (jika URL ada).
- **Banyak item**: Horizontal scroll (carousel) halus — overflow-x + scroll-snap; tombol prev/next opsional untuk aksesibilitas.

### 4.8 Kontak

- **Penempatan**: Section di halaman Kontak + ringkasan di Footer (email + social).
- **Form**:
  - Input besar (padding nyaman, font 16px+); **floating labels** (label pindah ke atas saat fokus/isi).
  - **Validasi real-time**: Format email, required, panjang; pesan error di bawah field (FR-34).
- **Social**: Ikon besar (LinkedIn, GitHub, Twitter/Instagram) di samping atau di bawah form; `aria-label` jelas.

---

## 5. User Flow (Ringkas)

1. **Masuk** → Hero: langsung paham siapa Anda.
2. **Scroll** → Timeline singkat → CTA "Lihat Proyek".
3. **Halaman Proyek** → Grid → Hover card (tech stack) → Klik "Detail".
4. **Detail proyek** → Baca → Tertarik → Scroll ke footer → LinkedIn atau Form Kontak.

---

## 6. Stack Teknis (Referensi)

- **Styling**: Tailwind CSS (atau pertahankan CSS variables + utility minimal).
- **Komponen aksesibel**: Headless UI / Radix UI (modal, dropdown, tooltip).
- **Ikon**: Heroicons / Lucide React.
- **Animasi**: Framer Motion (hero, scroll reveal, hover); hormati `prefers-reduced-motion`.
- **Konten**: React Markdown (+ sanitize) untuk blog; date-fns untuk tanggal.

---

## 7. Pemisahan Publik vs Admin

- **Publik**: Semua section di atas; navigasi hanya ke Home, About, Portfolio, Blog, Contact; tanpa link ke dashboard.
- **Admin**: Route terpisah (mis. `/admin`); layout sendiri (sidebar, menu kelola konten); tidak ditampilkan di navbar publik.

---

Dokumen ini dapat digunakan sebagai acuan implementasi dan testing (checklist responsif, aksesibilitas, dan kesesuaian dengan SRS).
