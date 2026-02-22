package handlers

import (
	"database/sql"
	"net/http"

	"github.com/personal/api/internal/database"
	"github.com/personal/api/internal/models"
)

const (
	queryProjectsList = `
		SELECT id, title, slug, role, problem, solution, result, diagram_url, is_featured, created_at, updated_at
		FROM projects
		ORDER BY is_featured DESC, created_at DESC
	`
	queryProjectBySlug = `
		SELECT id, title, slug, role, problem, solution, result, diagram_url, is_featured, created_at, updated_at
		FROM projects
		WHERE slug = ?
	`
	queryProjectTools = `
		SELECT t.id, t.name, t.slug, t.logo_url
		FROM project_tools pt
		JOIN tools t ON t.id = pt.tool_id
		WHERE pt.project_id = ?
		ORDER BY t.name
	`
)

// ProjectWithTools — project + tool names for API response.
type ProjectWithTools struct {
	models.Project
	Tools []models.Tool `json:"tools"`
}

// ProjectsList returns a handler for GET /api/projects (list).
func ProjectsList(db *database.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if !AllowMethod(w, r, http.MethodGet) {
			return
		}
		if !DBAvailable(db) {
			RespondError(w, http.StatusServiceUnavailable, "database not configured")
			return
		}
		list, err := fetchProjectsList(db)
		if err != nil {
			RespondError(w, http.StatusInternalServerError, "query failed")
			return
		}
		RespondJSON(w, http.StatusOK, map[string]interface{}{"projects": list})
	}
}

// ProjectBySlug returns a handler for GET /api/projects/:slug (detail + tools).
func ProjectBySlug(db *database.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if !AllowMethod(w, r, http.MethodGet) {
			return
		}
		if !DBAvailable(db) {
			RespondError(w, http.StatusServiceUnavailable, "database not configured")
			return
		}
		slug := SlugFromPath(r.URL.Path, "/api/projects/")
		if slug == "" {
			RespondError(w, http.StatusNotFound, "project not found")
			return
		}
		p, err := fetchProjectBySlug(db, slug)
		if err != nil {
			RespondError(w, http.StatusInternalServerError, "query failed")
			return
		}
		if p == nil {
			RespondError(w, http.StatusNotFound, "project not found")
			return
		}
		RespondJSON(w, http.StatusOK, p)
	}
}

func fetchProjectsList(db *database.DB) ([]ProjectWithTools, error) {
	rows, err := db.Query(queryProjectsList)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var list []ProjectWithTools
	for rows.Next() {
		var p models.Project
		if err := rows.Scan(&p.ID, &p.Title, &p.Slug, &p.Role, &p.Problem, &p.Solution, &p.Result, &p.DiagramURL, &p.IsFeatured, &p.CreatedAt, &p.UpdatedAt); err != nil {
			return nil, err
		}
		tools, _ := fetchToolsForProject(db, p.ID)
		list = append(list, ProjectWithTools{Project: p, Tools: tools})
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	if list == nil {
		list = []ProjectWithTools{}
	}
	return list, nil
}

func fetchProjectBySlug(db *database.DB, slug string) (*ProjectWithTools, error) {
	var p models.Project
	err := db.QueryRow(queryProjectBySlug, slug).Scan(
		&p.ID, &p.Title, &p.Slug, &p.Role, &p.Problem, &p.Solution, &p.Result,
		&p.DiagramURL, &p.IsFeatured, &p.CreatedAt, &p.UpdatedAt,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}
	tools, _ := fetchToolsForProject(db, p.ID)
	return &ProjectWithTools{Project: p, Tools: tools}, nil
}

func fetchToolsForProject(db *database.DB, projectID int64) ([]models.Tool, error) {
	rows, err := db.Query(queryProjectTools, projectID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var tools []models.Tool
	for rows.Next() {
		var t models.Tool
		if err := rows.Scan(&t.ID, &t.Name, &t.Slug, &t.LogoURL); err != nil {
			return nil, err
		}
		tools = append(tools, t)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	if tools == nil {
		tools = []models.Tool{}
	}
	return tools, nil
}
