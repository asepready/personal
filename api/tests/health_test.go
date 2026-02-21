package tests

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/personal/api/internal/handlers"
)

func TestHealth(t *testing.T) {
	tests := []struct {
		method string
		want   int
	}{
		{http.MethodGet, http.StatusOK},
		{http.MethodPost, http.StatusMethodNotAllowed},
		{http.MethodPut, http.StatusMethodNotAllowed},
	}

	for _, tt := range tests {
		t.Run(tt.method, func(t *testing.T) {
			req := httptest.NewRequest(tt.method, "/health", nil)
			rec := httptest.NewRecorder()
			handlers.Health(rec, req)

			if rec.Code != tt.want {
				t.Errorf("Health() status = %d, want %d", rec.Code, tt.want)
			}
			if tt.method == http.MethodGet && tt.want == http.StatusOK {
				var body handlers.HealthResponse
				if err := json.NewDecoder(rec.Body).Decode(&body); err != nil {
					t.Fatalf("decode body: %v", err)
				}
				if body.Status != "ok" {
					t.Errorf("body.Status = %q, want \"ok\"", body.Status)
				}
				if rec.Header().Get("Content-Type") != "application/json" {
					t.Errorf("Content-Type = %q, want application/json", rec.Header().Get("Content-Type"))
				}
			}
		})
	}
}
