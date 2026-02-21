-- Rollback indeks normalisasi (002).

DROP INDEX idx_skill_categories_sort ON skill_categories;
DROP INDEX idx_skills_category_name ON skills;
DROP INDEX idx_projects_featured_created ON projects;
DROP INDEX idx_project_tools_tool_id ON project_tools;
DROP INDEX idx_post_tags_tag_id ON post_tags;
