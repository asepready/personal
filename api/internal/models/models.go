// Package models holds domain entities and DTOs for the API.
package models

// SkillCategory matches table skill_categories.
type SkillCategory struct {
	ID        int    `json:"id"`
	Name      string `json:"name"`
	Slug      string `json:"slug"`
	SortOrder int    `json:"sort_order"`
}

// Skill matches table skills.
type Skill struct {
	ID         int64   `json:"id"`
	CategoryID int     `json:"category_id"`
	Name       string  `json:"name"`
	Level      string  `json:"level"`
	IconURL    *string `json:"icon_url,omitempty"`
	Category   string  `json:"category,omitempty"` // nama kategori (dari JOIN)
}
