package tests

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/personal/api/internal/handlers"
)

func TestStatus_NoDB(t *testing.T) {
	startTime := time.Now().Add(-10 * time.Second).Unix()
	handler := handlers.Status(startTime, nil)

	req := httptest.NewRequest(http.MethodGet, "/status", nil)
	rec := httptest.NewRecorder()
	handler.ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Errorf("status = %d, want 200", rec.Code)
	}
	var body handlers.StatusResponse
	if err := json.NewDecoder(rec.Body).Decode(&body); err != nil {
		t.Fatalf("decode: %v", err)
	}
	if body.Status != "ok" {
		t.Errorf("Status = %q, want \"ok\"", body.Status)
	}
	if body.Database != "disabled" {
		t.Errorf("Database = %q, want \"disabled\"", body.Database)
	}
	if body.UptimeS < 9 || body.UptimeS > 11 {
		t.Errorf("UptimeS = %d, expect ~10", body.UptimeS)
	}
}

func TestStatus_MethodNotAllowed(t *testing.T) {
	handler := handlers.Status(1, nil)
	req := httptest.NewRequest(http.MethodPost, "/status", nil)
	rec := httptest.NewRecorder()
	handler.ServeHTTP(rec, req)
	if rec.Code != http.StatusMethodNotAllowed {
		t.Errorf("status = %d, want 405", rec.Code)
	}
}
