# Diagram dan ERD Proyek Portfolio

Dokumen ini memuat **diagram lengkap** untuk proyek portfolio: arsitektur sistem, Entity Relationship Diagram (ERD), diagram urutan (sequence), flowchart, diagram state, dan diagram class. Semua diagram dalam format **Mermaid** agar mudah di-render dan dirawat.

**Daftar isi**

1. [Arsitektur Sistem](#1-arsitektur-sistem)
2. [Entity Relationship Diagram (ERD)](#2-entity-relationship-diagram-erd)
3. [Diagram Urutan (Sequence)](#3-diagram-urutan-sequence)
4. [Flowchart Alur Bisnis](#4-flowchart-alur-bisnis)
5. [Diagram State](#5-diagram-state)
6. [Diagram Class (Ringkas)](#6-diagram-class-ringkas)
7. [Referensi Dokumen](#7-referensi-dokumen)

---

## 1. Arsitektur Sistem

### 1.1 Konteks Sistem (Klien – API – Database)

Siapa mengakses apa: pengunjung lewat web (GET publik), admin lewat panel dengan token.

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

### 1.2 Arsitektur Lapisan (Layered)

```mermaid
flowchart TB
  subgraph presentation [Lapisan Presentasi]
    Web[portfolio-web]
    Admin[portfolio-admin]
  end

  subgraph api_layer [Lapisan API]
    API[portfolio-api<br/>REST / Lumen]
  end

  subgraph data [Lapisan Data]
    DB[(MySQL/MariaDB)]
  end

  Web --> API
  Admin --> API
  API --> DB
```

### 1.3 Deploy (Container)

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

Detail: [ARSITEKTUR.md](ARSITEKTUR.md), [../DEPLOY.md](../DEPLOY.md).

---

## 2. Entity Relationship Diagram (ERD)

Model data di database (MySQL/MariaDB) yang dipakai oleh portfolio-api. Tabel pivot: `user_skills`, `project_skills`, `post_tags`.

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
    text excerpt
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

Sumber kebenaran relasi: [portfolio-api/app/Models/](../portfolio-api/app/Models/).

---

## 3. Diagram Urutan (Sequence)

### 3.1 Login Admin

```mermaid
sequenceDiagram
  participant Admin as Admin (Browser)
  participant AdminApp as portfolio-admin
  participant API as portfolio-api
  participant DB as Database

  Admin->>AdminApp: Masukkan username & password
  AdminApp->>API: POST /api/login { username, password }
  API->>DB: Cek user, verifikasi password
  DB-->>API: Data user
  API-->>AdminApp: 200 { token, user }
  AdminApp->>AdminApp: setToken(), setCurrentUser()
  AdminApp->>Admin: Redirect / dashboard
```

### 3.2 Pengunjung Mengirim Form Kontak

```mermaid
sequenceDiagram
  participant Visitor as Pengunjung
  participant Web as portfolio-web
  participant API as portfolio-api
  participant DB as Database

  Visitor->>Web: Isi form (name, email, subject, message)
  Web->>Web: Validasi (client-side)
  Web->>API: POST /api/contact { name, email, subject, message }
  Note over API: Rate limit cek
  API->>DB: INSERT contact_messages
  DB-->>API: OK
  API-->>Web: 201 { message }
  Web-->>Visitor: Tampilkan sukses
```

### 3.3 Admin Mempublikasikan Blog Post

```mermaid
sequenceDiagram
  participant Admin as Admin
  participant AdminApp as portfolio-admin
  participant API as portfolio-api
  participant DB as Database

  Admin->>AdminApp: Edit post, set is_published = true, Simpan
  AdminApp->>API: PUT /api/blog-posts/{id} + Bearer token
  API->>API: Verifikasi token
  API->>DB: UPDATE blog_posts SET is_published=1, published_at=...
  DB-->>API: OK
  API-->>AdminApp: 200 { data }
  AdminApp-->>Admin: Toast sukses, tutup form
```

### 3.4 Pengunjung Melihat Daftar Blog (Publik)

```mermaid
sequenceDiagram
  participant Visitor as Pengunjung
  participant Web as portfolio-web
  participant API as portfolio-api
  participant DB as Database

  Visitor->>Web: Buka /blog
  Web->>API: GET /api/blog-posts?per_page=10 (tanpa token)
  API->>API: auth()->check() = false
  API->>DB: SELECT * WHERE is_published = 1
  DB-->>API: Rows
  API-->>Web: 200 { data, total }
  Web-->>Visitor: Render daftar post
```

Detail perilaku publik vs admin: [PUBLIKASI_WEB.md](PUBLIKASI_WEB.md), [ALUR_KONTEN_POST.md](ALUR_KONTEN_POST.md).

---

## 4. Flowchart Alur Bisnis

### 4.1 Alur Publikasi (Siapa Melihat Apa)

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

### 4.2 Alur Admin: Login dan Auto-fill Konten

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

### 4.3 Alur Pengunjung (User Flow Situs Publik)

```mermaid
flowchart TD
  A[Pengunjung masuk] --> B[Lihat Hero / Home]
  B --> C[Scroll: Timeline Pengalaman]
  C --> D[Klik Lihat Proyek]
  D --> E[Halaman Proyek - Grid]
  E --> F[Hover: lihat tech stack]
  F --> G[Klik Detail Proyek]
  G --> H[Baca detail]
  H --> I{Tertarik?}
  I -->|Ya| J[Scroll ke Footer]
  J --> K[Klik LinkedIn / Isi Form Kontak]
  I -->|Lanjut baca| L[Blog / Sertifikasi]
  L --> J
```

### 4.4 Alur Admin CRUD (Contoh: Blog Post)

```mermaid
flowchart TD
  A[Admin login] --> B[Dashboard]
  B --> C[Menu: Blog Posts]
  C --> D[List dengan filter]
  D --> E{Tindakan?}
  E -->|Tambah| F[Form Create - user_id auto]
  E -->|Kebab: Edit| G[Form Edit]
  E -->|Kebab: Duplicate| H[Form Create dengan data copy]
  E -->|Kebab: Hapus| I[Konfirmasi → DELETE]
  F --> J[Simpan → POST]
  G --> K[Simpan → PUT]
  J --> D
  K --> D
  I --> D
```

---

## 5. Diagram State

### 5.1 Status Blog Post dan Project (Published / Draft)

```mermaid
stateDiagram-v2
  [*] --> Draft: Buat baru
  Draft --> Published: Admin set is_published = true
  Published --> Draft: Admin set is_published = false
  Draft --> [*]: Hapus
  Published --> [*]: Hapus
```

- **Draft:** Tidak tampil di situs publik (GET tanpa token → 404 untuk by-id).
- **Published:** Tampil di daftar dan detail untuk pengunjung.

### 5.2 Status Pesan Kontak (Read / Unread)

```mermaid
stateDiagram-v2
  [*] --> Unread: Pesan masuk (POST contact)
  Unread --> Read: Admin "Mark as Read" / buka detail
  Read --> Unread: Tidak berlaku (satu arah)
```

- **Unread:** Ditandai di list (bold/background), badge notifikasi di header admin.
- **Read:** Setelah admin membuka atau klik "Mark as Read".

---

## 6. Diagram Class (Ringkas)

Ringkasan entitas domain utama dan relasi (berbasis model API/database). Untuk implementasi lengkap lihat model Eloquent di `portfolio-api/app/Models/`.

```mermaid
classDiagram
  class User {
    +int id
    +string full_name
    +string headline
    +string username
    +string email_public
    +hasMany experiences
    +hasMany educations
    +hasMany projects
    +hasMany blog_posts
    +belongsToMany skills
    +hasMany contact_messages
  }

  class Experience {
    +int id
    +int user_id
    +string company_name
    +string position_title
    +belongsTo user
  }

  class Education {
    +int id
    +int user_id
    +string institution_name
    +string degree
    +belongsTo user
  }

  class Project {
    +int id
    +int user_id
    +string title
    +string slug
    +boolean is_published
    +belongsTo user
    +belongsToMany skills
  }

  class BlogPost {
    +int id
    +int user_id
    +string title
    +string slug
    +boolean is_published
    +belongsTo user
    +belongsToMany tags
  }

  class SkillCategory {
    +int id
    +string name
    +hasMany skills
  }

  class Skill {
    +int id
    +int skill_category_id
    +string name
    +belongsTo category
    +belongsToMany users
    +belongsToMany projects
  }

  class ContactMessage {
    +int id
    +int user_id
    +string name
    +string email
    +boolean is_read
    +belongsTo user
  }

  class Tag {
    +int id
    +string name
    +string slug
  }

  User "1" --> "*" Experience
  User "1" --> "*" Education
  User "1" --> "*" Project
  User "1" --> "*" BlogPost
  User "1" --> "*" ContactMessage
  User "*" --> "*" Skill : user_skills
  Project "*" --> "*" Skill : project_skills
  BlogPost "*" --> "*" Tag : post_tags
  SkillCategory "1" --> "*" Skill
```

---

## 7. Referensi Dokumen

| Dokumen | Isi |
|--------|-----|
| [ARSITEKTUR.md](ARSITEKTUR.md) | Arsitektur stack, komponen, akses publik vs admin. |
| [SRS-PORTFOLIO.md](SRS-PORTFOLIO.md) | Kebutuhan fungsional (FR) dan non-fungsional (NFR). |
| [PUBLIKASI_WEB.md](PUBLIKASI_WEB.md) | Perilaku endpoint blog-posts dan projects (publik vs admin). |
| [PERANCANGAN_ADMIN.md](PERANCANGAN_ADMIN.md) | Fitur admin: login, current user, relasi form/list, menu. |
| [ALUR_KONTEN_POST.md](ALUR_KONTEN_POST.md) | Alur konten blog dari admin hingga tampil di web. |
| [../DEPLOY.md](../DEPLOY.md) | Deploy dengan Podman/Docker Compose. |
