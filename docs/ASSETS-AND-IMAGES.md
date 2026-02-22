# Manajemen Aset Gambar & Optimasi

Panduan agar foto profil, diagram topologi, screenshot, dan CV tidak membebani performa (Lighthouse > 90).

---

## 1. Format gambar (WebP / AVIF)

Gambar asli (PNG/JPG resolusi tinggi) memperlambat loading dan menurunkan skor Lighthouse.

| Format | Kapan dipakai | Catatan |
|--------|----------------|---------|
| **WebP** | Foto, screenshot, diagram raster | Ukuran lebih kecil dari PNG/JPG dengan kualitas setara. Dukungan browser luas. |
| **AVIF** | Opsional, untuk penghematan ekstra | Lebih kecil dari WebP, dukungan browser semakin baik. Bisa dipakai dengan `<picture>` dan fallback WebP. |
| **SVG** | Diagram, ikon, logo | Vektor: tajam di semua resolusi, ukuran file kecil. **Prioritas untuk diagram topologi.** |
| **PNG/JPG** | Hindari untuk aset baru | Jika terpaksa, kompres dulu dan pertimbangkan konversi ke WebP. |

**Rekomendasi:** Simpan aset baru dalam WebP (atau AVIF). Untuk diagram dari Draw.io/Excalidraw, ekspor sebagai **SVG** (prioritas) atau PNG lalu konversi ke WebP.

---

## 2. Diagram topologi (Draw.io / Excalidraw)

Phase 3 membutuhkan diagram topologi untuk proyek jaringan.

- **Ekspor sebagai SVG** (prioritas): kualitas tajam, ukuran kecil, skalabel. Di Draw.io: File → Export as → SVG.
- **Alternatif:** Ekspor PNG lalu konversi ke **WebP** (jangan biarkan PNG besar di repo).
- **Hindari:** PNG resolusi tinggi tanpa optimasi.

Letakkan file di `web/public/` (mis. `diagram-project-x.svg`) dan referensi dari halaman Projects atau dari field `diagram_url` di data proyek.

---

## 3. CV (cv.pdf)

- Letakkan **satu file** di **`web/public/cv.pdf`** agar tombol "Download CV" berfungsi.
- **Ukuran:** Optimalkan agar **tidak lebih dari 5 MB**. PDF yang terlalu besar memperlambat unduh dan memengaruhi performa persepsi.
- **Cara:** Kurangi resolusi gambar di dalam PDF, atau ekspor ulang dari sumber (Word/Google Docs) dengan opsi "Reduce file size" / kompresi. Pastikan PDF tanpa password.

CI memeriksa: jika `web/public/cv.pdf` ada dan ukurannya > 5 MB, build web akan gagal (lihat `.github/workflows/ci-cd.yml`).

---

## 4. Skrip optimasi gambar (opsional)

Di frontend (`web/`) tersedia skrip untuk mengonversi PNG/JPG ke WebP:

```bash
cd web
npm run optimize:images
```

Skrip akan memproses gambar di `web/public/` dan `web/src/assets/` (jika ada) dan menulis versi `.webp` di samping file asli. Setelah itu, ubah referensi di kode (atau pakai `<picture>`) agar memakai `.webp`. Skrip ini untuk dijalankan **lokal** sebelum commit; tidak wajib di CI.

Tanpa skrip, pastikan Anda mengonversi gambar ke WebP/AVIF secara manual (mis. dengan [Squoosh](https://squoosh.app)) sebelum menambahkannya ke repo.

---

## 5. Ringkasan ceklis

- [ ] Foto profil, screenshot: format WebP (atau AVIF); hindari PNG/JPG besar.
- [ ] Diagram topologi: ekspor **SVG** dari Draw.io/Excalidraw; atau PNG lalu konversi ke WebP.
- [ ] **cv.pdf** di `web/public/`: ukuran ≤ 5 MB; optimalkan jika perlu.
- [ ] (Opsional) Jalankan `npm run optimize:images` di `web/` untuk generate WebP dari PNG/JPG yang ada.

Referensi: [ToDo.md](ToDo.md) Phase 2 (Lighthouse > 90) dan Phase 3 (Projects, CV).
