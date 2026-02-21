// Package main runs database migrations (up or down).
// Usage: go run ./cmd/migrate [--down]
package main

import (
	"context"
	"flag"
	"log"
	"time"

	"github.com/joho/godotenv"
	"github.com/personal/api/internal/config"
	"github.com/personal/api/internal/database"
)

func main() {
	down := flag.Bool("down", false, "rollback satu migrasi terakhir")
	flag.Parse()

	_ = godotenv.Load()
	cfg := config.Load(time.Now().Unix())
	if cfg.DBDSN == "" {
		log.Fatal("DB_DSN tidak di-set. Isi di .env")
	}

	db, err := database.Open(cfg.DBDSN)
	if err != nil {
		log.Fatalf("Koneksi database gagal: %v", err)
	}
	defer db.Close()

	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Minute)
	defer cancel()

	if *down {
		if err := database.MigrateDownSQL(ctx, db.DB); err != nil {
			log.Fatalf("migrate down: %v", err)
		}
		log.Print("migrate down: ok")
		return
	}
	if err := database.MigrateUpSQL(ctx, db.DB); err != nil {
		log.Fatalf("migrate up: %v", err)
	}
	log.Print("migrate up: ok")
}
