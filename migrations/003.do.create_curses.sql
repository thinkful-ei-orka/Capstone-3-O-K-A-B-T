CREATE TABLE curses (
  curse_id SERIAL PRIMARY KEY,
  curse TEXT NOT NULL,
  blessed BOOLEAN NOT NULL,
  blessing INTEGER REFERENCES blessings(blessing_id) ON DELETE CASCADE,
  user_refid INTEGER REFERENCES users(user_id)
    ON DELETE CASCADE NOT NULL
);