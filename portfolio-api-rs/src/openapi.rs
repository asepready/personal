//! OpenAPI 3 spec (utoipa) — selaras dengan standar dokumentasi portfolio-api.
//! Swagger UI dilayani di /docs; spesifikasi di /docs/openapi.json.

use utoipa::OpenApi;

#[derive(OpenApi)]
#[openapi(
    info(
        title = "Personal Portfolio API",
        version = "0.1.0",
        description = "REST API for personal portfolio (Axum/Rust). Public read (GET) and POST /api/contact do not require auth. Mutating operations and contact-messages require Authorization Bearer token (admin)."
    ),
    servers(
        (url = "http://localhost:8000", description = "Development"),
        (url = "https://domainanda.com", description = "Production")
    ),
    tags(
        (name = "Health", description = "Health & version"),
        (name = "Users", description = "Profile users"),
        (name = "Auth", description = "Login (Bearer token)"),
        (name = "Public Contact", description = "Public contact form (no auth)"),
        (name = "Experiences", description = "Pengalaman kerja"),
        (name = "Educations", description = "Pendidikan"),
        (name = "Skill Categories", description = "Kategori skill"),
        (name = "Skills", description = "Skills"),
        (name = "Projects", description = "Proyek (filter is_published tanpa auth)"),
        (name = "Blog Posts", description = "Blog (filter is_published tanpa auth)"),
        (name = "Tags", description = "Tags"),
        (name = "Certifications", description = "Sertifikasi")
    ),
    paths(
        crate::handlers::root,
        crate::handlers::users_index,
        crate::handlers::users_show,
        crate::handlers::contact_create,
        crate::handlers::login_post,
        crate::handlers::experiences_index,
        crate::handlers::experiences_show,
        crate::handlers::educations_index,
        crate::handlers::educations_show,
        crate::handlers::skill_categories_index,
        crate::handlers::skill_categories_show,
        crate::handlers::skills_index,
        crate::handlers::skills_show,
        crate::handlers::projects_index,
        crate::handlers::projects_show,
        crate::handlers::blog_posts_index,
        crate::handlers::blog_posts_show,
        crate::handlers::tags_index,
        crate::handlers::tags_show,
        crate::handlers::certifications_index,
        crate::handlers::certifications_show
    )
)]
pub struct ApiDoc;

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn openapi_spec_has_info_title_and_version() {
        let spec = ApiDoc::openapi();
        assert_eq!(spec.info.title, "Personal Portfolio API");
        assert_eq!(spec.info.version, "0.1.0");
    }

    #[test]
    fn openapi_spec_has_expected_paths() {
        let spec = ApiDoc::openapi();
        let json = serde_json::to_value(&spec).unwrap();
        let paths = json.get("paths").expect("paths");
        assert!(paths.get("/").is_some(), "harus ada GET /");
        assert!(paths.get("/api/users").is_some(), "harus ada GET /api/users");
        assert!(
            paths.get("/api/users/{id}").is_some(),
            "harus ada GET /api/users/{{id}}"
        );
        assert!(paths.get("/api/contact").is_some(), "harus ada POST /api/contact");
    }

    #[test]
    fn openapi_spec_has_servers() {
        let spec = ApiDoc::openapi();
        let json = serde_json::to_value(&spec).unwrap();
        let servers = json.get("servers").expect("servers").as_array().unwrap();
        assert!(!servers.is_empty());
        assert!(servers
            .iter()
            .any(|s| s.get("url").and_then(|u| u.as_str()).unwrap_or("").contains("localhost")));
    }
}
