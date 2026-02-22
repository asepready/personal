// Package models mendefinisikan struct yang memetakan tabel di database
// (api/internal/database/table.sql dan migrations).
package models

import "time"

// User — tabel users (auth).
type User struct {
	ID           int64     `json:"id"`
	Username     string    `json:"username"`
	PasswordHash string    `json:"-"` // jangan expose di JSON
	Role         string    `json:"role"`
	CreatedAt    time.Time `json:"created_at"`
}

// SkillCategory — tabel skill_categories.
type SkillCategory struct {
	ID        int    `json:"id"`
	Name      string `json:"name"`
	Slug      string `json:"slug"`
	SortOrder int    `json:"sort_order"`
}

// Skill — tabel skills. Category (nama) diisi dari JOIN dengan skill_categories.
type Skill struct {
	ID         int64   `json:"id"`
	CategoryID int     `json:"category_id"`
	Name       string  `json:"name"`
	Level      string  `json:"level"`
	IconURL    *string `json:"icon_url,omitempty"`
	Category   string  `json:"category,omitempty"` // dari JOIN, bukan kolom tabel
}

// Tool — tabel tools.
type Tool struct {
	ID      int     `json:"id"`
	Name    string  `json:"name"`
	Slug    string  `json:"slug"`
	LogoURL *string `json:"logo_url,omitempty"`
}

// Project — tabel projects.
type Project struct {
	ID          int64     `json:"id"`
	Title       string    `json:"title"`
	Slug        string    `json:"slug"`
	Role        *string   `json:"role,omitempty"`
	Problem     *string   `json:"problem,omitempty"`
	Solution    *string   `json:"solution,omitempty"`
	Result      *string   `json:"result,omitempty"`
	DiagramURL  *string   `json:"diagram_url,omitempty"`
	IsFeatured  bool      `json:"is_featured"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// ProjectTool — tabel project_tools (M:N project ↔ tool).
type ProjectTool struct {
	ProjectID int64 `json:"project_id"`
	ToolID    int   `json:"tool_id"`
}

// Tag — tabel tags.
type Tag struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
	Slug string `json:"slug"`
}

// Post — tabel posts.
type Post struct {
	ID          int64      `json:"id"`
	Title       string     `json:"title"`
	Slug        string     `json:"slug"`
	Content     *string    `json:"content,omitempty"`
	Type        *string    `json:"type,omitempty"`
	Status      string     `json:"status"`
	PublishedAt *time.Time `json:"published_at,omitempty"`
	CreatedAt   time.Time  `json:"created_at"`
}

// PostTag — tabel post_tags (M:N post ↔ tag).
type PostTag struct {
	PostID int64 `json:"post_id"`
	TagID  int   `json:"tag_id"`
}

// MonitoringService — tabel monitoring_services.
type MonitoringService struct {
	ID          int    `json:"id"`
	Name        string `json:"name"`
	EndpointURL string `json:"endpoint_url"`
}

// UptimeLog — tabel uptime_logs.
type UptimeLog struct {
	ID             int64     `json:"id"`
	ServiceID      int       `json:"service_id"`
	Status         *string   `json:"status,omitempty"`
	ResponseTimeMs *int      `json:"response_time_ms,omitempty"`
	CheckedAt      time.Time `json:"checked_at"`
}
