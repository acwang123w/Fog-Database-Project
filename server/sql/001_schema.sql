-- Drop & create
DROP SCHEMA IF EXISTS steam CASCADE;
CREATE SCHEMA steam;
SET search_path TO steam;

CREATE TABLE users (
  user_id         SERIAL PRIMARY KEY,
  email           TEXT UNIQUE NOT NULL,
  username        TEXT NOT NULL,
  password_hash   TEXT NOT NULL,
  country         TEXT,
  friend_code     TEXT UNIQUE,
  account_balance NUMERIC(10,2) DEFAULT 0 CHECK (account_balance >= 0),
  status          TEXT DEFAULT 'active',
  created_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE developers (
  developer_id SERIAL PRIMARY KEY,
  name         TEXT NOT NULL,
  country      TEXT
);

CREATE TABLE games (
  game_id        SERIAL PRIMARY KEY,
  title          TEXT NOT NULL,
  developer_id   INT REFERENCES developers(developer_id) ON DELETE SET NULL,
  price          NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  release_date   DATE,
  content_rating TEXT,
  categories     TEXT[],
  created_at     TIMESTAMP DEFAULT NOW()
);

CREATE TABLE friends (
  user_id        INT REFERENCES users(user_id) ON DELETE CASCADE,
  friend_user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
  date_added     TIMESTAMP DEFAULT NOW(),
  status         TEXT DEFAULT 'pending',
  PRIMARY KEY (user_id, friend_user_id),
  CHECK (user_id <> friend_user_id)
);

CREATE TABLE purchases (
  transaction_id  SERIAL PRIMARY KEY,
  user_id         INT REFERENCES users(user_id) ON DELETE CASCADE,
  game_id         INT REFERENCES games(game_id) ON DELETE CASCADE,
  date            TIMESTAMP DEFAULT NOW(),
  price           NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  payment_method  TEXT NOT NULL
);

CREATE TABLE reviews (
  review_id  SERIAL PRIMARY KEY,
  user_id    INT REFERENCES users(user_id) ON DELETE CASCADE,
  game_id    INT REFERENCES games(game_id) ON DELETE CASCADE,
  rating     INT CHECK (rating BETWEEN 1 AND 10),
  contents   TEXT,
  date       TIMESTAMP DEFAULT NOW(),
  UNIQUE (user_id, game_id)
);

CREATE TABLE achievements (
  achievement_id SERIAL PRIMARY KEY,
  game_id        INT REFERENCES games(game_id) ON DELETE CASCADE,
  name           TEXT NOT NULL,
  description    TEXT
);

CREATE TABLE user_achievements (
  achievement_id INT REFERENCES achievements(achievement_id) ON DELETE CASCADE,
  user_id        INT REFERENCES users(user_id) ON DELETE CASCADE,
  date_achieved  TIMESTAMP DEFAULT NOW(),
  is_hidden      BOOLEAN DEFAULT FALSE,
  PRIMARY KEY (achievement_id, user_id)
);

CREATE TABLE awards (
  award_id SERIAL PRIMARY KEY,
  name     TEXT NOT NULL,
  category TEXT NOT NULL,
  year     INT  NOT NULL
);

CREATE TABLE game_awards (
  award_id INT REFERENCES awards(award_id) ON DELETE CASCADE,
  game_id  INT REFERENCES games(game_id)  ON DELETE CASCADE,
  PRIMARY KEY (award_id, game_id)
);

CREATE VIEW user_library AS
SELECT p.user_id, p.game_id, MAX(p.date) AS purchased_at
FROM purchases p
GROUP BY p.user_id, p.game_id;

CREATE INDEX idx_games_title
  ON games USING gin (to_tsvector('english', title));

CREATE INDEX idx_games_categories
  ON games USING gin (categories);

CREATE INDEX idx_reviews_game
  ON reviews(game_id);