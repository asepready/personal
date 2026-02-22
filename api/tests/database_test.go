package tests

import (
	"strings"
	"testing"

	"github.com/joho/godotenv"
	"github.com/personal/api/internal/config"
	"github.com/personal/api/internal/database"
)

func init() {
	// Format sama dengan server & migrate. Coba dari cwd (api/) dan dari repo root.
	_ = godotenv.Load("configs/.env")
	_ = godotenv.Load("api/configs/.env")
}

// TestDatabaseConnection memastikan koneksi ke database berhasil (ping + SELECT 1).
// DSN dari config (DB_DSN atau komponen DB_* sesuai .env.example). Skip jika tidak dikonfigurasi.
func TestDatabaseConnection(t *testing.T) {
	cfg := config.Load(0)
	dsn := strings.TrimSpace(cfg.DBDSN)
	if dsn == "" {
		t.Skip("DB_DSN atau (DB_USER + DB_NAME) tidak di-set di configs/.env, skip test koneksi database")
	}

	db, err := database.Open(dsn)
	if err != nil {
		t.Fatalf("database.Open: %v", err)
	}
	if db == nil {
		t.Fatal("database.Open: db nil padahal DSN non-empty")
	}
	defer db.Close()

	if err := db.Ping(); err != nil {
		t.Fatalf("db.Ping: %v", err)
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
