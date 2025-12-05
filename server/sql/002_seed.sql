SET search_path TO steam;

INSERT INTO users (email, username, password_hash, country, friend_code, account_balance) VALUES
('alice@example.com', 'aliceuser', '$2b$10$dummydummydummydummydummy111', 'US', 'ALC-123', 50),
('bob@example.com', 'bobuser',  '$2b$10$dummydummydummydummydummy222', 'US', 'BOB-456', 20),
('cara@example.com', 'carauser', '$2b$10$dummydummydummydummydummy333', 'CA', 'CAR-789', 10);

INSERT INTO developers (name,country) VALUES ('Valve','US'), ('Black Mesa Devs','US');

INSERT INTO games (title, developer_id, price, release_date, content_rating, categories) VALUES
('Portal',      1, 9.99,  '2007-10-10', 'T', ARRAY['Puzzle','Singleplayer']),
('Half-Life 2', 1, 7.99,  '2004-11-16', 'M', ARRAY['FPS','Story Rich']),
('Sky Colony',  2, 14.99, '2023-05-12', 'T', ARRAY['Indie','Strategy']);

INSERT INTO achievements (game_id, name, description) VALUES
(1,'Out of the Box','Finish test chamber 00'),
(1,'Cake Is a Lie','Discover the truth'),
(2,'Crowbar Beginner','Use crowbar'),
(3,'First Colony Founded','Build your first colony');

INSERT INTO awards (name, category, year) VALUES
('Fog Awards','Game of the Year',2023),
('Fog Awards','Labor of Love',2023);

INSERT INTO game_awards (award_id, game_id) VALUES (1,3),(2,1);

INSERT INTO purchases (user_id, game_id, price, payment_method) VALUES
(1,1,9.99,'card'),(1,2,7.99,'card'),(2,1,9.99,'balance');

INSERT INTO reviews (user_id, game_id, rating, contents) VALUES
(1,1,10,'Still amazing.'),
(2,1,9,'Mind-bending puzzles!');