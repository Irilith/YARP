CREATE TABLE IF NOT EXISTS anime_defender (
    id SERIAL PRIMARY KEY,
    key TEXT NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    computer TEXT NOT NULL,
    name TEXT NOT NULL UNIQUE,
    gem INTEGER NOT NULL DEFAULT 0,
    ticket INTEGER NOT NULL DEFAULT 0,
    gold INTEGER NOT NULL DEFAULT 0,
    rr INTEGER NOT NULL DEFAULT 0,
    dice INTEGER NOT NULL DEFAULT 0,
    frost_bind INTEGER NOT NULL DEFAULT 0,
    random INTEGER NOT NULL DEFAULT 0
);
