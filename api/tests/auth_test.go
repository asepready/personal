package tests

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/personal/api/internal/config"
	"github.com/personal/api/internal/handlers"
)

func testLoginConfig() *config.Config {
	return &config.Config{
		AdminUsername: "admin",
		AdminPassword: "secret123",
		JWTSecret:     "test-jwt-secret-minimal-32-characters-long",
	}
}

func TestLogin_Success(t *testing.T) {
	cfg := testLoginConfig()
	handler := handlers.Login(cfg)

	body := handlers.LoginRequest{Username: "admin", Password: "secret123"}
	raw, _ := json.Marshal(body)
	req := httptest.NewRequest(http.MethodPost, "/login", bytes.NewReader(raw))
	req.Header.Set("Content-Type", "application/json")
	rec := httptest.NewRecorder()
	handler.ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Errorf("status = %d, want 200", rec.Code)
	}
	var res handlers.LoginResponse
	if err := json.NewDecoder(rec.Body).Decode(&res); err != nil {
		t.Fatalf("decode: %v", err)
	}
	if res.Token == "" {
		t.Error("token empty")
	}
}

func TestLogin_InvalidCredentials(t *testing.T) {
	cfg := testLoginConfig()
	handler := handlers.Login(cfg)

	body := handlers.LoginRequest{Username: "admin", Password: "wrong"}
	raw, _ := json.Marshal(body)
	req := httptest.NewRequest(http.MethodPost, "/login", bytes.NewReader(raw))
	req.Header.Set("Content-Type", "application/json")
	rec := httptest.NewRecorder()
	handler.ServeHTTP(rec, req)

	if rec.Code != http.StatusUnauthorized {
		t.Errorf("status = %d, want 401", rec.Code)
	}
}

func TestLogin_MethodNotAllowed(t *testing.T) {
	handler := handlers.Login(testLoginConfig())
	req := httptest.NewRequest(http.MethodGet, "/login", nil)
	rec := httptest.NewRecorder()
	handler.ServeHTTP(rec, req)
	if rec.Code != http.StatusMethodNotAllowed {
		t.Errorf("status = %d, want 405", rec.Code)
	}
}

func TestLogin_NotConfigured(t *testing.T) {
	cfg := &config.Config{JWTSecret: "", AdminUsername: "", AdminPassword: ""}
	handler := handlers.Login(cfg)
	body := handlers.LoginRequest{Username: "a", Password: "b"}
	raw, _ := json.Marshal(body)
	req := httptest.NewRequest(http.MethodPost, "/login", bytes.NewReader(raw))
	req.Header.Set("Content-Type", "application/json")
	rec := httptest.NewRecorder()
	handler.ServeHTTP(rec, req)
	if rec.Code != http.StatusServiceUnavailable {
		t.Errorf("status = %d, want 503", rec.Code)
	}
}

func TestLogin_InvalidBody(t *testing.T) {
	handler := handlers.Login(testLoginConfig())
	req := httptest.NewRequest(http.MethodPost, "/login", bytes.NewReader([]byte("not json")))
	req.Header.Set("Content-Type", "application/json")
	rec := httptest.NewRecorder()
	handler.ServeHTTP(rec, req)
	if rec.Code != http.StatusBadRequest {
		t.Errorf("status = %d, want 400", rec.Code)
	}
}
