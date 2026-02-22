# Membuat Database dan User — MySQL/MariaDB

Panduan singkat membuat database dan user untuk API. Berlaku untuk **MySQL** dan **MariaDB**.

---

## 1. Persyaratan

- MySQL atau MariaDB sudah terpasang dan berjalan.
- Akses sebagai **root** atau user dengan privilege `CREATE`, `GRANT` (biasanya untuk setup awal).

---

## 2. Login ke MySQL/MariaDB

Dari terminal (client `mysql`):

```bash
# Login sebagai root (pakai password)
mysql -u root -p

# Atau tanpa password (development lokal)
mysql -u root
```

Atau lewat phpMyAdmin / Adminer: login dengan user yang punya hak buat database dan user.

---

## 3. Buat database

Di dalam session MySQL:

```sql
-- Ganti 'personal' dengan nama database yang Anda inginkan
CREATE DATABASE IF NOT EXISTS personal
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
```

- **utf8mb4** — mendukung emoji dan karakter 4-byte.
- **utf8mb4_unicode_ci** — collation untuk sort dan perbandingan string.

Cek database ada:

```sql
SHOW DATABASES LIKE 'personal';
```

---

## 4. Buat user (opsional tapi disarankan)

Jangan pakai user **root** untuk aplikasi. Buat user khusus:

```sql
-- Ganti 'api_user' dan 'password_kuat' dengan nama user dan password yang aman
CREATE USER IF NOT EXISTS 'api_user'@'localhost' IDENTIFIED BY 'password_kuat';
```

- **'api_user'@'localhost'** — user hanya bisa koneksi dari **localhost**. Untuk akses dari host lain (mis. server aplikasi beda mesin), ganti atau tambah:
  - **'api_user'@'%'** — dari host mana pun (kurang aman, pakai hanya jika perlu).
  - **'api_user'@'192.168.1.%'** — dari subnet tertentu.

---

## 5. Beri hak akses ke database

Beri user hak **SELECT, INSERT, UPDATE, DELETE** (dan **CREATE/DROP** jika mau jalankan migrasi dengan user ini) pada database tersebut:

```sql
-- User punya akses penuh ke database 'personal' (termasuk migrasi: CREATE/DROP table)
GRANT ALL PRIVILEGES ON personal.* TO 'api_user'@'localhost';

-- Muat ulang privilege
FLUSH PRIVILEGES;
```

Jika ingin user **hanya** bisa membaca/menulis data (tanpa buat/hapus tabel), cukup:

```sql
GRANT SELECT, INSERT, UPDATE, DELETE ON personal.* TO 'api_user'@'localhost';
FLUSH PRIVILEGES;
```

*(Kalau begitu, migrasi harus dijalankan dengan user root/admin yang punya CREATE/DROP.)*

---

## 6. Verifikasi koneksi

Keluar dari session root (`exit`), lalu coba login dengan user baru:

```bash
mysql -u api_user -p personal
```

Di dalam MySQL:

```sql
SELECT DATABASE();
SHOW TABLES;
```

Jika berhasil, Anda akan masuk ke database `personal` (tabel masih kosong sampai migrasi dijalankan).

---

## 7. Set DSN di aplikasi

Di **`api/configs/.env`** (atau env yang dipakai server/migrate), set koneksi database. Dua cara:

**Opsi A — Satu variabel (DB_DSN):**

```env
# Format: user:password@tcp(host:port)/database?parseTime=true
DB_DSN=api_user:password_kuat@tcp(localhost:3306)/personal?parseTime=true
```

- **user** — `api_user`
- **password** — password yang dipakai di `IDENTIFIED BY`
- **host** — `localhost` (atau IP/hostname server MySQL; untuk koneksi remote coba `127.0.0.1` jika localhost gagal)
- **port** — `3306` (default MySQL/MariaDB)
- **database** — `personal`
- **parseTime=true** — ditambahkan otomatis oleh config jika pakai Opsi B; untuk Opsi A bisa ditulis eksplisit.

**Opsi B — Komponen terpisah (tanpa DB_DSN):**

```env
DB_USER=api_user
DB_PASSWORD=password_kuat
DB_HOST=localhost
DB_PORT=3306
DB_NAME=personal
```

DSN akan dibangun di kode dari komponen di atas (password dengan karakter khusus aman). Jika `DB_HOST` atau `DB_PORT` kosong, dipakai default `localhost` dan `3306`.

---

## 8. Jalankan migrasi

Setelah database dan user siap, buat tabel dari aplikasi:

```bash
cd api
go run ./cmd/migrate
```

Atau:

```bash
cd api
make migrate
```

Tabel akan mengikuti skema di **`api/internal/database/migrations/`**. Detail schema dan migrasi: [DATABASE.md](DATABASE.md).

---

## 9. Ringkasan perintah (copy-paste)

Ganti `personal`, `api_user`, dan `password_kuat` sesuai kebutuhan:

```sql
-- 1. Buat database
CREATE DATABASE IF NOT EXISTS personal
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- 2. Buat user
CREATE USER IF NOT EXISTS 'api_user'@'localhost' IDENTIFIED BY 'password_kuat';

-- 3. Beri hak ke database (ALL = termasuk migrasi)
GRANT ALL PRIVILEGES ON personal.* TO 'api_user'@'localhost';
FLUSH PRIVILEGES;
```

Lalu di **`api/configs/.env`** (salah satu):

```env
DB_DSN=api_user:password_kuat@tcp(localhost:3306)/personal?parseTime=true
```

atau pakai komponen:

```env
DB_USER=api_user
DB_PASSWORD=password_kuat
DB_HOST=localhost
DB_PORT=3306
DB_NAME=personal
```

Lalu jalankan migrasi dari folder `api/`:

```bash
go run ./cmd/migrate
```

---

## 10. Keamanan singkat

- Jangan pakai **root** untuk koneksi aplikasi.
- Pakai password kuat untuk user database.
- Untuk production, batasi host user (mis. `'api_user'@'app-server-ip'` atau subnet tertentu).
- Jangan commit file **`.env`** yang berisi **DB_DSN** ke Git; gunakan **`.gitignore`** dan **`.env.example`** tanpa nilai rahasia.

Lihat juga: [DATABASE.md](DATABASE.md) (schema, migrasi, test koneksi), [README.md](README.md) (endpoint API).
