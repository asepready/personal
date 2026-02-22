package tests

import (
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/personal/api/internal/config"
	"github.com/personal/api/internal/handlers/admin"
	"github.com/personal/api/internal/middleware"
)

func testAuthConfig() *config.Config {
	return &config.Config{
		JWTSecret: "test-jwt-secret-minimal-32-characters-long",
	}
}

func mustSignToken(t *testing.T, secret string, username string) string {
	t.Helper()
	c := struct {
		Username string `json:"sub"`
		jwt.RegisteredClaims
	}{
		Username: username,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, c)
	s, err := token.SignedString([]byte(secret))
	if err != nil {
		t.Fatalf("sign token: %v", err)
	}
	return s
}

func TestRequireAuth_MissingHeader(t *testing.T) {
	cfg := testAuthConfig()
	h := middleware.RequireAuth(cfg, admin.Overview)
	req := httptest.NewRequest(http.MethodGet, "/admin", nil)
	rec := httptest.NewRecorder()
	h.ServeHTTP(rec, req)
	if rec.Code != http.StatusUnauthorized {
		t.Errorf("status = %d, want 401", rec.Code)
	}
}

func TestRequireAuth_InvalidPrefix(t *testing.T) {
	cfg := testAuthConfig()
	h := middleware.RequireAuth(cfg, admin.Overview)
	req := httptest.NewRequest(http.MethodGet, "/admin", nil)
	req.Header.Set("Authorization", "Basic xxx")
	rec := httptest.NewRecorder()
	h.ServeHTTP(rec, req)
	if rec.Code != http.StatusUnauthorized {
		t.Errorf("status = %d, want 401", rec.Code)
	}
}

func TestRequireAuth_InvalidToken(t *testing.T) {
	cfg := testAuthConfig()
	h := middleware.RequireAuth(cfg, admin.Overview)
	req := httptest.NewRequest(http.MethodGet, "/admin", nil)
	req.Header.Set("Authorization", "Bearer invalid.jwt.token")
	rec := httptest.NewRecorder()
	h.ServeHTTP(rec, req)
	if rec.Code != http.StatusUnauthorized {
		t.Errorf("status = %d, want 401", rec.Code)
	}
}

func TestRequireAuth_ValidToken(t *testing.T) {
	cfg := testAuthConfig()
	token := mustSignToken(t, cfg.JWTSecret, "admin")
	h := middleware.RequireAuth(cfg, admin.Overview)
	req := httptest.NewRequest(http.MethodGet, "/admin", nil)
	req.Header.Set("Authorization", "Bearer "+token)
	rec := httptest.NewRecorder()
	h.ServeHTTP(rec, req)
	if rec.Code != http.StatusOK {
		t.Errorf("status = %d, want 200", rec.Code)
	}
}

func TestRequireAuth_NotConfigured(t *testing.T) {
	cfg := &config.Config{JWTSecret: ""}
	h := middleware.RequireAuth(cfg, admin.Overview)
	req := httptest.NewRequest(http.MethodGet, "/admin", nil)
	rec := httptest.NewRecorder()
	h.ServeHTTP(rec, req)
	if rec.Code != http.StatusServiceUnavailable {
		t.Errorf("status = %d, want 503", rec.Code)
	}
}
