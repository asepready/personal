# Unit tests

Unit test untuk handlers dan middleware API. Semua test dijalankan dari folder `api/`:

```bash
go test ./tests/... -v -count=1
```

Atau dari root api: `make test` / `./scripts/test.sh`.

## Isi

| File | Menguji |
|------|--------|
| `health_test.go` | `handlers.Health` |
| `auth_test.go` | `handlers.Login` |
| `status_test.go` | `handlers.Status` |
| `admin_test.go` | `handlers.Admin` |
| `skills_test.go` | `handlers.SkillsList` |
| `middleware_auth_test.go` | `middleware.RequireAuth` |
| `database_test.go` | Koneksi DB (`database.Open`, `Ping`, query) — skip jika `DB_DSN` tidak di-set. |

Test memakai package `tests` dan mengimpor paket dari `internal/` (black-box style).

**Test koneksi database:** `TestDatabaseConnection` di `database_test.go` hanya jalan bila env `DB_DSN` di-set; bila tidak, test di-skip sehingga CI tanpa MySQL tetap lulus.
