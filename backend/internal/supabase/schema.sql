-- Users table
CREATE TABLE users (
    id              UUID DEFAULT gen_random_uuid() PRIMARY KEY NOT NULL,
    email           TEXT NOT NULL UNIQUE,
    hashed_password TEXT NOT NULL,
    created_at      TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TABLE gifts (
    id         UUID DEFAULT gen_random_uuid() PRIMARY KEY NOT NULL,
    user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    idea       TEXT NOT NULL,
    price      NUMERIC(10, 2),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);