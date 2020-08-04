CREATE TABLE curses (
  curse_id SERIAL PRIMARY KEY,
  curse TEXT NOT NULL,
  user_refid INTEGER REFERENCES users(user_id)
    ON DELETE CASCADE NOT NULL,
  blessed BOOLEAN NOT NULL DEFAULT false,
  blessing INTEGER REFERENCES blessings(blessing_id) ON DELETE CASCADE
);