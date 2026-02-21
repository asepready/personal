package handlers

import (
	"encoding/json"
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

// claims holds JWT claims (subject = username).
type claims struct {
	Username string `json:"sub"`
	jwt.RegisteredClaims
}

// Login validates credentials and returns a JWT.
func Login(cfg *config.Config) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
			return
		}
		if cfg.JWTSecret == "" || cfg.AdminUsername == "" || cfg.AdminPassword == "" {
			http.Error(w, "login not configured", http.StatusServiceUnavailable)
			return
		}
		var req LoginRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "invalid body", http.StatusBadRequest)
			return
		}
		if req.Username != cfg.AdminUsername || req.Password != cfg.AdminPassword {
			http.Error(w, "invalid credentials", http.StatusUnauthorized)
			return
		}
		c := claims{
			Username: req.Username,
			RegisteredClaims: jwt.RegisteredClaims{
				ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
				IssuedAt:  jwt.NewNumericDate(time.Now()),
			},
		}
		token := jwt.NewWithClaims(jwt.SigningMethodHS256, c)
		tokenString, err := token.SignedString([]byte(cfg.JWTSecret))
		if err != nil {
			http.Error(w, "token error", http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		_ = json.NewEncoder(w).Encode(LoginResponse{Token: tokenString})
	}
}
