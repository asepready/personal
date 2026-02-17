package main

import (
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/joho/godotenv"
	"github.com/personal/api/internal/config"
	"github.com/personal/api/internal/database"
	"github.com/personal/api/internal/handlers"
	"github.com/personal/api/internal/middleware"
)

func main() {
	_ = godotenv.Load() // load .env dari working directory (opsional jika tidak ada)
	startTime := time.Now().Unix()
	cfg := config.Load(startTime)

	var db *database.DB
	if cfg.DBDSN != "" {
		var err error
		db, err = database.Open(cfg.DBDSN)
		if err != nil {
			log.Fatalf("database: %v", err)
		}
		defer db.Close()
	}

	mux := http.NewServeMux()
	mux.HandleFunc("/health", handlers.Health)
	mux.HandleFunc("/status", handlers.Status(cfg.StartTime, db))

	addr := ":" + strconv.Itoa(cfg.Port)

	handler := middleware.SecurityHeaders(mux)
	log.Printf("listening on %s", addr)
	log.Fatal(http.ListenAndServe(addr, handler))
}
