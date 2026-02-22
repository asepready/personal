package handlers

import (
	"database/sql"
	"net/http"
	"regexp"
	"strings"
	"time"

	"github.com/personal/api/internal/database"
	"github.com/personal/api/internal/models"
)

var stripHTML = regexp.MustCompile(`<[^>]*>`)

const (
	queryPostsList = `
		SELECT id, title, slug, content, type, status, published_at, created_at
		FROM posts
		WHERE status = 'published' AND published_at IS NOT NULL
		ORDER BY published_at DESC
	`
	queryPostBySlug = `
		SELECT id, title, slug, content, type, status, published_at, created_at
		FROM posts
		WHERE slug = ? AND status = 'published' AND published_at IS NOT NULL
	`
	excerptLen = 160
)

// PostListItem — post for list (with excerpt).
type PostListItem struct {
	ID          int64   `json:"id"`
	Title       string  `json:"title"`
	Slug        string  `json:"slug"`
	Excerpt     string  `json:"excerpt"`
	Type        *string `json:"type,omitempty"`
	PublishedAt *string `json:"published_at,omitempty"`
}

// PostsList returns a handler for GET /api/posts (list published).
func PostsList(db *database.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if !AllowMethod(w, r, http.MethodGet) {
			return
		}
		if !DBAvailable(db) {
			RespondError(w, http.StatusServiceUnavailable, "database not configured")
			return
		}
		list, err := fetchPostsList(db)
		if err != nil {
			RespondError(w, http.StatusInternalServerError, "query failed")
			return
		}
		RespondJSON(w, http.StatusOK, map[string]interface{}{"posts": list})
	}
}

// PostBySlug returns a handler for GET /api/posts/:slug (detail).
func PostBySlug(db *database.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if !AllowMethod(w, r, http.MethodGet) {
			return
		}
		if !DBAvailable(db) {
			RespondError(w, http.StatusServiceUnavailable, "database not configured")
			return
		}
		slug := SlugFromPath(r.URL.Path, "/api/posts/")
		if slug == "" {
			RespondError(w, http.StatusNotFound, "post not found")
			return
		}
		post, err := fetchPostBySlug(db, slug)
		if err != nil {
			RespondError(w, http.StatusInternalServerError, "query failed")
			return
		}
		if post == nil {
			RespondError(w, http.StatusNotFound, "post not found")
			return
		}
		RespondJSON(w, http.StatusOK, post)
	}
}

func fetchPostsList(db *database.DB) ([]PostListItem, error) {
	rows, err := db.Query(queryPostsList)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var list []PostListItem
	for rows.Next() {
		var p models.Post
		if err := rows.Scan(&p.ID, &p.Title, &p.Slug, &p.Content, &p.Type, &p.Status, &p.PublishedAt, &p.CreatedAt); err != nil {
			return nil, err
		}
		excerpt := makeExcerpt(p.Content)
		pubAt := formatPublishedAt(p.PublishedAt)
		list = append(list, PostListItem{
			ID:          p.ID,
			Title:       p.Title,
			Slug:        p.Slug,
			Excerpt:     excerpt,
			Type:        p.Type,
			PublishedAt: pubAt,
		})
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	if list == nil {
		list = []PostListItem{}
	}
	return list, nil
}

func fetchPostBySlug(db *database.DB, slug string) (*models.Post, error) {
	var p models.Post
	err := db.QueryRow(queryPostBySlug, slug).Scan(
		&p.ID, &p.Title, &p.Slug, &p.Content, &p.Type, &p.Status, &p.PublishedAt, &p.CreatedAt,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}
	return &p, nil
}

func makeExcerpt(content *string) string {
	if content == nil || *content == "" {
		return ""
	}
	s := stripHTML.ReplaceAllString(*content, " ")
	s = strings.TrimSpace(s)
	if len(s) <= excerptLen {
		return s
	}
	return s[:excerptLen] + "…"
}

func formatPublishedAt(t *time.Time) *string {
	if t == nil {
		return nil
	}
	s := t.Format("2006-01-02")
	return &s
}
