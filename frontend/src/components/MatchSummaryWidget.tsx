import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

import axios from 'axios';


const getPlayerMatches = async (playerID: number): Promise<Match[]> => {
  try {
    const response = await axios.get(`http://localhost:5151/api/match/${playerID}`);
    if (Array.isArray(response.data)) {
      return response.data;
    } else {
      console.error('Unexpected response data format:', response.data);
      return [];
    }
  } catch (error) {
    console.error('Error fetching player matches:', error);
    return [];
  }
};

const getUnplayedGameModes = async (playerID: number): Promise<string[]> => {
  try {
    const response = await axios.get(`http://localhost:5151/api/match/unplayedmode/${playerID}`);
    if (Array.isArray(response.data)) {
      return response.data;
    } else {
      console.error('Unexpected response data format:', response.data);
      return [];
    }
  } catch (error) {
    console.error('Error fetching unplayed game modes:', error);
    return [];
  }
};

interface Match {
  matchid: number;
  outcome: string;
  map: string;
  mode: string;
  dateplayed: string;
  xpgain: number;
  kills: string;
  deaths: string;
  assists: string;
}

interface MatchSummaryWidgetProps {
  playerID: number | null;
}

const MatchSummaryWidget: React.FC<MatchSummaryWidgetProps> = ({ playerID }) => {
  const navigate = useNavigate();
  const [matches, setMatches] = useState<Match[]>([]);
  const [unplayedModes, setUnplayedModes] = useState<string[]>([]);

  useEffect(() => {
    const fetchMatchesAndModes = async () => {
      const playerMatches = await getPlayerMatches(playerID);
      setMatches(playerMatches);

      const modes = await getUnplayedGameModes(playerID);
      setUnplayedModes(modes);
    };

    if (playerID) {
      fetchMatchesAndModes();
    }
  }, [playerID]);

  return (
    <div className="mx-8 mt-4 bg-white border-2 border-gray-200 rounded-lg shadow-md w-1/2 h-full overflow-y-auto p-4">
      <div className="text-2xl font-bold mb-4">Match Summary</div>

      {unplayedModes.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Unplayed Game Modes</h2>
          <ul className="list-disc pl-5">
            {unplayedModes.map((mode, index) => (
              <li key={index} className="text-gray-700">{mode}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex-1 overflow-y-auto pb-8">
        {matches.map((match) => (
          <div
            key={match.matchid}
            className="p-4 border-b border-gray-300 cursor-pointer hover:bg-gray-100 flex items-center"
            onClick={() => navigate(`/match/${match.matchid}`)}
          >
            <div className="flex-1">
              <div className={match.outcome === "Win" ? "text-green-500 font-bold" : "text-red-500 font-bold"}>
                {match.outcome}
              </div>
              <div>Map: {match.map}</div>
              <div>Mode: {match.mode}</div>
            </div>
            <div className="flex-1 text-center">
              K/D/A: {match.kills}/{match.deaths}/{match.assists}
            </div>
            <div className="flex-1 text-right">
              <div>Date Played: {match.dateplayed}</div>
              <div>XP Gain: {match.xpgain}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MatchSummaryWidget;