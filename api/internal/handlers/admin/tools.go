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
	queryListTools   = `SELECT id, name, slug, logo_url FROM tools ORDER BY name`
	queryToolByID    = `SELECT id, name, slug, logo_url FROM tools WHERE id = ?`
	insertTool       = `INSERT INTO tools (name, slug, logo_url) VALUES (?, ?, ?)`
	updateTool       = `UPDATE tools SET name = ?, slug = ?, logo_url = ? WHERE id = ?`
	deleteTool       = `DELETE FROM tools WHERE id = ?`
)

// Tools returns CRUD handler for /admin/tools.
func Tools(db *database.DB) http.HandlerFunc {
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
			idStr := handlers.SlugFromPath(r.URL.Path, "/admin/tools/")
			if idStr != "" {
				id, err := strconv.ParseInt(idStr, 10, 64)
				if err != nil || id <= 0 {
					handlers.RespondError(w, http.StatusBadRequest, "invalid id")
					return
				}
				t, err := getToolByID(db, int(id))
				if err != nil {
					handlers.RespondError(w, http.StatusInternalServerError, "query failed")
					return
				}
				if t == nil {
					handlers.RespondError(w, http.StatusNotFound, "tool not found")
					return
				}
				handlers.RespondJSON(w, http.StatusOK, t)
				return
			}
			list, err := listTools(db)
			if err != nil {
				handlers.RespondError(w, http.StatusInternalServerError, "query failed")
				return
			}
			handlers.RespondJSON(w, http.StatusOK, map[string]interface{}{"tools": list})

		case http.MethodPost:
			var req struct {
				Name    string  `json:"name"`
				Slug    string  `json:"slug"`
				LogoURL *string `json:"logo_url"`
			}
			if err := handlers.DecodeJSON(r, &req); err != nil {
				handlers.RespondError(w, http.StatusBadRequest, "invalid body")
				return
			}
			if req.Name == "" || req.Slug == "" {
				handlers.RespondError(w, http.StatusBadRequest, "name and slug required")
				return
			}
			res, err := db.Exec(insertTool, req.Name, req.Slug, req.LogoURL)
			if err != nil {
				handlers.RespondError(w, http.StatusInternalServerError, "create failed")
				return
			}
			id, _ := res.LastInsertId()
			handlers.RespondJSON(w, http.StatusCreated, map[string]interface{}{
				"id": id, "name": req.Name, "slug": req.Slug, "logo_url": req.LogoURL,
			})

		case http.MethodPut:
			var req struct {
				ID      int     `json:"id"`
				Name    string  `json:"name"`
				Slug    string  `json:"slug"`
				LogoURL *string `json:"logo_url"`
			}
			if err := handlers.DecodeJSON(r, &req); err != nil {
				handlers.RespondError(w, http.StatusBadRequest, "invalid body")
				return
			}
			if req.ID <= 0 || req.Name == "" || req.Slug == "" {
				handlers.RespondError(w, http.StatusBadRequest, "id, name and slug required")
				return
			}
			result, err := db.Exec(updateTool, req.Name, req.Slug, req.LogoURL, req.ID)
			if err != nil {
				handlers.RespondError(w, http.StatusInternalServerError, "update failed")
				return
			}
			rows, _ := result.RowsAffected()
			if rows == 0 {
				handlers.RespondError(w, http.StatusNotFound, "tool not found")
				return
			}
			handlers.RespondJSON(w, http.StatusOK, map[string]interface{}{
				"id": req.ID, "name": req.Name, "slug": req.Slug, "logo_url": req.LogoURL,
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
			result, err := db.Exec(deleteTool, id)
			if err != nil {
				handlers.RespondError(w, http.StatusInternalServerError, "delete failed")
				return
			}
			rows, _ := result.RowsAffected()
			if rows == 0 {
				handlers.RespondError(w, http.StatusNotFound, "tool not found")
				return
			}
			handlers.RespondJSON(w, http.StatusOK, map[string]interface{}{"deleted": id})
		}
	}
}

func listTools(db *database.DB) ([]models.Tool, error) {
	rows, err := db.Query(queryListTools)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var list []models.Tool
	for rows.Next() {
		var t models.Tool
		if err := rows.Scan(&t.ID, &t.Name, &t.Slug, &t.LogoURL); err != nil {
			return nil, err
		}
		list = append(list, t)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	if list == nil {
		list = []models.Tool{}
	}
	return list, nil
}

func getToolByID(db *database.DB, id int) (*models.Tool, error) {
	var t models.Tool
	err := db.QueryRow(queryToolByID, id).Scan(&t.ID, &t.Name, &t.Slug, &t.LogoURL)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}
	return &t, nil
}
