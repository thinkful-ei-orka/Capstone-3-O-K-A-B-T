CREATE TABLE quotes (
    quote_id SERIAL PRIMARY KEY,
    quote_text TEXT NOT NULL,
    quote_source TEXT DEFAULT NULL
);