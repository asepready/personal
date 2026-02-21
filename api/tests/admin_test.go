package tests

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/personal/api/internal/handlers"
)

func TestAdmin(t *testing.T) {
	req := httptest.NewRequest(http.MethodGet, "/admin", nil)
	rec := httptest.NewRecorder()
	handlers.Admin(rec, req)

	if rec.Code != http.StatusOK {
		t.Errorf("status = %d, want 200", rec.Code)
	}
	var body handlers.AdminResponse
	if err := json.NewDecoder(rec.Body).Decode(&body); err != nil {
		t.Fatalf("decode: %v", err)
	}
	if body.Message != "Admin area" {
		t.Errorf("Message = %q, want \"Admin area\"", body.Message)
	}
}

func TestAdmin_MethodNotAllowed(t *testing.T) {
	req := httptest.NewRequest(http.MethodPost, "/admin", nil)
	rec := httptest.NewRecorder()
	handlers.Admin(rec, req)
	if rec.Code != http.StatusMethodNotAllowed {
		t.Errorf("status = %d, want 405", rec.Code)
	}
}
