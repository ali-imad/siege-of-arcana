-- Drop all tables in this file
DROP TABLE IF EXISTS Transaction;
DROP TABLE IF EXISTS SaleAmount;
DROP TABLE IF EXISTS CurrBalance;
DROP TABLE IF EXISTS InventoryItem;
DROP TABLE IF EXISTS Inventory;
DROP TABLE IF EXISTS ItemCategory;
DROP TABLE IF EXISTS Consumable;
DROP TABLE IF EXISTS Cosmetic;
DROP TABLE IF EXISTS ShopItemSold;
DROP TABLE IF EXISTS Item;
DROP TABLE IF EXISTS Currency;
DROP TABLE IF EXISTS Shop;
DROP TABLE IF EXISTS Performance;
DROP TABLE IF EXISTS MatchReward;
DROP TABLE IF EXISTS MatchStatsTemp;
DROP TABLE IF EXISTS MatchStats;
DROP TABLE IF EXISTS Match;
DROP TABLE IF EXISTS PlayerLevel;
DROP TABLE IF EXISTS PlayerRank;
DROP TABLE IF EXISTS Player;

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
    datePlayed VARCHAR(50) NOT NULL
);

-- Create the MatchStats table
CREATE TABLE MatchStats (
    statsID SERIAL PRIMARY KEY,
    matchID INTEGER NOT NULL,
    playerID INTEGER NOT NULL,
    xpGain INTEGER NOT NULL,
    kills INTEGER,
    deaths INTEGER,
    assists INTEGER,
    outcome VARCHAR(50),
    FOREIGN KEY (matchID) REFERENCES Match(matchID) ON DELETE CASCADE,
    FOREIGN KEY (playerID) REFERENCES Player(playerID)
);

-- Create the temporary staging table MatchStatsTemp
CREATE TABLE MatchStatsTemp (
    statsID SERIAL PRIMARY KEY,
    matchID INTEGER,
    playerID INTEGER,
    xpGain INTEGER,
    kills INTEGER,
    deaths INTEGER,
    assists INTEGER,
    outcome VARCHAR(50)
);

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

CREATE TABLE Item (
    itemID SERIAL PRIMARY KEY,
    title VARCHAR(50) NOT NULL
);

-- Create the ShopItemSold table
CREATE TABLE ShopItemSold (
    itemID INTEGER NOT NULL,
    shopID INTEGER NOT NULL,
    cost INTEGER,
    currName VARCHAR(50),
    PRIMARY KEY (itemID, shopID),
    FOREIGN KEY (shopID) REFERENCES Shop(shopID),
    FOREIGN KEY (itemID) REFERENCES Item(itemID),
    FOREIGN KEY (currName) REFERENCES Currency(currName)
);

-- Create the Cosmetic table
CREATE TABLE Cosmetic (
    itemID INTEGER PRIMARY KEY,
    rarity VARCHAR(50) NOT NULL,
    FOREIGN KEY (itemID) REFERENCES Item(itemID)
);

-- Create the Consumable table
CREATE TABLE Consumable (
    itemID INTEGER PRIMARY KEY,
    expiration INTEGER,
    effect VARCHAR(50),
    FOREIGN KEY (itemID) REFERENCES Item(itemID)
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
    invName VARCHAR(50) NOT NULL,
    FOREIGN KEY (playerID) REFERENCES Player(playerID)
);

-- Create the InventoryItem table (weak entity)
CREATE TABLE InventoryItem (
    invID INTEGER NOT NULL,
    itemID INTEGER NOT NULL,
    quantity INTEGER,
    PRIMARY KEY (invID, itemID),
    FOREIGN KEY (invID) REFERENCES Inventory(invID),
    FOREIGN KEY (itemID) REFERENCES Item(itemID)
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

-- Create the SaleAmount table
CREATE TABLE SaleAmount (
    itemID INTEGER NOT NULL,
    shopID INTEGER NOT NULL,
    cost INTEGER NOT NULL,
    quantity INTEGER,
    PRIMARY KEY (itemID, shopID, cost),
    FOREIGN KEY (itemID, shopID) REFERENCES ShopItemSold(itemID, shopID)
);

-- Create the Transaction table
CREATE TABLE Transaction (
    txID SERIAL PRIMARY KEY,
    playerID INTEGER NOT NULL,
    itemID INTEGER NOT NULL,
    shopID INTEGER NOT NULL,
    invID INTEGER NOT NULL,
    balanceID INTEGER NOT NULL,
    cost INTEGER,
    FOREIGN KEY (playerID) REFERENCES Player(playerID),
    FOREIGN KEY (invID) REFERENCES Inventory(invID),
    FOREIGN KEY (itemID) REFERENCES Item(itemID),
    FOREIGN KEY (itemID, shopID) REFERENCES ShopItemSold(itemID, shopID),
    FOREIGN KEY (balanceID) REFERENCES CurrBalance(balanceID),
    FOREIGN KEY (itemID, cost, shopID) REFERENCES SaleAmount(itemID, cost, shopID) ON DELETE CASCADE
);

