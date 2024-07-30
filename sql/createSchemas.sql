-- Create the Player table
CREATE TABLE Player (
    playerID SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    password VARCHAR(50) NOT NULL,
    elo INTEGER,
    totalXP INTEGER
);

-- Create the PlayerRank table
CREATE TABLE PlayerRank (
    elo INTEGER PRIMARY KEY,
    rank VARCHAR(50) NOT NULL
);

-- Create the PlayerLevel table
CREATE TABLE PlayerLevel (
    xp INTEGER PRIMARY KEY,
    level INTEGER NOT NULL
);

-- Create the Match table
CREATE TABLE Match (
    matchID SERIAL PRIMARY KEY,
    mode VARCHAR(50) NOT NULL,
    map VARCHAR(50) NOT NULL,
    statsID1 INTEGER,
    statsID2 INTEGER,
    statsID3 INTEGER,
    statsID4 INTEGER,
    statsID5 INTEGER,
    statsID6 INTEGER,
    statsID7 INTEGER,
    statsID8 INTEGER,
    statsID9 INTEGER,
    statsID10 INTEGER
);

-- Create the MatchStats table
CREATE TABLE MatchStats (
    statsID SERIAL PRIMARY KEY,
    matchID INTEGER NOT NULL,
    playerID INTEGER NOT NULL,
    kills INTEGER,
    deaths INTEGER,
    assists INTEGER,
    outcome VARCHAR(50),
    FOREIGN KEY (matchID) REFERENCES Match(matchID),
    FOREIGN KEY (playerID) REFERENCES Player(playerID)
);

-- Create the temporary staging table MatchStatsTemp
CREATE TABLE MatchStatsTemp (
    statsID SERIAL PRIMARY KEY,
    matchID INTEGER,
    playerID INTEGER,
    kills INTEGER,
    deaths INTEGER,
    assists INTEGER,
    outcome VARCHAR(50)
);

ALTER TABLE Match 
    ADD CONSTRAINT fk_statsID1 FOREIGN KEY (statsID1) REFERENCES MatchStats(statsID) ON DELETE CASCADE,
    ADD CONSTRAINT fk_statsID2 FOREIGN KEY (statsID2) REFERENCES MatchStats(statsID) ON DELETE CASCADE,
    ADD CONSTRAINT fk_statsID3 FOREIGN KEY (statsID3) REFERENCES MatchStats(statsID) ON DELETE CASCADE,
    ADD CONSTRAINT fk_statsID4 FOREIGN KEY (statsID4) REFERENCES MatchStats(statsID) ON DELETE CASCADE,
    ADD CONSTRAINT fk_statsID5 FOREIGN KEY (statsID5) REFERENCES MatchStats(statsID) ON DELETE CASCADE,
    ADD CONSTRAINT fk_statsID6 FOREIGN KEY (statsID6) REFERENCES MatchStats(statsID) ON DELETE CASCADE,
    ADD CONSTRAINT fk_statsID7 FOREIGN KEY (statsID7) REFERENCES MatchStats(statsID) ON DELETE CASCADE,
    ADD CONSTRAINT fk_statsID8 FOREIGN KEY (statsID8) REFERENCES MatchStats(statsID) ON DELETE CASCADE,
    ADD CONSTRAINT fk_statsID9 FOREIGN KEY (statsID9) REFERENCES MatchStats(statsID) ON DELETE CASCADE,
    ADD CONSTRAINT fk_statsID10 FOREIGN KEY (statsID10) REFERENCES MatchStats(statsID) ON DELETE CASCADE;


-- Create the MatchReward table
CREATE TABLE MatchReward (
    efficacy FLOAT,
    outcome VARCHAR(50),
    xpGained INTEGER
);

-- Create the Performance table
CREATE TABLE Performance (
    kills INTEGER,
    deaths INTEGER,
    assists INTEGER,
    efficacy FLOAT
);

-- Create the Shop table
CREATE TABLE Shop (
    shopID SERIAL PRIMARY KEY,
    title VARCHAR(50) NOT NULL
);

-- Create the Currency table
CREATE TABLE Currency (
    currName VARCHAR(50) PRIMARY KEY,
    type BOOLEAN
);

-- Create the ShopItemSold table
CREATE TABLE ShopItemSold (
    itemID SERIAL PRIMARY KEY,
    shopID INTEGER NOT NULL,
    title VARCHAR(50) NOT NULL,
    cost INTEGER,
    currName VARCHAR(50),
    FOREIGN KEY (shopID) REFERENCES Shop(shopID),
    FOREIGN KEY (currName) REFERENCES Currency(currName)
);

-- Create the Cosmetic table
CREATE TABLE Cosmetic (
    itemID INTEGER PRIMARY KEY,
    rarity VARCHAR(50) NOT NULL,
    FOREIGN KEY (itemID) REFERENCES ShopItemSold(itemID)
);

-- Create the Consumable table
CREATE TABLE Consumable (
    itemID INTEGER PRIMARY KEY,
    expiration INTEGER,
    effect VARCHAR(50),
    FOREIGN KEY (itemID) REFERENCES ShopItemSold(itemID)
);

-- Create the ItemCategory table
CREATE TABLE ItemCategory (
    title VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL
);

-- Create the Inventory table
CREATE TABLE Inventory (
    invID SERIAL PRIMARY KEY,
    playerID INTEGER NOT NULL,
    FOREIGN KEY (playerID) REFERENCES Player(playerID)
);

-- Create the InventoryItem table
CREATE TABLE InventoryItem (
    invItemID SERIAL PRIMARY KEY,
    invID INTEGER NOT NULL,
    itemID INTEGER NOT NULL,
    quantity INTEGER,
    FOREIGN KEY (invID) REFERENCES Inventory(invID),
    FOREIGN KEY (itemID) REFERENCES ShopItemSold(itemID)
);

-- Create the CurrBalance table
CREATE TABLE CurrBalance (
    balanceID SERIAL PRIMARY KEY,
    playerID INTEGER NOT NULL,
    currName VARCHAR(50) NOT NULL,
    amount INTEGER,
    FOREIGN KEY (playerID) REFERENCES Player(playerID),
    FOREIGN KEY (currName) REFERENCES Currency(currName)
);

-- Create the Transaction table
CREATE TABLE Transaction (
    txID SERIAL PRIMARY KEY,
    playerID INTEGER NOT NULL,
    itemID INTEGER NOT NULL,
    balanceID INTEGER NOT NULL,
    cost INTEGER,
    FOREIGN KEY (playerID) REFERENCES Player(playerID),
    FOREIGN KEY (itemID) REFERENCES ShopItemSold(itemID),
    FOREIGN KEY (balanceID) REFERENCES CurrBalance(balanceID)
);

-- Create the SaleAmount table
CREATE TABLE SaleAmount (
    itemID INTEGER NOT NULL,
    cost INTEGER,
    quantity INTEGER,
    FOREIGN KEY (itemID) REFERENCES ShopItemSold(itemID)
);
