package middleware

import (
	"net/http"
	"strings"

	"github.com/golang-jwt/jwt/v5"
	"github.com/personal/api/internal/config"
)

const bearerPrefix = "Bearer "

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
		tokenString := extractBearerToken(r)
		if tokenString == "" {
			http.Error(w, "missing authorization", http.StatusUnauthorized)
			return
		}
		if !validJWT(tokenString, cfg.JWTSecret) {
			http.Error(w, "invalid token", http.StatusUnauthorized)
			return
		}
		next.ServeHTTP(w, r)
	})
}

func extractBearerToken(r *http.Request) string {
	auth := r.Header.Get("Authorization")
	if !strings.HasPrefix(auth, bearerPrefix) {
		return ""
	}
	return strings.TrimSpace(strings.TrimPrefix(auth, bearerPrefix))
}

func validJWT(tokenString, secret string) bool {
	var c claims
	token, err := jwt.ParseWithClaims(tokenString, &c, func(_ *jwt.Token) (interface{}, error) {
		return []byte(secret), nil
	})
	return err == nil && token != nil && token.Valid
}
