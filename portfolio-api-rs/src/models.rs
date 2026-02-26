//! Model baris DB dan DTO input — selaras ERD & migration Lumen.
//! Row/Input structs reserved for future CRUD; allow dead_code until used.

#![allow(dead_code)]

use serde::{Deserialize, Serialize};
use sqlx::FromRow;

// ----- Users -----
#[derive(Debug, Clone, Serialize, FromRow)]
pub struct UserRow {
    pub id: i64,
    pub full_name: String,
    pub headline: Option<String>,
    pub bio: Option<String>,
    pub email_public: Option<String>,
    pub location: Option<String>,
    pub profile_image_url: Option<String>,
    pub username: Option<String>,
}

#[derive(Deserialize)]
pub struct UserInput {
    pub full_name: Option<String>,
    pub headline: Option<String>,
    pub bio: Option<String>,
    pub email_public: Option<String>,
    pub location: Option<String>,
    pub profile_image_url: Option<String>,
    pub username: Option<String>,
    pub password: Option<String>,
}

// ----- Experiences -----
#[derive(Debug, Clone, Serialize, FromRow)]
pub struct ExperienceRow {
    pub id: i64,
    pub user_id: i64,
    pub company_name: String,
    pub position_title: String,
    pub location: Option<String>,
    pub start_date: Option<chrono::NaiveDate>,
    pub end_date: Option<chrono::NaiveDate>,
    pub is_current: bool,
    pub description: Option<String>,
}

#[derive(Deserialize)]
pub struct ExperienceInput {
    pub user_id: Option<i64>,
    pub company_name: Option<String>,
    pub position_title: Option<String>,
    pub location: Option<String>,
    pub start_date: Option<String>,
    pub end_date: Option<String>,
    pub is_current: Option<bool>,
    pub description: Option<String>,
}

// ----- Educations -----
#[derive(Debug, Clone, Serialize, FromRow)]
pub struct EducationRow {
    pub id: i64,
    pub user_id: i64,
    pub institution_name: String,
    pub degree: Option<String>,
    pub field_of_study: Option<String>,
    pub location: Option<String>,
    pub start_date: Option<chrono::NaiveDate>,
    pub end_date: Option<chrono::NaiveDate>,
    pub is_current: bool,
    pub description: Option<String>,
}

#[derive(Deserialize)]
pub struct EducationInput {
    pub user_id: Option<i64>,
    pub institution_name: Option<String>,
    pub degree: Option<String>,
    pub field_of_study: Option<String>,
    pub location: Option<String>,
    pub start_date: Option<String>,
    pub end_date: Option<String>,
    pub is_current: Option<bool>,
    pub description: Option<String>,
}

// ----- Skill categories -----
#[derive(Debug, Clone, Serialize, FromRow)]
pub struct SkillCategoryRow {
    pub id: i64,
    pub name: String,
    pub slug: Option<String>,
    pub description: Option<String>,
    pub sort_order: i32,
}

#[derive(Deserialize)]
pub struct SkillCategoryInput {
    pub name: Option<String>,
    pub slug: Option<String>,
    pub description: Option<String>,
    pub sort_order: Option<i32>,
}

// ----- Skills -----
#[derive(Debug, Clone, Serialize, FromRow)]
pub struct SkillRow {
    pub id: i64,
    pub skill_category_id: Option<i64>,
    pub name: String,
    pub slug: Option<String>,
    pub level: Option<String>,
    pub description: Option<String>,
    pub sort_order: i32,
}

#[derive(Deserialize)]
pub struct SkillInput {
    pub skill_category_id: Option<i64>,
    pub name: Option<String>,
    pub slug: Option<String>,
    pub level: Option<String>,
    pub description: Option<String>,
    pub sort_order: Option<i32>,
}

// ----- User skills (pivot) -----
#[derive(Debug, Clone, Serialize, FromRow)]
pub struct UserSkillRow {
    pub id: i64,
    pub user_id: i64,
    pub skill_id: i64,
    pub proficiency_level: Option<i16>,
    pub years_experience: Option<i16>,
    pub is_primary: bool,
}

#[derive(Deserialize)]
pub struct UserSkillInput {
    pub user_id: Option<i64>,
    pub skill_id: Option<i64>,
    pub proficiency_level: Option<i16>,
    pub years_experience: Option<i16>,
    pub is_primary: Option<bool>,
}

// ----- Projects -----
#[derive(Debug, Clone, Serialize, FromRow)]
pub struct ProjectRow {
    pub id: i64,
    pub user_id: i64,
    pub title: String,
    pub slug: Option<String>,
    pub short_description: Option<String>,
    pub description: Option<String>,
    pub start_date: Option<chrono::NaiveDate>,
    pub end_date: Option<chrono::NaiveDate>,
    pub is_current: bool,
    pub thumbnail_url: Option<String>,
    pub url: Option<String>,
    pub repository_url: Option<String>,
    pub is_featured: bool,
    pub is_published: bool,
    pub published_at: Option<chrono::NaiveDateTime>,
    pub sort_order: i32,
}

#[derive(Deserialize)]
pub struct ProjectInput {
    pub user_id: Option<i64>,
    pub title: Option<String>,
    pub slug: Option<String>,
    pub short_description: Option<String>,
    pub description: Option<String>,
    pub start_date: Option<String>,
    pub end_date: Option<String>,
    pub is_current: Option<bool>,
    pub thumbnail_url: Option<String>,
    pub url: Option<String>,
    pub repository_url: Option<String>,
    pub is_featured: Option<bool>,
    pub is_published: Option<bool>,
    pub published_at: Option<String>,
    pub sort_order: Option<i32>,
}

// ----- Project skills (pivot) -----
#[derive(Debug, Clone, Serialize, FromRow)]
pub struct ProjectSkillRow {
    pub id: i64,
    pub project_id: i64,
    pub skill_id: i64,
    pub sort_order: i32,
}

#[derive(Deserialize)]
pub struct ProjectSkillInput {
    pub project_id: Option<i64>,
    pub skill_id: Option<i64>,
    pub sort_order: Option<i32>,
}

// ----- Blog posts -----
#[derive(Debug, Clone, Serialize, FromRow)]
pub struct BlogPostRow {
    pub id: i64,
    pub user_id: i64,
    pub title: String,
    pub slug: Option<String>,
    pub excerpt: Option<String>,
    pub content: Option<String>,
    pub cover_image_url: Option<String>,
    pub is_published: bool,
    pub published_at: Option<chrono::NaiveDateTime>,
}

#[derive(Deserialize)]
pub struct BlogPostInput {
    pub user_id: Option<i64>,
    pub title: Option<String>,
    pub slug: Option<String>,
    pub excerpt: Option<String>,
    pub content: Option<String>,
    pub cover_image_url: Option<String>,
    pub is_published: Option<bool>,
    pub published_at: Option<String>,
}

// ----- Tags -----
#[derive(Debug, Clone, Serialize, FromRow)]
pub struct TagRow {
    pub id: i64,
    pub name: String,
    pub slug: Option<String>,
    pub color: Option<String>,
}

#[derive(Deserialize)]
pub struct TagInput {
    pub name: Option<String>,
    pub slug: Option<String>,
    pub color: Option<String>,
}

// ----- Post tags (pivot) -----
#[derive(Debug, Clone, Serialize, FromRow)]
pub struct PostTagRow {
    pub id: i64,
    pub blog_post_id: i64,
    pub tag_id: i64,
}

#[derive(Deserialize)]
pub struct PostTagInput {
    pub blog_post_id: Option<i64>,
    pub tag_id: Option<i64>,
}

// ----- Certifications -----
#[derive(Debug, Clone, Serialize, FromRow)]
pub struct CertificationRow {
    pub id: i64,
    pub user_id: i64,
    pub name: String,
    pub issuer: Option<String>,
    pub issue_date: Option<chrono::NaiveDate>,
    pub expiration_date: Option<chrono::NaiveDate>,
    pub credential_id: Option<String>,
    pub credential_url: Option<String>,
    pub description: Option<String>,
    pub does_not_expire: bool,
}

#[derive(Deserialize)]
pub struct CertificationInput {
    pub user_id: Option<i64>,
    pub name: Option<String>,
    pub issuer: Option<String>,
    pub issue_date: Option<String>,
    pub expiration_date: Option<String>,
    pub credential_id: Option<String>,
    pub credential_url: Option<String>,
    pub description: Option<String>,
    pub does_not_expire: Option<bool>,
}

// ----- Contact messages -----
#[derive(Debug, Clone, Serialize, FromRow)]
pub struct ContactMessageRow {
    pub id: i64,
    pub user_id: Option<i64>,
    pub name: String,
    pub email: String,
    pub subject: Option<String>,
    pub message: Option<String>,
    pub is_read: bool,
}

#[derive(Deserialize)]
pub struct ContactMessageInput {
    pub user_id: Option<i64>,
    pub name: Option<String>,
    pub email: Option<String>,
    pub subject: Option<String>,
    pub message: Option<String>,
    pub is_read: Option<bool>,
}
