// Package config loads application configuration from environment variables.
package config

import (
	"fmt"
	"net/url"
	"os"
	"strconv"
	"strings"
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
// DB_DSN: jika di-set, dipakai langsung. Jika kosong, DSN dibangun dari DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME.
func Load(startTime int64) *Config {
	port := 8080
	if p := os.Getenv("PORT"); p != "" {
		if v, err := strconv.Atoi(p); err == nil && v > 0 && v <= 65535 {
			port = v
		}
	}
	dsn := strings.TrimSpace(os.Getenv("DB_DSN"))
	if dsn == "" {
		dsn = buildDSN(
			os.Getenv("DB_USER"),
			os.Getenv("DB_PASSWORD"),
			os.Getenv("DB_HOST"),
			os.Getenv("DB_PORT"),
			os.Getenv("DB_NAME"),
		)
	}
	return &Config{
		Port:          port,
		DBDSN:         dsn,
		StartTime:     startTime,
		AdminUsername: os.Getenv("ADMIN_USERNAME"),
		AdminPassword: os.Getenv("ADMIN_PASSWORD"),
		JWTSecret:     os.Getenv("JWT_SECRET"),
	}
}

// buildDSN membangun DSN dari komponen. Kosong jika user/database tidak di-set.
// Password di-encode agar karakter khusus ($, @, #, dll.) aman di connection string.
func buildDSN(user, password, host, port, database string) string {
	user = strings.TrimSpace(user)
	database = strings.TrimSpace(database)
	if user == "" || database == "" {
		return ""
	}
	host = strings.TrimSpace(host)
	port = strings.TrimSpace(port)
	if host == "" {
		host = "localhost"
	}
	if port == "" {
		port = "3306"
	}
	encodedPassword := url.QueryEscape(password)
	return fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=true", user, encodedPassword, host, port, database)
}
