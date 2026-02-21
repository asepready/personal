// Package handlers implements HTTP handlers for the API.
package handlers

import (
	"encoding/json"
	"net/http"
)

// HealthResponse is the response body for GET /health.
type HealthResponse struct {
	Status string `json:"status"`
}

// Health returns 200 OK with {"status":"ok"}.
func Health(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(HealthResponse{Status: "ok"})
}
