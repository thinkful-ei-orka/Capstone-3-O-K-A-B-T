BEGIN;
    TRUNCATE
        users,
        curses,
        blessings,
        quotes;

INSERT INTO users
    (username, password, totalBlessings, lastBlessing, limiter)
VALUES
    ('admin',
        -- password = "pass"
        '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG',
        10,
        now(),
        3
        ),
    ('receiver',
        '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG',
        10,
        now(),
        3
        );

INSERT INTO blessings
    (blessing)
VALUES
    ('U+1F91F');

INSERT INTO curses
    (curse, user_refid, blessed, blessing)
VALUES
    ('To much stress', 1, false, null);

INSERT INTO quotes
    (quote_text,quote_source)
VALUES
    ('Swearing is industry language. For as long as we''re alive it''s not going to change. You''ve got to be boisterous to get results', 'Gordon Ramsay'),
    ('Swearing''s my release. It''s the one weapon I have to defend myself against destiny when it elects to strike without pity','Andrea Pirlo'),
    ('My first outdoor cooking memories are full of erratic British summers, Dad swearing at a barbecue that he couldn''t put together, and eventually eating charred sausages, feeling brilliant', 'Jamie Oliver'),
    ('There is no such thing as too much swearing. Swearing is just a piece of linguistic mechanics. The words in-between are the clever ones.','Peter Capaldi'),
    ('We examined the relationship between the use of profanity and dishonesty and showed that profanity is positively correlated with honesty at an individual level and with integrity at a society level.', 'Gilad Feldman, Huiwen Lian, Michal Kosinski, and David Stillwell "Frankly, We Do Give A Damn: The Relationship Between Profanity and Honesty"'),
    ('Cursting activates the ''fight or flight'' response, leading to a surge of adrenaline and corresponding analgesic effect.','Neel Burton MD - Psychology Today'),
    ('Cursing can give us a greater sense of power and control over a bad situation. This can boost our confidence and self-esteem.','Neel Burton MD - Psychology Today'),
    ('When angry, count to four; When very angry, swear.','Mark Twain'),
    ('Cursing enables us to get back at bad people or situations without having to resort to violence.','Neel Burton MD - Psychology Today'),
    ('Swearing can be a way of signaling that we really mean something, or that it is really important to us. That''s why swearing is so much a part of any sport.','Neel Burton MD - Psychology Today'),
    ('Never use a big word whne a little filthy one will do','Johnny Carson');