// Package database provides MySQL/MariaDB connection and migrations.
package database

import (
	"context"
	"database/sql"
	"strings"
	"time"

	_ "github.com/go-sql-driver/mysql"
)

// DB wraps *sql.DB for MySQL/MariaDB.
type DB struct {
	*sql.DB
}

const (
	defaultConnectTimeout  = 5 * time.Second
	defaultMaxOpenConns    = 10
	defaultMaxIdleConns    = 5
	defaultConnMaxLifetime = 5 * time.Minute
	defaultConnMaxIdleTime = 1 * time.Minute
)

// Open connects to MySQL/MariaDB. If dsn is empty, returns (nil, nil).
// DSN format: user:password@tcp(host:3306)/dbname?parseTime=true
// Timeout dan pool diatur agar koneksi stabil dan tidak menggantung.
func Open(dsn string) (*DB, error) {
	if strings.TrimSpace(dsn) == "" {
		return nil, nil
	}
	dsn = ensureDSNTimeouts(dsn)
	db, err := sql.Open("mysql", dsn)
	if err != nil {
		return nil, err
	}
	db.SetMaxOpenConns(defaultMaxOpenConns)
	db.SetMaxIdleConns(defaultMaxIdleConns)
	db.SetConnMaxLifetime(defaultConnMaxLifetime)
	db.SetConnMaxIdleTime(defaultConnMaxIdleTime)

	ctx, cancel := context.WithTimeout(context.Background(), defaultConnectTimeout)
	defer cancel()
	if err := db.PingContext(ctx); err != nil {
		_ = db.Close()
		return nil, err
	}
	return &DB{db}, nil
}

// ensureDSNTimeouts menambahkan timeout ke DSN jika belum ada (mencegah koneksi menggantung).
func ensureDSNTimeouts(dsn string) string {
	if strings.Contains(dsn, "?") {
		if strings.Contains(dsn, "timeout=") || strings.Contains(dsn, "readTimeout=") {
			return dsn
		}
		dsn += "&timeout=5s&readTimeout=10s&writeTimeout=10s"
	} else {
		dsn += "?timeout=5s&readTimeout=10s&writeTimeout=10s"
	}
	if !strings.Contains(dsn, "parseTime=") {
		dsn += "&parseTime=true"
	}
	return dsn
}

// Ping returns nil if the database is reachable, or if DB is nil.
func (db *DB) Ping() error {
	if db == nil || db.DB == nil {
		return nil
	}
	return db.DB.Ping()
}
