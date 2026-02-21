package handlers

import (
	"encoding/json"
	"net/http"
)

// AdminResponse contoh response halaman admin
type AdminResponse struct {
	Message string `json:"message"`
}

// Admin mengembalikan data admin (hanya jika token valid).
func Admin(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(AdminResponse{Message: "Admin area"})
}
