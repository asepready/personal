package handlers

import "net/http"

// AdminResponse is the response body for GET /admin.
type AdminResponse struct {
	Message string `json:"message"`
}

const adminMessage = "Admin area"

// Admin returns the admin payload (called after RequireAuth).
func Admin(w http.ResponseWriter, r *http.Request) {
	if !AllowMethod(w, r, http.MethodGet) {
		return
	}
	RespondJSON(w, http.StatusOK, AdminResponse{Message: adminMessage})
}
