package admin

import (
	"database/sql"
	"net/http"
	"strconv"

	"github.com/personal/api/internal/database"
	"github.com/personal/api/internal/handlers"
	"github.com/personal/api/internal/models"
)

const (
	queryListTags  = `SELECT id, name, slug FROM tags ORDER BY name`
	queryTagByID   = `SELECT id, name, slug FROM tags WHERE id = ?`
	insertTag      = `INSERT INTO tags (name, slug) VALUES (?, ?)`
	updateTag      = `UPDATE tags SET name = ?, slug = ? WHERE id = ?`
	deleteTag      = `DELETE FROM tags WHERE id = ?`
)

// Tags returns CRUD handler for /admin/tags.
func Tags(db *database.DB) http.HandlerFunc {
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
			idStr := handlers.SlugFromPath(r.URL.Path, "/admin/tags/")
			if idStr != "" {
				id, err := strconv.ParseInt(idStr, 10, 64)
				if err != nil || id <= 0 {
					handlers.RespondError(w, http.StatusBadRequest, "invalid id")
					return
				}
				tag, err := getTagByID(db, int(id))
				if err != nil {
					handlers.RespondError(w, http.StatusInternalServerError, "query failed")
					return
				}
				if tag == nil {
					handlers.RespondError(w, http.StatusNotFound, "tag not found")
					return
				}
				handlers.RespondJSON(w, http.StatusOK, tag)
				return
			}
			list, err := listTags(db)
			if err != nil {
				handlers.RespondError(w, http.StatusInternalServerError, "query failed")
				return
			}
			handlers.RespondJSON(w, http.StatusOK, map[string]interface{}{"tags": list})

		case http.MethodPost:
			var req struct {
				Name string `json:"name"`
				Slug string `json:"slug"`
			}
			if err := handlers.DecodeJSON(r, &req); err != nil {
				handlers.RespondError(w, http.StatusBadRequest, "invalid body")
				return
			}
			if req.Name == "" || req.Slug == "" {
				handlers.RespondError(w, http.StatusBadRequest, "name and slug required")
				return
			}
			res, err := db.Exec(insertTag, req.Name, req.Slug)
			if err != nil {
				handlers.RespondError(w, http.StatusInternalServerError, "create failed")
				return
			}
			id, _ := res.LastInsertId()
			handlers.RespondJSON(w, http.StatusCreated, map[string]interface{}{
				"id": id, "name": req.Name, "slug": req.Slug,
			})

		case http.MethodPut:
			var req struct {
				ID   int    `json:"id"`
				Name string `json:"name"`
				Slug string `json:"slug"`
			}
			if err := handlers.DecodeJSON(r, &req); err != nil {
				handlers.RespondError(w, http.StatusBadRequest, "invalid body")
				return
			}
			if req.ID <= 0 || req.Name == "" || req.Slug == "" {
				handlers.RespondError(w, http.StatusBadRequest, "id, name and slug required")
				return
			}
			result, err := db.Exec(updateTag, req.Name, req.Slug, req.ID)
			if err != nil {
				handlers.RespondError(w, http.StatusInternalServerError, "update failed")
				return
			}
			rows, _ := result.RowsAffected()
			if rows == 0 {
				handlers.RespondError(w, http.StatusNotFound, "tag not found")
				return
			}
			handlers.RespondJSON(w, http.StatusOK, map[string]interface{}{
				"id": req.ID, "name": req.Name, "slug": req.Slug,
			})

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
			result, err := db.Exec(deleteTag, id)
			if err != nil {
				handlers.RespondError(w, http.StatusInternalServerError, "delete failed")
				return
			}
			rows, _ := result.RowsAffected()
			if rows == 0 {
				handlers.RespondError(w, http.StatusNotFound, "tag not found")
				return
			}
			handlers.RespondJSON(w, http.StatusOK, map[string]interface{}{"deleted": id})
		}
	}
}

func listTags(db *database.DB) ([]models.Tag, error) {
	rows, err := db.Query(queryListTags)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var list []models.Tag
	for rows.Next() {
		var t models.Tag
		if err := rows.Scan(&t.ID, &t.Name, &t.Slug); err != nil {
			return nil, err
		}
		list = append(list, t)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	if list == nil {
		list = []models.Tag{}
	}
	return list, nil
}

func getTagByID(db *database.DB, id int) (*models.Tag, error) {
	var t models.Tag
	err := db.QueryRow(queryTagByID, id).Scan(&t.ID, &t.Name, &t.Slug)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}
	return &t, nil
}
