SET search_path TO steam;
INSERT INTO developers (name, country) VALUES
 ('Night Owl Studios','UK'),
 ('Sunbeam Interactive','JP'),
 ('Arctic Fox','SE'),
 ('Nebula Forge','US')
ON CONFLICT DO NOTHING;
INSERT INTO games (title, developer_id, price, release_date, content_rating, categories) VALUES
 ('Star Drifter',   (SELECT developer_id FROM developers WHERE name='Nebula Forge'), 19.99, '2024-02-10', 'T', ARRAY['Indie','Space','Roguelike']),
 ('Echoes of Dawn', (SELECT developer_id FROM developers WHERE name='Sunbeam Interactive'), 24.99, '2022-09-18', 'T', ARRAY['RPG','Singleplayer','Story Rich']),
 ('Frostline',      (SELECT developer_id FROM developers WHERE name='Arctic Fox'), 12.99, '2021-12-05', 'T', ARRAY['Survival','Crafting']),
 ('Circuit Clash',  (SELECT developer_id FROM developers WHERE name='Night Owl Studios'),  9.99, '2020-07-21', 'E', ARRAY['Arcade','Multiplayer']),
 ('Mystic Orchard', (SELECT developer_id FROM developers WHERE name='Sunbeam Interactive'), 14.99, '2023-04-15', 'E', ARRAY['Simulation','Cozy']),
 ('Velocity Rush',  (SELECT developer_id FROM developers WHERE name='Nebula Forge'), 29.99, '2024-06-30', 'T', ARRAY['Racing','Online']),
 ('Kingdoms & Keys',(SELECT developer_id FROM developers WHERE name='Night Owl Studios'), 39.99, '2022-11-11', 'T', ARRAY['Strategy','City Builder']);
INSERT INTO purchases (user_id, game_id, price, payment_method)
SELECT 1, g.game_id, g.price, 'card' FROM games g WHERE g.title IN
 ('Star Drifter','Echoes of Dawn','Frostline','Circuit Clash','Mystic Orchard','Velocity Rush','Kingdoms & Keys');
INSERT INTO purchases (user_id, game_id, price, payment_method)
SELECT 2, g.game_id, g.price, 'card' FROM games g WHERE g.title IN
 ('Star Drifter','Frostline','Circuit Clash','Mystic Orchard');
INSERT INTO purchases (user_id, game_id, price, payment_method)
SELECT 3, g.game_id, g.price, 'card' FROM games g WHERE g.title IN
 ('Echoes of Dawn','Velocity Rush','Kingdoms & Keys');
INSERT INTO reviews (user_id, game_id, rating, contents)
SELECT 1, g.game_id, 8, 'Great roguelike loops and space vibes.' FROM games g WHERE g.title='Star Drifter';
INSERT INTO reviews (user_id, game_id, rating, contents)
SELECT 2, g.game_id, 7, 'Fun, could use more ship types.' FROM games g WHERE g.title='Star Drifter';
INSERT INTO reviews (user_id, game_id, rating, contents)
SELECT 1, g.game_id, 9, 'Narrative is top tier.' FROM games g WHERE g.title='Echoes of Dawn';
INSERT INTO reviews (user_id, game_id, rating, contents)
SELECT 3, g.game_id, 8, 'Beautiful OST and art direction.' FROM games g WHERE g.title='Echoes of Dawn';
INSERT INTO reviews (user_id, game_id, rating, contents)
SELECT 2, g.game_id, 6, 'Chilly grind, satisfying crafting.' FROM games g WHERE g.title='Frostline';
INSERT INTO reviews (user_id, game_id, rating, contents)
SELECT 1, g.game_id, 7, 'Arcade chaos with friends.' FROM games g WHERE g.title='Circuit Clash';
INSERT INTO reviews (user_id, game_id, rating, contents)
SELECT 2, g.game_id, 7, 'Simple and addictive.' FROM games g WHERE g.title='Circuit Clash';
INSERT INTO reviews (user_id, game_id, rating, contents)
SELECT 1, g.game_id, 9, 'Ultra cozy farming loop.' FROM games g WHERE g.title='Mystic Orchard';
INSERT INTO reviews (user_id, game_id, rating, contents)
SELECT 2, g.game_id, 8, 'Chill and cute.' FROM games g WHERE g.title='Mystic Orchard';
INSERT INTO reviews (user_id, game_id, rating, contents)
SELECT 1, g.game_id, 8, 'Fast and clean handling.' FROM games g WHERE g.title='Velocity Rush';
INSERT INTO reviews (user_id, game_id, rating, contents)
SELECT 3, g.game_id, 7, 'Online lobbies are lively.' FROM games g WHERE g.title='Velocity Rush';
INSERT INTO reviews (user_id, game_id, rating, contents)
SELECT 1, g.game_id, 8, 'Deep systems; tough but fair.' FROM games g WHERE g.title='Kingdoms & Keys';
INSERT INTO reviews (user_id, game_id, rating, contents)
SELECT 3, g.game_id, 9, 'City-builder bliss with puzzles.' FROM games g WHERE g.title='Kingdoms & Keys';

