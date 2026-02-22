# API Endpoints

Base URL: `http://localhost:8081` (atau sesuai `PORT` di env). Semua response JSON; error berupa `{"error":"<pesan>"}`.

**Dokumentasi interaktif (Swagger UI):** [http://localhost:8081/api/docs](http://localhost:8081/api/docs) (atau `http://<ip-atau-host>/api/docs`).

---

## Daftar ringkas

Semua endpoint memakai prefix **`/api/`** (public) atau **`/api/admin/`** (protected).

| Method              | Path                          | Auth       | Keterangan                     |
| ------------------- | ----------------------------- | ---------- | ------------------------------ |
| GET                 | `/api/health`                 | —          | Health check                   |
| GET                 | `/api/status`                 | —          | Uptime + status DB             |
| POST                | `/api/login`                  | —          | Login admin → JWT                                   |
| GET                 | `/api/skills`                 | —          | Daftar skills                                        |
| GET                 | `/api/projects`               | —          | Daftar proyek                                        |
| GET                 | `/api/projects/:slug`         | —          | Detail proyek by slug                                |
| GET                 | `/api/posts`                  | —          | Daftar post (published)                              |
| GET                 | `/api/posts/:slug`            | —          | Detail post by slug                                  |
| GET                 | `/api/admin`                  | Bearer JWT | Overview admin                                       |
| GET                 | `/api/admin/resources`        | Bearer JWT | Schema resource CMS (list + form fields)             |
| GET/POST/PUT/DELETE | `/api/admin/skill-categories` | Bearer JWT | CRUD kategori skill                                  |
| GET/POST/PUT/DELETE | `/api/admin/skills`           | Bearer JWT | CRUD skills                                          |
| GET/POST/PUT/DELETE | `/api/admin/tools`            | Bearer JWT | CRUD tools                                           |
| GET/POST/PUT/DELETE | `/api/admin/tags`             | Bearer JWT | CRUD tags                                            |
| GET/POST/PUT/DELETE | `/api/admin/projects`         | Bearer JWT | CRUD projects                                        |
| GET/POST/PUT/DELETE | `/api/admin/posts`            | Bearer JWT | CRUD posts                                           |

Untuk admin **GET by ID** (satu item): `GET /api/admin/tools/:id`, `GET /api/admin/tags/:id`, `GET /api/admin/projects/:id`, `GET /api/admin/posts/:id`.  
**DELETE** pakai query: `DELETE /api/admin/...?id=<id>`.

---

## Public (tanpa auth)

### GET /api/health

Health check (liveness).

|              |                   |
| ------------ | ----------------- |
| **Response** | `200 OK`          |
| **Body**     | `{"status":"ok"}` |

Method lain → `405 Method Not Allowed`.

---

### GET /api/status

Status server: uptime dan status database.

|              |                                                                                 |
| ------------ | ------------------------------------------------------------------------------- |
| **Response** | `200 OK`                                                                        |
| **Body**     | `{"status":"ok","uptime_seconds":<int64>,"database":"ok"\|"disabled"\|"error"}` |

Method lain → `405 Method Not Allowed`.

---

### POST /api/login

Login admin; mengembalikan JWT.

|                          |                                                 |
| ------------------------ | ----------------------------------------------- |
| **Request**              | `Content-Type: application/json`                |
| **Body**                 | `{"username":"<string>","password":"<string>"}` |
| **Success**              | `200 OK` → `{"token":"<jwt>"}`                  |
| **Invalid credentials**  | `401 Unauthorized` → `{"error":"..."}`          |
| **Login not configured** | `503 Service Unavailable`                       |
| **Invalid body**         | `400 Bad Request`                               |

Method lain → `405 Method Not Allowed`. Token JWT berlaku 7 hari.

---

### GET /api/skills

Daftar skills (dari database). Jika DB tidak dikonfigurasi atau gagal → `503`.

|              |                                                                                                                      |
| ------------ | -------------------------------------------------------------------------------------------------------------------- |
| **Response** | `200 OK`                                                                                                             |
| **Body**     | `{"skills":[{"id":<int64>,"category_id":<int>,"name":"...","level":"...","icon_url":"..."\|null,"category":"..."}]}` |

Method lain → `405 Method Not Allowed`.

---

### GET /api/projects

Daftar proyek (dengan tools). Jika DB tidak ada/gagal → `503`.

|              |                                                                                                                                                                        |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Response** | `200 OK`                                                                                                                                                               |
| **Body**     | `{"projects":[{"id":<int64>,"title":"...","slug":"...","role","problem","solution","result","diagram_url","is_featured", "created_at","updated_at","tools":[{...}]}]}` |

Method lain → `405 Method Not Allowed`.

---

### GET /api/projects/:slug

Detail satu proyek by slug. Slug di path (URL-encoded).

|               |                                    |
| ------------- | ---------------------------------- |
| **Success**   | `200 OK` → objek project + `tools` |
| **Not found** | `404 Not Found`                    |

Method lain → `405 Method Not Allowed`.

---

### GET /api/posts

Daftar post **published** (status published + published_at tidak null). Jika DB tidak ada/gagal → `503`.

|              |                                                                                               |
| ------------ | --------------------------------------------------------------------------------------------- |
| **Response** | `200 OK`                                                                                      |
| **Body**     | `{"posts":[{"id":<int64>,"title":"...","slug":"...","excerpt":"...","type","published_at"}]}` |

Method lain → `405 Method Not Allowed`.

---

### GET /api/posts/:slug

Detail satu post by slug (published only). Slug di path (URL-encoded).

|               |                                            |
| ------------- | ------------------------------------------ |
| **Success**   | `200 OK` → objek post (termasuk `content`) |
| **Not found** | `404 Not Found`                            |

Method lain → `405 Method Not Allowed`.

---

## Protected (Bearer JWT)

Semua endpoint di bawah memerlukan header:

```
Authorization: Bearer <token>
```

Tanpa token / token invalid → `401 Unauthorized`. Auth tidak dikonfigurasi → `503`.

---

### GET /api/admin

Overview area admin.

|              |                                       |
| ------------ | ------------------------------------- |
| **Response** | `200 OK` → `{"message":"Admin area"}` |

Method lain → `405 Method Not Allowed`.

---

### GET /api/admin/resources

Schema resource untuk admin dinamis (CMS): daftar resource beserta `list_fields` dan `form_fields` untuk render tabel & form.

|              |                                                                                                           |
| ------------ | --------------------------------------------------------------------------------------------------------- |
| **Response** | `200 OK` → `{"resources":[{ "id","label","list_fields","form_fields","primary_key","display_key" },...]}` |

Resource id: `skill-categories`, `skills`, `tools`, `tags`, `projects`, `posts`. Method lain → `405`.

---

### /api/admin/skill-categories — CRUD kategori skill

- **GET** — List: `200 OK` → `{"categories":[{"id","name","slug","sort_order"},...]}`
- **POST** — Body: `{"name","slug","sort_order"}`. Wajib: name, slug. → `201 Created` → `{"id", "name", "slug", "sort_order"}`
- **PUT** — Body: `{"id","name","slug","sort_order"}`. → `200 OK` atau `404 Not Found`
- **DELETE** — Query: `?id=<int>`. → `200 OK` → `{"deleted":<id>}` atau `404`

DB tidak dikonfigurasi → `503`. Body invalid / field wajib kosong → `400`.

---

### /api/admin/skills — CRUD skills

- **GET** — List: `200 OK` → `{"skills":[{"id","category_id","name","level","icon_url", "category"},...]}`
- **POST** — Body: `{"category_id","name","level","icon_url"}`. Wajib: category_id, name, level. → `201 Created`
- **PUT** — Body: `{"id","category_id","name","level","icon_url"}`. → `200 OK` atau `404`
- **DELETE** — Query: `?id=<int>`. → `200 OK` → `{"deleted":<id>}` atau `404`

---

### /api/admin/tools — CRUD tools

- **GET** — List: `200 OK` → `{"tools":[{"id","name","slug","logo_url"},...]}`
- **GET /api/admin/tools/:id** — Satu item: `200 OK` atau `404`
- **POST** — Body: `{"name","slug","logo_url"}`. Wajib: name, slug. → `201 Created`
- **PUT** — Body: `{"id","name","slug","logo_url"}`. → `200 OK` atau `404`
- **DELETE** — Query: `?id=<int>`. → `200 OK` → `{"deleted":<id>}` atau `404`

---

### /api/admin/tags — CRUD tags

- **GET** — List: `200 OK` → `{"tags":[{"id","name","slug"},...]}`
- **GET /api/admin/tags/:id** — Satu item: `200 OK` atau `404`
- **POST** — Body: `{"name","slug"}`. Wajib: name, slug. → `201 Created`
- **PUT** — Body: `{"id","name","slug"}`. → `200 OK` atau `404`
- **DELETE** — Query: `?id=<int>`. → `200 OK` → `{"deleted":<id>}` atau `404`

---

### /api/admin/projects — CRUD projects

- **GET** — List: `200 OK` → `{"projects":[{"id","title","slug","role","problem","solution","result","diagram_url","is_featured","created_at","updated_at","tool_ids"},...]}`
- **GET /api/admin/projects/:id** — Satu item (dengan `tool_ids`): `200 OK` atau `404`
- **POST** — Body: `{"title","slug","role","problem","solution","result","diagram_url","is_featured","tool_ids":[]}`. Wajib: title, slug. → `201 Created`
- **PUT** — Body: sama + `id`. Wajib: id, title, slug. → `200 OK` atau `404`
- **DELETE** — Query: `?id=<int>`. → `200 OK` → `{"deleted":<id>}` atau `404`

---

### /api/admin/posts — CRUD posts

- **GET** — List: `200 OK` → `{"posts":[{"id","title","slug","content","type","status","published_at","created_at","tag_ids"},...]}`
- **GET /api/admin/posts/:id** — Satu item (dengan `tag_ids`): `200 OK` atau `404`
- **POST** — Body: `{"title","slug","content","type","status","published_at","tag_ids":[]}`. Wajib: title, slug. status default "draft". published_at format ISO date (YYYY-MM-DD). → `201 Created`
- **PUT** — Body: sama + `id`. → `200 OK` atau `404`
- **DELETE** — Query: `?id=<int>`. → `200 OK` → `{"deleted":<id>}` atau `404`

---

## CORS

Jika env `ALLOW_ORIGIN` di-set (mis. `https://frontend.example.com`), server menambah header:

- `Access-Control-Allow-Origin: <ALLOW_ORIGIN>`
- `Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS`
- `Access-Control-Allow-Headers: Content-Type, Authorization`

Nilai `*` tidak dipakai (aman production). Request **OPTIONS** dijawab `204 No Content` bila origin diizinkan.

---

## Security headers

Middleware menambah header ke semua response: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy`, `Strict-Transport-Security` (bila HTTPS), `Content-Security-Policy`, serta menghapus `X-Powered-By` dan mengosongkan `Server`. Detail: `internal/middleware/`.
