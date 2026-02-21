// Package database provides MySQL/MariaDB connection and migrations.
package database

import (
	"context"
	"database/sql"
	"time"

	_ "github.com/go-sql-driver/mysql"
)

// DB wraps *sql.DB for MySQL/MariaDB.
type DB struct {
	*sql.DB
}

// Open connects to MySQL/MariaDB. If dsn is empty, returns (nil, nil).
// DSN format: user:password@tcp(host:3306)/dbname?parseTime=true
func Open(dsn string) (*DB, error) {
	if dsn == "" {
		return nil, nil
	}
	db, err := sql.Open("mysql", dsn)
	if err != nil {
		return nil, err
	}
	db.SetMaxOpenConns(10)
	db.SetMaxIdleConns(5)
	db.SetConnMaxLifetime(5 * time.Minute)

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := db.PingContext(ctx); err != nil {
		_ = db.Close()
		return nil, err
	}
	return &DB{db}, nil
}

// Ping returns nil if the database is reachable, or if DB is nil.
func (db *DB) Ping() error {
	if db == nil || db.DB == nil {
		return nil
	}
	return db.DB.Ping()
}
