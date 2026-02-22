# SEO & Social Sharing (Open Graph & Twitter Card)

Agar link portfolio tampil rapi saat dibagikan di LinkedIn, Twitter/X, Facebook, atau WhatsApp (preview dengan judul, deskripsi, dan gambar).

---

## 1. Meta tags di index.html

Di **`web/index.html`** sudah ditambahkan:

| Tag | Fungsi |
|-----|--------|
| `og:type`, `og:title`, `og:description`, `og:image`, `og:url` | Open Graph (LinkedIn, Facebook, Slack, WhatsApp, dll.) |
| `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image` | Twitter Card (preview di Twitter/X) |

**Sebelum deploy:** Ganti **`https://yoursite.com`** di semua meta (og:image, og:url, twitter:image) dengan URL production Anda (mis. `https://username.github.io/personal` atau domain custom). Jika tidak diganti, preview bisa salah atau kosong.

---

## 2. Gambar OG (og:image)

- **Ukuran disarankan:** **Landscape 1200×630 px** (rasio ~1.91:1). Banyak platform memakai ukuran ini.
- **File:** Simpan di **`web/public/og-image.png`** (atau `.jpg`/`.webp`). Lalu di meta pakai `https://yoursite.com/og-image.png`.
- **Konten:** Logo, nama, tagline, atau screenshot hero — yang mewakili brand/portfolio. Hindari teks terlalu kecil (sulit terbaca di thumbnail).

Jika tidak menyediakan `og-image.png`, ganti URL di meta ke gambar lain yang sudah di-host (absolut), atau hapus sementara baris `og:image` / `twitter:image` (preview akan tanpa gambar).

---

## 3. Ceklis sebelum launch

- [ ] Ganti `https://yoursite.com` di `web/index.html` (og:url, og:image, twitter:image) dengan URL production.
- [ ] Buat gambar **1200×630 px**, simpan di `web/public/og-image.png` (atau format lain, sesuaikan nama di meta).
- [ ] Cek preview: [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/), [Twitter Card Validator](https://cards-dev.twitter.com/validator) (atau LinkedIn paste URL).

---

## 4. Per-halaman (opsional)

Meta saat ini berlaku untuk **seluruh SPA** (satu set og/twitter untuk semua route). Untuk OG berbeda per halaman (mis. tiap artikel blog), gunakan library seperti **@unhead/vue** (Vue 3) atau **vue-meta** dan set `useHead()` / `useSeoMeta()` per route. Itu membutuhkan render/SSR atau injeksi runtime; untuk kebanyakan portfolio, satu set global di `index.html` sudah cukup.

---

Referensi: [ToDo.md](ToDo.md) Phase 6 (robots.txt, sitemap, 404, **meta OG/Twitter**).
