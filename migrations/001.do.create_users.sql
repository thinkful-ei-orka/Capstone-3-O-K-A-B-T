CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  totalblessings INTEGER DEFAULT 0,
  lastblessing TIMESTAMPTZ NOT NULL DEFAULT now(),
  limiter INTEGER DEFAULT 3,
  blocklist INTEGER ARRAY DEFAULT NULL
);