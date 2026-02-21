// Package middleware provides HTTP middleware: CORS, auth, and security headers.
package middleware

import (
	"net/http"
	"strings"
)

// isHTTPS reports whether the request is considered HTTPS (TLS or X-Forwarded-Proto).
func isHTTPS(r *http.Request) bool {
	if r.TLS != nil {
		return true
	}
	return strings.ToLower(strings.TrimSpace(r.Header.Get("X-Forwarded-Proto"))) == "https"
}

// SecurityHeaders adds Phase 4 security headers and removes server identity.
func SecurityHeaders(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Hide server info (Phase 4)
		w.Header().Set("X-Content-Type-Options", "nosniff")
		w.Header().Set("X-Frame-Options", "DENY")
		w.Header().Set("Referrer-Policy", "strict-origin-when-cross-origin")
		// HSTS (Phase 4): hanya saat HTTPS; max-age 1 tahun, includeSubDomains
		if isHTTPS(r) {
			w.Header().Set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload")
		}
		// CSP: allow same-origin and common API usage; tighten as needed
		w.Header().Set("Content-Security-Policy", "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self'")
		// Remove any server identification
		w.Header().Del("X-Powered-By")
		next.ServeHTTP(w, r)
	})
}
