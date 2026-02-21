-- Indeks tambahan untuk performa (sesuai table.sql normalisasi).
-- Aman dijalankan setelah 001_initial.

-- Kategori: urutan list (ORDER BY sort_order)
CREATE INDEX idx_skill_categories_sort ON skill_categories (sort_order);

-- Skills: list per kategori + urut nama (ORDER BY c.sort_order, s.name)
CREATE INDEX idx_skills_category_name ON skills (category_id, name);

-- Projects: list featured lalu terbaru
CREATE INDEX idx_projects_featured_created ON projects (is_featured DESC, created_at DESC);

-- Reverse lookup: proyek per tool
CREATE INDEX idx_project_tools_tool_id ON project_tools (tool_id);

-- Reverse lookup: post per tag
CREATE INDEX idx_post_tags_tag_id ON post_tags (tag_id);
