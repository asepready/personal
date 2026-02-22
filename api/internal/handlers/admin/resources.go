package admin

import (
	"net/http"

	"github.com/personal/api/internal/handlers"
)

// AdminResourceSchema mendefinisikan satu entitas yang bisa dikelola di admin (CMS-style).
type AdminResourceSchema struct {
	ID          string                 `json:"id"`
	Label       string                 `json:"label"`
	ListFields  []AdminListField       `json:"list_fields"`
	FormFields  []AdminFormField       `json:"form_fields"`
	PrimaryKey  string                 `json:"primary_key"`  // id, untuk link edit
	DisplayKey  string                 `json:"display_key"`  // kolom yang ditampilkan di list (judul/nama)
}

type AdminListField struct {
	Key   string `json:"key"`
	Label string `json:"label"`
}

type AdminFormField struct {
	Key      string   `json:"key"`
	Label    string   `json:"label"`
	Type     string   `json:"type"` // string, text, number, select, multiselect, boolean, date, url
	Required bool     `json:"required,omitempty"`
	Options  []Option `json:"options,omitempty"`   // untuk select
	Relation string   `json:"relation,omitempty"` // resource id untuk isi options (e.g. skill-categories)
}

type Option struct {
	Value string `json:"value"`
	Label string `json:"label"`
}

// schemaAdminResources mengembalikan definisi semua resource admin (berdasarkan model database).
func schemaAdminResources() []AdminResourceSchema {
	return []AdminResourceSchema{
		{
			ID:    "skill-categories",
			Label: "Kategori Skill",
			PrimaryKey: "id",
			DisplayKey: "name",
			ListFields: []AdminListField{
				{Key: "id", Label: "ID"},
				{Key: "name", Label: "Nama"},
				{Key: "slug", Label: "Slug"},
				{Key: "sort_order", Label: "Urutan"},
			},
			FormFields: []AdminFormField{
				{Key: "name", Label: "Nama", Type: "string", Required: true},
				{Key: "slug", Label: "Slug", Type: "string", Required: true},
				{Key: "sort_order", Label: "Urutan", Type: "number", Required: false},
			},
		},
		{
			ID:    "skills",
			Label: "Skills",
			PrimaryKey: "id",
			DisplayKey: "name",
			ListFields: []AdminListField{
				{Key: "id", Label: "ID"},
				{Key: "category", Label: "Kategori"},
				{Key: "name", Label: "Nama"},
				{Key: "level", Label: "Level"},
			},
			FormFields: []AdminFormField{
				{Key: "category_id", Label: "Kategori", Type: "select", Required: true, Relation: "skill-categories"},
				{Key: "name", Label: "Nama", Type: "string", Required: true},
				{Key: "level", Label: "Level", Type: "string", Required: true},
				{Key: "icon_url", Label: "Icon URL", Type: "url", Required: false},
			},
		},
		{
			ID:    "tools",
			Label: "Tools",
			PrimaryKey: "id",
			DisplayKey: "name",
			ListFields: []AdminListField{
				{Key: "id", Label: "ID"},
				{Key: "name", Label: "Nama"},
				{Key: "slug", Label: "Slug"},
			},
			FormFields: []AdminFormField{
				{Key: "name", Label: "Nama", Type: "string", Required: true},
				{Key: "slug", Label: "Slug", Type: "string", Required: true},
				{Key: "logo_url", Label: "Logo URL", Type: "url", Required: false},
			},
		},
		{
			ID:    "projects",
			Label: "Projects",
			PrimaryKey: "id",
			DisplayKey: "title",
			ListFields: []AdminListField{
				{Key: "id", Label: "ID"},
				{Key: "title", Label: "Judul"},
				{Key: "slug", Label: "Slug"},
				{Key: "is_featured", Label: "Featured"},
			},
			FormFields: []AdminFormField{
				{Key: "title", Label: "Judul", Type: "string", Required: true},
				{Key: "slug", Label: "Slug", Type: "string", Required: true},
				{Key: "role", Label: "Role", Type: "string", Required: false},
				{Key: "problem", Label: "Problem", Type: "text", Required: false},
				{Key: "solution", Label: "Solusi", Type: "text", Required: false},
				{Key: "result", Label: "Hasil", Type: "text", Required: false},
				{Key: "diagram_url", Label: "Diagram URL", Type: "url", Required: false},
				{Key: "is_featured", Label: "Featured", Type: "boolean", Required: false},
				{Key: "tool_ids", Label: "Tools", Type: "multiselect", Required: false, Relation: "tools"},
			},
		},
		{
			ID:    "tags",
			Label: "Tags",
			PrimaryKey: "id",
			DisplayKey: "name",
			ListFields: []AdminListField{
				{Key: "id", Label: "ID"},
				{Key: "name", Label: "Nama"},
				{Key: "slug", Label: "Slug"},
			},
			FormFields: []AdminFormField{
				{Key: "name", Label: "Nama", Type: "string", Required: true},
				{Key: "slug", Label: "Slug", Type: "string", Required: true},
			},
		},
		{
			ID:    "posts",
			Label: "Posts / Blog",
			PrimaryKey: "id",
			DisplayKey: "title",
			ListFields: []AdminListField{
				{Key: "id", Label: "ID"},
				{Key: "title", Label: "Judul"},
				{Key: "slug", Label: "Slug"},
				{Key: "status", Label: "Status"},
				{Key: "published_at", Label: "Terbit"},
			},
			FormFields: []AdminFormField{
				{Key: "title", Label: "Judul", Type: "string", Required: true},
				{Key: "slug", Label: "Slug", Type: "string", Required: true},
				{Key: "content", Label: "Konten", Type: "text", Required: false},
				{Key: "type", Label: "Tipe", Type: "string", Required: false},
				{Key: "status", Label: "Status", Type: "string", Required: true},
				{Key: "published_at", Label: "Tanggal terbit", Type: "date", Required: false},
				{Key: "tag_ids", Label: "Tags", Type: "multiselect", Required: false, Relation: "tags"},
			},
		},
	}
}

// Resources returns handler GET /admin/resources — daftar resource + schema untuk admin dinamis (CMS/LMS).
func Resources(w http.ResponseWriter, r *http.Request) {
	if !handlers.AllowMethod(w, r, http.MethodGet) {
		return
	}
	handlers.RespondJSON(w, http.StatusOK, map[string]interface{}{
		"resources": schemaAdminResources(),
	})
}
