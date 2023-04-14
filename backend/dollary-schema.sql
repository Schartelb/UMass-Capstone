CREATE TABLE decks (
  archidekt_num INTEGER PRIMARY KEY CHECK (archidekt_num >= 0),
  name TEXT UNIQUE NOT NULL
);

CREATE TABLE users (
  username VARCHAR(25) PRIMARY KEY,
  password TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL
    CHECK (position('@' IN email) > 1),
  is_admin BOOLEAN NOT NULL DEFAULT FALSE
);

-- CREATE TABLE jobs (
--   id SERIAL PRIMARY KEY,
--   title TEXT NOT NULL,
--   salary INTEGER CHECK (salary >= 0),
--   equity NUMERIC CHECK (equity <= 1.0),
--   company_handle VARCHAR(25) NOT NULL
--     REFERENCES companies ON DELETE CASCADE
-- );

CREATE TABLE user_decks (
  username VARCHAR(25)
    REFERENCES users ON DELETE CASCADE,
  archidekt_num INTEGER
    REFERENCES decks ON DELETE CASCADE,
  PRIMARY KEY (username, archidekt_num)
);
