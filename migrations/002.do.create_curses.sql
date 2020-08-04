CREATE TABLE "curses" (
  "curse_id" SERIAL PRIMARY KEY,
  "curse" TEXT NOT NULL,
  "blessed" BOOLEAN NOT NULL,
  "user_id" INTEGER REFERENCES "user"(id)
    ON DELETE CASCADE NOT NULL
);