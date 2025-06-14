-- name: InsertUser :one
INSERT INTO users (email, hashed_password)
VALUES ($1, $2)
    RETURNING id;

-- name: GetUserAuth :one
SELECT id, hashed_password
FROM users
WHERE email = $1;

-- name: GetUserByID :one
SELECT id, email, created_at
FROM users
WHERE id = $1;
