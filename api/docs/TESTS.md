# Unit Test

Semua unit test berada di folder **`tests/`** (black-box: package `tests` mengimpor `internal/handlers`, `internal/middleware`, dll.).

## Menjalankan test

Dari folder **`api/`**:

```bash
go test ./tests/... -v -count=1
```

Atau:

```bash
make test
./scripts/test.sh
```

- `-v` — output per test.
- `-count=1` — tanpa cache (hasil selalu terbaru).

## Cakupan

| File | Yang diuji |
|------|------------|
| `tests/health_test.go` | `handlers.Health` — GET 200, method lain 405, body JSON. |
| `tests/auth_test.go` | `handlers.Login` — sukses, invalid credentials, method not allowed, not configured, invalid body. |
| `tests/status_test.go` | `handlers.Status` — tanpa DB (uptime, database "disabled"), method not allowed. |
| `tests/admin_test.go` | `admin.Overview` (GET /api/admin) — GET 200, method not allowed. |
| `tests/skills_test.go` | `handlers.SkillsList` — no DB 503, method not allowed, with DB list. |
| `tests/middleware_auth_test.go` | `middleware.RequireAuth` — missing header, invalid prefix/token, valid token, not configured. |
| `tests/database_test.go` | Koneksi DB: `Open`, `Ping`, `SELECT 1`. Skip jika DSN tidak di-set atau MySQL tidak jalan (CI/lokal tanpa DB tetap lulus). `Open("")` mengembalikan `(nil, nil)`. |

Handler yang butuh DB di-test dengan `db == nil` atau struct kosong, kecuali `database_test.go` yang (jika DSN di-set dan MySQL tersedia) memakai koneksi nyata.
