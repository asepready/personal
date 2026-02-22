package database

import (
	"context"
	"database/sql"
	"embed"
	"fmt"
	"sort"
	"strings"
	"time"
)

//go:embed migrations/*.sql
var migrationsFS embed.FS

// Migrations are embedded *.up.sql and *.down.sql in migrations/.

const migrationsDir = "migrations"

// schemaMigrationsTable dipakai untuk melacak migrasi yang sudah dijalankan.
const schemaMigrationsTable = "schema_migrations"

// MigrateUp menjalankan semua migrasi yang belum dijalankan.
func (db *DB) MigrateUp(ctx context.Context) error {
	if db == nil || db.DB == nil {
		return fmt.Errorf("database not connected")
	}
	if err := db.ensureMigrationsTable(ctx); err != nil {
		return err
	}
	applied, err := db.appliedVersions(ctx)
	if err != nil {
		return err
	}
	entries, err := migrationsFS.ReadDir(migrationsDir)
	if err != nil {
		return err
	}
	var upFiles []string
	for _, e := range entries {
		if e.IsDir() || !strings.HasSuffix(e.Name(), ".up.sql") {
			continue
		}
		upFiles = append(upFiles, e.Name())
	}
	sort.Strings(upFiles)
	for _, name := range upFiles {
		version := strings.TrimSuffix(name, ".up.sql")
		if applied[version] {
			continue
		}
		body, err := migrationsFS.ReadFile(migrationsDir + "/" + name)
		if err != nil {
			return fmt.Errorf("read %s: %w", name, err)
		}
		if err := db.runMigration(ctx, version, string(body), true); err != nil {
			return fmt.Errorf("migrate %s: %w", version, err)
		}
	}
	return nil
}

// MigrateDown menjalankan migrasi down untuk versi terakhir yang applied.
func (db *DB) MigrateDown(ctx context.Context) error {
	if db == nil || db.DB == nil {
		return fmt.Errorf("database not connected")
	}
	if err := db.ensureMigrationsTable(ctx); err != nil {
		return err
	}
	versions, err := db.appliedVersionsOrdered(ctx)
	if err != nil {
		return err
	}
	if len(versions) == 0 {
		return nil
	}
	last := versions[len(versions)-1]
	downName := last + ".down.sql"
	body, err := migrationsFS.ReadFile(migrationsDir + "/" + downName)
	if err != nil {
		return fmt.Errorf("read %s: %w", downName, err)
	}
	return db.runMigration(ctx, last, string(body), false)
}

func (db *DB) ensureMigrationsTable(ctx context.Context) error {
	_, err := db.ExecContext(ctx, `
		CREATE TABLE IF NOT EXISTS `+schemaMigrationsTable+` (
			version VARCHAR(255) PRIMARY KEY,
			applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		)
	`)
	return err
}

func (db *DB) appliedVersions(ctx context.Context) (map[string]bool, error) {
	rows, err := db.QueryContext(ctx, "SELECT version FROM "+schemaMigrationsTable)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	m := make(map[string]bool)
	for rows.Next() {
		var v string
		if err := rows.Scan(&v); err != nil {
			return nil, err
		}
		m[v] = true
	}
	return m, rows.Err()
}

func (db *DB) appliedVersionsOrdered(ctx context.Context) ([]string, error) {
	rows, err := db.QueryContext(ctx, "SELECT version FROM "+schemaMigrationsTable+" ORDER BY version")
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var list []string
	for rows.Next() {
		var v string
		if err := rows.Scan(&v); err != nil {
			return nil, err
		}
		list = append(list, v)
	}
	return list, rows.Err()
}

func (db *DB) runMigration(ctx context.Context, version, sqlBody string, isUp bool) error {
	tx, err := db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}
	defer tx.Rollback()
	// MySQL bisa menjalankan multi-statement dengan Exec
	for _, stmt := range splitStatements(sqlBody) {
		stmt = strings.TrimSpace(stmt)
		if stmt == "" {
			continue
		}
		if _, err := tx.ExecContext(ctx, stmt); err != nil {
			return err
		}
	}
	if isUp {
		_, err = tx.ExecContext(ctx, "INSERT INTO "+schemaMigrationsTable+" (version, applied_at) VALUES (?, ?)", version, time.Now())
	} else {
		_, err = tx.ExecContext(ctx, "DELETE FROM "+schemaMigrationsTable+" WHERE version = ?", version)
	}
	if err != nil {
		return err
	}
	return tx.Commit()
}

// splitStatements memecah isi SQL per statement (pemisah ;).
// Baris komentar (--) di awal tiap blok dibuang, bukan seluruh blok.
// Catatan: jangan gunakan ; di dalam string literal di file migrasi.
func splitStatements(s string) []string {
	var out []string
	for _, part := range strings.Split(s, ";") {
		part = stripLeadingCommentLines(strings.TrimSpace(part))
		if part == "" {
			continue
		}
		out = append(out, part+";")
	}
	return out
}

// stripLeadingCommentLines menghapus baris kosong dan baris komentar (--) di awal s.
func stripLeadingCommentLines(s string) string {
	lines := strings.Split(s, "\n")
	i := 0
	for i < len(lines) {
		line := strings.TrimSpace(lines[i])
		if line != "" && !strings.HasPrefix(line, "--") {
			break
		}
		i++
	}
	return strings.TrimSpace(strings.Join(lines[i:], "\n"))
}

// MigrateUpSQL sama seperti MigrateUp tapi pakai *sql.DB (untuk CLI).
func MigrateUpSQL(ctx context.Context, sqlDB *sql.DB) error {
	return (&DB{DB: sqlDB}).MigrateUp(ctx)
}

// MigrateDownSQL sama seperti MigrateDown tapi pakai *sql.DB.
func MigrateDownSQL(ctx context.Context, sqlDB *sql.DB) error {
	return (&DB{DB: sqlDB}).MigrateDown(ctx)
}
