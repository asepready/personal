package database

import (
	"database/sql"
	"time"

	_ "github.com/go-sql-driver/mysql"
)

// DB wraps *sql.DB for MariaDB/MySQL.
type DB struct {
	*sql.DB
}

// Open connects to MariaDB/MySQL. DSN format: "user:pass@tcp(host:3306)/dbname?parseTime=true"
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
	if err := db.Ping(); err != nil {
		_ = db.Close()
		return nil, err
	}
	return &DB{db}, nil
}

// Ping returns nil if DB is connected (or DB is nil).
func (db *DB) Ping() error {
	if db == nil || db.DB == nil {
		return nil
	}
	return db.DB.Ping()
}
