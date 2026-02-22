// Package main runs the API HTTP server.
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
	"github.com/personal/api/internal/handlers/admin"
	"github.com/personal/api/internal/middleware"
)

func main() {
	// Load .env dari folder api/ atau api/configs/
	_ = godotenv.Load()
	_ = godotenv.Load("configs/.env")
	startTime := time.Now().Unix()
	cfg := config.Load(startTime)

	var db *database.DB
	if cfg.DBDSN != "" {
		var err error
		db, err = database.Open(cfg.DBDSN)
		if err != nil {
			log.Printf("database: koneksi gagal (server jalan tanpa DB): %v", err)
			log.Print("database: pastikan MySQL/MariaDB jalan, DB_DSN benar di configs/.env")
			db = nil
		} else {
			log.Print("database: terhubung")
			defer db.Close()
		}
	}

	mux := http.NewServeMux()
	mux.HandleFunc("/health", handlers.Health)
	mux.HandleFunc("/status", handlers.Status(cfg.StartTime, db))
	mux.HandleFunc("/api/status", handlers.Status(cfg.StartTime, db)) // untuk frontend (hindari konflik route SPA /status)
	mux.HandleFunc("/api/skills", handlers.SkillsList(db))
	mux.HandleFunc("/api/projects", handlers.ProjectsList(db))
	mux.HandleFunc("/api/projects/", handlers.ProjectBySlug(db))
	mux.HandleFunc("/api/posts", handlers.PostsList(db))
	mux.HandleFunc("/api/posts/", handlers.PostBySlug(db))
	mux.HandleFunc("/login", handlers.Login(cfg))
	// Admin dashboard API (CRUD) — paket handlers/admin
	mux.Handle("/admin/skill-categories", middleware.RequireAuth(cfg, admin.Categories(db)))
	mux.Handle("/admin/skills", middleware.RequireAuth(cfg, admin.Skills(db)))
	mux.Handle("/admin", middleware.RequireAuth(cfg, admin.Overview))

	addr := ":" + strconv.Itoa(cfg.Port)

	handler := middleware.CORS(middleware.SecurityHeaders(mux))
	log.Printf("listening on %s", addr)
	log.Fatal(http.ListenAndServe(addr, handler))
}
