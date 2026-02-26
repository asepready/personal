//! Handler HTTP: health, docs, API — selaras Lumen (ERD, publikasi, auth).

use axum::{
    extract::{Path, State},
    http::{HeaderMap, StatusCode},
    response::IntoResponse,
    Json,
};
use rand::Rng;
use serde::{Deserialize, Serialize};
use sqlx::FromRow;

use crate::auth;
use crate::response::{json_error, json_success};
use crate::state::AppState;

/// Versi aplikasi (GET /).
#[utoipa::path(
    get,
    path = "/",
    responses(
        (status = 200, description = "Versi aplikasi", body = String)
    )
)]
pub async fn root() -> impl IntoResponse {
    Json(serde_json::json!({ "version": env!("CARGO_PKG_VERSION"), "name": env!("CARGO_PKG_NAME") }))
}

/// Baris user untuk response (hanya field publik; password/api_token tidak di-expose).
#[derive(Serialize, FromRow)]
pub struct UserListItem {
    id: i64,
    full_name: String,
}

#[utoipa::path(
    get,
    path = "/api/users",
    responses(
        (status = 200, description = "Daftar users (format ApiResponse: data, message, errors)")
    )
)]
pub async fn users_index(State(state): State<AppState>) -> impl IntoResponse {
    let data: Vec<UserListItem> = if let Some(pool) = &state.pool {
        match sqlx::query_as::<_, UserListItem>("SELECT id, full_name FROM users ORDER BY id")
            .fetch_all(pool)
            .await
        {
            Ok(rows) => rows,
            Err(e) => {
                tracing::error!("users_index db error: {}", e);
                return json_error(
                    "Database error",
                    Some(serde_json::json!({ "detail": e.to_string() })),
                    StatusCode::INTERNAL_SERVER_ERROR,
                );
            }
        }
    } else {
        vec![]
    };
    json_success(data, "Users retrieved successfully", StatusCode::OK)
}

/// Get user by ID (GET /api/users/:id).
#[utoipa::path(
    get,
    path = "/api/users/{id}",
    params(("id" = u64, Path, description = "User ID")),
    responses(
        (status = 200, description = "User ditemukan"),
        (status = 404, description = "User not found")
    )
)]
pub async fn users_show(
    State(state): State<AppState>,
    Path(id): Path<i64>,
) -> impl IntoResponse {
    if let Some(pool) = &state.pool {
        match sqlx::query_as::<_, UserListItem>("SELECT id, full_name FROM users WHERE id = ?")
            .bind(id)
            .fetch_optional(pool)
            .await
        {
            Ok(Some(user)) => return json_success(user, "User retrieved successfully", StatusCode::OK),
            Ok(None) => return json_error("User not found", None, StatusCode::NOT_FOUND),
            Err(e) => {
                tracing::error!("users_show db error: {}", e);
                return json_error(
                    "Database error",
                    Some(serde_json::json!({ "detail": e.to_string() })),
                    StatusCode::INTERNAL_SERVER_ERROR,
                );
            }
        }
    }
    if id == 0 {
        return json_error("User not found", None, StatusCode::NOT_FOUND);
    }
    let user = UserListItem {
        id,
        full_name: "Placeholder".to_string(),
    };
    json_success(user, "User retrieved successfully", StatusCode::OK)
}

/// Submit contact (POST /api/contact) — publik; user_id dari CONTACT_OWNER_USER_ID atau user pertama (selaras Lumen).
#[derive(Deserialize, Serialize, utoipa::ToSchema)]
pub struct ContactInput {
    pub name: String,
    pub email: String,
    pub subject: String,
    pub message: String,
}

#[utoipa::path(
    post,
    path = "/api/contact",
    request_body = ContactInput,
    responses(
        (status = 201, description = "Pesan terkirim"),
        (status = 422, description = "Validation failed"),
        (status = 429, description = "Too many requests"),
        (status = 503, description = "Contact owner not configured")
    )
)]
pub async fn contact_create(
    State(state): State<AppState>,
    Json(payload): Json<ContactInput>,
) -> impl IntoResponse {
    if payload.name.is_empty() || payload.email.is_empty() || payload.subject.is_empty() || payload.message.is_empty() {
        return json_error(
            "Validation failed",
            Some(serde_json::json!({"name": ["Required"], "email": ["Required"], "subject": ["Required"], "message": ["Required"]})),
            StatusCode::UNPROCESSABLE_ENTITY,
        );
    }
    let pool = match &state.pool {
        Some(p) => p,
        None => {
            let data = serde_json::json!({ "message": "Message sent successfully." });
            return json_success(data, "Message sent successfully.", StatusCode::CREATED);
        }
    };
    let owner_id: Option<i64> = std::env::var("CONTACT_OWNER_USER_ID")
        .ok()
        .and_then(|s| s.parse().ok());
    let user_id: i64 = match owner_id {
        Some(id) => {
            let exists: Option<(i64,)> = sqlx::query_as("SELECT id FROM users WHERE id = ?")
                .bind(id)
                .fetch_optional(pool)
                .await
                .ok()
                .flatten();
            if exists.is_none() {
                return json_error("Contact owner not configured.", None, StatusCode::SERVICE_UNAVAILABLE);
            }
            id
        }
        None => {
            let row: Option<(i64,)> = sqlx::query_as("SELECT id FROM users LIMIT 1")
                .fetch_optional(pool)
                .await
                .ok()
                .flatten();
            match row {
                Some((id,)) => id,
                None => return json_error("Contact owner not configured.", None, StatusCode::SERVICE_UNAVAILABLE),
            }
        }
    };
    let _ = sqlx::query(
        "INSERT INTO contact_messages (user_id, name, email, subject, message, is_read, created_at, updated_at) VALUES (?, ?, ?, ?, ?, 0, NOW(), NOW())",
    )
    .bind(user_id)
    .bind(&payload.name)
    .bind(&payload.email)
    .bind(&payload.subject)
    .bind(&payload.message)
    .execute(pool)
    .await;
    let data = serde_json::json!({ "message": "Message sent successfully." });
    json_success(data, "Message sent successfully.", StatusCode::CREATED)
}

/// Login (POST /api/login) — username + password, kembalikan token + user (selaras Lumen).
#[derive(Deserialize, utoipa::ToSchema)]
pub struct LoginInput {
    pub username: String,
    pub password: String,
}

#[utoipa::path(
    post,
    path = "/api/login",
    request_body = LoginInput,
    responses(
        (status = 200, description = "Login berhasil"),
        (status = 401, description = "Kredensial tidak valid"),
        (status = 422, description = "Validation failed")
    )
)]
pub async fn login_post(
    State(state): State<AppState>,
    Json(payload): Json<LoginInput>,
) -> impl IntoResponse {
    if payload.username.is_empty() || payload.password.is_empty() {
        return json_error(
            "Validation failed",
            Some(serde_json::json!({"username": ["Required"], "password": ["Required"]})),
            StatusCode::UNPROCESSABLE_ENTITY,
        );
    }
    let pool = match &state.pool {
        Some(p) => p,
        None => return json_error("Kredensial tidak valid", None, StatusCode::UNAUTHORIZED),
    };
    let row: Option<(i64, String, Option<String>, Option<String>)> = sqlx::query_as(
        "SELECT id, full_name, username, password FROM users WHERE username = ?",
    )
    .bind(&payload.username)
    .fetch_optional(pool)
    .await
    .ok()
    .flatten();
    let (id, full_name, username, hashed) = match row {
        Some(r) => r,
        None => return json_error("Kredensial tidak valid", None, StatusCode::UNAUTHORIZED),
    };
    let hashed = match hashed {
        Some(h) => h,
        None => return json_error("Kredensial tidak valid", None, StatusCode::UNAUTHORIZED),
    };
    if !bcrypt::verify(&payload.password, &hashed).unwrap_or(false) {
        return json_error("Kredensial tidak valid", None, StatusCode::UNAUTHORIZED);
    }
    let token: String = rand::thread_rng()
        .sample_iter(&rand::distributions::Alphanumeric)
        .take(60)
        .map(char::from)
        .collect();
    let _ = sqlx::query("UPDATE users SET api_token = ?, updated_at = NOW() WHERE id = ?")
        .bind(&token)
        .bind(id)
        .execute(pool)
        .await;
    let user = serde_json::json!({
        "id": id,
        "full_name": full_name,
        "username": username
    });
    json_success(
        serde_json::json!({ "token": token, "user": user }),
        "Login berhasil",
        StatusCode::OK,
    )
}

// ---------- Experiences (ERD) ----------
#[derive(Serialize, FromRow)]
pub struct ExperienceListItem {
    id: i64,
    user_id: i64,
    company_name: String,
    position_title: String,
    location: Option<String>,
    start_date: Option<chrono::NaiveDate>,
    end_date: Option<chrono::NaiveDate>,
    is_current: bool,
    description: Option<String>,
}

#[utoipa::path(get, path = "/api/experiences", responses((status = 200, description = "Daftar experiences")))]
pub async fn experiences_index(State(state): State<AppState>) -> impl IntoResponse {
    let data: Vec<ExperienceListItem> = if let Some(pool) = &state.pool {
        sqlx::query_as::<_, ExperienceListItem>("SELECT id, user_id, company_name, position_title, location, start_date, end_date, is_current, description FROM experiences ORDER BY id")
            .fetch_all(pool)
            .await
            .unwrap_or_default()
    } else {
        vec![]
    };
    json_success(data, "Experiences retrieved successfully", StatusCode::OK)
}

#[utoipa::path(get, path = "/api/experiences/{id}", params(("id" = i64, Path)), responses((status = 200), (status = 404)))]
pub async fn experiences_show(State(state): State<AppState>, Path(id): Path<i64>) -> impl IntoResponse {
    if let Some(pool) = &state.pool {
        if let Ok(Some(row)) = sqlx::query_as::<_, ExperienceListItem>("SELECT id, user_id, company_name, position_title, location, start_date, end_date, is_current, description FROM experiences WHERE id = ?")
            .bind(id)
            .fetch_optional(pool)
            .await
        {
            return json_success(row, "Experience retrieved successfully", StatusCode::OK);
        }
    }
    json_error("Experience not found", None, StatusCode::NOT_FOUND)
}

// ---------- Educations (ERD) ----------
#[derive(Serialize, FromRow)]
pub struct EducationListItem {
    id: i64,
    user_id: i64,
    institution_name: String,
    degree: Option<String>,
    field_of_study: Option<String>,
    location: Option<String>,
    start_date: Option<chrono::NaiveDate>,
    end_date: Option<chrono::NaiveDate>,
    is_current: bool,
    description: Option<String>,
}

#[utoipa::path(get, path = "/api/educations", responses((status = 200, description = "Daftar educations")))]
pub async fn educations_index(State(state): State<AppState>) -> impl IntoResponse {
    let data: Vec<EducationListItem> = if let Some(pool) = &state.pool {
        sqlx::query_as::<_, EducationListItem>("SELECT id, user_id, institution_name, degree, field_of_study, location, start_date, end_date, is_current, description FROM educations ORDER BY id")
            .fetch_all(pool)
            .await
            .unwrap_or_default()
    } else {
        vec![]
    };
    json_success(data, "Educations retrieved successfully", StatusCode::OK)
}

#[utoipa::path(get, path = "/api/educations/{id}", params(("id" = i64, Path)), responses((status = 200), (status = 404)))]
pub async fn educations_show(State(state): State<AppState>, Path(id): Path<i64>) -> impl IntoResponse {
    if let Some(pool) = &state.pool {
        if let Ok(Some(row)) = sqlx::query_as::<_, EducationListItem>("SELECT id, user_id, institution_name, degree, field_of_study, location, start_date, end_date, is_current, description FROM educations WHERE id = ?")
            .bind(id)
            .fetch_optional(pool)
            .await
        {
            return json_success(row, "Education retrieved successfully", StatusCode::OK);
        }
    }
    json_error("Education not found", None, StatusCode::NOT_FOUND)
}

// ---------- Skill categories (ERD) ----------
#[derive(Serialize, FromRow, utoipa::ToSchema)]
pub struct SkillCategoryListItem {
    id: i64,
    name: String,
    slug: Option<String>,
    description: Option<String>,
    sort_order: i32,
}

#[utoipa::path(get, path = "/api/skill-categories", responses((status = 200, description = "Daftar skill categories")))]
pub async fn skill_categories_index(State(state): State<AppState>) -> impl IntoResponse {
    let data: Vec<SkillCategoryListItem> = if let Some(pool) = &state.pool {
        sqlx::query_as::<_, SkillCategoryListItem>("SELECT id, name, slug, description, sort_order FROM skill_categories ORDER BY sort_order, id")
            .fetch_all(pool)
            .await
            .unwrap_or_default()
    } else {
        vec![]
    };
    json_success(data, "Skill categories retrieved successfully", StatusCode::OK)
}

#[utoipa::path(get, path = "/api/skill-categories/{id}", params(("id" = i64, Path)), responses((status = 200), (status = 404)))]
pub async fn skill_categories_show(State(state): State<AppState>, Path(id): Path<i64>) -> impl IntoResponse {
    if let Some(pool) = &state.pool {
        if let Ok(Some(row)) = sqlx::query_as::<_, SkillCategoryListItem>("SELECT id, name, slug, description, sort_order FROM skill_categories WHERE id = ?")
            .bind(id)
            .fetch_optional(pool)
            .await
        {
            return json_success(row, "Skill category retrieved successfully", StatusCode::OK);
        }
    }
    json_error("Skill category not found", None, StatusCode::NOT_FOUND)
}

// ---------- Skills (ERD) ----------
#[derive(Serialize, FromRow, utoipa::ToSchema)]
pub struct SkillListItem {
    id: i64,
    skill_category_id: Option<i64>,
    name: String,
    slug: Option<String>,
    level: Option<String>,
    description: Option<String>,
    sort_order: i32,
}

#[utoipa::path(get, path = "/api/skills", responses((status = 200, description = "Daftar skills")))]
pub async fn skills_index(State(state): State<AppState>) -> impl IntoResponse {
    let data: Vec<SkillListItem> = if let Some(pool) = &state.pool {
        sqlx::query_as::<_, SkillListItem>("SELECT id, skill_category_id, name, slug, level, description, sort_order FROM skills ORDER BY sort_order, id")
            .fetch_all(pool)
            .await
            .unwrap_or_default()
    } else {
        vec![]
    };
    json_success(data, "Skills retrieved successfully", StatusCode::OK)
}

#[utoipa::path(get, path = "/api/skills/{id}", params(("id" = i64, Path)), responses((status = 200), (status = 404)))]
pub async fn skills_show(State(state): State<AppState>, Path(id): Path<i64>) -> impl IntoResponse {
    if let Some(pool) = &state.pool {
        if let Ok(Some(row)) = sqlx::query_as::<_, SkillListItem>("SELECT id, skill_category_id, name, slug, level, description, sort_order FROM skills WHERE id = ?")
            .bind(id)
            .fetch_optional(pool)
            .await
        {
            return json_success(row, "Skill retrieved successfully", StatusCode::OK);
        }
    }
    json_error("Skill not found", None, StatusCode::NOT_FOUND)
}

// ---------- Projects (ERD; filter is_published bila tanpa auth — PUBLIKASI_WEB) ----------
#[derive(Serialize, FromRow)]
pub struct ProjectListItem {
    id: i64,
    user_id: i64,
    title: String,
    slug: Option<String>,
    short_description: Option<String>,
    description: Option<String>,
    start_date: Option<chrono::NaiveDate>,
    end_date: Option<chrono::NaiveDate>,
    is_current: bool,
    thumbnail_url: Option<String>,
    url: Option<String>,
    repository_url: Option<String>,
    is_featured: bool,
    pub is_published: bool,
    published_at: Option<chrono::NaiveDateTime>,
    sort_order: i32,
}

#[utoipa::path(get, path = "/api/projects", responses((status = 200, description = "Daftar projects; tanpa auth hanya is_published=1")))]
pub async fn projects_index(State(state): State<AppState>, headers: HeaderMap) -> impl IntoResponse {
    let is_admin = auth::resolve_user_from_headers(&state, &headers).await.is_some();
    let data: Vec<ProjectListItem> = if let Some(pool) = &state.pool {
        let sql = if is_admin {
            "SELECT id, user_id, title, slug, short_description, description, start_date, end_date, is_current, thumbnail_url, url, repository_url, is_featured, is_published, published_at, sort_order FROM projects ORDER BY sort_order, id"
        } else {
            "SELECT id, user_id, title, slug, short_description, description, start_date, end_date, is_current, thumbnail_url, url, repository_url, is_featured, is_published, published_at, sort_order FROM projects WHERE is_published = 1 ORDER BY sort_order, id"
        };
        sqlx::query_as::<_, ProjectListItem>(sql)
            .fetch_all(pool)
            .await
            .unwrap_or_default()
    } else {
        vec![]
    };
    json_success(data, "Projects retrieved successfully", StatusCode::OK)
}

#[utoipa::path(get, path = "/api/projects/{id}", params(("id" = i64, Path)), responses((status = 200), (status = 404)))]
pub async fn projects_show(State(state): State<AppState>, headers: HeaderMap, Path(id): Path<i64>) -> impl IntoResponse {
    let is_admin = auth::resolve_user_from_headers(&state, &headers).await.is_some();
    if let Some(pool) = &state.pool {
        let row: Option<ProjectListItem> = sqlx::query_as::<_, ProjectListItem>("SELECT id, user_id, title, slug, short_description, description, start_date, end_date, is_current, thumbnail_url, url, repository_url, is_featured, is_published, published_at, sort_order FROM projects WHERE id = ?")
            .bind(id)
            .fetch_optional(pool)
            .await
            .ok()
            .flatten();
        if let Some(r) = row {
            if !is_admin && !r.is_published {
                return json_error("Project not found", None, StatusCode::NOT_FOUND);
            }
            return json_success(r, "Project retrieved successfully", StatusCode::OK);
        }
    }
    json_error("Project not found", None, StatusCode::NOT_FOUND)
}

// ---------- Blog posts (ERD; filter is_published bila tanpa auth — PUBLIKASI_WEB) ----------
#[derive(Serialize, FromRow)]
pub struct BlogPostListItem {
    id: i64,
    user_id: i64,
    title: String,
    slug: Option<String>,
    excerpt: Option<String>,
    content: Option<String>,
    cover_image_url: Option<String>,
    pub is_published: bool,
    published_at: Option<chrono::NaiveDateTime>,
}

#[utoipa::path(get, path = "/api/blog-posts", responses((status = 200, description = "Daftar blog posts; tanpa auth hanya is_published=1")))]
pub async fn blog_posts_index(State(state): State<AppState>, headers: HeaderMap) -> impl IntoResponse {
    let is_admin = auth::resolve_user_from_headers(&state, &headers).await.is_some();
    let data: Vec<BlogPostListItem> = if let Some(pool) = &state.pool {
        let sql = if is_admin {
            "SELECT id, user_id, title, slug, excerpt, content, cover_image_url, is_published, published_at FROM blog_posts ORDER BY id"
        } else {
            "SELECT id, user_id, title, slug, excerpt, content, cover_image_url, is_published, published_at FROM blog_posts WHERE is_published = 1 ORDER BY id"
        };
        sqlx::query_as::<_, BlogPostListItem>(sql)
            .fetch_all(pool)
            .await
            .unwrap_or_default()
    } else {
        vec![]
    };
    json_success(data, "Blog posts retrieved successfully", StatusCode::OK)
}

#[utoipa::path(get, path = "/api/blog-posts/{id}", params(("id" = i64, Path)), responses((status = 200), (status = 404)))]
pub async fn blog_posts_show(State(state): State<AppState>, headers: HeaderMap, Path(id): Path<i64>) -> impl IntoResponse {
    let is_admin = auth::resolve_user_from_headers(&state, &headers).await.is_some();
    if let Some(pool) = &state.pool {
        let row: Option<BlogPostListItem> = sqlx::query_as::<_, BlogPostListItem>("SELECT id, user_id, title, slug, excerpt, content, cover_image_url, is_published, published_at FROM blog_posts WHERE id = ?")
            .bind(id)
            .fetch_optional(pool)
            .await
            .ok()
            .flatten();
        if let Some(r) = row {
            if !is_admin && !r.is_published {
                return json_error("Blog post not found", None, StatusCode::NOT_FOUND);
            }
            return json_success(r, "Blog post retrieved successfully", StatusCode::OK);
        }
    }
    json_error("Blog post not found", None, StatusCode::NOT_FOUND)
}

// ---------- Tags (ERD) ----------
#[derive(Serialize, FromRow, utoipa::ToSchema)]
pub struct TagListItem {
    id: i64,
    name: String,
    slug: Option<String>,
    color: Option<String>,
}

#[utoipa::path(get, path = "/api/tags", responses((status = 200, description = "Daftar tags")))]
pub async fn tags_index(State(state): State<AppState>) -> impl IntoResponse {
    let data: Vec<TagListItem> = if let Some(pool) = &state.pool {
        sqlx::query_as::<_, TagListItem>("SELECT id, name, slug, color FROM tags ORDER BY id")
            .fetch_all(pool)
            .await
            .unwrap_or_default()
    } else {
        vec![]
    };
    json_success(data, "Tags retrieved successfully", StatusCode::OK)
}

#[utoipa::path(get, path = "/api/tags/{id}", params(("id" = i64, Path)), responses((status = 200), (status = 404)))]
pub async fn tags_show(State(state): State<AppState>, Path(id): Path<i64>) -> impl IntoResponse {
    if let Some(pool) = &state.pool {
        if let Ok(Some(row)) = sqlx::query_as::<_, TagListItem>("SELECT id, name, slug, color FROM tags WHERE id = ?")
            .bind(id)
            .fetch_optional(pool)
            .await
        {
            return json_success(row, "Tag retrieved successfully", StatusCode::OK);
        }
    }
    json_error("Tag not found", None, StatusCode::NOT_FOUND)
}

// ---------- Certifications (ERD) ----------
#[derive(Serialize, FromRow)]
pub struct CertificationListItem {
    id: i64,
    user_id: i64,
    name: String,
    issuer: Option<String>,
    issue_date: Option<chrono::NaiveDate>,
    expiration_date: Option<chrono::NaiveDate>,
    credential_id: Option<String>,
    credential_url: Option<String>,
    description: Option<String>,
    does_not_expire: bool,
}

#[utoipa::path(get, path = "/api/certifications", responses((status = 200, description = "Daftar certifications")))]
pub async fn certifications_index(State(state): State<AppState>) -> impl IntoResponse {
    let data: Vec<CertificationListItem> = if let Some(pool) = &state.pool {
        sqlx::query_as::<_, CertificationListItem>("SELECT id, user_id, name, issuer, issue_date, expiration_date, credential_id, credential_url, description, does_not_expire FROM certifications ORDER BY id")
            .fetch_all(pool)
            .await
            .unwrap_or_default()
    } else {
        vec![]
    };
    json_success(data, "Certifications retrieved successfully", StatusCode::OK)
}

#[utoipa::path(get, path = "/api/certifications/{id}", params(("id" = i64, Path)), responses((status = 200), (status = 404)))]
pub async fn certifications_show(State(state): State<AppState>, Path(id): Path<i64>) -> impl IntoResponse {
    if let Some(pool) = &state.pool {
        if let Ok(Some(row)) = sqlx::query_as::<_, CertificationListItem>("SELECT id, user_id, name, issuer, issue_date, expiration_date, credential_id, credential_url, description, does_not_expire FROM certifications WHERE id = ?")
            .bind(id)
            .fetch_optional(pool)
            .await
        {
            return json_success(row, "Certification retrieved successfully", StatusCode::OK);
        }
    }
    json_error("Certification not found", None, StatusCode::NOT_FOUND)
}

