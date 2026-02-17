package config

import (
	"os"
	"strconv"
)

// Config holds application configuration from environment.
type Config struct {
	Port     int
	DBDSN    string
	StartTime int64 // unix seconds, set at startup for uptime
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
		Port:      port,
		DBDSN:     os.Getenv("DB_DSN"),
		StartTime: startTime,
	}
}
