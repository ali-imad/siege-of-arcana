-- Insert administrator player profile (pid = 0)
INSERT INTO Player (playerID, username, email, password, elo, totalXP) VALUES
(0, 'admin', 'admin@gamecompany.com', 'superSecurePassword123', 9999, 999999);

-- Insert regular players
INSERT INTO Player (username, email, password, elo, totalXP) VALUES
('Ali', 'ali@foo.com', 'password1234567890', 1000, 12000),
('Sharjeel', 'sharjeel@foo.com', 'password1234567890', 800, 2000),
('Zaid', 'zaid@foo.com', 'qwerty', 700, 7000),
('Steve', 'steve@foo.com', 'askldfjdsl', 1200, 4000),
('Wozniak', 'wozniak@foo.com', 'password1234567890', 1550, 5500),
('Emma', 'emma@foo.com', 'securepass123', 900, 3000),
('Olivia', 'olivia@foo.com', 'oliviapass456', 1100, 3500),
('Noah', 'noah@foo.com', 'noahsark789', 1300, 4500),
('Liam', 'liam@foo.com', 'liamstrong321', 1400, 5000),
('Ava', 'ava@foo.com', 'avapwd987', 1000, 3200);

-- Insert player ranks
INSERT INTO PlayerRank (elo, rank) VALUES
(700, 'Wood'),
(800, 'Bronze'),
(900, 'Bronze'),
(1000, 'Silver'),
(1100, 'Silver'),
(1200, 'Silver'),
(1300, 'Silver'),
(1400, 'Gold'),
(1500, 'Gold'),
(1550, 'Gold'),
(1600, 'Platinum'),
(1700, 'Diamond'),
(2000, 'Elite'),
(9999, 'Admin');

-- Insert player levels
INSERT INTO PlayerLevel (xp, level) VALUES
(0, 1),
(2000, 2),
(3000, 3),
(4000, 4),
(5000, 5),
(5500, 5),
(6000, 6),
(7000, 7),
(999999, 100);

-- Insert matches
INSERT INTO Match (mode, map, datePlayed) VALUES
('5v5', 'Map1', '2023-03-02 14:00:00'),
('5v5', 'Map2', '2023-08-22 15:00:00'),
('5v5', 'Map3', '2024-04-03 16:00:00'),
('5v5', 'Map1', '2024-05-16 17:00:00'),
('5v5', 'Map3', '2024-08-01 18:00:00'),
('3v3', 'Map1', '2023-03-02 14:00:00');

-- Insert match stats staging table
INSERT INTO MatchStatsTemp (matchID, playerID, xpGain, kills, deaths, assists, outcome) VALUES
-- Match 1
(1, 1, 100, 15, 10, 5, 'Win'),
(1, 2, 120, 12, 8, 3, 'Win'),
(1, 3, 130, 10, 12, 6, 'Win'),
(1, 4, 140, 18, 7, 4, 'Win'),
(1, 5, 150, 8, 15, 7, 'Win'),
(1, 6, 80, 11, 13, 2, 'Loss'),
(1, 7, 90, 9, 14, 5, 'Loss'),
(1, 8, 100, 13, 11, 3, 'Loss'),
(1, 9, 70, 7, 16, 8, 'Loss'),
(1, 10, 110, 10, 12, 4, 'Loss'),
-- Match 2
(2, 1, 150, 20, 8, 3, 'Win'),
(2, 3, 160, 16, 10, 5, 'Win'),
(2, 5, 140, 14, 12, 7, 'Win'),
(2, 7, 130, 18, 9, 4, 'Win'),
(2, 9, 120, 12, 11, 6, 'Win'),
(2, 2, 90, 10, 15, 2, 'Loss'),
(2, 4, 80, 9, 17, 3, 'Loss'),
(2, 6, 70, 11, 14, 5, 'Loss'),
(2, 8, 60, 13, 13, 4, 'Loss'),
(2, 10, 50, 8, 16, 7, 'Loss'),
-- Match 3
(3, 2, 170, 17, 9, 4, 'Win'),
(3, 4, 160, 15, 11, 6, 'Win'),
(3, 6, 150, 13, 10, 5, 'Win'),
(3, 8, 180, 19, 8, 3, 'Win'),
(3, 10, 140, 11, 12, 7, 'Win'),
(3, 1, 75, 10, 14, 3, 'Loss'),
(3, 3, 65, 9, 15, 4, 'Loss'),
(3, 5, 85, 12, 13, 5, 'Loss'),
(3, 7, 55, 8, 16, 6, 'Loss'),
(3, 9, 45, 11, 14, 4, 'Loss'),
-- Match 4
(4, 1, 160, 16, 11, 5, 'Win'),
(4, 4, 150, 18, 9, 4, 'Win'),
(4, 7, 140, 14, 12, 6, 'Win'),
(4, 8, 130, 20, 7, 3, 'Win'),
(4, 9, 120, 15, 10, 5, 'Win'),
(4, 2, 90, 11, 15, 3, 'Loss'),
(4, 3, 80, 9, 17, 4, 'Loss'),
(4, 5, 70, 12, 14, 5, 'Loss'),
(4, 6, 60, 10, 16, 6, 'Loss'),
(4, 10, 50, 8, 18, 7, 'Loss'),
-- Match 5
(5, 3, 190, 19, 8, 4, 'Win'),
(5, 5, 180, 17, 10, 5, 'Win'),
(5, 6, 170, 15, 11, 6, 'Win'),
(5, 9, 200, 21, 7, 3, 'Win'),
(5, 10, 160, 16, 9, 5, 'Win'),
(5, 1, 75, 12, 14, 3, 'Loss'),
(5, 2, 65, 10, 15, 4, 'Loss'),
(5, 4, 85, 11, 13, 5, 'Loss'),
(5, 7, 55, 9, 16, 6, 'Loss'),
(5, 8, 45, 13, 12, 4, 'Loss');

-- Move data from staging table to MatchStats
INSERT INTO MatchStats (matchID, playerID, xpGain, kills, deaths, assists, outcome)
SELECT matchID, playerID, xpGain, kills, deaths, assists, outcome
FROM MatchStatsTemp;

-- Update Match table with statsID references
UPDATE Match m
SET 
    statsID1 = (SELECT statsID FROM MatchStats ms WHERE ms.matchID = m.matchID ORDER BY statsID LIMIT 1 OFFSET 0),
    statsID2 = (SELECT statsID FROM MatchStats ms WHERE ms.matchID = m.matchID ORDER BY statsID LIMIT 1 OFFSET 1),
    statsID3 = (SELECT statsID FROM MatchStats ms WHERE ms.matchID = m.matchID ORDER BY statsID LIMIT 1 OFFSET 2),
    statsID4 = (SELECT statsID FROM MatchStats ms WHERE ms.matchID = m.matchID ORDER BY statsID LIMIT 1 OFFSET 3),
    statsID5 = (SELECT statsID FROM MatchStats ms WHERE ms.matchID = m.matchID ORDER BY statsID LIMIT 1 OFFSET 4),
    statsID6 = (SELECT statsID FROM MatchStats ms WHERE ms.matchID = m.matchID ORDER BY statsID LIMIT 1 OFFSET 5),
    statsID7 = (SELECT statsID FROM MatchStats ms WHERE ms.matchID = m.matchID ORDER BY statsID LIMIT 1 OFFSET 6),
    statsID8 = (SELECT statsID FROM MatchStats ms WHERE ms.matchID = m.matchID ORDER BY statsID LIMIT 1 OFFSET 7),
    statsID9 = (SELECT statsID FROM MatchStats ms WHERE ms.matchID = m.matchID ORDER BY statsID LIMIT 1 OFFSET 8),
    statsID10 = (SELECT statsID FROM MatchStats ms WHERE ms.matchID = m.matchID ORDER BY statsID LIMIT 1 OFFSET 9);

-- Clear the staging table
DELETE FROM MatchStatsTemp;
-- Insert match rewards
INSERT INTO MatchReward (efficacy, outcome, xpGained) VALUES
(0.8, 'Win', 500),
(0.7, 'Loss', 300),
(0.9, 'Win', 600),
(0.6, 'Loss', 200),
(0.85, 'Win', 550);

-- Insert performance
INSERT INTO Performance (kills, deaths, assists, efficacy) VALUES
(10, 2, 5, 0.8),
(8, 3, 4, 0.7),
(6, 4, 3, 0.65),
(12, 1, 7, 0.9),
(9, 5, 6, 0.75);

-- Insert shops (removed shopID as it's SERIAL)
INSERT INTO Shop (title) VALUES
('General Shop'),
('Premium Shop'),
('Researcher Shop'),
('Enchanter Shop'),
('Loyalty Shop');

-- Insert currencies (unchanged)
INSERT INTO Currency (currName, type) VALUES
('Gold', TRUE),
('Silver', TRUE),
('Platinum', TRUE),
('Essence', FALSE),
('Artifacts', FALSE);

-- Insert items
INSERT INTO Item (itemID, title) VALUES
(1, 'Health Potion'),
(2, 'Strength Potion'),
(3, 'Bow'),
(4, 'Magic Wand'),
(5, 'Potion of Experience Gain'),
(6, 'Iron Sword'),
(7, 'Leather Armor'),
(8, 'Golden Armor'),
(9, 'Enchanted Sword'),
(10, 'Ancient Scroll'),
(11, 'Mysterious Relic'),
(12, 'Enchanted Gem'),
(13, 'Magical Dust'),
(14, 'Exclusive Mount'),
(15, 'Rare Pet');


-- Insert shop items
INSERT INTO ShopItemSold (itemID, shopID, cost, currName) VALUES
-- General Shop
(1, 1, 10, 'Silver'), -- Health Potion
(2, 1, 15, 'Silver'), -- Strength Potion
(3, 1, 500, 'Silver'),-- Bow
(4, 1, 20, 'Silver'), -- Magic Wand
(5, 1, 30, 'Silver'), -- Potion of Experience Gain
(6, 1, 100, 'Silver'),-- Iron Sword
(7, 1, 50, 'Silver'), -- Leather Armor
(8, 1, 200, 'Silver'),-- Golden Armor
(9, 1, 35, 'Silver'), -- Enchanted Sword
(10, 1, 200, 'Silver'),-- Ancient Scroll
(11, 1, 15, 'Silver'),-- Mysterious Relic
(12, 1, 50, 'Silver'),-- Enchanted Gem
(13, 1, 10, 'Silver'),-- Magical Dust
(14, 1, 200, 'Silver'),-- Exclusive Mount
(15, 1, 150, 'Silver'),-- Rare Pet
-- Premium Shop
(1, 2, 50, 'Gold'), -- Health Potion
(2, 2, 75, 'Gold'), -- Strength Potion
(3, 2, 15, 'Gold'), -- Bow
(4, 2, 200, 'Gold'),-- Magic Wand
(5, 2, 150, 'Gold'),-- Potion of Experience Gain
-- Researcher Shop
(10, 3, 20, 'Artifacts'), -- Ancient Scroll
(11, 3, 5, 'Artifacts'),  -- Mysterious Relic
(12, 3, 30, 'Artifacts'), -- Enchanted Gem
(13, 3, 50, 'Artifacts'), -- Magical Dust
-- Enchanter Shop
(9, 4, 35, 'Essence'), -- Enchanted Sword
(10, 4, 10, 'Essence'),-- Ancient Scroll
(11, 4, 40, 'Essence'),-- Mysterious Relic
(12, 4, 15, 'Essence'),-- Enchanted Gem
-- Loyalty Shop
(5, 5, 10, 'Platinum'),  -- Potion of Experience Gain
(9, 5, 20, 'Platinum'),  -- Enchanted Sword
(13, 5, 5, 'Platinum'),  -- Magical Dust
(14, 5, 100, 'Platinum'),-- Exclusive Mount
(15, 5, 50, 'Platinum');  -- Rare Pet

-- Insert consumable items
INSERT INTO Consumable (itemID, expiration, effect) VALUES
(1, null, 'Heals 50 HP'),
(2, null, 'Increases strength by 10% for 30 seconds'),
(5, 30, 'Grants 100 XP'),
(13, null, 'Grants 10 Essence');

INSERT INTO Cosmetic (itemID, rarity) VALUES
(3, 'Common'),
(4, 'Uncommon'),
(6, 'Common'),
(7, 'Common'),
(8, 'Rare'),
(9, 'Rare'),
(10, 'Epic'),
(11, 'Epic'),
(12, 'Epic'),
(14, 'Epic'),
(15, 'Legendary');

-- Insert item categories (unchanged)
INSERT INTO ItemCategory (title, category) VALUES
('Health Potion', 'Consumable'),
('Strength Potion', 'Consumable'),
('Bow', 'Equipment'),
('Magic Wand', 'Equipment'),
('Potion of Experience Gain', 'Consumable'),
('Iron Sword', 'Equipment'),
('Leather Armor', 'Equipment'),
('Golden Armor', 'Equipment'),
('Enchanted Sword', 'Equipment'),
('Ancient Scroll', 'Equipment'),
('Mysterious Relic', 'Equipment'),
('Enchanted Gem', 'Equipment'),
('Magical Dust', 'Consumable'),
('Exclusive Mount', 'Equipment'),
('Rare Pet', 'Equipment');

-- Insert inventories
INSERT INTO Inventory (invName, playerID) VALUES
('Main',0),   -- 1
('Main',1),
('Main',2),
('Main',3),
('Main',4),
('Main',5),
('Main',6),
('Main',7),
('Main',8),
('Main',9),
('Main',10),
('Gift Box',0), -- 12
('Gift Box',1), -- 13
('Gift Box',2), -- 14
('Gift Box',3), -- 15
('Gift Box',4),
('Gift Box',5),
('Gift Box',6),
('Gift Box',7),
('Gift Box',8),
('Gift Box',9),
('Gift Box',10);

-- Insert sample transactions and populate inventories
-- Note: We're assuming that the itemIDs are assigned in the order of insertion into ShopItemSold
INSERT INTO InventoryItem (invID, itemID, quantity) VALUES
-- Player 1 (Ali)
(2, 1, 5),  -- 5 Health Potions
(2, 4, 2),  -- 2 Potions of Experience Gain
(2, 3, 1),  -- 1 Bow
-- Player 2 (Sharjeel)
(3, 2, 3),  -- 3 Strength Potions
(3, 5, 1),  -- 1 Iron Sword
(3, 3, 1),  -- 1 Bow
-- Player 3 (Zaid)
(4, 4, 10), -- 10 Potions of Experience Gain
(4, 6, 1),  -- 1 Leather Armor
-- Player 4 (Steve)
(5, 4, 1),  -- 1 Magic Wand,
(5, 10, 1), -- 1 Golden Armor
-- Player 5 (Wozniak)
(6, 4, 1),  -- 1 Magic Wand (Researcher)
(6, 10, 2), -- 2 Ancient Scrolls
(6, 5, 5);  -- 5 Potions of Experience Gain (Loyalty)

-- Insert currency balances (removed balanceID as it's SERIAL)
INSERT INTO CurrBalance (playerID, currName, amount) VALUES
-- Player 1 (Ali)
(1, 'Gold', 100),
(1, 'Silver', 4300),  -- (5000 - 50 - 150 - 500)
(1, 'Essence', 0),
(1, 'Artifacts', 0),
(1, 'Platinum', 4),
-- Player 2
(2, 'Gold', 100),
(2, 'Silver', 4650),  -- (5000 - 150 - 100 - 200)
(2, 'Essence', 0),
(2, 'Artifacts', 0),
(2, 'Platinum', 30),
-- Player 3
(3, 'Gold', 300),
(3, 'Silver', 3350),  -- (5000 - 1500 - 100)
(3, 'Essence', 0),
(3, 'Artifacts', 0),
(3, 'Platinum', 20),
-- Player 4
(4, 'Gold', 1130),  -- (Steve buys gold)
(4, 'Silver', 4600),
(4, 'Essence', 0),
(4, 'Artifacts', 0),
(4, 'Platinum', 20),
-- Player 5
(5, 'Gold', 1550),  -- (Wozniak buys gold)
(5, 'Silver', 4550),  -- (5000 - 30 - 400 - 50)
(5, 'Essence', 0),
(5, 'Artifacts', 3),  -- Left over
(5, 'Platinum', 10),

-- Players 6-10 (unchanged)
(6, 'Gold', 80),
(6, 'Silver', 1500),
(6, 'Essence', 40),
(6, 'Artifacts', 25),
(6, 'Platinum', 7),
(7, 'Gold', 120),
(7, 'Silver', 2200),
(7, 'Essence', 65),
(7, 'Artifacts', 18),
(7, 'Platinum', 9),
(8, 'Gold', 180),
(8, 'Silver', 2800),
(8, 'Essence', 90),
(8, 'Artifacts', 35),
(8, 'Platinum', 11),
(9, 'Gold', 160),
(9, 'Silver', 2500),
(9, 'Essence', 80),
(9, 'Artifacts', 28),
(9, 'Platinum', 10),
(10, 'Gold', 140),
(10, 'Silver', 2300),
(10, 'Essence', 70),
(10, 'Artifacts', 22),
(10, 'Platinum', 8);

-- Insert sample data for SaleAmount based on the transactions
INSERT INTO SaleAmount (itemID, shopID, cost, quantity) VALUES
-- Player 1
(1, 1, 50, 5),  -- 5 Health Potions
(5, 1, 30, 2),  -- 2 Potions of Experience Gain
(3, 1, 500, 1), -- 1 Bow
-- Player 2
(2, 1, 15, 3),  -- 3 Strength Potions
(6, 1, 150, 1), -- 1 Iron Sword
-- duplicate
-- Player 3
(7, 1, 100, 1), -- 1 Leather Armor
-- Player 4
(4, 1, 30, 1),  -- 1 Magic Wand
(8, 1, 200, 1),-- 1 Golden Armor
-- Player 5
(10, 1, 200, 2);-- 2 Ancient Scrolls


-- Insert transactions
INSERT INTO Transaction (playerID, invID, shopID, itemID, balanceID, cost) VALUES
-- Player 1
(2, 1, 1, 1, 1, 50),  -- 5 Health Potions
(2, 1, 1, 5, 2, 30),  -- 2 Potions of Experience Gain
(2, 1, 1, 3, 3, 500), -- 1 Bow
-- Player 2
(3, 1, 1, 2, 4, 15),  -- 3 Strength Potions
(3, 1, 1, 6, 5, 150), -- 1 Iron Sword
(3, 1, 1, 3, 6, 500), -- 1 Bow
-- Player 3
(4, 1, 1, 5, 7, 30),  -- 1 Potions of Experience Gain
(4, 1, 1, 7, 8, 100), -- 1 Leather Armor
-- Player 4
(5, 1, 1, 4, 9, 30),  -- 1 Magic Wand
(5, 1, 1, 8, 10, 200),-- 1 Golden Armor
-- Player 5
(6, 1, 1, 10, 11, 200),-- 2 Ancient Scrolls
(6, 1, 1, 5, 12, 30);  -- 2 Potions of Experience Gain

