# Diagram dan ERD Proyek Portfolio

Dokumen ini memuat diagram arsitektur, Entity Relationship Diagram (ERD) database, dan diagram alur yang dipakai di dokumentasi proyek.

---

## 1. Arsitektur stack (alur klien – API)

Diagram ini menggambarkan siapa mengakses apa: pengunjung lewat web (GET publik), admin lewat panel dengan token.

```mermaid
flowchart LR
  subgraph client [Klien]
    Visitor[Pengunjung]
    AdminUser[Admin]
  end

  subgraph apps [Aplikasi]
    Web[portfolio-web]
    Admin[portfolio-admin]
  end

  subgraph backend [Backend]
    API[portfolio-api]
    DB[(Database)]
  end

  Visitor --> Web
  AdminUser --> Admin
  Web -->|"GET publik"| API
  Admin -->|"GET + mutasi, Bearer token"| API
  API --> DB
```

Detail: [ARSITEKTUR.md](ARSITEKTUR.md).

---

## 2. Entity Relationship Diagram (ERD)

Model data di database (MySQL/MariaDB) yang dipakai oleh portfolio-api. Tabel pivot: `user_skills` (User–Skill), `project_skills` (Project–Skill), `post_tags` (BlogPost–Tag).

```mermaid
erDiagram
  users ||--o{ experiences : "user_id"
  users ||--o{ educations : "user_id"
  users ||--o{ projects : "user_id"
  users ||--o{ blog_posts : "user_id"
  users ||--o{ certifications : "user_id"
  users ||--o{ contact_messages : "user_id"
  users }o--o{ skills : "user_skills"
  skill_categories ||--o{ skills : "skill_category_id"
  projects }o--o{ skills : "project_skills"
  blog_posts }o--o{ tags : "post_tags"

  users {
    int id PK
    string full_name
    string headline
    string username
    string email_public
    string location
    string profile_image_url
    string api_token
  }

  experiences {
    int id PK
    int user_id FK
    string company_name
    string position_title
    date start_date
    date end_date
    boolean is_current
  }

  educations {
    int id PK
    int user_id FK
    string institution_name
    string degree
    string field_of_study
    date start_date
    date end_date
    boolean is_current
  }

  projects {
    int id PK
    int user_id FK
    string title
    string slug
    boolean is_published
    datetime published_at
    boolean is_featured
  }

  blog_posts {
    int id PK
    int user_id FK
    string title
    string slug
    text content
    boolean is_published
    datetime published_at
  }

  certifications {
    int id PK
    int user_id FK
    string name
    string issuer
    date issue_date
    date expiration_date
  }

  contact_messages {
    int id PK
    int user_id FK
    string name
    string email
    string subject
    text message
    boolean is_read
  }

  skill_categories {
    int id PK
    string name
    string slug
  }

  skills {
    int id PK
    int skill_category_id FK
    string name
    string slug
    string level
  }

  tags {
    int id PK
    string name
    string slug
  }

  user_skills {
    int id PK
    int user_id FK
    int skill_id FK
    string proficiency_level
    int years_experience
    boolean is_primary
  }

  project_skills {
    int id PK
    int project_id FK
    int skill_id FK
  }

  post_tags {
    int id PK
    int blog_post_id FK
    int tag_id FK
  }
```

---

## 3. Alur publikasi (publik vs admin)

Request tanpa token hanya mendapat blog posts dan projects yang `is_published = true`; dengan token admin melihat semua.

```mermaid
flowchart LR
  subgraph client [Klien]
    Public[Request tanpa token]
    Admin[Request dengan Bearer token]
  end

  subgraph api [API]
    BlogIndex[BlogPostController index/show]
    ProjectIndex[ProjectController index/show]
  end

  Public -->|"auth()->check() = false"| BlogIndex
  Admin -->|"auth()->check() = true"| BlogIndex
  BlogIndex -->|"hanya is_published=1 atau 404"| Public
  BlogIndex -->|"semua"| Admin

  Public --> ProjectIndex
  Admin --> ProjectIndex
  ProjectIndex -->|"hanya is_published=1 atau 404"| Public
  ProjectIndex -->|"semua"| Admin
```

Detail: [PUBLIKASI_WEB.md](PUBLIKASI_WEB.md).

---

## 4. Alur admin: login dan auto-fill konten

Setelah login, current user disimpan; saat buka form Tambah, field user_id terisi otomatis.

```mermaid
flowchart LR
  subgraph login [Login]
    A[Login API] --> B[Response user + token]
    B --> C[setCurrentUser + setToken]
  end

  subgraph create [Buat konten]
    D[Klik Tambah] --> E[openCreate]
    E --> F[getCurrentUser]
    F --> G[formData.user_id = currentUser.id]
  end

  login --> create
```

Detail: [PERANCANGAN_ADMIN.md](PERANCANGAN_ADMIN.md).

---

## 5. Alur deploy (container)

Stack dijalankan dengan Podman/Docker Compose: db → api → web, admin.

```mermaid
flowchart LR
  subgraph compose [Compose]
    DB[(db MariaDB)]
    API[api Lumen]
    Web[web React]
    Admin[admin React]
  end

  DB --> API
  API --> Web
  API --> Admin
```

Detail: [../DEPLOY.md](../DEPLOY.md).

---

## Referensi

| Dokumen | Isi |
|---------|-----|
| [ARSITEKTUR.md](ARSITEKTUR.md) | Arsitektur stack, komponen, akses. |
| [PUBLIKASI_WEB.md](PUBLIKASI_WEB.md) | Perilaku endpoint blog-posts dan projects. |
| [PERANCANGAN_ADMIN.md](PERANCANGAN_ADMIN.md) | Fitur admin dan alur current user. |
| [../DEPLOY.md](../DEPLOY.md) | Deploy dengan Podman/Docker. |
| [../portfolio-api/app/Models/](../portfolio-api/app/Models/) | Model Eloquent (sumber kebenaran relasi). |
