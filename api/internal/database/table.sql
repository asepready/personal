-- =============================================================================
-- Schema referensi: normalisasi untuk performa backend & loading cepat.
-- Naming: snake_case; PK/FK konsisten; indeks mengikuti pola query.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. USERS (Auth)
-- -----------------------------------------------------------------------------
CREATE TABLE users (
    id           BIGINT       PRIMARY KEY AUTO_INCREMENT,
    username     VARCHAR(50)  NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role         VARCHAR(20)  NOT NULL DEFAULT 'admin',
    created_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_users_username (username)
);
-- Login: lookup by username
CREATE INDEX idx_users_username ON users (username);

-- -----------------------------------------------------------------------------
-- 2. SKILL CATEGORIES + SKILLS (1:N)
-- -----------------------------------------------------------------------------
CREATE TABLE skill_categories (
    id         INT         PRIMARY KEY AUTO_INCREMENT,
    name       VARCHAR(50) NOT NULL,
    slug       VARCHAR(50) NOT NULL,
    sort_order INT         NOT NULL DEFAULT 0,
    UNIQUE KEY uq_skill_categories_name (name),
    UNIQUE KEY uq_skill_categories_slug (slug)
);
-- Daftar kategori urut (ORDER BY sort_order)
CREATE INDEX idx_skill_categories_sort ON skill_categories (sort_order);

CREATE TABLE skills (
    id          BIGINT       PRIMARY KEY AUTO_INCREMENT,
    category_id INT          NOT NULL,
    name        VARCHAR(100) NOT NULL,
    level       VARCHAR(20)  NOT NULL,
    icon_url    VARCHAR(255) DEFAULT NULL,
    CONSTRAINT fk_skills_category
        FOREIGN KEY (category_id) REFERENCES skill_categories (id) ON DELETE CASCADE
);
-- List skills per kategori + urut nama (query: JOIN + ORDER BY sort_order, name)
CREATE INDEX idx_skills_category_name ON skills (category_id, name);

-- -----------------------------------------------------------------------------
-- 3. TOOLS + PROJECTS (M:N via project_tools)
-- -----------------------------------------------------------------------------
CREATE TABLE tools (
    id       INT          PRIMARY KEY AUTO_INCREMENT,
    name     VARCHAR(100) NOT NULL,
    slug     VARCHAR(100) NOT NULL,
    logo_url VARCHAR(255) DEFAULT NULL,
    UNIQUE KEY uq_tools_name (name),
    UNIQUE KEY uq_tools_slug (slug)
);

CREATE TABLE projects (
    id          BIGINT      PRIMARY KEY AUTO_INCREMENT,
    title       VARCHAR(255) NOT NULL,
    slug        VARCHAR(255) NOT NULL,
    role        VARCHAR(100) DEFAULT NULL,
    problem     TEXT         DEFAULT NULL,
    solution    TEXT         DEFAULT NULL,
    result      TEXT         DEFAULT NULL,
    diagram_url VARCHAR(255) DEFAULT NULL,
    is_featured TINYINT(1)   NOT NULL DEFAULT 0,
    created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_projects_slug (slug)
);
-- List by slug (detail); list featured + terbaru (listing)
CREATE INDEX idx_projects_slug ON projects (slug);
CREATE INDEX idx_projects_featured_created ON projects (is_featured DESC, created_at DESC);

CREATE TABLE project_tools (
    project_id BIGINT NOT NULL,
    tool_id    INT    NOT NULL,
    PRIMARY KEY (project_id, tool_id),
    CONSTRAINT fk_project_tools_project
        FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE,
    CONSTRAINT fk_project_tools_tool
        FOREIGN KEY (tool_id) REFERENCES tools (id) ON DELETE CASCADE
);
-- Reverse lookup: proyek per tool
CREATE INDEX idx_project_tools_tool_id ON project_tools (tool_id);

-- -----------------------------------------------------------------------------
-- 4. TAGS + POSTS (Blog, M:N via post_tags)
-- -----------------------------------------------------------------------------
CREATE TABLE tags (
    id   INT         PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    slug VARCHAR(50) NOT NULL,
    UNIQUE KEY uq_tags_name (name),
    UNIQUE KEY uq_tags_slug (slug)
);

CREATE TABLE posts (
    id           BIGINT     PRIMARY KEY AUTO_INCREMENT,
    title        VARCHAR(255) NOT NULL,
    slug         VARCHAR(255) NOT NULL,
    content      LONGTEXT     DEFAULT NULL,
    type         VARCHAR(50)  DEFAULT NULL,
    status       VARCHAR(20)  NOT NULL DEFAULT 'published',
    published_at TIMESTAMP    DEFAULT NULL,
    created_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_posts_slug (slug)
);
-- List published terbaru; detail by slug
CREATE INDEX idx_posts_status_published ON posts (status, published_at DESC);
CREATE INDEX idx_posts_slug ON posts (slug);

CREATE TABLE post_tags (
    post_id BIGINT NOT NULL,
    tag_id  INT    NOT NULL,
    PRIMARY KEY (post_id, tag_id),
    CONSTRAINT fk_post_tags_post
        FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE,
    CONSTRAINT fk_post_tags_tag
        FOREIGN KEY (tag_id) REFERENCES tags (id) ON DELETE CASCADE
);
-- Reverse lookup: post per tag
CREATE INDEX idx_post_tags_tag_id ON post_tags (tag_id);

-- -----------------------------------------------------------------------------
-- 5. MONITORING (Uptime)
-- -----------------------------------------------------------------------------
CREATE TABLE monitoring_services (
    id           INT          PRIMARY KEY AUTO_INCREMENT,
    name         VARCHAR(100) NOT NULL,
    endpoint_url VARCHAR(255) NOT NULL
);

CREATE TABLE uptime_logs (
    id              BIGINT    PRIMARY KEY AUTO_INCREMENT,
    service_id      INT       NOT NULL,
    status          VARCHAR(20) DEFAULT NULL,
    response_time_ms INT      DEFAULT NULL,
    checked_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_uptime_logs_service
        FOREIGN KEY (service_id) REFERENCES monitoring_services (id) ON DELETE CASCADE
);
-- Timeline per service (ORDER BY checked_at DESC)
CREATE INDEX idx_uptime_logs_service_checked ON uptime_logs (service_id, checked_at DESC);
