-- Insert administrator player profile
INSERT INTO Player (playerID, username, email, password, elo, totalXP) VALUES
(0, 'admin', 'admin@gamecompany.com', 'superSecurePassword123', 9999, 999999);

-- Insert regular players
INSERT INTO Player (playerID, username, email, password, elo, totalXP) VALUES
(1, 'Ali', 'ali@foo.com', 'password1234567890', 1000, 0),
(2, 'Sharjeel', 'sharjeel@foo.com', 'password1234567890', 800, 2000),
(3, 'Zaid', 'zaid@foo.com', 'qwerty', 700, 7000),
(4, 'Steve', 'steve@foo.com', 'askldfjdsl', 1200, 4000),
(5, 'Wozniak', 'wozniak@foo.com', 'password1234567890', 1550, 5500),
(6, 'Emma', 'emma@foo.com', 'securepass123', 900, 3000),
(7, 'Olivia', 'olivia@foo.com', 'oliviapass456', 1100, 3500),
(8, 'Noah', 'noah@foo.com', 'noahsark789', 1300, 4500),
(9, 'Liam', 'liam@foo.com', 'liamstrong321', 1400, 5000),
(10, 'Ava', 'ava@foo.com', 'avapwd987', 1000, 3200);

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
INSERT INTO Match (matchID, mode, map) VALUES
(1, '5v5', 'Map1'),
(2, '5v5', 'Map2'),
(3, '5v5', 'Map3'),
(4, '5v5', 'Map1'),
(5, '5v5', 'Map3');

-- Insert match statistics into staging table
INSERT INTO MatchStatsTemp (matchID, playerID, kills, deaths, assists, outcome) VALUES
-- Match 1
(1, 1, 15, 10, 5, 'Win'),
(1, 2, 12, 8, 3, 'Win'),
(1, 3, 10, 12, 6, 'Win'),
(1, 4, 18, 7, 4, 'Win'),
(1, 5, 8, 15, 7, 'Win'),
(1, 6, 11, 13, 2, 'Loss'),
(1, 7, 9, 14, 5, 'Loss'),
(1, 8, 13, 11, 3, 'Loss'),
(1, 9, 7, 16, 8, 'Loss'),
(1, 10, 10, 12, 4, 'Loss'),
-- Match 2
(2, 1, 20, 8, 3, 'Win'),
(2, 3, 16, 10, 5, 'Win'),
(2, 5, 14, 12, 7, 'Win'),
(2, 7, 18, 9, 4, 'Win'),
(2, 9, 12, 11, 6, 'Win'),
(2, 2, 10, 15, 2, 'Loss'),
(2, 4, 9, 17, 3, 'Loss'),
(2, 6, 11, 14, 5, 'Loss'),
(2, 8, 13, 13, 4, 'Loss'),
(2, 10, 8, 16, 7, 'Loss'),
-- Match 3
(3, 2, 17, 9, 4, 'Win'),
(3, 4, 15, 11, 6, 'Win'),
(3, 6, 13, 10, 5, 'Win'),
(3, 8, 19, 8, 3, 'Win'),
(3, 10, 11, 12, 7, 'Win'),
(3, 1, 10, 14, 3, 'Loss'),
(3, 3, 9, 15, 4, 'Loss'),
(3, 5, 12, 13, 5, 'Loss'),
(3, 7, 8, 16, 6, 'Loss'),
(3, 9, 11, 14, 4, 'Loss'),
-- Match 4
(4, 1, 16, 11, 5, 'Win'),
(4, 4, 18, 9, 4, 'Win'),
(4, 7, 14, 12, 6, 'Win'),
(4, 8, 20, 7, 3, 'Win'),
(4, 9, 15, 10, 5, 'Win'),
(4, 2, 11, 15, 3, 'Loss'),
(4, 3, 9, 17, 4, 'Loss'),
(4, 5, 12, 14, 5, 'Loss'),
(4, 6, 10, 16, 6, 'Loss'),
(4, 10, 8, 18, 7, 'Loss'),
-- Match 5
(5, 3, 19, 8, 4, 'Win'),
(5, 5, 17, 10, 5, 'Win'),
(5, 6, 15, 11, 6, 'Win'),
(5, 9, 21, 7, 3, 'Win'),
(5, 10, 16, 9, 5, 'Win'),
(5, 1, 12, 14, 3, 'Loss'),
(5, 2, 10, 15, 4, 'Loss'),
(5, 4, 11, 13, 5, 'Loss'),
(5, 7, 9, 16, 6, 'Loss'),
(5, 8, 13, 12, 4, 'Loss');

-- Move data from staging table to MatchStats
INSERT INTO MatchStats (matchID, playerID, kills, deaths, assists, outcome)
SELECT matchID, playerID, kills, deaths, assists, outcome
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

-- Insert shops
INSERT INTO Shop (shopID, title) VALUES
(1, 'Main Shop'),
(2, 'Event Shop');

-- Insert currencies
INSERT INTO Currency (currName, type) VALUES
('Gold', TRUE),
('Silver', TRUE),
('Essence', FALSE),
('Artifacts', FALSE),
('Relics', FALSE),
('Platinum', TRUE);  -- Added 'Platinum'

-- Insert shop items sold
INSERT INTO ShopItemSold (itemID, shopID, title, cost, currName) VALUES
(1001, 1, 'Cape', 100, 'Gold'),
(1002, 1, 'Shield', 200, 'Silver'),
(1003, 1, 'Potion of Experience Gain', 100, 'Gold'),
(1004, 1, 'Arrow', 150, 'Silver'),
(1005, 1, 'Bow', 200, 'Essence'),
(1006, 2, 'Festive Dress', 100, 'Essence'),
(1007, 2, 'Potion of Strength', 20, 'Gold'),
(1008, 2, 'Potion of Strength', 200, 'Essence'),
(1009, 2, 'Bow tie', 200, 'Essence'),
(1010, 2, 'Hat', 200, 'Essence');

-- Insert cosmetic items
INSERT INTO Cosmetic (itemID, rarity) VALUES
(1001, 'Rare'),
(1002, 'Common'),
(1006, 'Common'),
(1009, 'Mythic'),
(1010, 'Legendary');

-- Insert consumable items
INSERT INTO Consumable (itemID, expiration, effect) VALUES
(1003, 30, 'Gain 100 xp'),
(1004, 15, 'Does 20 damage'),
(1005, 20, 'Fire arrow, 20 uses'),
(1007, 20, 'Increases damage'),
(1008, 20, 'Increases damage');

-- Insert item categories
INSERT INTO ItemCategory (title, category) VALUES
('Cape', 'Cosmetic'),
('Shield', 'Cosmetic'),
('Potion of Experience Gain', 'Consumable'),
('Potion of Strength', 'Consumable'),
('Arrow', 'Consumable'),
('Bow', 'Consumable'),
('Festive Dress', 'Cosmetic'),
('Bow tie', 'Cosmetic'),
('Hat', 'Cosmetic');

-- Insert inventories
INSERT INTO Inventory (invID, playerID) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5),
(0, 0);

-- Insert inventory items
INSERT INTO InventoryItem (invItemID, invID, itemID, quantity) VALUES
(1, 1, 1001, 2),
(2, 2, 1002, 3),
(3, 3, 1003, 5),
(4, 4, 1004, 1),
(5, 5, 1005, 4),
(0, 0, 1010, 1);

-- Insert currency balances (must be after Currency insertion)
INSERT INTO CurrBalance (balanceID, playerID, currName, amount) VALUES
(201, 1, 'Gold', 1000),
(202, 2, 'Silver', 500),
(203, 1, 'Essence', 2000),
(204, 4, 'Gold', 1500),
(205, 5, 'Platinum', 3000),  -- Ensure 'Platinum' exists
(206, 2, 'Gold', 2000),
(200, 0, 'Gold', 1000000),
(207, 0, 'Silver', 1000000),
(208, 0, 'Platinum', 1000000),
(209, 0, 'Essence', 1000000),
(210, 0, 'Artifacts', 1000000),
(211, 0, 'Relics', 1000000);

-- Insert transactions (must be after CurrBalance insertion)
INSERT INTO Transaction (txID, playerID, itemID, balanceID, cost) VALUES
(1, 1, 1001, 201, 50),
(2, 2, 1002, 202, 75),
(3, 3, 1003, 203, 100),
(4, 4, 1004, 204, 150),
(5, 5, 1005, 205, 200);

-- Insert sale amounts
INSERT INTO SaleAmount (itemID, cost, quantity) VALUES
(1001, 50, 10),
(1002, 75, 20),
(1003, 100, 15),
(1004, 150, 8),
(1005, 200, 5);

