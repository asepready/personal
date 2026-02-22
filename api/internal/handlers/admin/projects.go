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
	queryProjectsList = `SELECT id, title, slug, role, problem, solution, result, diagram_url, is_featured, created_at, updated_at FROM projects ORDER BY is_featured DESC, created_at DESC`
	queryProjectByID  = `SELECT id, title, slug, role, problem, solution, result, diagram_url, is_featured, created_at, updated_at FROM projects WHERE id = ?`
	queryProjectTools = `SELECT tool_id FROM project_tools WHERE project_id = ?`
	insertProject     = `INSERT INTO projects (title, slug, role, problem, solution, result, diagram_url, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
	updateProject     = `UPDATE projects SET title=?, slug=?, role=?, problem=?, solution=?, result=?, diagram_url=?, is_featured=? WHERE id = ?`
	deleteProject     = `DELETE FROM projects WHERE id = ?`
	insertProjectTool = `INSERT INTO project_tools (project_id, tool_id) VALUES (?, ?)`
	deleteProjectTools = `DELETE FROM project_tools WHERE project_id = ?`
)

// ProjectWithTools — project + tool_ids for admin.
type ProjectWithTools struct {
	models.Project
	ToolIDs []int `json:"tool_ids"`
}

// Projects returns CRUD handler for /admin/projects.
func Projects(db *database.DB) http.HandlerFunc {
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
			idStr := handlers.SlugFromPath(r.URL.Path, "/admin/projects/")
			if idStr != "" {
				id, err := strconv.ParseInt(idStr, 10, 64)
				if err != nil || id <= 0 {
					handlers.RespondError(w, http.StatusBadRequest, "invalid id")
					return
				}
				p, err := getProjectByID(db, id)
				if err != nil {
					handlers.RespondError(w, http.StatusInternalServerError, "query failed")
					return
				}
				if p == nil {
					handlers.RespondError(w, http.StatusNotFound, "project not found")
					return
				}
				handlers.RespondJSON(w, http.StatusOK, p)
				return
			}
			list, err := listProjects(db)
			if err != nil {
				handlers.RespondError(w, http.StatusInternalServerError, "query failed")
				return
			}
			handlers.RespondJSON(w, http.StatusOK, map[string]interface{}{"projects": list})

		case http.MethodPost:
			var req struct {
				Title      string  `json:"title"`
				Slug       string  `json:"slug"`
				Role       *string `json:"role"`
				Problem    *string `json:"problem"`
				Solution   *string `json:"solution"`
				Result     *string `json:"result"`
				DiagramURL *string `json:"diagram_url"`
				IsFeatured bool    `json:"is_featured"`
				ToolIDs    []int   `json:"tool_ids"`
			}
			if err := handlers.DecodeJSON(r, &req); err != nil {
				handlers.RespondError(w, http.StatusBadRequest, "invalid body")
				return
			}
			if req.Title == "" || req.Slug == "" {
				handlers.RespondError(w, http.StatusBadRequest, "title and slug required")
				return
			}
			res, err := db.Exec(insertProject,
				req.Title, req.Slug, req.Role, req.Problem, req.Solution, req.Result,
				req.DiagramURL, req.IsFeatured,
			)
			if err != nil {
				handlers.RespondError(w, http.StatusInternalServerError, "create failed")
				return
			}
			pid, _ := res.LastInsertId()
			if len(req.ToolIDs) > 0 {
				for _, tid := range req.ToolIDs {
					if tid > 0 {
						_, _ = db.Exec(insertProjectTool, pid, tid)
					}
				}
			}
			handlers.RespondJSON(w, http.StatusCreated, map[string]interface{}{"id": pid, "title": req.Title, "slug": req.Slug})

		case http.MethodPut:
			var req struct {
				ID         int64   `json:"id"`
				Title      string  `json:"title"`
				Slug       string  `json:"slug"`
				Role       *string `json:"role"`
				Problem    *string `json:"problem"`
				Solution   *string `json:"solution"`
				Result     *string `json:"result"`
				DiagramURL *string `json:"diagram_url"`
				IsFeatured bool    `json:"is_featured"`
				ToolIDs    []int   `json:"tool_ids"`
			}
			if err := handlers.DecodeJSON(r, &req); err != nil {
				handlers.RespondError(w, http.StatusBadRequest, "invalid body")
				return
			}
			if req.ID <= 0 || req.Title == "" || req.Slug == "" {
				handlers.RespondError(w, http.StatusBadRequest, "id, title and slug required")
				return
			}
			result, err := db.Exec(updateProject,
				req.Title, req.Slug, req.Role, req.Problem, req.Solution, req.Result,
				req.DiagramURL, req.IsFeatured, req.ID,
			)
			if err != nil {
				handlers.RespondError(w, http.StatusInternalServerError, "update failed")
				return
			}
			rows, _ := result.RowsAffected()
			if rows == 0 {
				handlers.RespondError(w, http.StatusNotFound, "project not found")
				return
			}
			_, _ = db.Exec(deleteProjectTools, req.ID)
			if len(req.ToolIDs) > 0 {
				for _, tid := range req.ToolIDs {
					if tid > 0 {
						_, _ = db.Exec(insertProjectTool, req.ID, tid)
					}
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
			result, err := db.Exec(deleteProject, id)
			if err != nil {
				handlers.RespondError(w, http.StatusInternalServerError, "delete failed")
				return
			}
			rows, _ := result.RowsAffected()
			if rows == 0 {
				handlers.RespondError(w, http.StatusNotFound, "project not found")
				return
			}
			handlers.RespondJSON(w, http.StatusOK, map[string]interface{}{"deleted": id})
		}
	}
}

func listProjects(db *database.DB) ([]ProjectWithTools, error) {
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
		toolIDs, _ := getProjectToolIDs(db, p.ID)
		list = append(list, ProjectWithTools{Project: p, ToolIDs: toolIDs})
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	if list == nil {
		list = []ProjectWithTools{}
	}
	return list, nil
}

func getProjectByID(db *database.DB, id int64) (*ProjectWithTools, error) {
	var p models.Project
	err := db.QueryRow(queryProjectByID, id).Scan(
		&p.ID, &p.Title, &p.Slug, &p.Role, &p.Problem, &p.Solution, &p.Result,
		&p.DiagramURL, &p.IsFeatured, &p.CreatedAt, &p.UpdatedAt,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}
	toolIDs, _ := getProjectToolIDs(db, p.ID)
	return &ProjectWithTools{Project: p, ToolIDs: toolIDs}, nil
}

func getProjectToolIDs(db *database.DB, projectID int64) ([]int, error) {
	rows, err := db.Query(queryProjectTools, projectID)
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
