package handlers

import (
	"net/http"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/personal/api/internal/config"
)

// LoginRequest is the request body for POST /login.
type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

// LoginResponse is the response body on successful login.
type LoginResponse struct {
	Token string `json:"token"`
}

type claims struct {
	Username string `json:"sub"`
	jwt.RegisteredClaims
}

const jwtExpiry = 24 * time.Hour

// Login validates credentials and returns a JWT.
func Login(cfg *config.Config) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if !AllowMethod(w, r, http.MethodPost) {
			return
		}
		defer r.Body.Close()

		if !isLoginConfigured(cfg) {
			http.Error(w, "login not configured", http.StatusServiceUnavailable)
			return
		}

		var req LoginRequest
		if err := DecodeJSON(r, &req); err != nil {
			http.Error(w, "invalid body", http.StatusBadRequest)
			return
		}

		if !credentialsMatch(req, cfg) {
			http.Error(w, "invalid credentials", http.StatusUnauthorized)
			return
		}

		tokenString, err := buildJWT(req.Username, cfg.JWTSecret)
		if err != nil {
			http.Error(w, "token error", http.StatusInternalServerError)
			return
		}
		RespondJSON(w, http.StatusOK, LoginResponse{Token: tokenString})
	}
}

func isLoginConfigured(cfg *config.Config) bool {
	return cfg.JWTSecret != "" && cfg.AdminUsername != "" && cfg.AdminPassword != ""
}

func credentialsMatch(req LoginRequest, cfg *config.Config) bool {
	return req.Username == cfg.AdminUsername && req.Password == cfg.AdminPassword
}

func buildJWT(username, secret string) (string, error) {
	c := claims{
		Username: username,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(jwtExpiry)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, c)
	return token.SignedString([]byte(secret))
}
