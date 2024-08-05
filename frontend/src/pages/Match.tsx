import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';

interface Player {
  profile: string;
  kda: string | null;
  efficacy: number | null;
}

interface MatchView {
  matchID: number;
  dateplayed: string | null;
  mode: string | null;
  map: string | null;
  allies: Player[];
  enemies: Player[];
}

const Match: React.FC = () => {
  const { matchID } = useParams<{ matchID: string }>();
  const navigate = useNavigate();
  const [match, setMatch] = useState<MatchView | null>(null);

  useEffect(() => {
    const fetchMatchDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5151/api/match/view/${matchID}`);
        setMatch(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching match details:', error);
      }
    };

    fetchMatchDetails();
  }, [matchID]);

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5151/api/match/delete/${matchID}`);
      navigate(-1);
    } catch (error) {
      console.error('Error deleting match:', error);
    }
  };

  if (!match) {
    return <div>Match not found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="text-4xl font-bold mb-4">Match Details</div>
      <div className="flex mb-4">
        <div className="flex-1">
          {match.dateplayed && <div>Date Played: {match.dateplayed}</div>}
          {match.mode && <div>Mode: {match.mode}</div>}
          {match.map && <div>Map: {match.map}</div>}
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
          <button
            className="bg-red-500 text-white rounded-lg px-4 py-2 mb-4"
            onClick={handleDelete}
          >
            Delete Match
          </button>
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
            {ally.kda && <div>K/D/A: {ally.kda}</div>}
            {ally.efficacy !== null && <div>Efficacy: {ally.efficacy}</div>}
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
            {enemy.kda && <div>K/D/A: {enemy.kda}</div>}
            {enemy.efficacy !== null && <div>Efficacy: {enemy.efficacy}</div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Match;
