# Present
**Present** is a simple, secure gift list app that helps you plan, track, and manage gifts for any occasion. Built with a backend-first approach using Supabase and a clean Next.js frontend, Present supports user authentication, real-time updates, and budget tracking to make gift-giving organized and stress-free.

## 🔧 Stack Overview

| Component       | Technology        |
|----------------|-------------------|
| Language        | Go                |
| Framework       | Chi router        |
| DB              | Supabase Postgres |
| DB Client       | pgxpool           |
| Auth            | JWT (cookie-based)|
| Hashing         | bcrypt            |

---

## 🌐 API Endpoints

### 🔐 Auth Routes

| Method | Route       | Description                          |
|--------|-------------|--------------------------------------|
| POST   | /signup     | Create a new user, hash password     |
| POST   | /login      | Validate credentials, issue JWT      |
| GET    | /me         | Return user info using JWT cookie    |
| POST   | /signout    | Clear auth cookie                    |

### 🎁 Gift Routes

| Method | Route           | Description                        |
|--------|------------------|------------------------------------|
| GET    | /gifts           | List all gifts owned by user       |
| POST   | /gifts           | Add new gift (idea, price)         |
| GET    | /gifts/{id}      | Get a specific gift by ID          |
| PATCH  | /gifts/{id}      | Update gift idea or price          |
| DELETE | /gifts/{id}      | Delete gift                        |

### 🔎 Utility

- `GET /ping` – basic health check endpoint

---

## 🔐 Authentication Logic

- Users are authenticated via JWTs stored in `access_token` cookies.
- After `login` or `signup`, a JWT is generated and sent as an HttpOnly cookie.
- On each protected route, extract and verify the JWT from cookies.

**Cookie configuration:**

| Key            | Value        |
|----------------|--------------|
| HttpOnly       | true         |
| SameSite       | Lax or Strict|
| Secure         | true (in prod)|
| Path           | `/`          |
| Name           | `access_token` |

---

## 🛡️ Password Handling

- On `signup`, hash the password using bcrypt before storing.
- On `login`, compare the hash with the provided password using bcrypt.
- Use a strong bcrypt cost (e.g., 10–14).

---

## 🧠 JWT Claims Design

| Claim | Value                 |
|-------|-----------------------|
| `sub` | User ID (UUID)        |
| `exp` | Expiration (1 hour)   |
| `iat` | Issued at timestamp   |

JWTs are short-lived (e.g., 1 hour), and new tokens are issued on each login.

---

## 🗃️ Database (via pgxpool + Supabase)

**Users table:**

| Field     | Type      |
|-----------|-----------|
| id        | UUID (PK) |
| email     | TEXT      |
| password  | TEXT (hashed) |

**Gifts table:**

| Field     | Type      |
|-----------|-----------|
| id        | UUID (PK) |
| user_id   | UUID (FK) |
| idea      | TEXT      |
| price     | NUMERIC   |

Queries will always scope by the `user_id` extracted from JWT.

---

## 🧱 Suggested Folder Structure

```
/cmd
  /api
    main.go
/internal
  /auth         # login, signup, token generation
  /handlers     # me, gifts, ping
  /models       # user, gift
  /middleware   # jwt auth middleware
  /db           # pgxpool connection, queries
```

---

## ✅ Route Protection Logic

1. Middleware checks `access_token` in cookie.
2. If valid, extracts user ID and attaches to request context.
3. Handlers retrieve the current user ID from the context for DB queries.

---

## 🚧 Next Steps

- [ ] Set up Supabase project and get connection URL
- [ ] Implement JWT auth middleware
- [ ] Build handler stubs (signup, login, me, gifts, ping)
- [ ] Set up `pgxpool` and test DB access
- [ ] Test cookies locally with Postman or frontend

---

Let me know when you're ready to scaffold the actual route handlers (without code snippets) or want to review the database schema setup!

