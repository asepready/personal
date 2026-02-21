# Konfigurasi (configs)

File `.env` berisi variabel lingkungan untuk API. Salin dari `.env.example` dan isi nilai yang aman.

## Panduan kekuatan password

Gunakan untuk **ADMIN_PASSWORD** dan **password di DB_DSN** (user database):

| Aspek | Anjuran | Alasan |
|-------|---------|--------|
| **Panjang** | Minimal 12–16 karakter | Semakin panjang, waktu retas naik secara eksponensial. |
| **Huruf besar & kecil** | aB, Ab, dll. | Menambah variasi karakter di tiap posisi. |
| **Angka** | 0–9 | Memecah pola kata kamus. |
| **Simbol** | @, #, $, !, *, dll. | Mengecoh algoritma pencarian pola sederhana. |

**Contoh kuat:** `MyP@ssw0rd#2024!` (16 karakter, huruf besar/kecil, angka, simbol).

**Contoh lemah:** `admin123`, `password` — jangan dipakai di production.

## Variabel

Lihat **`.env.example`** untuk daftar variabel. Ringkasan: `PORT`, `DB_DSN`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `JWT_SECRET`, `ALLOW_ORIGIN`.

Jangan commit `.env` yang berisi nilai asli ke Git.
