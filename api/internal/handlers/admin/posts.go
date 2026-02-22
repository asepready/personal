package admin

import (
	"database/sql"
	"net/http"
	"strconv"
	"time"

	"github.com/personal/api/internal/database"
	"github.com/personal/api/internal/handlers"
	"github.com/personal/api/internal/models"
)

const (
	queryPostsList  = `SELECT id, title, slug, content, type, status, published_at, created_at FROM posts ORDER BY created_at DESC`
	queryPostByID   = `SELECT id, title, slug, content, type, status, published_at, created_at FROM posts WHERE id = ?`
	queryPostTags   = `SELECT tag_id FROM post_tags WHERE post_id = ?`
	insertPost      = `INSERT INTO posts (title, slug, content, type, status, published_at) VALUES (?, ?, ?, ?, ?, ?)`
	updatePost      = `UPDATE posts SET title=?, slug=?, content=?, type=?, status=?, published_at=? WHERE id = ?`
	deletePost      = `DELETE FROM posts WHERE id = ?`
	insertPostTag   = `INSERT INTO post_tags (post_id, tag_id) VALUES (?, ?)`
	deletePostTags  = `DELETE FROM post_tags WHERE post_id = ?`
)

// PostWithTags — post + tag_ids for admin.
type PostWithTags struct {
	models.Post
	TagIDs []int `json:"tag_ids"`
}

// Posts returns CRUD handler for /admin/posts.
func Posts(db *database.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if !handlers.AllowMethods(w, r, http.MethodGet, http.MethodPost, http.MethodPut, http.MethodDelete) {
			return
		}
		defer r.Body.Close()
		if !handlers.DBAvailable(db) {
			handlers.RespondError(w, http.StatusServiceUnavailable, "database not configured")
			return
		}

		switch r.Method {
		case http.MethodGet:
			idStr := handlers.SlugFromPath(r.URL.Path, "/api/admin/posts/")
			if idStr != "" {
				id, err := strconv.ParseInt(idStr, 10, 64)
				if err != nil || id <= 0 {
					handlers.RespondError(w, http.StatusBadRequest, "invalid id")
					return
				}
				post, err := getPostByID(db, id)
				if err != nil {
					handlers.RespondError(w, http.StatusInternalServerError, "query failed")
					return
				}
				if post == nil {
					handlers.RespondError(w, http.StatusNotFound, "post not found")
					return
				}
				handlers.RespondJSON(w, http.StatusOK, post)
				return
			}
			list, err := listPosts(db)
			if err != nil {
				handlers.RespondError(w, http.StatusInternalServerError, "query failed")
				return
			}
			handlers.RespondJSON(w, http.StatusOK, map[string]interface{}{"posts": list})

		case http.MethodPost:
			var req struct {
				Title       string   `json:"title"`
				Slug        string   `json:"slug"`
				Content     *string  `json:"content"`
				Type        *string  `json:"type"`
				Status      string   `json:"status"`
				PublishedAt *string  `json:"published_at"` // ISO date or empty
				TagIDs      []int    `json:"tag_ids"`
			}
			if err := handlers.DecodeJSON(r, &req); err != nil {
				handlers.RespondError(w, http.StatusBadRequest, "invalid body")
				return
			}
			if req.Title == "" || req.Slug == "" {
				handlers.RespondError(w, http.StatusBadRequest, "title and slug required")
				return
			}
			if req.Status == "" {
				req.Status = "draft"
			}
			var pubAt interface{}
			if req.PublishedAt != nil && *req.PublishedAt != "" {
				t, err := time.Parse("2006-01-02", *req.PublishedAt)
				if err == nil {
					pubAt = t
				}
			}
			res, err := db.Exec(insertPost, req.Title, req.Slug, req.Content, req.Type, req.Status, pubAt)
			if err != nil {
				handlers.RespondError(w, http.StatusInternalServerError, "create failed")
				return
			}
			pid, _ := res.LastInsertId()
			for _, tid := range req.TagIDs {
				if tid > 0 {
					_, _ = db.Exec(insertPostTag, pid, tid)
				}
			}
			handlers.RespondJSON(w, http.StatusCreated, map[string]interface{}{"id": pid, "title": req.Title, "slug": req.Slug})

		case http.MethodPut:
			var req struct {
				ID          int64    `json:"id"`
				Title       string   `json:"title"`
				Slug        string   `json:"slug"`
				Content     *string  `json:"content"`
				Type        *string  `json:"type"`
				Status      string   `json:"status"`
				PublishedAt *string  `json:"published_at"`
				TagIDs      []int    `json:"tag_ids"`
			}
			if err := handlers.DecodeJSON(r, &req); err != nil {
				handlers.RespondError(w, http.StatusBadRequest, "invalid body")
				return
			}
			if req.ID <= 0 || req.Title == "" || req.Slug == "" {
				handlers.RespondError(w, http.StatusBadRequest, "id, title and slug required")
				return
			}
			if req.Status == "" {
				req.Status = "draft"
			}
			var pubAt interface{}
			if req.PublishedAt != nil && *req.PublishedAt != "" {
				t, err := time.Parse("2006-01-02", *req.PublishedAt)
				if err == nil {
					pubAt = t
				}
			}
			result, err := db.Exec(updatePost, req.Title, req.Slug, req.Content, req.Type, req.Status, pubAt, req.ID)
			if err != nil {
				handlers.RespondError(w, http.StatusInternalServerError, "update failed")
				return
			}
			rows, _ := result.RowsAffected()
			if rows == 0 {
				handlers.RespondError(w, http.StatusNotFound, "post not found")
				return
			}
			_, _ = db.Exec(deletePostTags, req.ID)
			for _, tid := range req.TagIDs {
				if tid > 0 {
					_, _ = db.Exec(insertPostTag, req.ID, tid)
				}
			}
			handlers.RespondJSON(w, http.StatusOK, map[string]interface{}{"id": req.ID, "title": req.Title, "slug": req.Slug})

		case http.MethodDelete:
			idStr := r.URL.Query().Get("id")
			if idStr == "" {
				handlers.RespondError(w, http.StatusBadRequest, "id required")
				return
			}
			id, err := strconv.ParseInt(idStr, 10, 64)
			if err != nil || id <= 0 {
				handlers.RespondError(w, http.StatusBadRequest, "invalid id")
				return
			}
			result, err := db.Exec(deletePost, id)
			if err != nil {
				handlers.RespondError(w, http.StatusInternalServerError, "delete failed")
				return
			}
			rows, _ := result.RowsAffected()
			if rows == 0 {
				handlers.RespondError(w, http.StatusNotFound, "post not found")
				return
			}
			handlers.RespondJSON(w, http.StatusOK, map[string]interface{}{"deleted": id})
		}
	}
}

func listPosts(db *database.DB) ([]PostWithTags, error) {
	rows, err := db.Query(queryPostsList)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var list []PostWithTags
	for rows.Next() {
		var p models.Post
		if err := rows.Scan(&p.ID, &p.Title, &p.Slug, &p.Content, &p.Type, &p.Status, &p.PublishedAt, &p.CreatedAt); err != nil {
			return nil, err
		}
		tagIDs, _ := getPostTagIDs(db, p.ID)
		list = append(list, PostWithTags{Post: p, TagIDs: tagIDs})
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	if list == nil {
		list = []PostWithTags{}
	}
	return list, nil
}

func getPostByID(db *database.DB, id int64) (*PostWithTags, error) {
	var p models.Post
	err := db.QueryRow(queryPostByID, id).Scan(
		&p.ID, &p.Title, &p.Slug, &p.Content, &p.Type, &p.Status, &p.PublishedAt, &p.CreatedAt,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}
	tagIDs, _ := getPostTagIDs(db, p.ID)
	return &PostWithTags{Post: p, TagIDs: tagIDs}, nil
}

func getPostTagIDs(db *database.DB, postID int64) ([]int, error) {
	rows, err := db.Query(queryPostTags, postID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var ids []int
	for rows.Next() {
		var tid int
		if err := rows.Scan(&tid); err != nil {
			return nil, err
		}
		ids = append(ids, tid)
	}
	return ids, rows.Err()
}
