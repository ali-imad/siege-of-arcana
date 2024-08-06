# Siege of Arcana

## Project Overview

Siege of Arcana is a relational database-driven multiplayer game featuring
microtransactions, and match analytics. This is the CPSC 304 milestone project
and, as a web application, mocks the players client for this (fake) online,
match-based, multiplayer video game.

## Project Description

Our database intends to model a player-centric client for an online,
match-based, multiplayer video game. The entirety of player persistent
information, centered around individual player profiles and match history, will
be modeled in the database. The database will also model a centralized game shop
supporting player transactions.

Player profiles will be recorded, allowing users to update player information
(username, email, password), view their overall game statistics (wins, losses,
ranking), and their inventory (champions, skins, boosts). Match history will be
recorded to provide detailed match data (participants, outcome) and each
participant's individual performance (kills, assists, deaths). A marketplace for
in-game items for player purchase will also be recorded, tracking item
availability and promotions, as well as each player’s transaction history and
currency balance.

## Key Features

#### Player Profiles:

- Update player information: username, email, password.
- View overall game statistics: wins, losses, ranking.
- Manage inventory: cosmetics, consumables

#### Match History:

- Record match data: participants, outcome
- Track individual performance: kills, assists, deaths, experience gained.

#### Game Shop & Transactions:

- Centralized marketplace for in-game items with multiple shops.
- Contains player transaction history and currency balance.

## Building

#### Requirements:
- Node 20
- Postgresql

**Instructions:**
1. Navigate to `sql/` and insert `createSchemas.sql` and `insertSampleData.sql` to your database
2. Create a `.env` file in `frontend/` and `backend/` using the example `.env.sample` in each directory
3. Individually open a terminal window to each of `frontend/` and `backend/` and call `npm i` to install all dependencies
4. Call `npm run dev`in each terminal
5. Visit the application at `localhost:5173`
