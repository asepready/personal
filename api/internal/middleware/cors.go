package middleware

import (
	"net/http"
	"os"
	"strings"
)

// CORS adds Access-Control-Allow-* headers when ALLOW_ORIGIN is set (untuk frontend beda origin).
func CORS(next http.Handler) http.Handler {
	allowOrigin := strings.TrimSpace(os.Getenv("ALLOW_ORIGIN"))
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if allowOrigin != "" {
			w.Header().Set("Access-Control-Allow-Origin", allowOrigin)
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
			if r.Method == http.MethodOptions {
				w.WriteHeader(http.StatusNoContent)
				return
			}
		}
		next.ServeHTTP(w, r)
	})
}
