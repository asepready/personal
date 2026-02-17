package middleware

import (
	"net/http"
)

// SecurityHeaders adds Phase 4 security headers and removes server identity.
func SecurityHeaders(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Hide server info (Phase 4)
		w.Header().Set("X-Content-Type-Options", "nosniff")
		w.Header().Set("X-Frame-Options", "DENY")
		w.Header().Set("Referrer-Policy", "strict-origin-when-cross-origin")
		// CSP: allow same-origin and common API usage; tighten as needed
		w.Header().Set("Content-Security-Policy", "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self'")
		// Remove any server identification
		w.Header().Del("X-Powered-By")
		next.ServeHTTP(w, r)
	})
}
