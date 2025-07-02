-- 1) Пользователи
INSERT INTO users (username, password, email, role)
VALUES
    ('admin', '$2b$12$zy0Ls2tAJiA.drfLQ4ZtjeeT0r2w81gHc0Xs5oSIlMDx6WekYEpKm', 'admin@ad.com', 'ADMIN'),
    ('user1', '$2b$12$p9CjHDNN73c1g8nmv6HQmuf7ItJS3tX7AvfLLDUOFgmwkDWofplDi', 'user@user.com', 'USER');

-- 2) Теории и контент
INSERT INTO theories (id, title) VALUES
                                     (1, 'Uvod do teorii grafov 1.1'),
                                     (2, 'Uvod do teorii grafov 1.2');

INSERT INTO theory_content (id, content_type, title, data, media_link, theory_id) VALUES
                                                                               (1, 'Article', 'Historický úvod',
                                                                                'Teória grafov je pomerne mladá matematická disciplína, má však veľmi vážne praktické uplatnenie. Prvopočiatky teórie grafov siahajú do začiatku 18. storočia a sú spojené s menom švajčiarskeho matematika a fyzika Leonharda Eulera, ktorý väčšinu svojho života pôsobil v Rusku, kde je aj pochovaný. V roku 1736 Euler publikoval prácu s názvom Solutio problematis ad geometriam situs pertinentis, v ktorej riešil problém prechádzky po mostoch mesta Königsberg (dnešný Kaliningrad). Bola to, z dnešného pohľadu, hlavolamová úloha. Až oveľa neskôr sa ukázalo, že problém, ktorý Euler vyriešil, má významné uplatnenia v doprave, elektrotechnike, informatike a v mnohých ďalších technických disciplínach. Euler pri svojom riešení abstrahoval podstatu problému. Mapu mesta previedol do jej topologickej podoby, tú ďalej reprezentoval pomocou grafu a pomocou grafu potom problém vyriešil.\n\nĎalších takmer 200 rokov sa teória grafov rozvíjala v „ilegalite“. To znamená, že matematici riešili problémy, ktoré dnes patria do teórie grafov, ale teória grafov ešte neexistovala ako samostatná matematická disciplína. Medzi slávne a veľmi známe problémy teórie grafov, ktorými sa matematici zaoberali už v 19. storočí, patria napríklad problém obchodného cestujúceho a problém štyroch farieb. Problém obchodného cestujúceho ako prvý matematicky sformuloval írsky matematik W.R. Hamilton v roku 1800 a odvtedy sa ním zaoberali a stále zaoberajú mnohí významní matematici. Tento problém sa radí medzi problémy kombinatorickej optimalizácie a je to NP-úplný problém súvisiaci s plánovaním, logistikou, mikroelektronikou, operačným výskumom a informatikou. Problém štyroch farieb ako prvý sformuloval F. Guthrie, žiak známeho matematika Augusta de Morgana, v roku 1852. Týmto problémom sa tiež zaoberali mnohí slávni matematici, okrem iného aj Arthur Cayley, ktorý sa považuje za jedného z otcov teórie grafov. Problém štyroch farieb veľmi dlho odolával pokusom o vyriešenie. Už v 19. storočí prišli matematici s jeho „dôkazmi“. S najúspešnejšími pokusmi prišli A. Kempe v roku 1879 a P. Tait v roku 1880. Oba tieto „dôkazy“ odolávali vyše 11 rokov, ale nakoniec sa ukázali ako chybné v rokoch 1890 a 1891. Okrem týchto dvoch nasledoval ešte celý rad viac či menej úspešných pokusov o vyriešenie problému štyroch farieb. Na jeho vyriešenie bola dokonca vypísaná aj veľká finančná odmena. Avšak až v roku 1976 sa dvom matematikom, K. Appelovi a W. Hakenovi, podarilo vyriešiť tento problém za pomoci počítačov. Ich dôkaz spočíval v overovaní 19363 možností pomocou počítača. Bol to prvý významný matematický problém dokázaný s podporou počítačov. Formálny matematický dôkaz problému štyroch farieb sa, síce bez overovania možností, ale taktiež s pomocou programu Coq, podaril až v roku 2005 matematikom B. Wernerovi a G. Gonthierovi.\n\nOba spomenuté problémy boli spočiatku sformulované ako hlavolamové úlohy. Až o desaťročia neskôr sa ukázalo, že majú obrovský význam pre mnohé nové odvetvia techniky aj prírodných vied, ktoré v čase formulácie týchto problémov ešte ani neexistovali. To isté platí aj o ďalších problémoch teórie grafov a matematických problémov všeobecne. To, čo dnes vyzerá ako od života odtrhnutá teória, sa o pár desaťročí môže ukázať ako pre ľudskú prax podstatná vec.\n\nPrvú monografiu o teórii grafov napísal až v roku 1936 maďarský matematik Dénes Kőnig. Odvtedy patrí teória grafov medzi najrýchlejšie sa rozvíjajúce matematické disciplíny s množstvom aplikácií a využití v informatike, technike, prírodných vedách, v ekonómii a dokonca aj v tzv. humanitných vedách.',
                                                                                '', 1),
                                                                               (2, 'Picture', 'Obr. 3.1: Problém mostov mesta Königsberg',
                                                                                'https://sk.wikipedia.org/wiki/Probl%C3%A9m_siedmich_mostov' ,'**MEDIA_LINK**', 1),
                                                                               (3, 'Example', 'Definícia grafu, typy grafov, základné pojmy',
                                                                                'V praxi sa často stretávame s rôznymi typmi diagramov. Môžu to byť napríklad mapy cestnej alebo železničnej siete, rozvody plynu, elektriny alebo vody, výrobné plány, plošné spoje alebo návrhy mikroprocesorov, chemické väzby, štruktúra DNA atď. Napríklad môžeme mať cestnú mapu medzi 8 slovenskými krajskými mestami, ktorá vyzerá tak, ako je to znázornené na obrázku vyššie. Červené kruhy predstavujú krajské mestá a žlté čiary predstavujú cesty, ktoré ich spájajú. Predpokladáme, že máme za úlohu naplánovať trasu zásobovacieho auta, ktoré má vyštartovať z Bratislavy, a po každej z ciest má prejsť práve raz a má skončiť opäť v Bratislave.', 'https://en.wikipedia.org/wiki/Four_color_theorem', 2),
                                                                               (4, 'Example', 'Non-oriented and Oriented Graphs',
                                                                                'Okrem neorientovaných grafov existujú aj tie orientované grafy. Na predloženej úlohe by sme mohli predstaviť tak, že cesty medzi mestami sú jednosmerné, čiže autá po nich môžu jazdiť len jedným predpísaným smerom. Pojem orientovaného grafu si, pre väčšiu názornosť, ilustrujeme ešte aj na úplne odlišnom type úlohy. Na športovom turnaji hrajú tímy mužstvá a, b, c, d systémom „každý s každým“. Mužstvo a porazilo mužstvá b, c a d, mužstvo b porazilo mužstvo d, mužstvo c porazilo mužstvo b a napokon mužstvo d porazilo mužstvo c. Toto môžeme znázorniť pomocou orientovaného grafu, ktorý vidíme na obrázku vyššie. Vrcholy grafu predstavujú mužstvá a šípky, nazývané orientované hrany grafu, znázorňujú kto koho porazil.', '', 2),
                                                                               (5, 'Article', 'Definícia 3.2.1 — Neorientovaný graf',
                                                                                'Neorientovaný graf, alebo stručne len graf, je usporiadaná dvojica {math}G = (V, E){/math}. Prvky množiny {math}V{/math} sa nazývajú vrcholy (vertices) grafu {math}G{/math}. Prvky množiny {math}E{/math} sa nazývajú hrany (edges) grafu {math}G{/math} a zodpovedajú jedno a dvojprvkovým podmnožinám množiny {math}V{/math}.\n\nTreba si uvedomiť, že na množinu {math}V{/math} sa v definícii 3.2.1 nekladú žiadne požiadavky. Uvedená definícia preto zahrňa aj prázdny graf, t.j. graf, ktorý nemá žiadne vrcholy ani hrany. Prázdny graf dostaneme, ak bude {math}V = \\emptyset{/math}. Ďalej uvedená definícia pripúšťa aj nekonečný graf, t.j. graf, ktorý má nekonečný počet vrcholov, napríklad ak bude {math}V = \\mathbb{Z}{/math}. My sa budeme zaoberať len konečnými grafmi, t.j. grafmi s konečným počtom vrcholov a hrán.\n\nVrchy grafu obvykle označujeme písmenami {math}u, v, v_1, v_2, \\ldots{/math} avšak môžeme ich označiť aj inak, ako sme to videli na príklade s krajskými mestami Slovenska. Hrany grafu budeme obvykle označovať písmenami {math}h, h_1, h_2, \\ldots{/math} a ak to bude potrebné, budeme ich zapisovať ako jednoprvkové alebo dvojprvkové množiny. Napríklad {math}h_1 = \\{u, v\\}{/math} bude označovať hranu spájajúcu vrcholy {math}u{/math} a {math}v{/math} a {math}h_2 = \\{u\\}{/math} bude označovať hranu spájajúcu vrchol {math}u{/math} sám so sebou.\n\nDefinícia 3.2.1 pripúšťa aj možnosť, že medzi dvoma vrcholmi grafu {math}G{/math} je viac než len jedna hrana. Majme napríklad graf s vrcholmi {math}V = \\{u, v, \\ldots\\}{/math} a s hranami {math}E = \\{h_1, h_2, \\ldots\\}{/math}, pričom {math}h_1 = \\{u, v\\}{/math} a {math}h_2 = \\{u, v\\}{/math}. Uvedený zápis znamená, že vrcholy {math}u{/math} a {math}v{/math} sú spojené aspoň dvoma hranami. V definícii 3.2.1 je v slove „zodpovedajú“ ukryté priradenie medzi hranami grafu a podmnožinami množiny {math}V{/math}. Takže správne by sme mali písať {math}h_1 \\to \\{u, v\\}{/math} a {math}h_2 \\to \\{u, v\\}{/math}. Pre jednoduchosť však aj naďalej budeme používať symbol „—“.', '', 2);

-- 3) Данные для визуализации (GraphData + узлы/рёбра)
INSERT INTO graph_data (id, title, oriented, theory_content_id) VALUES
                                                                   (1, 'Map Visualization of Slovak Cities:', FALSE, 3),
                                                                   (2, 'Tournament Directional Graph', TRUE, 4);

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
                                                                     (12, 'd',  '1', 2);

INSERT INTO graph_links (id, link_id, weight, source, target, graph_data_id) VALUES
                                                                                 ( 1, '1', NULL, 'BA', 'TT', 1),
                                                                                 ( 2, '2', NULL, 'TN', 'TT', 1),
                                                                                 ( 3, '3', NULL, 'NR', 'BB', 1),
                                                                                 ( 4, '4', NULL, 'BB', 'ZA', 1),
                                                                                 ( 5, '5', NULL, 'NR', 'KE', 1),
                                                                                 ( 6, '6', NULL, 'KE', 'PO', 1),
                                                                                 ( 7, '7', NULL, 'TN', 'NR', 1),
                                                                                 ( 8, '8', NULL, 'BA', 'NR', 1),
                                                                                 ( 9, '1', NULL, 'a',  'b', 2),
                                                                                 (10, '2', NULL, 'a',  'c', 2),
                                                                                 (11, '3', NULL, 'a',  'd', 2),
                                                                                 (12, '4', NULL, 'b',  'd', 2),
                                                                                 (13, '5', NULL, 'c',  'b', 2),
                                                                                 (14, '6', NULL, 'd',  'c', 2),
                                                                                 (15, '9', NULL, 'TN', 'BB', 1),
                                                                                 (16, '10', NULL, 'BB', 'KE', 1),
                                                                                 (17, '11', NULL, 'ZA', 'PO', 1),
                                                                                 (18, '12', NULL, 'ZA', 'KE', 1),
                                                                                 (19, '13', NULL, 'ZA', 'TN', 1);

-- 4) Практики и задания
INSERT INTO practices (id, title) VALUES
                                      (1, 'Aciklické grafy'),
                                      (2, 'Súvislé grafy'),
                                      (3, 'Stromové grafy');

INSERT INTO practice_content (id, content_type, title, data, media_link, practice_id) VALUES
                                                                                          (1, 'Exercise', 'Vytvorte acyklický graf',
                                                                                           'Vašou úlohou je vytvoriť acyklický graf s najmenej 5 vrcholmi', '-', 1),
                                                                                          (2, 'Exercise', 'Vytvorte súvislý graf',
                                                                                           'Vašou úlohou je vytvoriť súvislý graf s 10 vrcholmi', '-', 2),
                                                                                          (3, 'Exercise', 'Vytvorte stromový graf',
                                                                                           'Vašou úlohou je vytvoriť stromový graf s 4 vrcholmi', '-', 3);

INSERT INTO possible_vertex_counts (id, count, practice_content_id) VALUES
                                                                        (1, 5, 1), (2, 6, 1), (3, 7, 1), (4, 8, 1),
                                                                        (5, 10, 2),
                                                                        (6, 4, 3);

INSERT INTO possible_edge_counts (id, count, practice_content_id) VALUES
                                                                      ( 1, 1, 1), ( 2, 2, 1), ( 3, 3, 1), ( 4, 4, 1), ( 5, 5, 1),
                                                                      ( 6, 9, 2), ( 7,10, 2), ( 8,11, 2), ( 9,12, 2), (10,13, 2), (11,14, 2),
                                                                      (12, 3, 3);

INSERT INTO graph_properties (id, property, practice_content_id) VALUES
                                                                     (1, 'ACYCLIC', 1),
                                                                     (2, 'CONNECTED', 2),
                                                                     (3, 'TREE', 3);
-- Additional data:

-- 6) Дополняем теорию (theory_id = 2) новой статьёй и примером

-- 6) Дополняем теорию (theory_id = 2) новой статьёй и примером

INSERT INTO theory_content (id, content_type, title, data, media_link, theory_id) VALUES
                                                                                      (6, 'Article', 'Definícia 3.2.2 — Vrcholy a hrany grafu',
                                                                                       'Incidencia – Ak {math}h = \\{u, v\\}{/math}, čiže hrana {math}h{/math} spája vrcholy {math}u{/math} a {math}v{/math}, tak potom hovoríme, že tieto vrcholy incídujú s hranou {math}h{/math} a aj naopak, hrana {math}h{/math} incíduje s vrcholmi {math}u{/math} a {math}v{/math}.
                                                                                        Susednosť – Ak máme hranu {math}h = \\{u, v\\}{/math}, t.j. vrcholy {math}u{/math} a {math}v{/math} sú spojené hranou, tak tieto vrcholy sa nazývajú susedné vrcholy.
                                                                                        Násobné hrany – Ak sú dva vrcholy spojené viac než jednou hranou, tak hrany, ktoré ich spájajú, sa nazývajú násobné hrany.
                                                                                        Slučka – Ak je vrchol {math}u{/math} spojený hranou (susedí) sám so sebou, napríklad {math}h = \\{u\\}{/math}, potom sa taká hrana nazýva slučka.
                                                                                        Izolovaný vrchol – Vrchol, ktorý neincíduje so žiadnou hranou, sa nazýva izolovaný vrchol.',
                                                                                       '', 2),
                                                                                      (7, 'Example', 'Príklad 3.1',
                                                                                       'V grafe, ktorý vidíme na obrázku vpravo, je vrchol {math}v{/math} izolovaný vrchol a hrany {math}h1{/math} a {math}h2{/math}, ktoré spájajú vrcholy {math}u{/math} a {math}w{/math}, sú násobné hrany. Vrcholy {math}u{/math} a {math}w{/math} sú susedné vrcholy a oba incídujú s hranami {math}h1{/math} aj {math}h2{/math}.',
                                                                                       '', 2);

INSERT INTO graph_data (id, title, oriented, theory_content_id) VALUES
    (3, 'Graph for Príklad 3.1: multiple edges & isolated vertex', FALSE, 7);

INSERT INTO graph_nodes (id, node_id, node_group, graph_data_id) VALUES
                                                                     (13, 'w', '1', 3),
                                                                     (14, 'u', '1', 3),
                                                                     (15, 'v', '1', 3);

INSERT INTO graph_links (id, link_id, weight, source, target, graph_data_id) VALUES
                                                                                 (20, 'h1', NULL, 'w', 'u', 3),
                                                                                 (21, 'h2', NULL, 'u', 'w', 3);

INSERT INTO theory_content (id, content_type, title, data, media_link, theory_id) VALUES
    (8, 'Article', 'Definícia 3.2.4 — Obyčajný graf',
     'Obyčajný graf, nazývaný aj jednoduchý graf, je graf bez {math}slučky{/math} a {math}násobných hrán{/math}.',
     '', 2);

-- 11) Добавляем Example Príklad 3.4
INSERT INTO theory_content (id, content_type, title, data, media_link, theory_id) VALUES
    (9, 'Example', 'Príklad 3.4',
     'Graf na obrázku 3.2 je obyčajný graf. Graf na obrázku 3.3 má násobné hrany, a preto nie je obyčajný. Rovnako ani graf na obrázku 3.4 nie je obyčajný, pretože má slučku.',
     '', 2);

-- 12) GraphData для Príklad 3.4 (три рисунка: Obr. 3.2, 3.3 и 3.4)
INSERT INTO graph_data (id, title, oriented, theory_content_id) VALUES
                                                                    (4, 'Obyčajný graf (Obr. 3.2)', FALSE, 9),
                                                                    (5, 'Graf s násobnými hranami (Obr. 3.3)', FALSE, 9),
                                                                    (6, 'Graf so slučkou (Obr. 3.4)', FALSE, 9);

-- 13) Узлы для Obr. 3.2 (a–b–c треугольник + висячий d)
INSERT INTO graph_nodes (id, node_id, node_group, graph_data_id) VALUES
                                                                     (16, 'a', '1', 4),
                                                                     (17, 'b', '1', 4),
                                                                     (18, 'c', '1', 4),
                                                                     (19, 'd', '1', 4);

-- 14) Рёбра для Obr. 3.2
INSERT INTO graph_links (id, link_id, weight, source, target, graph_data_id) VALUES
                                                                                 (22, '1', NULL, 'a', 'b', 4),
                                                                                 (23, '2', NULL, 'b', 'c', 4),
                                                                                 (24, '3', NULL, 'c', 'a', 4),
                                                                                 (25, '4', NULL, 'c', 'd', 4);

-- 15) Узлы для Obr. 3.3 (a, b, c)
INSERT INTO graph_nodes (id, node_id, node_group, graph_data_id) VALUES
                                                                     (20, 'a', '1', 5),
                                                                     (21, 'b', '1', 5),
                                                                     (22, 'c', '1', 5);

-- 16) Рёбра для Obr. 3.3 (две параллельные a–b + b–c)
INSERT INTO graph_links (id, link_id, weight, source, target, graph_data_id) VALUES
                                                                                 (26, '1', NULL, 'a', 'b', 5),
                                                                                 (27, '2', NULL, 'a', 'b', 5),
                                                                                 (28, '3', NULL, 'b', 'c', 5);

-- 17) Узлы для Obr. 3.4 (a, b, c)
INSERT INTO graph_nodes (id, node_id, node_group, graph_data_id) VALUES
                                                                     (23, 'a', '1', 6),
                                                                     (24, 'b', '1', 6),
                                                                     (25, 'c', '1', 6);

-- 18) Рёбра для Obr. 3.4 (a–c, b–c и цикл c–c)
INSERT INTO graph_links (id, link_id, weight, source, target, graph_data_id) VALUES
                                                                                 (29, '1', NULL, 'a', 'c', 6),
                                                                                 (30, '2', NULL, 'b', 'c', 6),
                                                                                 (31, '3', NULL, 'c', 'c', 6);

INSERT INTO theory_content (id, content_type, title, data, media_link, theory_id) VALUES
    (10, 'Article', 'Definícia 3.2.7 — Komplet­ný graf',
     'Komplet­ný (úplný) graf na {math}n{/math} vrcholoch sa označuje {math}K_n{/math} a je to obyčajný graf s {math}n{/math} vrcholmi, ktorý obsahuje hranu medzi ľubovoľnými dvoma rôznymi vrcholmi.',
     '', 2);

-- 21) Добавляем Example Príklad 3.7 — Grafy K₃ и K₄
INSERT INTO theory_content (id, content_type, title, data, media_link, theory_id) VALUES
    (11, 'Example', 'Príklad 3.7',
     'Na obrázku 3.9 je komplet­ný graf na 3 vrcholoch ({math}K_3{/math}). Na obrázkoch 3.10 a 3.11 je komplet­ný graf na 4 vrcholoch ({math}K_4{/math}), nakreslený dvoma rôznymi spôsobmi.',
     '', 2);

-- 22) GraphData для Príklad 3.7
INSERT INTO graph_data (id, title, oriented, theory_content_id) VALUES
                                                                    (7,  'Graf K₃ (Obr. 3.9)',             FALSE, 11),
                                                                    (8,  'Graf K₄ (Obr. 3.10)',            FALSE, 11),
                                                                    (9,  'Graf K₄ (Obr. 3.11)',            FALSE, 11);

-- 23) Узлы для Graf K₃
INSERT INTO graph_nodes (id, node_id, node_group, graph_data_id) VALUES
                                                                     (26, 'a', '1', 7),
                                                                     (27, 'b', '1', 7),
                                                                     (28, 'c', '1', 7);

-- 24) Рёбра для Graf K₃ (все пары)
INSERT INTO graph_links (id, link_id, weight, source, target, graph_data_id) VALUES
                                                                                 (32, '1', NULL, 'a', 'b', 7),
                                                                                 (33, '2', NULL, 'b', 'c', 7),
                                                                                 (34, '3', NULL, 'c', 'a', 7);

-- 25) Узлы для Graf K₄ (Obr. 3.10)
INSERT INTO graph_nodes (id, node_id, node_group, graph_data_id) VALUES
                                                                     (29, 'a', '1', 8),
                                                                     (30, 'b', '1', 8),
                                                                     (31, 'c', '1', 8),
                                                                     (32, 'd', '1', 8);

-- 26) Рёбра для Graf K₄ (6 пар)
INSERT INTO graph_links (id, link_id, weight, source, target, graph_data_id) VALUES
                                                                                 (35, '1', NULL, 'a', 'b', 8),
                                                                                 (36, '2', NULL, 'a', 'c', 8),
                                                                                 (37, '3', NULL, 'a', 'd', 8),
                                                                                 (38, '4', NULL, 'b', 'c', 8),
                                                                                 (39, '5', NULL, 'b', 'd', 8),
                                                                                 (40, '6', NULL, 'c', 'd', 8);

-- 27) Узлы для Graf K₄ (Obr. 3.11) — повторно, своя конфигурация
INSERT INTO graph_nodes (id, node_id, node_group, graph_data_id) VALUES
                                                                     (33, 'a', '1', 9),
                                                                     (34, 'b', '1', 9),
                                                                     (35, 'c', '1', 9),
                                                                     (36, 'd', '1', 9);

-- 28) Рёбра для Graf K₄ (Obr. 3.11) — те же 6 пар
INSERT INTO graph_links (id, link_id, weight, source, target, graph_data_id) VALUES
                                                                                 (41, '1', NULL, 'a', 'b', 9),
                                                                                 (42, '2', NULL, 'a', 'c', 9),
                                                                                 (43, '3', NULL, 'a', 'd', 9),
                                                                                 (44, '4', NULL, 'b', 'c', 9),
                                                                                 (45, '5', NULL, 'b', 'd', 9),
                                                                                 (46, '6', NULL, 'c', 'd', 9);

-- 29) Добавляем Article Definícia 3.2.8 — Komplementárny graf
INSERT INTO theory_content (id, content_type, title, data, media_link, theory_id) VALUES
    (12, 'Article', 'Definícia 3.2.8 — Komplementárny graf',
     'Nech {math}G{/math} je obyčajný graf na {math}n{/math} vrcholoch. Potom komplementárny (doplnkový) graf ku grafu {math}G{/math} označíme {math}\overline{G}{/math} a dostaneme ho tak, že z grafu {math}K_n{/math} vynesieme všetky hrany, ktoré patria do grafu {math}G{/math}.',
     '', 2);

-- 30) Добавляем Example Príklad 3.8 — Graf G и komplementárny \overline{G}
INSERT INTO theory_content (id, content_type, title, data, media_link, theory_id) VALUES
    (13, 'Example', 'Príklad 3.8',
     'Na obrázku 3.12 je graf {math}G{/math} (štvorcový cyklus). Na obrázku 3.13 je jeho komplementárny graf {math}\overline{G}{/math}.',
     '', 2);

-- 31) GraphData для Príklad 3.8
INSERT INTO graph_data (id, title, oriented, theory_content_id) VALUES
                                                                    (10, 'Graf G (Obr. 3.12)',             FALSE, 13),
                                                                    (11, 'Komplementárny graf \overline{G} (Obr. 3.13)', FALSE, 13);

-- 32) Узлы для Graf G (štvorcový cyklus)
INSERT INTO graph_nodes (id, node_id, node_group, graph_data_id) VALUES
                                                                     (37, '1', '1', 10),
                                                                     (38, '2', '1', 10),
                                                                     (39, '3', '1', 10),
                                                                     (40, '4', '1', 10);

-- 33) Рёбра для Graf G (cyklus 1-2-3-4-1)
INSERT INTO graph_links (id, link_id, weight, source, target, graph_data_id) VALUES
                                                                                 (47, '1', NULL, '1', '2', 10),
                                                                                 (48, '2', NULL, '2', '3', 10),
                                                                                 (49, '3', NULL, '3', '4', 10),
                                                                                 (50, '4', NULL, '4', '1', 10);

-- 34) Узлы для Komplementárny graf \overline{G}
INSERT INTO graph_nodes (id, node_id, node_group, graph_data_id) VALUES
                                                                     (41, '1', '1', 11),
                                                                     (42, '2', '1', 11),
                                                                     (43, '3', '1', 11),
                                                                     (44, '4', '1', 11);

-- 35) Рёбра для Komplementárny graf \overline{G} (diagonály 1-3 и 2-4)
INSERT INTO graph_links (id, link_id, weight, source, target, graph_data_id) VALUES
                                                                                 (51, '1', NULL, '1', '3', 11),
                                                                                 (52, '2', NULL, '2', '4', 11);


INSERT INTO theories (id, title) VALUES
    (3, 'Stromy');

-- 2) Добавляем определения и примеры для theory_id = 3
INSERT INTO theory_content (id, content_type, title, data, media_link, theory_id) VALUES
                                                                                      -- Definícia 4.2.1 — Strom
                                                                                      (14, 'Article', 'Definícia 4.2.1 — Strom',
                                                                                       'Súvislý a acyklický graf sa nazýva strom.',
                                                                                       '', 3),
                                                                                      -- Definícia 4.2.2 — Les
                                                                                      (15, 'Example', 'Definícia 4.2.2 — Les',
                                                                                       'Graf {math}G{/math}, ktorého všetky komponenty sú stromy, sa nazýva les.',
                                                                                       '', 3),
                                                                                      -- Definícia 4.2.3 — List
                                                                                      (16, 'Article', 'Definícia 4.2.3 — List',
                                                                                       'List je vrchol stromu, ktorého stupeň je 1.',
                                                                                       '', 3),
                                                                                      -- Príklad 4.4 (grafy na Obr. 4.4, 4.5 a Obr. 4.6)
                                                                                      (17, 'Example', 'Príklad 4.4',
                                                                                       'Grafy na obrázkoch 4.4 a 4.5 nie sú stromy. Graf na Obr. 4.4 síce nemá cyklus, ale nie je súvislý. Graf na Obr. 4.5 je síce súvislý, ale obsahuje cyklus {math}C_3{/math}. Graf na Obr. 4.6 je strom – súvislý a acyklický graf.',
                                                                                       '', 3),
                                                                                      -- Príklad 4.5 (strom so 4 listami)
                                                                                      (18, 'Example', 'Príklad 4.5',
                                                                                       'Graf na Obr. 4.6 je strom so 4 listami: {math}a, b, e, f{/math}, ktoré majú stupeň 1.',
                                                                                       '', 3),
                                                                                      -- Definícia 4.3.1 — Koreňový strom, koreň
                                                                                      (19, 'Article', 'Definícia 4.3.1 — Koreňový strom, koreň',
                                                                                       'Koreňový strom je strom s pevne vybraným vrcholom {math}u{/math}, ktorý sa nazýva koreň.',
                                                                                       '', 3),
                                                                                      -- Definícia 4.3.2 — Úroveň vrcholu, výška koreňového stromu
                                                                                      (20, 'Article', 'Definícia 4.3.2 — Úroveň vrcholu, výška koreňového stromu',
                                                                                       'Nech {math}T{/math} je koreňový strom s koreňom {math}u{/math}. Úroveň vrcholu {math}v{/math} je jeho vzdialenosť od koreňa. Výška koreňového stromu je maximálna úroveň, ktorú dosahujú jeho vrcholy.',
                                                                                       '', 3);

-- 6) Добавляем GraphData для TheoryContent id = 17 (Príklad 4.4)
INSERT INTO graph_data (id, title, oriented, theory_content_id) VALUES
                                                                    (12, 'Obr. 4.4 – Dva komponenty, acyklický, nesúvislý', FALSE, 17),
                                                                    (13, 'Obr. 4.5 – Súvislý graf s cyklom C₃',           FALSE, 17),
                                                                    (14, 'Obr. 4.6 – Strom (súvislý a acyklický)',          FALSE, 17);

-- (A) Узлы для Obr. 4.4 (graph_data_id = 12)
INSERT INTO graph_nodes (id, node_id, node_group, graph_data_id) VALUES
                                                                     (45, 'A', '1', 12),
                                                                     (46, 'B', '1', 12),
                                                                     (47, 'C', '1', 12),
                                                                     (48, 'D', '1', 12),
                                                                     (49, 'E', '2', 12),
                                                                     (50, 'F', '2', 12),
                                                                     (51, 'G', '2', 12);

-- (B) Узлы для Obr. 4.5 (graph_data_id = 13)
INSERT INTO graph_nodes (id, node_id, node_group, graph_data_id) VALUES
                                                                     (52, 'X', '1', 13),
                                                                     (53, 'Y', '1', 13),
                                                                     (54, 'Z', '1', 13);

-- (C) Узлы для Obr. 4.6 – Strom so 4 listami (graph_data_id = 14, theory_content_id = 18)
INSERT INTO graph_nodes (id, node_id, node_group, graph_data_id) VALUES
                                                                     (55, 'a', '1', 14),
                                                                     (56, 'b', '1', 14),
                                                                     (57, 'c', '2', 14),
                                                                     (58, 'd', '2', 14),
                                                                     (59, 'e', '1', 14),
                                                                     (60, 'f', '1', 14);

-- 7) Рёбра для всех добавленных графов, id начиная с 53
INSERT INTO graph_links (id, link_id, weight, source, target, graph_data_id) VALUES
                                                                                 -- Obr. 4.4 (12): А–B–C–D и E–F–G
                                                                                 (53, '1',  NULL, 'A', 'B', 12),
                                                                                 (54, '2',  NULL, 'B', 'C', 12),
                                                                                 (55, '3',  NULL, 'C', 'D', 12),
                                                                                 (56, '4',  NULL, 'E', 'F', 12),
                                                                                 (57, '5',  NULL, 'F', 'G', 12),

                                                                                 -- Obr. 4.5 (13): cyklus X–Y–Z
                                                                                 (58, '1',  NULL, 'X', 'Y', 13),
                                                                                 (59, '2',  NULL, 'Y', 'Z', 13),
                                                                                 (60, '3',  NULL, 'Z', 'X', 13),

                                                                                 -- Obr. 4.6 so 4 listami (14)
                                                                                 (61, 'h1', NULL, 'c', 'a', 14),
                                                                                 (62, 'h2', NULL, 'c', 'b', 14),
                                                                                 (63, 'h3', NULL, 'c', 'd', 14),
                                                                                 (64, 'h4', NULL, 'd', 'e', 14),
                                                                                 (65, 'h5', NULL, 'd', 'f', 14);


INSERT INTO graph_data (id, title, oriented, theory_content_id) VALUES
    (15, 'Obr. 4.2 – Les z dvoch stromov', FALSE, 15);

-- 2) Узлы (id = 61-67)
INSERT INTO graph_nodes (id, node_id, node_group, graph_data_id) VALUES
                                                                     -- дерево №1 (группа 1)
                                                                     (61, 'A', '1', 15),
                                                                     (62, 'B', '1', 15),
                                                                     (63, 'C', '1', 15),
                                                                     -- дерево №2 (группа 2)
                                                                     (64, 'D', '2', 15),
                                                                     (65, 'E', '2', 15),
                                                                     (66, 'F', '2', 15),
                                                                     (67, 'G', '2', 15);

-- 3) Рёбра (id = 66-70)
INSERT INTO graph_links (id, link_id, weight, source, target, graph_data_id) VALUES
                                                                                 -- дерево №1 (A-B-C)
                                                                                 (66, '1', NULL, 'A', 'B', 15),
                                                                                 (67, '2', NULL, 'B', 'C', 15),
                                                                                 -- дерево №2 (D-E-F-G цепочка)
                                                                                 (68, '3', NULL, 'D', 'E', 15),
                                                                                 (69, '4', NULL, 'E', 'F', 15),
                                                                                 (70, '5', NULL, 'F', 'G', 15);
-- 5) Выравниваем последовательности (serial / identity) под максимальные id из ручных INSERT

SELECT setval(pg_get_serial_sequence('users',               'id'), (SELECT MAX(id) FROM users));
SELECT setval(pg_get_serial_sequence('theories',            'id'), (SELECT MAX(id) FROM theories));
SELECT setval(pg_get_serial_sequence('theory_content',      'id'), (SELECT MAX(id) FROM theory_content));
SELECT setval(pg_get_serial_sequence('graph_data',          'id'), (SELECT MAX(id) FROM graph_data));
SELECT setval(pg_get_serial_sequence('graph_nodes',         'id'), (SELECT MAX(id) FROM graph_nodes));
SELECT setval(pg_get_serial_sequence('graph_links',         'id'), (SELECT MAX(id) FROM graph_links));
SELECT setval(pg_get_serial_sequence('practices',           'id'), (SELECT MAX(id) FROM practices));
SELECT setval(pg_get_serial_sequence('practice_content',    'id'), (SELECT MAX(id) FROM practice_content));
SELECT setval(pg_get_serial_sequence('possible_vertex_counts', 'id'), (SELECT MAX(id) FROM possible_vertex_counts));
SELECT setval(pg_get_serial_sequence('possible_edge_counts',   'id'), (SELECT MAX(id) FROM possible_edge_counts));
SELECT setval(pg_get_serial_sequence('graph_properties',    'id'), (SELECT MAX(id) FROM graph_properties));
