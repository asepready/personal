package tests

import (
	"strings"
	"testing"

	"github.com/joho/godotenv"
	"github.com/personal/api/internal/config"
	"github.com/personal/api/internal/database"
)

func init() {
	// Format sama dengan server & migrate. Cwd saat go test = package dir (api/tests), jadi .env di api/configs/.
	paths := []string{
		"../configs/.env",   // cwd = api/tests (biasa: go test dari api/)
		"configs/.env",      // cwd = api (jika test dijalankan lain)
		"api/configs/.env",  // cwd = repo root
	}
	for _, p := range paths {
		if err := godotenv.Load(p); err == nil {
			break
		}
	}
}

// TestDatabaseConnection memastikan koneksi ke database berhasil (ping + SELECT 1).
// Skip jika DSN tidak dikonfigurasi atau MySQL tidak berjalan (CI / lingkungan tanpa DB).
func TestDatabaseConnection(t *testing.T) {
	cfg := config.Load(0)
	dsn := strings.TrimSpace(cfg.DBDSN)
	if dsn == "" {
		t.Skip("DB_DSN atau (DB_USER + DB_NAME) tidak di-set di configs/.env, skip test koneksi database")
	}

	db, err := database.Open(dsn)
	if err != nil {
		t.Skipf("database tidak tersedia (skip): %v", err)
	}
	if db == nil {
		t.Fatal("database.Open: db nil padahal DSN non-empty")
	}
	defer db.Close()

	if err := db.Ping(); err != nil {
		t.Skipf("database ping gagal (MySQL mungkin tidak jalan): %v", err)
	}

	var n int
	if err := db.QueryRow("SELECT 1").Scan(&n); err != nil {
		t.Fatalf("SELECT 1: %v", err)
	}
	if n != 1 {
		t.Errorf("SELECT 1 = %d, want 1", n)
	}
}

// TestDatabaseOpenEmptyDSN memastikan Open("") mengembalikan (nil, nil).
func TestDatabaseOpenEmptyDSN(t *testing.T) {
	db, err := database.Open("")
	if err != nil {
		t.Fatalf("Open(\"\"): err = %v, want nil", err)
	}
	if db != nil {
		t.Fatal("Open(\"\"): db harus nil")
	}
}
