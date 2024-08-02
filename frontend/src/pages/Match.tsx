import React from "react";
import { useParams, useNavigate } from "react-router-dom";

const matches = [
  {
    matchID: 1,
    datePlayed: "2024-07-01",
    mode: "Deathmatch",
    map: "Dust II",
    xpGain: 500,
    eloChange: 25,
    result: "Win",
    allies: [
      { profile: "Ali", kda: "10/5/8", efficacy: 0.9 },
      { profile: "Sharj", kda: "8/3/10", efficacy: 0.85 },
      { profile: "Ali", kda: "10/5/8", efficacy: 0.9 },
      { profile: "Sharj", kda: "8/3/10", efficacy: 0.85 },
      { profile: "Ali", kda: "10/5/8", efficacy: 0.9 },
      { profile: "Sharj", kda: "8/3/10", efficacy: 0.85 },
    ],
    enemies: [
      { profile: "Gregor", kda: "5/10/2", efficacy: 0.5 },
      { profile: "Jordan", kda: "4/9/3", efficacy: 0.45 },
      { profile: "Ali", kda: "10/5/8", efficacy: 0.9 },
      { profile: "Sharj", kda: "8/3/10", efficacy: 0.85 },
      { profile: "Ali", kda: "10/5/8", efficacy: 0.9 },
      { profile: "Sharj", kda: "8/3/10", efficacy: 0.85 },
    ],
  },
  {
    matchID: 2,
    datePlayed: "2024-07-02",
    mode: "Competitive",
    map: "Mirage",
    xpGain: 300,
    eloChange: -15,
    result: "Loss",
    allies: [
      { profile: "Ali", kda: "5/10/8", efficacy: 0.6 },
      { profile: "Sharj", kda: "6/8/5", efficacy: 0.65 },
    ],
    enemies: [
      { profile: "Gregor", kda: "10/5/4", efficacy: 0.8 },
      { profile: "Jordan", kda: "9/4/6", efficacy: 0.75 },
    ],
  },
];

const Match = () => {
  const { matchID } = useParams();
  const navigate = useNavigate();
  const match = matches.find((m) => m.matchID === Number(matchID));

  if (!match) {
    return <div>Match not found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="text-4xl font-bold mb-4">Match Details</div>
      <div className="flex mb-4">
        <div className="flex-1">
          <div>Date Played: {match.datePlayed}</div>
          <div>Mode: {match.mode}</div>
          <div>Map: {match.map}</div>
        </div>
        <div className="flex-1 text-center">
          <button
            className="bg-blue-500 text-white rounded-lg px-4 py-2 mb-4"
            onClick={() => navigate(-1)}
          >
            Back to Profile
          </button>
        </div>
        <div className="flex-1 text-right">
          <div>XP Gain: {match.xpGain}</div>
          <div>ELO Change: {match.eloChange}</div>
          <div className={match.result === "Win" ? "text-green-500 font-bold" : "text-red-500 font-bold"}>
            Result: {match.result}
          </div>
        </div>
      </div>
      <div className="text-2xl font-bold mb-2">Allies</div>
      <div className="flex flex-col gap-4 mb-4">
        {match.allies.map((ally) => (
          <div
            key={ally.profile}
            className="p-4 border-2 border-green-500 rounded-lg shadow-md cursor-pointer flex justify-between"
            onClick={() => navigate(`/profile/${ally.profile}`)}
          >
            <div className="text-green-500 font-bold">{ally.profile}</div>
            <div>K/D/A: {ally.kda}</div>
            <div>Efficacy: {ally.efficacy}</div>
          </div>
        ))}
      </div>
      <div className="text-2xl font-bold mb-2">Enemies</div>
      <div className="flex flex-col gap-4">
        {match.enemies.map((enemy) => (
          <div
            key={enemy.profile}
            className="p-4 border-2 border-red-500 rounded-lg shadow-md cursor-pointer flex justify-between"
            onClick={() => navigate(`/profile/${enemy.profile}`)}
          >
            <div className="text-red-500 font-bold">{enemy.profile}</div>
            <div>K/D/A: {enemy.kda}</div>
            <div>Efficacy: {enemy.efficacy}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Match;

