package middleware

import (
	"net/http"
	"strings"

	"github.com/golang-jwt/jwt/v5"
	"github.com/personal/api/internal/config"
)

// claims is the JWT payload (must match handlers.auth claims).
type claims struct {
	Username string `json:"sub"`
	jwt.RegisteredClaims
}

// RequireAuth validates the Bearer token and calls next only if valid.
func RequireAuth(cfg *config.Config, next http.HandlerFunc) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if cfg.JWTSecret == "" {
			http.Error(w, "auth not configured", http.StatusServiceUnavailable)
			return
		}
		auth := r.Header.Get("Authorization")
		if auth == "" {
			http.Error(w, "missing authorization", http.StatusUnauthorized)
			return
		}
		const prefix = "Bearer "
		if !strings.HasPrefix(auth, prefix) {
			http.Error(w, "invalid authorization", http.StatusUnauthorized)
			return
		}
		tokenString := strings.TrimPrefix(auth, prefix)
		var c claims
		token, err := jwt.ParseWithClaims(tokenString, &c, func(_ *jwt.Token) (interface{}, error) {
			return []byte(cfg.JWTSecret), nil
		})
		if err != nil || !token.Valid {
			http.Error(w, "invalid token", http.StatusUnauthorized)
			return
		}
		next.ServeHTTP(w, r)
	})
}
