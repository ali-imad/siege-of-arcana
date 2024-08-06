import React, { useState, useEffect } from 'react';
import Select from "react-dropdown-select"
import axios from 'axios';

import UpdateInfo from '../components/UpdateInfo';

import MatchSummaryWidget from "../components/MatchSummaryWidget";
import { Button } from 'react-bootstrap';

const matches = [
  { matchID: 1, result: "Win", map: "Dust II", mode: "Deathmatch", datePlayed: "2024-07-01", xpGain: 500, kda: "10/5/8" },
  { matchID: 2, result: "Loss", map: "Mirage", mode: "Competitive", datePlayed: "2024-07-02", xpGain: 300, kda: "8/10/4" },
  { matchID: 3, result: "Win", map: "Dust II", mode: "Deathmatch", datePlayed: "2024-07-01", xpGain: 500, kda: "10/5/8" },
  { matchID: 4, result: "Loss", map: "Mirage", mode: "Competitive", datePlayed: "2024-07-02", xpGain: 300, kda: "8/10/4" },
  { matchID: 5, result: "Win", map: "Dust II", mode: "Deathmatch", datePlayed: "2024-07-01", xpGain: 500, kda: "10/5/8" },
  { matchID: 6, result: "Loss", map: "Mirage", mode: "Competitive", datePlayed: "2024-07-02", xpGain: 300, kda: "8/10/4" },
  { matchID: 6, result: "Loss", map: "Mirage", mode: "Competitive", datePlayed: "2024-07-02", xpGain: 300, kda: "8/10/4" },
];

const Profile = () => {
  const user = localStorage.getItem('user');
  const userJSON = JSON.parse(user);
  const [rank, setRank] = useState(null);
  const [level, setLevel] = useState(null);
  const [smurf, setSmurf] = useState(null);
  const [smurfWR, setSmurfWR] = useState(null);
  const [profileSelect, setProfileSelect] = useState('');
  const [outcome, setOutcome] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [showOutcomes, setShowOutcomes] = useState(false);


  const getRank = async (elo) => {
    const url = `http://localhost:5001/api/user/name/${elo}`;
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching rank:', error);
      throw error;
    }
  };

  const getLevel = async (totalXP) => {
    const url = `http://localhost:5001/api/user/profile/${totalXP}`;
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching level:', error);
      throw error;
    }
  };

  const getSmurf = async (pid) => {
    const url = `http://localhost:5001/api/match/smurfdetect/${pid}`;
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching level:', error);
      throw error;
    }
  };

  const getTotalOutcomes = async (pid) => {
    const url = `http://localhost:5001/api/match/outcome/${pid}`;
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching level:', error);
      throw error;
    }
  };

  const getCertainOutcomes = async (pid, outcome) => {
    const url = `http://localhost:5001/api/match/outcome/${pid}/${outcome}`;
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching level:', error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchRank = async () => {
      try {
        const rankData = await getRank(userJSON.elo);
        setRank(rankData);
      } catch (error) {
        console.error('Error setting rank:', error);
      }
    };

    const fetchLevel = async () => {
      try {
        const levelData = await getLevel(userJSON.totalxp);
        setLevel(levelData);
      } catch (error) {
        console.error('Error setting level:', error);
      }
    };

    const fetchSmurf = async () => {
      try {
        const smurfData = await getSmurf(userJSON.playerid);
        setSmurf(smurfData.isSmurf);
        setSmurfWR(smurfData.winRatio)
      } catch (error) {
        console.error('Error setting level:', error);
      }
    };
    
    fetchSmurf();
    fetchRank();
    fetchLevel();

  }, [userJSON.elo, userJSON.totalxp, userJSON.playerid]);




const ProgressBar = ({ value, max, label }) => {
  const percentage = (value / max) * 100;


  return (
    <div className="w-full max-w-md">
      <div className="relative h-6 bg-gray-300 rounded-full overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full bg-blue-600 rounded-full"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className="mt-1 text-sm text-gray-600">
        {label} {value}/{max}
      </div>
    </div>
  );
};

const handleOutcomes = async () => {

    try {
      if (profileSelect === 'Wins and Losses') {
        const outcomeData = await getTotalOutcomes(userJSON.playerid);
        console.log(outcomeData);
        setOutcome(outcomeData)
        setShowOutcomes(true);
      } else if (profileSelect === "Wins") {
        const outcomeData = await getCertainOutcomes(userJSON.playerid, 'Win');
        console.log(outcomeData);
        setOutcome(outcomeData)
        setShowOutcomes(true);
      } else if (profileSelect === "Losses"){
        const outcomeData = await getCertainOutcomes(userJSON.playerid, 'Loss');
        console.log(outcomeData);
        setOutcome(outcomeData)
        setShowOutcomes(true);
      } else {
        console.log("no outcome selected yet")
        setErrorMessage('please select an outcome from the dropdown')
        setShowOutcomes(false);
      }
    } catch (error) {
      console.error('Error setting level:', error);
    }

}
const displayOutcomes = () => {

  if (profileSelect === 'Wins and Losses') {
    return (
      <div>
        {outcome.map((item, index) => (
          <div key={index}>
            <br></br>
            <p>Outcome: {item.outcome}</p>
            <p>Count: {item.count}</p>
            <br></br>
          </div>
        ))}
      </div>
    );
  } else if (profileSelect === "Wins") {
    return (
      <div>
        <br></br>
          <p>Outcome: {outcome.outcome}</p>
          <p>Count: </p>
        </div>
      )
  } else if (profileSelect === "Losses"){
    return (
      <div>
        <br></br>
          <p>Outcome: {outcome.outcome}</p>
          <p>Count: {outcome.count}</p>
        </div>
      )
  } else {
    console.log("no outcome selected yet")
    setErrorMessage('please select an outcome from the dropdown')
  }

}


const options = [
  { value: 1, label: 'Wins and Losses' },
  { value: 2, label: 'Wins' },
  { value: 3, label: 'Losses' }
];

const SelectComponent = () => {

  const [selectedOption, setSelectedOption] = useState('');

  const handleChange = (selectedOption) => {
    setProfileSelect(selectedOption[0].label);
    setSelectedOption(selectedOption[0].label);
    console.log(selectedOption[0].label)
    setErrorMessage('')
    setOutcome(null);
    setShowOutcomes(false);
    
  };

  return (
    <div className={"fixed w-1/4 h-full overflow-y-auto p-4"}>
      <h1>Outcomes:</h1>
      <Select
        value={selectedOption}
        onChange={handleChange}
        options={options}
      />
      <br></br>
      <Button className="bg-soa-accent text-white p-2 px-4 rounded-lg"
      onClick={() => handleOutcomes()}>Search {profileSelect}</Button>
      <br></br>
      {showOutcomes && displayOutcomes()}
      {errorMessage}
    </div>
  );
};


const SmurfLabel = () => {
  if (smurf) {
    return (<><h1 className='text-4xl font-bold'>SMURF DETECTED</h1><h2> Win Ratio : {smurfWR}</h2></>)
  } else {
    return <h2>Win Ratio : {smurfWR}</h2>
  }
}


  return (
    <div className='container mx-auto p-4 bg-grey-100'>
      <div className='text-4xl font-bold'>Profile</div>
      <MatchSummaryWidget matches={matches} />

      <div>{userJSON.username}</div>
      {rank && <div>Rank: {rank}</div>}
      {level && <div>Level: {level}</div>}
      <ProgressBar
      value={userJSON.totalxp}
      max={level ? (level * 1000) + 1000 : 0}
      label={'level progress:'}/>
      <UpdateInfo></UpdateInfo>
      <SmurfLabel></SmurfLabel>
      <br></br>
      <SelectComponent></SelectComponent>
      </div>
  );
};

export default Profile;