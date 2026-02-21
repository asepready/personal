package handlers

import (
	"net/http"

	"github.com/personal/api/internal/database"
	"github.com/personal/api/internal/models"
)

const (
	querySkills = `
		SELECT s.id, s.category_id, s.name, s.level, s.icon_url, COALESCE(c.name, '') AS category_name
		FROM skills s
		LEFT JOIN skill_categories c ON c.id = s.category_id
		ORDER BY c.sort_order, s.name
	`
)

// SkillsList returns a handler for GET /api/skills.
func SkillsList(db *database.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if !AllowMethod(w, r, http.MethodGet) {
			return
		}
		if !dbAvailable(db) {
			RespondError(w, http.StatusServiceUnavailable, "database not configured")
			return
		}
		list, err := fetchSkills(db)
		if err != nil {
			RespondError(w, http.StatusInternalServerError, "query failed")
			return
		}
		RespondJSON(w, http.StatusOK, map[string]interface{}{"skills": list})
	}
}

func dbAvailable(db *database.DB) bool {
	return db != nil && db.DB != nil
}

func fetchSkills(db *database.DB) ([]models.Skill, error) {
	rows, err := db.Query(querySkills)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	return scanSkills(rows)
}

func scanSkills(rows interface {
	Next() bool
	Scan(dest ...interface{}) error
	Err() error
}) ([]models.Skill, error) {
	var list []models.Skill
	for rows.Next() {
		var s models.Skill
		var catName string
		if err := rows.Scan(&s.ID, &s.CategoryID, &s.Name, &s.Level, &s.IconURL, &catName); err != nil {
			return nil, err
		}
		s.Category = catName
		list = append(list, s)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	if list == nil {
		list = []models.Skill{}
	}
	return list, nil
}
