// Package test berisi tes integrasi API (full stack).
// Sesuai Standard Go Project Layout: folder /test untuk external test.
package test

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/personal/api/internal/config"
	"github.com/personal/api/internal/database"
	"github.com/personal/api/internal/handlers"
	"github.com/personal/api/internal/middleware"
)

func testServer(cfg *config.Config, db *database.DB) http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("/health", handlers.Health)
	mux.HandleFunc("/status", handlers.Status(cfg.StartTime, db))
	mux.HandleFunc("/api/skills", handlers.SkillsList(db))
	mux.HandleFunc("/login", handlers.Login(cfg))
	mux.Handle("/admin", middleware.RequireAuth(cfg, handlers.Admin))
	return mux
}

func TestIntegration_HealthAndStatus(t *testing.T) {
	cfg := &config.Config{StartTime: time.Now().Add(-5 * time.Second).Unix()}
	srv := testServer(cfg, nil)

	req := httptest.NewRequest(http.MethodGet, "/health", nil)
	rec := httptest.NewRecorder()
	srv.ServeHTTP(rec, req)
	if rec.Code != http.StatusOK {
		t.Errorf("GET /health status = %d", rec.Code)
	}

	req2 := httptest.NewRequest(http.MethodGet, "/status", nil)
	rec2 := httptest.NewRecorder()
	srv.ServeHTTP(rec2, req2)
	if rec2.Code != http.StatusOK {
		t.Errorf("GET /status status = %d", rec2.Code)
	}
}

func TestIntegration_LoginAndAdmin(t *testing.T) {
	cfg := &config.Config{
		StartTime:     time.Now().Unix(),
		AdminUsername: "admin",
		AdminPassword: "secret",
		JWTSecret:     "integration-test-secret-min-32-chars",
	}
	srv := testServer(cfg, nil)

	body, _ := json.Marshal(map[string]string{"username": "admin", "password": "secret"})
	req := httptest.NewRequest(http.MethodPost, "/login", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	rec := httptest.NewRecorder()
	srv.ServeHTTP(rec, req)
	if rec.Code != http.StatusOK {
		t.Errorf("POST /login status = %d", rec.Code)
	}
	var loginRes struct {
		Token string `json:"token"`
	}
	if err := json.NewDecoder(rec.Body).Decode(&loginRes); err != nil || loginRes.Token == "" {
		t.Fatalf("login response: %v", err)
	}

	req2 := httptest.NewRequest(http.MethodGet, "/admin", nil)
	req2.Header.Set("Authorization", "Bearer "+loginRes.Token)
	rec2 := httptest.NewRecorder()
	srv.ServeHTTP(rec2, req2)
	if rec2.Code != http.StatusOK {
		t.Errorf("GET /admin with token status = %d", rec2.Code)
	}
}
