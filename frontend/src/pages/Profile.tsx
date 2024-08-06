import React, { useState, useEffect } from 'react';
import Select from "react-dropdown-select"
import axios from 'axios';

import UpdateInfo from '../components/UpdateInfo';

import MatchSummaryWidget from "../components/MatchSummaryWidget";
import { Button } from 'react-bootstrap';

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
  const [options, setOptions] = useState([]);
  const [analysis, setAnalysis] = useState([])


  const getRank = async (elo) => {
    const url = `http://localhost:5151/api/user/name/${elo}`;
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching rank:', error);
      throw error;
    }
  };

  const getLevel = async (totalXP) => {
    const url = `http://localhost:5151/api/user/profile/${totalXP}`;
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching level:', error);
      throw error;
    }
  };

  const getSmurf = async (pid) => {
    const url = `http://localhost:5151/api/match/smurfdetect/${pid}`;
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching level:', error);
      throw error;
    }
  };

  const getTotalOutcomes = async (pid) => {
    const url = `http://localhost:5151/api/match/outcome/${pid}`;
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching level:', error);
      throw error;
    }
  };

  const getCertainOutcomes = async (pid, outcome) => {
    const url = `http://localhost:5151/api/match/outcome/${pid}/${outcome}`;
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching level:', error);
      throw error;
    }
  };

  const getPerformanceAnlysis = async (pid) => {
    const url = `http://localhost:5151/api/user/performance/${pid}`;
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching analysis:', error);
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
      if (profileSelect === 'All Outcomes') {
        const outcomeData = await getTotalOutcomes(userJSON.playerid);
        console.log(outcomeData);
        setOutcome(outcomeData)
        setShowOutcomes(true);
      } else if (options.find(o => profileSelect === o.label)) {
        const outcomeData = await getCertainOutcomes(userJSON.playerid, profileSelect);
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
  if (profileSelect === 'All Outcomes') {
    console.log(options)
    return (
      <div>
        {outcome.map((item, index) => (
          <div key={index}>
            <p>Outcome: {item.outcome} Count: {item.count}</p>
          </div>
        ))}
      </div>
    );
  } else if (options.find(o => profileSelect === o.label)) {
    return (
      <div>
        <br></br>
        <p>Outcome: {outcome.outcome} Count: {outcome.count}</p>
        <br></br>
      </div>
    );
  } else {
      return (
        <div>
          <p>No outcome data available for the selected profile.</p>
        </div>
      );
    }
  };



useEffect(() => {
  const fetchOptions = async () => {
    try {
      const optionData = await getTotalOutcomes(userJSON.playerid);
      
      const transformedOptions = optionData.map((option, index) => ({
        value: index + 1,
        label: `${option.outcome}`
      }));

      transformedOptions.unshift({ value: 0, label: 'All Outcomes' });

      setOptions(transformedOptions);
      console.log(transformedOptions);
    } catch (error) {
      console.error('Error setting options:', error);
    }
  };

  fetchOptions();
}, [userJSON.playerid]);

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

const handlePerformance = async () => {
  const analysisData = await getPerformanceAnlysis(userJSON.playerid);
  setAnalysis(analysisData)
  console.log(analysisData)
}

const AnalysisTable = ({ analysis }) => {
  return (
    <div className="w-1/2 ml-0 mx-auto overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border-b">Mode</th>
            <th className="px-4 py-2 border-b">Avg Player Kills</th>
            <th className="px-4 py-2 border-b">Avg Player Deaths</th>
            <th className="px-4 py-2 border-b">Avg Player Assists</th>
            <th className="px-4 py-2 border-b">Avg Overall Kills</th>
            <th className="px-4 py-2 border-b">Avg Overall Deaths</th>
            <th className="px-4 py-2 border-b">Avg Overall Assists</th>
          </tr>
        </thead>
        <tbody>
          {analysis.map((item, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
              <td className="px-4 py-2 border-b">{item.mode}</td>
              <td className="px-4 py-2 border-b">{parseFloat(item.avg_player_kills).toFixed(2)}</td>
              <td className="px-4 py-2 border-b">{parseFloat(item.avg_player_deaths).toFixed(2)}</td>
              <td className="px-4 py-2 border-b">{parseFloat(item.avg_player_assists).toFixed(2)}</td>
              <td className="px-4 py-2 border-b">{parseFloat(item.avg_overall_kills).toFixed(2)}</td>
              <td className="px-4 py-2 border-b">{parseFloat(item.avg_overall_deaths).toFixed(2)}</td>
              <td className="px-4 py-2 border-b">{parseFloat(item.avg_overall_assists).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


  return (
    <div className='container mx-auto p-4 bg-grey-100'>
      <div className='text-4xl font-bold'>Profile</div>
      <MatchSummaryWidget playerID={JSON.parse(localStorage.getItem('user')).playerid} />
      <div>{userJSON.username}</div>
      {rank && <div>Rank: {rank}</div>}
      {level && <div>Level: {level}</div>}
      <ProgressBar
      value={userJSON.totalxp}
      max={level ? (level * 1000) + 1000 : 0}
      label={'level progress:'}/>
      <UpdateInfo></UpdateInfo>
      <SmurfLabel></SmurfLabel>
      <button className="bg-soa-accent text-white p-1 px-2 rounded-lg" onClick={() => handlePerformance()}>See Performance Analysis</button>
      <AnalysisTable analysis={analysis}></AnalysisTable>
      <SelectComponent></SelectComponent>
      </div>
  );
};

export default Profile;