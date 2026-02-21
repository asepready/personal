package handlers

import (
	"encoding/json"
	"net/http"
)

// AdminResponse is the response body for GET /admin.
type AdminResponse struct {
	Message string `json:"message"`
}

// Admin returns the admin payload (called after RequireAuth).
func Admin(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(AdminResponse{Message: "Admin area"})
}
