package middleware

import (
	"net/http"
	"os"
	"strings"
)

const (
	envAllowOrigin = "ALLOW_ORIGIN"
	headerOrigin   = "Access-Control-Allow-Origin"
	headerMethods  = "Access-Control-Allow-Methods"
	headerHeaders  = "Access-Control-Allow-Headers"
	corsMethods    = "GET, POST, OPTIONS"
	corsHeaders    = "Content-Type, Authorization"
)

// CORS adds Access-Control-Allow-* headers when ALLOW_ORIGIN is set.
func CORS(next http.Handler) http.Handler {
	allowOrigin := strings.TrimSpace(os.Getenv(envAllowOrigin))
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if allowOrigin != "" {
			w.Header().Set(headerOrigin, allowOrigin)
			w.Header().Set(headerMethods, corsMethods)
			w.Header().Set(headerHeaders, corsHeaders)
			if r.Method == http.MethodOptions {
				w.WriteHeader(http.StatusNoContent)
				return
			}
		}
		next.ServeHTTP(w, r)
	})
}
