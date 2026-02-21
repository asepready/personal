package handlers

import "net/http"

// HealthResponse is the response body for GET /health.
type HealthResponse struct {
	Status string `json:"status"`
}

// Health returns 200 OK with {"status":"ok"}.
func Health(w http.ResponseWriter, r *http.Request) {
	if !AllowMethod(w, r, http.MethodGet) {
		return
	}
	RespondJSON(w, http.StatusOK, HealthResponse{Status: StatusOK})
}
