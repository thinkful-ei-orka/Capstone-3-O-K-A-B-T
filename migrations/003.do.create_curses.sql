CREATE TABLE curses (
  curse_id SERIAL PRIMARY KEY,
  curse TEXT NOT NULL,
  user_id INTEGER REFERENCES users(user_id)
    ON DELETE CASCADE,
  blessed BOOLEAN NOT NULL DEFAULT false,
  blessing INTEGER REFERENCES blessings(blessing_id) ON DELETE CASCADE,
  pulled_by INTEGER REFERENCES users(user_id) ON DELETE CASCADE DEFAULT NULL,
  pulled_time TIMESTAMPTZ DEFAULT now()
);