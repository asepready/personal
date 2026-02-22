# Database — Dokumentasi API

Backend API memakai **MySQL/MariaDB**. Koneksi bersifat **opsional**: jika `DB_DSN` kosong atau gagal, server tetap berjalan; endpoint yang membutuhkan database (mis. `/api/skills`) mengembalikan `503 Service Unavailable`.

**Belum punya database/user?** → Lihat [DATABASE-SETUP.md](DATABASE-SETUP.md) untuk panduan membuat database dan user.

---

## 1. Koneksi & konfigurasi

### Variabel lingkungan

| Variabel | Deskripsi |
|----------|------------|
| `DB_DSN` | Connection string MySQL/MariaDB. Kosong = API berjalan tanpa database. |
| `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`, `DB_NAME` | Jika `DB_DSN` kosong, DSN dibangun dari komponen ini (lihat `api/internal/config/config.go`). `DB_HOST` default `localhost`, `DB_PORT` default `3306`. |

### Format DSN

```
user:password@tcp(host:port)/dbname?parseTime=true
```

Contoh:

```text
root:secret@tcp(localhost:3306)/personal?parseTime=true
```

Parameter `parseTime=true` diperlukan agar kolom `DATE`/`TIMESTAMP` di-scan ke `time.Time` di Go.

### Kode koneksi

- **Lokasi:** `api/internal/database/database.go`
- **Fungsi:** `Open(dsn string) (*DB, error)` — jika `dsn` kosong mengembalikan `(nil, nil)`.
- **Ping:** `db.Ping()` — mengembalikan `nil` jika DB tidak dikonfigurasi atau koneksi berhasil.

---

## 2. Schema referensi

Skema lengkap (normalisasi + indeks untuk performa) ada di:

**`api/internal/database/table.sql`**

### Ringkasan tabel

| Tabel | Deskripsi |
|-------|------------|
| `users` | Autentikasi (username, password_hash, role). |
| `skill_categories` | Kategori skill (nama, slug, urutan). |
| `skills` | Skill per kategori (nama, level, icon_url). |
| `tools` | Daftar tool (Ansible, Docker, dll.). |
| `projects` | Proyek/portfolio (title, slug, problem, solution, result, is_featured). |
| `project_tools` | Relasi many-to-many: proyek ↔ tool. |
| `tags` | Tag untuk blog. |
| `posts` | Artikel blog (title, slug, content, status, published_at). |
| `post_tags` | Relasi many-to-many: post ↔ tag. |
| `monitoring_services` | Layanan yang dimonitor (uptime). |
| `uptime_logs` | Log status dan response time per layanan. |

### Relasi singkat

- **1:N:** `skill_categories` → `skills` (category_id).
- **M:N:** `projects` ↔ `tools` via `project_tools`; `posts` ↔ `tags` via `post_tags`.
- **1:N:** `monitoring_services` → `uptime_logs` (service_id).

---

## 3. Detail tabel

### users

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | BIGINT | PK, AUTO_INCREMENT |
| username | VARCHAR(50) | UNIQUE, NOT NULL |
| password_hash | VARCHAR(255) | NOT NULL |
| role | VARCHAR(20) | DEFAULT 'admin' |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

Indeks: `idx_users_username` (username).

---

### skill_categories

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | INT | PK, AUTO_INCREMENT |
| name | VARCHAR(50) | UNIQUE, NOT NULL |
| slug | VARCHAR(50) | UNIQUE, NOT NULL |
| sort_order | INT | DEFAULT 0 |

Indeks: `idx_skill_categories_sort` (sort_order).

---

### skills

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | BIGINT | PK, AUTO_INCREMENT |
| category_id | INT | FK → skill_categories(id), ON DELETE CASCADE |
| name | VARCHAR(100) | NOT NULL |
| level | VARCHAR(20) | NOT NULL |
| icon_url | VARCHAR(255) | NULL |

Indeks: `idx_skills_category_name` (category_id, name).

---

### tools

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | INT | PK, AUTO_INCREMENT |
| name | VARCHAR(100) | UNIQUE, NOT NULL |
| slug | VARCHAR(100) | UNIQUE, NOT NULL |
| logo_url | VARCHAR(255) | NULL |

---

### projects

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | BIGINT | PK, AUTO_INCREMENT |
| title | VARCHAR(255) | NOT NULL |
| slug | VARCHAR(255) | UNIQUE, NOT NULL |
| role | VARCHAR(100) | NULL |
| problem | TEXT | NULL |
| solution | TEXT | NULL |
| result | TEXT | NULL |
| diagram_url | VARCHAR(255) | NULL |
| is_featured | TINYINT(1) | DEFAULT 0 |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP |

Indeks: `idx_projects_slug`, `idx_projects_featured_created` (is_featured DESC, created_at DESC).

---

### project_tools

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| project_id | BIGINT | PK, FK → projects(id), ON DELETE CASCADE |
| tool_id | INT | PK, FK → tools(id), ON DELETE CASCADE |

Indeks: `idx_project_tools_tool_id` (tool_id).

---

### tags

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | INT | PK, AUTO_INCREMENT |
| name | VARCHAR(50) | UNIQUE, NOT NULL |
| slug | VARCHAR(50) | UNIQUE, NOT NULL |

---

### posts

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | BIGINT | PK, AUTO_INCREMENT |
| title | VARCHAR(255) | NOT NULL |
| slug | VARCHAR(255) | UNIQUE, NOT NULL |
| content | LONGTEXT | NULL |
| type | VARCHAR(50) | NULL |
| status | VARCHAR(20) | DEFAULT 'published' |
| published_at | TIMESTAMP | NULL |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

Indeks: `idx_posts_status_published` (status, published_at DESC), `idx_posts_slug`.

---

### post_tags

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| post_id | BIGINT | PK, FK → posts(id), ON DELETE CASCADE |
| tag_id | INT | PK, FK → tags(id), ON DELETE CASCADE |

Indeks: `idx_post_tags_tag_id` (tag_id).

---

### monitoring_services

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | INT | PK, AUTO_INCREMENT |
| name | VARCHAR(100) | NOT NULL |
| endpoint_url | VARCHAR(255) | NOT NULL |

---

### uptime_logs

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | BIGINT | PK, AUTO_INCREMENT |
| service_id | INT | FK → monitoring_services(id), ON DELETE CASCADE |
| status | VARCHAR(20) | NULL (mis. up/down) |
| response_time_ms | INT | NULL |
| checked_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

Indeks: `idx_uptime_logs_service_checked` (service_id, checked_at DESC).

---

## 4. Migrasi

Migrasi disimpan di **`api/internal/database/migrations/`** dan di-embed ke binary (`go:embed`).

### File migrasi

| File | Isi |
|------|-----|
| `001_initial.up.sql` | Buat semua tabel + indeks awal. |
| `001_initial.down.sql` | Rollback: hapus tabel (urutan disesuaikan dependensi). |
| `002_normalize_indexes.up.sql` | Tambah indeks untuk performa (kategori, skills, projects, post_tags, project_tools). |
| `002_normalize_indexes.down.sql` | Hapus indeks yang ditambah 002. |

Versi dicatat di tabel **`schema_migrations`** (version, applied_at). Nama file harus berurut leksikografis (001_, 002_, …).

### Menjalankan migrasi (up)

Dari folder **`api/`**:

```bash
go run ./cmd/migrate
```

Atau:

```bash
make migrate
```

Hanya file `*.up.sql` yang versinya belum ada di `schema_migrations` yang dijalankan.

### Rollback (satu versi)

Dari folder **`api/`**:

```bash
go run ./cmd/migrate --down
```

atau:

```bash
make migrate-down
```

Ini menjalankan `*.down.sql` untuk versi terakhir yang tercatat di `schema_migrations`. Migrate membutuhkan DSN (DB_DSN atau DB_USER + DB_NAME) di `api/configs/.env`.

### Logika migrasi

- **Lokasi:** `api/internal/database/migrate.go`
- **MigrateUp:** baca daftar `*.up.sql` → untuk setiap versi yang belum applied, eksekusi SQL lalu insert ke `schema_migrations`.
- **MigrateDown:** ambil versi terakhir dari `schema_migrations` → eksekusi `*.down.sql` → hapus baris versi tersebut.

---

## 5. Kode terkait

| Lokasi | Fungsi |
|--------|--------|
| `api/internal/database/database.go` | `Open(dsn)`, `Ping()`, wrapper `*sql.DB`. |
| `api/internal/database/migrate.go` | `MigrateUp`, `MigrateDown`, embed migrations. |
| `api/internal/database/table.sql` | Schema referensi (bukan file yang dieksekusi migrasi). |
| `api/internal/models/models.go` | Struct Go untuk Skill, SkillCategory (dan bisa diperluas). |

Endpoint yang memakai database saat ini: **GET /api/skills** (query ke `skills` + `skill_categories`).

---

## 6. Test koneksi

Test koneksi database ada di **`api/tests/database_test.go`**:

- **TestDatabaseConnection** — `Open(DB_DSN)`, `Ping()`, query `SELECT 1`. Dikeluarkan (skip) jika `DB_DSN` tidak di-set, sehingga CI tanpa MySQL tetap lulus.
- **TestDatabaseOpenEmptyDSN** — memastikan `Open("")` mengembalikan `(nil, nil)`.

Jalankan (dari folder `api/`):

```bash
go test ./tests/... -run Database -v
```

Dengan MySQL: set `DB_DSN` di env (atau `.env`) sebelum menjalankan test.

---

## 7. Ringkasan

- **Engine:** MySQL/MariaDB; koneksi opsional via `DB_DSN`.
- **Schema:** lihat `api/internal/database/table.sql`; migrasi di `api/internal/database/migrations/`.
- **Migrasi:** `go run ./cmd/migrate` (up), `go run ./cmd/migrate --down` (rollback satu versi).
- **Test:** `api/tests/database_test.go`; test koneksi di-skip bila `DB_DSN` kosong.
