BEGIN;
  TRUNCATE
        blessings
        RESTART IDENTITY CASCADE;

INSERT INTO blessings
  (blessing)
VALUES
  ('U+1F91F'),
  ('U+1F607'),
  ('U+1F92C'),
  ('U+1F602'),
  ('U+1F622'),
  ('U+1F525');

COMMIT