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
	"github.com/personal/api/internal/spec"
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
	// Public API: semua di bawah /api/
	mux.HandleFunc("/api/health", handlers.Health)
	mux.HandleFunc("/api/status", handlers.Status(cfg.StartTime, db))
	mux.HandleFunc("/api/login", handlers.Login(cfg))
	mux.HandleFunc("/api/skills", handlers.SkillsList(db))
	mux.HandleFunc("/api/projects", handlers.ProjectsList(db))
	mux.HandleFunc("/api/projects/", handlers.ProjectBySlug(db))
	mux.HandleFunc("/api/posts", handlers.PostsList(db))
	mux.HandleFunc("/api/posts/", handlers.PostBySlug(db))
	// Swagger UI: http://host/api/docs atau http://host/api/docs/
	mux.HandleFunc("/api/docs", func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/api/docs" {
			return
		}
		http.Redirect(w, r, "/api/docs/", http.StatusFound)
	})
	mux.Handle("/api/docs/", http.StripPrefix("/api/docs", spec.Handler()))
	// Admin API: semua di bawah /api/admin/
	mux.Handle("/api/admin/resources", middleware.RequireAuth(cfg, http.HandlerFunc(admin.Resources)))
	mux.Handle("/api/admin/skill-categories", middleware.RequireAuth(cfg, admin.Categories(db)))
	mux.Handle("/api/admin/skills", middleware.RequireAuth(cfg, admin.Skills(db)))
	mux.Handle("/api/admin/tools/", middleware.RequireAuth(cfg, admin.Tools(db)))
	mux.Handle("/api/admin/tools", middleware.RequireAuth(cfg, admin.Tools(db)))
	mux.Handle("/api/admin/tags/", middleware.RequireAuth(cfg, admin.Tags(db)))
	mux.Handle("/api/admin/tags", middleware.RequireAuth(cfg, admin.Tags(db)))
	mux.Handle("/api/admin/projects/", middleware.RequireAuth(cfg, admin.Projects(db)))
	mux.Handle("/api/admin/projects", middleware.RequireAuth(cfg, admin.Projects(db)))
	mux.Handle("/api/admin/posts/", middleware.RequireAuth(cfg, admin.Posts(db)))
	mux.Handle("/api/admin/posts", middleware.RequireAuth(cfg, admin.Posts(db)))
	mux.Handle("/api/admin", middleware.RequireAuth(cfg, http.HandlerFunc(admin.Overview)))

	addr := ":" + strconv.Itoa(cfg.Port)

	handler := middleware.CORS(middleware.SecurityHeaders(mux))
	log.Printf("listening on %s", addr)
	log.Fatal(http.ListenAndServe(addr, handler))
}
