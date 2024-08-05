import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

import axios from 'axios';

//TODO: Get this to properly route from the properPlayer.
const getPlayerMatches = async (playerID: number): Promise<Match[]> => {
  try {
    const response = await axios.get(`http://localhost:5151/api/match/1`);
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

interface MatchSummaryWidgetCols {
  playerID: 1;
}

const MatchSummaryWidget: React.FC<MatchSummaryWidgetCols> = ({ playerID }) => {
  const navigate = useNavigate();
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    const fetchMatches = async () => {
      const playerMatches = await getPlayerMatches(playerID);
      setMatches(playerMatches);
    };

    fetchMatches();
  }, [playerID]);

  return (
    <div className="bg-white border-2 border-gray-200 rounded-lg shadow-md fixed right-0 top-16 w-1/2 h-full overflow-y-auto p-4">
      <div className="text-2xl font-bold mb-4">Match Summary</div>
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