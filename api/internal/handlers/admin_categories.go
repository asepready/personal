package handlers

import (
	"net/http"
	"strconv"

	"github.com/personal/api/internal/database"
	"github.com/personal/api/internal/models"
)

const (
	queryListCategories = `SELECT id, name, slug, sort_order FROM skill_categories ORDER BY sort_order, name`
	insertCategory      = `INSERT INTO skill_categories (name, slug, sort_order) VALUES (?, ?, ?)`
	updateCategory      = `UPDATE skill_categories SET name = ?, slug = ?, sort_order = ? WHERE id = ?`
	deleteCategory      = `DELETE FROM skill_categories WHERE id = ?`
)

// AdminSkillCategories returns a handler for CRUD /admin/skill-categories (GET list, POST create, PUT update, DELETE).
func AdminSkillCategories(db *database.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if !AllowMethods(w, r, http.MethodGet, http.MethodPost, http.MethodPut, http.MethodDelete) {
			return
		}
		defer r.Body.Close()
		if !dbAvailable(db) {
			RespondError(w, http.StatusServiceUnavailable, "database not configured")
			return
		}

		switch r.Method {
		case http.MethodGet:
			list, err := listCategories(db)
			if err != nil {
				RespondError(w, http.StatusInternalServerError, "query failed")
				return
			}
			RespondJSON(w, http.StatusOK, map[string]interface{}{"categories": list})
		case http.MethodPost:
			var req struct {
				Name      string `json:"name"`
				Slug      string `json:"slug"`
				SortOrder int    `json:"sort_order"`
			}
			if err := DecodeJSON(r, &req); err != nil {
				RespondError(w, http.StatusBadRequest, "invalid body")
				return
			}
			if req.Name == "" || req.Slug == "" {
				RespondError(w, http.StatusBadRequest, "name and slug required")
				return
			}
			res, err := db.Exec(insertCategory, req.Name, req.Slug, req.SortOrder)
			if err != nil {
				RespondError(w, http.StatusInternalServerError, "create failed")
				return
			}
			id, _ := res.LastInsertId()
			RespondJSON(w, http.StatusCreated, map[string]interface{}{"id": id, "name": req.Name, "slug": req.Slug, "sort_order": req.SortOrder})
		case http.MethodPut:
			var req struct {
				ID        int    `json:"id"`
				Name      string `json:"name"`
				Slug      string `json:"slug"`
				SortOrder int    `json:"sort_order"`
			}
			if err := DecodeJSON(r, &req); err != nil {
				RespondError(w, http.StatusBadRequest, "invalid body")
				return
			}
			if req.ID <= 0 || req.Name == "" || req.Slug == "" {
				RespondError(w, http.StatusBadRequest, "id, name and slug required")
				return
			}
			result, err := db.Exec(updateCategory, req.Name, req.Slug, req.SortOrder, req.ID)
			if err != nil {
				RespondError(w, http.StatusInternalServerError, "update failed")
				return
			}
			rows, _ := result.RowsAffected()
			if rows == 0 {
				RespondError(w, http.StatusNotFound, "category not found")
				return
			}
			RespondJSON(w, http.StatusOK, map[string]interface{}{"id": req.ID, "name": req.Name, "slug": req.Slug, "sort_order": req.SortOrder})
		case http.MethodDelete:
			idStr := r.URL.Query().Get("id")
			if idStr == "" {
				RespondError(w, http.StatusBadRequest, "id required")
				return
			}
			id, err := strconv.ParseInt(idStr, 10, 64)
			if err != nil || id <= 0 {
				RespondError(w, http.StatusBadRequest, "invalid id")
				return
			}
			result, err := db.Exec(deleteCategory, id)
			if err != nil {
				RespondError(w, http.StatusInternalServerError, "delete failed")
				return
			}
			rows, _ := result.RowsAffected()
			if rows == 0 {
				RespondError(w, http.StatusNotFound, "category not found")
				return
			}
			RespondJSON(w, http.StatusOK, map[string]interface{}{"deleted": id})
		}
	}
}

func listCategories(db *database.DB) ([]models.SkillCategory, error) {
	rows, err := db.Query(queryListCategories)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var list []models.SkillCategory
	for rows.Next() {
		var c models.SkillCategory
		if err := rows.Scan(&c.ID, &c.Name, &c.Slug, &c.SortOrder); err != nil {
			return nil, err
		}
		list = append(list, c)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	if list == nil {
		list = []models.SkillCategory{}
	}
	return list, nil
}
