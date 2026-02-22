# Database

API memakai MySQL/MariaDB. Koneksi opsional: jika `DB_DSN` kosong atau gagal, server tetap jalan; endpoint yang butuh DB (mis. `/api/skills`) mengembalikan 503.

## Schema referensi

Schema aktif ditentukan oleh migrasi di **`internal/database/migrations/`** (`001_initial.up.sql`, `002_*.up.sql`). Referensi ringkas juga di **`internal/database/table.sql`** (jika ada).

Tabel utama:

| Tabel | Deskripsi |
|-------|-----------|
| `users` | Auth (username, password_hash, role). |
| `skill_categories` | Kategori skill (nama, slug, sort_order). |
| `skills` | Skill per kategori (name, level, icon_url). |
| `tools` | Tool (Ansible, Docker, dsb.). |
| `projects` | Proyek (title, slug, problem/solution/result, is_featured). |
| `project_tools` | Relasi M:N proyek–tool. |
| `tags` | Tag blog. |
| `posts` | Post/blog (title, slug, content, status, published_at). |
| `post_tags` | Relasi M:N post–tag. |
| `monitoring_services` | Layanan untuk uptime. |
| `uptime_logs` | Log status/response time per layanan. |

Indeks dirancang untuk query yang dipakai backend (list by category, by slug, featured, status+published_at, dsb.). Lihat file migrasi dan `table.sql` untuk detail.

## Migrasi

Migrasi disimpan di:

**`internal/database/migrations/`**

- `001_initial.up.sql` / `001_initial.down.sql` — tabel awal.
- `002_normalize_indexes.up.sql` / `002_normalize_indexes.down.sql` — indeks tambahan untuk performa.

### Menjalankan migrasi

Dari folder `api/`:

```bash
go run ./cmd/migrate
```

Ini menjalankan file `*.up.sql` yang belum tercatat di tabel `schema_migrations`.

### Rollback

Rollback satu versi terakhir:

```bash
go run ./cmd/migrate --down
```

### Urutan file

Nama file harus berurut (lexicographic) agar versi migrasi konsisten (mis. `001_...`, `002_...`).

## Kode terkait

- **Koneksi:** `internal/database/database.go` — `Open(dsn)`, `Ping()`.
- **Migrasi:** `internal/database/migrate.go` — baca folder migrations, eksekusi up/down.
- **Model:** `internal/models/models.go` — struct Go untuk skills (dan bisa diperluas untuk entitas lain).
