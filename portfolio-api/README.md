# Personal Portfolio API (Lumen)

REST API untuk portfolio pribadi: users, experiences, educations, skills, projects, blog posts, certifications, contact messages. Dibangun dengan Lumen dan didokumentasikan dengan OpenAPI 3 / Swagger UI.

- **Publik (tanpa auth):** Semua `GET` untuk resource di atas, dan **POST /api/contact** (form kontak pengunjung, rate limited).
- **Admin (perlu auth):** Semua `POST`/`PUT`/`PATCH`/`DELETE` untuk resource di atas, serta semua endpoint **contact-messages** (list, show, create, update, delete). Gunakan header `Authorization: Bearer <token>`; token dibuat dengan `php artisan make:token`.

**Deploy ke Podman/Docker**: Lihat [DEPLOY.md](../DEPLOY.md) di root workspace untuk Containerfile, Compose, dan langkah deploy (API + DB + frontend).

## Persyaratan & Versi

| Komponen     | Versi                                    |
| ------------ | ---------------------------------------- |
| **PHP**      | ^8.1                                     |
| **Composer** | 2.2+ (diperlukan oleh Lumen 10)          |
| **Lumen**    | 10.x (Laravel Lumen)                     |
| **Database** | MySQL atau MariaDB (mis. bawaan Laragon) |

> **Jika `composer install` gagal dengan error "composer-runtime-api ^2.2 ... found composer-runtime-api[2.0.0]"**: Composer Anda terlalu lama. Lumen 10 membutuhkan Composer 2.2 atau lebih baru. Upgrade dengan `composer self-update` atau unduh dari [getcomposer.org](https://getcomposer.org/download/).  
> **Jika `composer self-update` gagal dengan "Access is denied" (Laragon)**: Jalankan terminal sebagai **Administrator** lalu jalankan `composer self-update` lagi; atau pasang Composer terbaru lewat [Composer-Setup.exe](https://getcomposer.org/download/).

## Setup Environment

1. **Clone repositori** dan masuk ke folder proyek:

    ```bash
    cd c:\laragon\www\portfolio-api
    ```

2. **Pasang dependensi**:

    ```bash
    composer install
    ```

3. **Salin file environment**:

    ```bash
    copy .env.example .env
    ```

    (Di Linux/macOS: `cp .env.example .env`)

4. **Konfigurasi database** di `.env`:
    - Buat database di MySQL/MariaDB (mis. nama: `personal_portfolio`).
    - Isi koneksi:
        - `DB_CONNECTION=mysql`
        - `DB_HOST=127.0.0.1`
        - `DB_PORT=3306`
        - `DB_DATABASE=personal_portfolio`
        - `DB_USERNAME=root`
        - `DB_PASSWORD=` (sesuaikan dengan Laragon/MySQL Anda)
    - Opsional: atur `APP_NAME`, `APP_URL`, `APP_TIMEZONE` sesuai kebutuhan.

5. **Jalankan migration**:
    ```bash
    php -r "echo 'base64:'.base64_encode(random_bytes(32)).PHP_EOL;"
    php artisan migrate
    ```

6. **(Opsional) Isi data contoh untuk testing**:
    ```bash
    php artisan db:seed
    ```
    atau `composer seed`. Data dummy: 1 user, pengalaman, pendidikan, kategori skill & skill, user-skills, 3 proyek, 2 post blog + tags, sertifikasi, 2 pesan kontak.

7. **Token API (untuk akses admin)**  
    Untuk memanggil endpoint yang dilindungi (POST/PUT/DELETE dan contact-messages), gunakan token:
    ```bash
    php artisan make:token          # assign token ke user pertama
    php artisan make:token 2        # assign token ke user dengan ID 2
    ```
    Lalu kirim header di setiap request: `Authorization: Bearer <token>`.

Setelah itu, API siap dijalankan.

## Menjalankan Server Lumen

Pilih salah satu cara:

### Opsi A: Laragon (Apache/Nginx)

- Pastikan proyek berada di bawah folder `www` (mis. `c:\laragon\www\api-portfolio`).
- Nyalakan Laragon dan pastikan MySQL/MariaDB berjalan.
- Buka di browser:
    - **Base URL**: `http://localhost/api-portfolio/public`
    - Ganti `localhost` dengan virtual host Anda jika sudah dikonfigurasi.

### Opsi B: Built-in PHP server (development)

```bash
php artisan serve
```

- Server berjalan di **http://localhost:8000**
- Base URL API: `http://localhost:8000/api`
- Dokumentasi: `http://localhost:8000/docs`

---

## Dokumentasi API (Swagger)

OpenAPI 3 dan Swagger UI disediakan untuk menjelajah dan mencoba endpoint.

### Cara mengakses

- **Swagger UI** (explore & try API):  
  **GET** `/docs`  
  Contoh: [http://localhost:8000/docs](http://localhost:8000/docs) (jika pakai `php artisan serve`), atau `http://localhost/api-portfolio/public/docs` (jika pakai Laragon).

- **Spesifikasi OpenAPI 3 (YAML)**:  
  **GET** `/docs/openapi.yaml`  
  Contoh: [http://localhost:8000/docs/openapi.yaml](http://localhost:8000/docs/openapi.yaml)

Gunakan path yang sama dengan base URL Anda (production: `https://domainanda.com/docs` dan `https://domainanda.com/docs/openapi.yaml`).

### Endpoint API (prefix: `/api`)

- **Publik (tanpa token):** `GET` untuk semua resource di bawah, plus **POST /api/contact** (form kontak: body `name`, `email`, `subject`, `message`; rate limit 5 request/menit per IP). `user_id` untuk contact di-set oleh server (env `CONTACT_OWNER_USER_ID` atau user pertama). Untuk **GET blog-posts** dan **GET projects**, request tanpa token hanya mengembalikan data dengan `is_published=true`; detail di [docs/PUBLIKASI_WEB.md](../docs/PUBLIKASI_WEB.md).
- **Admin (header `Authorization: Bearer <token>`):** `POST`, `PUT`, `PATCH`, `DELETE` untuk resource di bawah, serta semua akses ke **contact-messages** (GET list/show, POST, PUT, PATCH, DELETE).

Resource: `users`, `experiences`, `educations`, `skill-categories`, `skills`, `user-skills`, `projects`, `project-skills`, `blog-posts`, `tags`, `post-tags`, `certifications`, `contact-messages`.  
Detail path, request/response, dan kode 401/429 ada di Swagger UI (`/docs`).

---

## Unit / Feature Test (PHPUnit)

Test otomatis untuk endpoint API dan struktur response. Environment testing memakai **SQLite in-memory** (tidak perlu MySQL saat menjalankan test).

**Persyaratan:** PHP harus memiliki ekstensi **pdo_sqlite** aktif. Tanpa ekstensi ini akan muncul error `PDOException: could not find driver` saat `composer test`.  
- **Laragon:** Menu **PHP** → **php.ini**, cari `pdo_sqlite`, pastikan baris `extension=pdo_sqlite` tidak di-comment (tanpa `;` di depan). Simpan lalu restart Laragon jika perlu.  
- **Cek ekstensi:** jalankan `php -m` dan pastikan ada `pdo_sqlite`.

### Menjalankan test

Pastikan PHP ada di PATH (mis. lewat Laragon atau terminal yang mengenali `php`), lalu:

```bash
cd c:\laragon\www\portfolio-api
composer test
```

atau:

```bash
php vendor/bin/phpunit
```

- **Config**: `phpunit.xml` mengatur `APP_ENV=testing`, `DB_CONNECTION=sqlite`, `DB_DATABASE=:memory:`.
- **Isi test**: `tests/ApiTest.php` — test base endpoint, GET users (publik), 401 untuk mutasi tanpa token, 201 dengan token (store/update/destroy), GET index experiences/skills/projects/blog-posts, POST /api/contact (publik, 201/422/429 rate limit), serta contact-messages dengan token.

---

## Ringkasan

- **Setup**: clone → `composer install` → copy `.env` → set DB → `php artisan migrate` → (opsional) `php artisan make:token`
- **Env**: `CONTACT_OWNER_USER_ID` (penerima form kontak), `CORS_ORIGINS` (frontend origin), `THROTTLE_*` (rate limit). Production: `APP_DEBUG=false` dan isi `APP_KEY`.
- **Jalankan**: Laragon (`http://localhost/.../public`) atau `php artisan serve` → `http://localhost:8000`
- **Dokumentasi**: buka `/docs` untuk Swagger UI, `/docs/openapi.yaml` untuk OpenAPI 3

## License

Proyek ini open-source (MIT). Framework Lumen: [Laravel Lumen](https://lumen.laravel.com).
