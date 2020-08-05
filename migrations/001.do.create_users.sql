CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  totalBlessings INTEGER DEFAULT 0,
  lastBlessing TIMESTAMPTZ NOT NULL DEFAULT now(),
  limiter INTEGER DEFAULT 3
);