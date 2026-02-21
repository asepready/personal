package config

import (
	"os"
	"strconv"
)

// Config holds application configuration from environment.
type Config struct {
	Port          int
	DBDSN         string
	StartTime     int64  // unix seconds, set at startup for uptime
	AdminUsername string // untuk login admin
	AdminPassword string
	JWTSecret     string // secret untuk tanda-tangan JWT
}

// Load reads config from environment.
func Load(startTime int64) *Config {
	port := 8080
	if p := os.Getenv("PORT"); p != "" {
		if v, err := strconv.Atoi(p); err == nil && v > 0 && v <= 65535 {
			port = v
		}
	}
	return &Config{
		Port:          port,
		DBDSN:         os.Getenv("DB_DSN"),
		StartTime:     startTime,
		AdminUsername: os.Getenv("ADMIN_USERNAME"),
		AdminPassword: os.Getenv("ADMIN_PASSWORD"),
		JWTSecret:     os.Getenv("JWT_SECRET"),
	}
}
