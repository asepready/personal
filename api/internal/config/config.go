// Package config loads application configuration from environment variables.
package config

import (
	"os"
	"strconv"
	"strings"

	"github.com/go-sql-driver/mysql"
)

// Config holds application configuration.
type Config struct {
	Port          int    // HTTP server port (default 8080)
	DBDSN         string // MySQL DSN
	StartTime     int64  // Unix time at startup (for uptime)
	AdminUsername string
	AdminPassword string
	JWTSecret     string // Min 32 chars for HS256
}

// Load reads configuration from the environment.
// DB_DSN: jika di-set, dipakai langsung. Jika kosong, DSN dibangun dari DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME.
func Load(startTime int64) *Config {
	port := 8080
	if p := getEnv("PORT"); p != "" {
		if v, err := strconv.Atoi(p); err == nil && v > 0 && v <= 65535 {
			port = v
		}
	}
	dsn := getEnv("DB_DSN")
	if dsn == "" {
		dsn = buildDSN(
			getEnv("DB_USER"),
			getEnv("DB_PASSWORD"),
			getEnv("DB_HOST"),
			getEnv("DB_PORT"),
			getEnv("DB_NAME"),
		)
	}
	return &Config{
		Port:          port,
		DBDSN:         dsn,
		StartTime:     startTime,
		AdminUsername: getEnv("ADMIN_USERNAME"),
		AdminPassword: getEnv("ADMIN_PASSWORD"),
		JWTSecret:     getEnv("JWT_SECRET"),
	}
}

// getEnv membaca env, trim spasi dan kutip di pinggir (mis. "nilai" atau 'nilai').
func getEnv(key string) string {
	s := strings.TrimSpace(os.Getenv(key))
	s = strings.TrimPrefix(s, "\"")
	s = strings.TrimSuffix(s, "\"")
	s = strings.TrimPrefix(s, "'")
	s = strings.TrimSuffix(s, "'")
	return strings.TrimSpace(s)
}

// buildDSN membangun DSN dari komponen (.env: DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME).
// Pakai mysql.Config.FormatDSN agar password dengan karakter khusus ($, @, #, dll.) aman.
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
	cfg := mysql.NewConfig()
	cfg.User = user
	cfg.Passwd = strings.TrimSpace(password)
	cfg.Net = "tcp"
	cfg.Addr = host + ":" + port
	cfg.DBName = database
	cfg.Params = map[string]string{"parseTime": "true"}
	return cfg.FormatDSN()
}
