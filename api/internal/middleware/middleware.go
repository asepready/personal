package middleware

import (
	"net/http"
	"strings"
)

const (
	headerXContentTypeOptions = "X-Content-Type-Options"
	headerXFrameOptions       = "X-Frame-Options"
	headerReferrerPolicy      = "Referrer-Policy"
	headerStrictTransport     = "Strict-Transport-Security"
	headerContentSecurity     = "Content-Security-Policy"
	headerXPoweredBy          = "X-Powered-By"
	headerServer              = "Server"
	headerForwardedProto      = "X-Forwarded-Proto"

	valueNosniff              = "nosniff"
	valueDeny                 = "DENY"
	valueReferrerPolicy       = "strict-origin-when-cross-origin"
	valueHSTS                 = "max-age=31536000; includeSubDomains; preload"
	valueCSP                  = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self'"
)

func isHTTPS(r *http.Request) bool {
	if r.TLS != nil {
		return true
	}
	return strings.ToLower(strings.TrimSpace(r.Header.Get(headerForwardedProto))) == "https"
}

// SecurityHeaders adds security headers and removes server identity.
func SecurityHeaders(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set(headerXContentTypeOptions, valueNosniff)
		w.Header().Set(headerXFrameOptions, valueDeny)
		w.Header().Set(headerReferrerPolicy, valueReferrerPolicy)
		if isHTTPS(r) {
			w.Header().Set(headerStrictTransport, valueHSTS)
		}
		w.Header().Set(headerContentSecurity, valueCSP)
		w.Header().Del(headerXPoweredBy)
		w.Header().Set(headerServer, "") // Phase 4: hide server identity
		next.ServeHTTP(w, r)
	})
}
