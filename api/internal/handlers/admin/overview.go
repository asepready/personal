package admin

import (
	"net/http"

	"github.com/personal/api/internal/handlers"
)

// Overview returns the handler for GET /admin (payload overview, setelah RequireAuth).
func Overview(w http.ResponseWriter, r *http.Request) {
	if !handlers.AllowMethod(w, r, http.MethodGet) {
		return
	}
	handlers.RespondJSON(w, http.StatusOK, map[string]string{"message": "Admin area"})
}
