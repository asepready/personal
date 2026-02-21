package tests

import (
	"os"
	"testing"

	"github.com/joho/godotenv"
	"github.com/personal/api/internal/database"
)

func init() {
	// Load api/configs/.env saat test dijalankan dari folder api/ (supaya DB_DSN dipakai TestDatabaseConnection)
	_ = godotenv.Load("configs/.env")
}

// TestDatabaseConnection memastikan koneksi ke database berhasil (ping + query sederhana).
// Dikeluarkan jika DB_DSN tidak di-set (CI tanpa MySQL).
func TestDatabaseConnection(t *testing.T) {
	dsn := os.Getenv("DB_DSN")
	if dsn == "" {
		t.Skip("DB_DSN tidak di-set, skip test koneksi database")
	}

	db, err := database.Open(dsn)
	if err != nil {
		t.Fatalf("database.Open: %v", err)
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
