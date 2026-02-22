package admin

import (
	"net/http"
	"strconv"

	"github.com/personal/api/internal/database"
	"github.com/personal/api/internal/handlers"
)

const (
	insertSkill = `INSERT INTO skills (category_id, name, level, icon_url) VALUES (?, ?, ?, ?)`
	updateSkill = `UPDATE skills SET category_id = ?, name = ?, level = ?, icon_url = ? WHERE id = ?`
	deleteSkill = `DELETE FROM skills WHERE id = ?`
)

// Skills returns a handler for CRUD /admin/skills (GET list, POST create, PUT update, DELETE).
func Skills(db *database.DB) http.HandlerFunc {
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
			list, err := handlers.FetchSkills(db)
			if err != nil {
				handlers.RespondError(w, http.StatusInternalServerError, "query failed")
				return
			}
			handlers.RespondJSON(w, http.StatusOK, map[string]interface{}{"skills": list})
		case http.MethodPost:
			var req struct {
				CategoryID int     `json:"category_id"`
				Name       string  `json:"name"`
				Level      string  `json:"level"`
				IconURL    *string `json:"icon_url"`
			}
			if err := handlers.DecodeJSON(r, &req); err != nil {
				handlers.RespondError(w, http.StatusBadRequest, "invalid body")
				return
			}
			if req.CategoryID <= 0 || req.Name == "" || req.Level == "" {
				handlers.RespondError(w, http.StatusBadRequest, "category_id, name and level required")
				return
			}
			res, err := db.Exec(insertSkill, req.CategoryID, req.Name, req.Level, req.IconURL)
			if err != nil {
				handlers.RespondError(w, http.StatusInternalServerError, "create failed")
				return
			}
			id, _ := res.LastInsertId()
			handlers.RespondJSON(w, http.StatusCreated, map[string]interface{}{
				"id": id, "category_id": req.CategoryID, "name": req.Name, "level": req.Level, "icon_url": req.IconURL,
			})
		case http.MethodPut:
			var req struct {
				ID         int64   `json:"id"`
				CategoryID int     `json:"category_id"`
				Name       string  `json:"name"`
				Level      string  `json:"level"`
				IconURL    *string `json:"icon_url"`
			}
			if err := handlers.DecodeJSON(r, &req); err != nil {
				handlers.RespondError(w, http.StatusBadRequest, "invalid body")
				return
			}
			if req.ID <= 0 || req.CategoryID <= 0 || req.Name == "" || req.Level == "" {
				handlers.RespondError(w, http.StatusBadRequest, "id, category_id, name and level required")
				return
			}
			result, err := db.Exec(updateSkill, req.CategoryID, req.Name, req.Level, req.IconURL, req.ID)
			if err != nil {
				handlers.RespondError(w, http.StatusInternalServerError, "update failed")
				return
			}
			rows, _ := result.RowsAffected()
			if rows == 0 {
				handlers.RespondError(w, http.StatusNotFound, "skill not found")
				return
			}
			handlers.RespondJSON(w, http.StatusOK, map[string]interface{}{
				"id": req.ID, "category_id": req.CategoryID, "name": req.Name, "level": req.Level, "icon_url": req.IconURL,
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
			result, err := db.Exec(deleteSkill, id)
			if err != nil {
				handlers.RespondError(w, http.StatusInternalServerError, "delete failed")
				return
			}
			rows, _ := result.RowsAffected()
			if rows == 0 {
				handlers.RespondError(w, http.StatusNotFound, "skill not found")
				return
			}
			handlers.RespondJSON(w, http.StatusOK, map[string]interface{}{"deleted": id})
		}
	}
}
