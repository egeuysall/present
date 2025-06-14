-- name: GetGiftsByUser :many
SELECT * FROM gifts
WHERE user_id = $1
ORDER BY created_at DESC;

-- name: GetGiftByID :one
SELECT * FROM gifts
WHERE id = $1 AND user_id = $2;

-- name: CreateGift :exec
INSERT INTO gifts (user_id, idea, price)
VALUES ($1, $2, $3);

-- name: UpdateGiftByID :exec
UPDATE gifts
SET
    idea = COALESCE($2, idea),
    price = COALESCE($3, price),
    updated_at = now()
WHERE id = $1 AND user_id = $4;

-- name: DeleteGiftByID :exec
DELETE FROM gifts
WHERE id = $1 AND user_id = $2;
