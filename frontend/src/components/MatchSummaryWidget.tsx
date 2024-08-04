import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const getPlayerMatches = async (playerID: number): Promise<Match[]> => {
  try {
    const response = await axios.get(`/api/matches?playerID=${playerID}`);
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
  matchID: number;
  result: string;
  map: string;
  mode: string;
  datePlayed: string;
  xpGain: number;
  kda: string;
}

interface MatchSummaryWidgetCols {
  playerID: 1;
}

const MatchSummaryWidget: React.FC<MatchSummaryWidgetCols> = ({ playerID }) => {
  const navigate = useNavigate();
  const [matches, setMatches] = useState<Match[]>([]);
  const [hiddenCols, setHiddenCols] = useState<string[]>([]);

  useEffect(() => {
    const fetchMatches = async () => {
      const playerMatches = await getPlayerMatches(playerID);
      setMatches(playerMatches);
    };

    fetchMatches();
  }, [playerID]);

  const handleCheckboxChange = (cols: string) => {
    setHiddenCols((prevHiddenCols) =>
      prevHiddenCols.includes(cols)
        ? prevHiddenCols.filter((p) => p !== cols)
        : [...prevHiddenCols, cols]
    );
  };

  return (
    <div className="bg-white border-2 border-gray-200 rounded-lg shadow-md fixed right-0 top-16 w-1/4 h-full overflow-y-auto p-4">
      <div className="text-2xl font-bold mb-4">Match Summary</div>
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="datePlayed"
            checked={!hiddenCols.includes("datePlayed")}
            onChange={() => handleCheckboxChange("datePlayed")}
          />
          <label htmlFor="datePlayed" className="ml-2">Date Played</label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="mode"
            checked={!hiddenCols.includes("mode")}
            onChange={() => handleCheckboxChange("mode")}
          />
          <label htmlFor="mode" className="ml-2">Mode</label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="map"
            checked={!hiddenCols.includes("map")}
            onChange={() => handleCheckboxChange("map")}
          />
          <label htmlFor="map" className="ml-2">Map</label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="xpGain"
            checked={!hiddenCols.includes("xpGain")}
            onChange={() => handleCheckboxChange("xpGain")}
          />
          <label htmlFor="xpGain" className="ml-2">XP Gain</label>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto pb-8">
        {matches.map((match) => (
          <div
            key={match.matchID}
            className="p-4 border-b border-gray-300 cursor-pointer hover:bg-gray-100 flex items-center"
            onClick={() => navigate(`/match/${match.matchID}`)}
          >
            <div className="flex-1">
              <div className={match.result === "Win" ? "text-green-500 font-bold" : "text-red-500 font-bold"}>
                {match.result}
              </div>
              {!hiddenCols.includes("map") && <div>Map: {match.map}</div>}
              {!hiddenCols.includes("mode") && <div>Mode: {match.mode}</div>}
            </div>
            <div className="flex-1 text-center">
              K/D/A: {match.kda}
            </div>
            <div className="flex-1 text-right">
              {!hiddenCols.includes("datePlayed") && <div>Date Played: {match.datePlayed}</div>}
              {!hiddenCols.includes("xpGain") && <div>XP Gain: {match.xpGain}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MatchSummaryWidget;