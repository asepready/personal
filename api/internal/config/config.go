// Package config loads application configuration from environment variables.
package config

import (
	"os"
	"strconv"
)

// Config holds application configuration.
type Config struct {
	Port          int    // HTTP server port (default 8080)
	DBDSN         string // MySQL DSN: user:password@tcp(host:port)/dbname?parseTime=true
	StartTime     int64  // Unix time at startup (for uptime)
	AdminUsername string
	AdminPassword string
	JWTSecret     string // Min 32 chars for HS256
}

// Load reads configuration from the environment.
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
