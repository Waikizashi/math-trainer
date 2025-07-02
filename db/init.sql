-- init.sql — однократная инициализация базы
BEGIN;

-- 1) Пользователи
INSERT INTO users (username, password, email, role)
VALUES
  ('admin', '$2b$12$zy0Ls2tAJiA.drfLQ4ZtjeeT0r2w81gHc0Xs5oSIlMDx6WekYEpKm', 'admin@ad.com', 'ADMIN'),
  ('user1', '$2b$12$p9CjHDNN73c1g8nmv6HQmuf7ItJS3tX7AvfLLDUOFgmwkDWofplDi', 'user@user.com', 'USER')
ON CONFLICT (username) DO NOTHING;

-- 2) Теории и контент
INSERT INTO theories (id, title) VALUES
  (1, 'Uvod do teorii grafov'),
  (2, 'Uvod do teorii grafov')
ON CONFLICT (id) DO NOTHING;

INSERT INTO content (id, content_type, title, data, media_link, theory_id) VALUES
  (1, 'Article', 'Historický úvod',
   'Teória grafov je pomerne mladá matematická disciplína, má však veľmi vážne praktické uplatnenie. Prvopočiatky teórie grafov siahajú do začiatku 18. storočia a sú spojené s menom švajčiarskeho matematika a fyzika Leonharda Eulera, ktorý väčšinu svojho života pôsobil v Rusku, kde je aj pochovaný. V roku 1736 Euler publikoval prácu s názvom Solutio problematis ad geometriam situs pertinentis, v ktorej riešil problém prechádzky po mostoch mesta Königsberg…',
   '', 1),
  (2, 'Picture', 'Obr. 3.1: Problém mostov mesta Königsberg',
   '**MEDIA_LINK**', '##LINK_TO_PHOTO##', 1),
  (3, 'Example', 'Definícia grafu, typy grafov, základné pojmy',
   'V praxi sa často stretávame s rôznymi typmi diagramov…', 'https://en.wikipedia.org/wiki/Four_color_theorem', 2),
  (4, 'Example', 'Non-oriented and Oriented Graphs',
   'Okrem neorientovaných grafov existujú aj tie orientované grafy…', '', 2),
  (5, 'Article', 'Definícia 3.2.1 — Neorientovaný graf',
   'Neorientovaný graf, alebo stručne len graf, je usporiadaná dvojica {math}G=(V,E){/math}…', '', 2)
ON CONFLICT (id) DO NOTHING;

-- 3) Данные для визуализации (GraphData + узлы/рёбра)
INSERT INTO graph_data (id, title, oriented, theorycontent_id) VALUES
  (1, 'Map Visualization of Slovak Cities:', FALSE, 3),
  (2, 'Tournament Directional Graph', TRUE, 4)
ON CONFLICT (id) DO NOTHING;

INSERT INTO graph_nodes (id, node_id, node_group, graph_data_id) VALUES
  ( 1, 'BA', '1', 1),
  ( 2, 'TT', '1', 1),
  ( 3, 'NR', '1', 1),
  ( 4, 'BB', '1', 1),
  ( 5, 'ZA', '1', 1),
  ( 6, 'KE', '1', 1),
  ( 7, 'PO', '1', 1),
  ( 8, 'TN', '1', 1),
  ( 9, 'a',  '1', 2),
  (10, 'b',  '1', 2),
  (11, 'c',  '1', 2),
  (12, 'd',  '1', 2)
ON CONFLICT (id) DO NOTHING;

INSERT INTO graph_links (id, link_id, weight, source, target, graph_data_id) VALUES
  ( 1, '1', NULL, 'BA', 'TT', 1),
  ( 2, '2', NULL, 'TT', 'NR', 1),
  ( 3, '3', NULL, 'NR', 'BB', 1),
  ( 4, '4', NULL, 'BB', 'ZA', 1),
  ( 5, '5', NULL, 'ZA', 'KE', 1),
  ( 6, '6', NULL, 'KE', 'PO', 1),
  ( 7, '7', NULL, 'PO', 'TN', 1),
  ( 8, '8', NULL, 'TN', 'BA', 1),
  ( 9, '1', NULL, 'a',  'b', 2),
  (10, '2', NULL, 'a',  'c', 2),
  (11, '3', NULL, 'a',  'd', 2),
  (12, '4', NULL, 'b',  'd', 2),
  (13, '5', NULL, 'c',  'b', 2),
  (14, '6', NULL, 'd',  'c', 2)
ON CONFLICT (id) DO NOTHING;

-- 4) Практики и задания
INSERT INTO practices (id, title) VALUES
  (1, 'Aciklické grafy'),
  (2, 'Súvislé grafy'),
  (3, 'Stromové grafy')
ON CONFLICT (id) DO NOTHING;

INSERT INTO practice_content (id, content_type, title, data, media_link, practice_id) VALUES
  (1, 'Exercise', 'Vytvorte acyklický graf',
     'Vašou úlohou je vytvoriť acyklický graf s najmenej 5 vrcholmi', '-', 1),
  (2, 'Exercise', 'Vytvorte súvislý graf',
     'Vašou úlohou je vytvoriť súvislý graf s 10 vrcholmi', '-', 2),
  (3, 'Exercise', 'Vytvorte stromový graf',
     'Vašou úlohou je vytvoriť stromový graf s 4 vrcholmi', '-', 3)
ON CONFLICT (id) DO NOTHING;

INSERT INTO possible_vertex_counts (id, count, practice_content_id) VALUES
  (1, 5, 1), (2, 6, 1), (3, 7, 1), (4, 8, 1),
  (5, 10, 2),
  (6, 4, 3)
ON CONFLICT (id) DO NOTHING;

INSERT INTO possible_edge_counts (id, count, practice_content_id) VALUES
  ( 1, 1, 1), ( 2, 2, 1), ( 3, 3, 1), ( 4, 4, 1), ( 5, 5, 1),
  ( 6, 9, 2), ( 7,10, 2), ( 8,11, 2), ( 9,12, 2), (10,13, 2), (11,14, 2),
  (12, 3, 3)
ON CONFLICT (id) DO NOTHING;

INSERT INTO graph_properties (id, property, practice_content_id) VALUES
  (1, 'ACYCLIC', 1),
  (2, 'CONNECTED', 2),
  (3, 'TREE', 3)
ON CONFLICT (id) DO NOTHING;

COMMIT;
