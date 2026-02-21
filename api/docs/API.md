# API Endpoints

Base URL: `http://localhost:8080` (atau sesuai `PORT` di env).

## Public (tanpa auth)

### GET /health

Health check (liveness).

| | |
|---|---|
| **Response** | `200 OK` |
| **Body** | `{"status":"ok"}` |
| **Content-Type** | `application/json` |

Method selain GET → `405 Method Not Allowed`.

---

### GET /status

Status server: uptime dan status database.

| | |
|---|---|
| **Response** | `200 OK` |
| **Body** | `{"status":"ok","uptime_seconds":<int64>,"database":"ok"\|"disabled"\|"error"}` |
| **Content-Type** | `application/json` |

Method selain GET → `405 Method Not Allowed`.

---

### POST /login

Login admin; mengembalikan JWT.

| | |
|---|---|
| **Request body** | `{"username":"<string>","password":"<string>"}` |
| **Content-Type** | `application/json` |
| **Success** | `200 OK` → `{"token":"<jwt>"}` |
| **Invalid credentials** | `401 Unauthorized` |
| **Login not configured** | `503 Service Unavailable` (env kosong) |
| **Invalid body** | `400 Bad Request` |

Method selain POST → `405 Method Not Allowed`.

---

### GET /api/skills

Daftar skills (dari database). Jika DB tidak dikonfigurasi atau gagal → `503 Service Unavailable`.

| | |
|---|---|
| **Response** | `200 OK` |
| **Body** | `{"skills":[{"id":<int64>,"category_id":<int>,"name":"...","level":"...","icon_url":"..."\|null,"category":"..."}]}` |
| **Content-Type** | `application/json` |

Method selain GET → `405 Method Not Allowed`.

---

## Protected (perlu JWT)

### GET /admin

Area admin. Memerlukan header:

```
Authorization: Bearer <token>
```

| | |
|---|---|
| **Success** | `200 OK` → `{"message":"Admin area"}` |
| **Missing/invalid token** | `401 Unauthorized` |
| **Auth not configured** | `503 Service Unavailable` |

Method selain GET → `405 Method Not Allowed`.

---

## CORS

Jika env `ALLOW_ORIGIN` di-set (mis. `https://frontend.example.com`), server menambah header:

- `Access-Control-Allow-Origin: <ALLOW_ORIGIN>`
- `Access-Control-Allow-Methods: GET, POST, OPTIONS`
- `Access-Control-Allow-Headers: Content-Type, Authorization`

Request `OPTIONS` dijawab dengan `204 No Content`.

## Security headers

Middleware menambah header ke semua response (mis. `X-Content-Type-Options`, `X-Frame-Options`). Detail lihat `internal/middleware/`.
