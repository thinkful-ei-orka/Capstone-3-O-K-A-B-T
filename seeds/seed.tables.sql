BEGIN;

    TRUNCATE
        "user",
        "curses",
        "blessings";
    
    INSERT INTO "user"
        ("username", "password")
    VALUES
        (
            'admin',
            -- password = "pass"
            '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG'
        );

    INSERT INTO "blessings"
        ("blessing")
    VALUES
        (
            'U+1F91F',
        );

    INSERT INTO "curses"
        ("curse")
    VALUES
        (
            'To much stress'
        );
    INSERT INTO "curses"
        ("curse", "user_refid")
    VALUES
        (
            'To much stress',
            1
        );

    