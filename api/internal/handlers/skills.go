package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/personal/api/internal/database"
	"github.com/personal/api/internal/models"
)

func writeJSONError(w http.ResponseWriter, code int, errMsg string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	_ = json.NewEncoder(w).Encode(map[string]string{"error": errMsg})
}

// SkillsList returns a handler for GET /api/skills (list skills from DB).
func SkillsList(db *database.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
			return
		}
		if db == nil || db.DB == nil {
			writeJSONError(w, http.StatusServiceUnavailable, "database not configured")
			return
		}
		rows, err := db.Query(`
			SELECT s.id, s.category_id, s.name, s.level, s.icon_url, COALESCE(c.name, '') AS category_name
			FROM skills s
			LEFT JOIN skill_categories c ON c.id = s.category_id
			ORDER BY c.sort_order, s.name
		`)
		if err != nil {
			writeJSONError(w, http.StatusInternalServerError, "query failed")
			return
		}
		defer rows.Close()

		var list []models.Skill
		for rows.Next() {
			var s models.Skill
			var catName string
			if err := rows.Scan(&s.ID, &s.CategoryID, &s.Name, &s.Level, &s.IconURL, &catName); err != nil {
				continue
			}
			s.Category = catName
			list = append(list, s)
		}
		if list == nil {
			list = []models.Skill{}
		}
		w.Header().Set("Content-Type", "application/json")
		_ = json.NewEncoder(w).Encode(map[string]interface{}{"skills": list})
	}
}
