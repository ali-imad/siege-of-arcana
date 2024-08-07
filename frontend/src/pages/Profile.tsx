import React, {useState, useEffect} from 'react';
import Select from "react-dropdown-select"
import axios from 'axios';
import {ToastContainer, toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import UpdateInfo from '../components/UpdateInfo';

import MatchSummaryWidget from "../components/MatchSummaryWidget";
import {Button} from 'react-bootstrap';
import {useParams} from "react-router-dom";

const Profile = () => {
  const { name } = useParams();
  const [userObj, setUserObj] = useState(JSON.parse(localStorage.getItem('user')));
  const [rank, setRank] = useState(null);
  const [level, setLevel] = useState(null);
  const [smurf, setSmurf] = useState(null);
  const [smurfWR, setSmurfWR] = useState(null);
  const [profileSelect, setProfileSelect] = useState('');
  const [outcome, setOutcome] = useState(null)
  const [showOutcomes, setShowOutcomes] = useState(false);
  const [options, setOptions] = useState([]);
  const [analysis, setAnalysis] = useState([])

  useEffect(() => {
    if (name) {
      const getUserObj = async (n) => {
        const url = `http://localhost:5151/api/user/name/${n}`;
        try {
          const response = await axios.get(url);
          setUserObj(response.data);
          console.log(response.data)
        } catch (error) {
          console.error('Error fetching user:', error);
          throw error;
        }
      }
      getUserObj(name);
    }
  }, []);


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

  const getPerformanceAnalysis = async (pid) => {
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
        const rankData = await getRank(userObj.elo);
        setRank(rankData);
      } catch (error) {
        console.error('Error setting rank:', error);
      }
    };

    const fetchLevel = async () => {
      try {
        const levelData = await getLevel(userObj.totalxp);
        setLevel(levelData);
      } catch (error) {
        console.error('Error setting level:', error);
      }
    };

    const fetchSmurf = async () => {
      try {
        const smurfData = await getSmurf(userObj.playerid);
        setSmurf(smurfData.isSmurf);
        setSmurfWR(smurfData.winRatio)
      } catch (error) {
        console.error('Error setting level:', error);
      }
    };

    fetchSmurf();
    fetchRank();
    fetchLevel();

  }, [userObj.elo, userObj.totalxp, userObj.playerid]);


  const ProgressBar = ({value, max, label}) => {
    const percentage = (value / max) * 100;


    return (
      <div className="w-full max-w-md">
        <div className="relative h-6 bg-gray-300 rounded-full overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-blue-600 rounded-full"
            style={{width: `${percentage}%`}}
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
        const outcomeData = await getTotalOutcomes(userObj.playerid);
        console.log(outcomeData);
        setOutcome(outcomeData)
        setShowOutcomes(true);
      } else if (options.find(o => profileSelect === o.label)) {
        const outcomeData = await getCertainOutcomes(userObj.playerid, profileSelect);
        console.log(outcomeData);
        setOutcome(outcomeData)
        setShowOutcomes(true);
      } else {
        console.log("please select an outcome from the dropdown")
        toast.error('Error purchasing item', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
        })
        setShowOutcomes(false);
      }
    } catch (error) {
      console.error('Error setting level:', error);
    }

  }

  const Outcome = (props: { index, outcome }) => {
    const {outcome, index} = props;

    return (<div key={index} className={'text-xl'}>
      <p className='inline font-bold text-soa-mauve'>{outcome.outcome}:</p><p
      className={'inline text-soa-dark'}> {outcome.count}</p>
    </div>)
  }

  const displayOutcomes = () => {
    if (profileSelect === 'All Outcomes') {
      console.log(options)
      return (
        <div className='flex space-x-4'>
          {outcome.map((item, index) => (
            <Outcome key={index} outcome={item}/>
          ))}
        </div>
      );
    } else if (options.find(o => profileSelect === o.label)) {
      return (
        <div>
          <Outcome key={outcome.outcome[0]} outcome={outcome}/>
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
        const optionData = await getTotalOutcomes(userObj.playerid);

        const transformedOptions = optionData.map((option, index) => ({
          value: index + 1,
          label: `${option.outcome}`
        }));

        transformedOptions.unshift({value: 0, label: 'All Outcomes'});

        setOptions(transformedOptions);
        console.log(transformedOptions);
      } catch (error) {
        console.error('Error setting options:', error);
      }
    };

    fetchOptions();
  }, [userObj.playerid]);

  const OutcomesComponent  = () => {

    const [selectedOption, setSelectedOption] = useState('');

    const handleChange = (selectedOption) => {
      setProfileSelect(selectedOption[0].label);
      setSelectedOption(selectedOption[0].label);
      console.log(selectedOption[0].label)
      setOutcome(null);
      setShowOutcomes(false);

    };

    return (
      <div className={"w-1/4 h-full overflow-y-auto flex flex-col"}>
        <h1 className='text-2xl font-bold text-soa-purple'>Outcomes:</h1>
        <Select
          value={selectedOption}
          onChange={handleChange}
          options={options}
        />
        {showOutcomes && displayOutcomes()}
        <Button className="bg-soa-accent text-white p-2 px-4 rounded-lg mt-auto mb-4"
                onClick={() => handleOutcomes()}>Search {profileSelect}</Button>
      </div>
    );
  };


  const SmurfLabel = () => {
    if (smurf) {
      return (<div className='flex flex-col w-1/2 h-full justify-start p-4'>
        <h1 className='text-2xl font-bold text-soa-mauve'>This player is a smurf</h1>
        <h2 className='text-sm font-bold text-soa-dark'>Win rate: {smurfWR * 100}%</h2>
      </div>)
    } else {
      return <></>
    }
  }

  const handlePerformance = async () => {
    const analysisData = await getPerformanceAnalysis(userObj.playerid);
    setAnalysis(analysisData)
    console.log(analysisData)
  }

  const AnalysisTable = ({analysis}) => {
    return (
      <div className="w-full space-y-4">
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
    <div className='container flex justify-between'>
      <div className='mx-8 p-4 bg-grey-100 flex flex-col justify-start'>
        <div className={'flex space-x-4 items-center justify-between'}>
          <div className={'flex flex-col w-1/3'}>
            <div className='text-4xl font-bold'>Profile</div>
            <div>{userObj.username}</div>
            {rank && <div>Rank: {rank}</div>}
            {level && <div>Level: {level}</div>}
            {/* <ProgressBar
      value={userObj.totalxp}
      max={level ? (level * 1000) + 1000 : 0}
      label={'level progress:'}/> */}
            <UpdateInfo/>
              <button className="w-full bg-soa-accent text-white p-1 px-2 rounded-lg mb-4"
                      onClick={() => handlePerformance()}>See
                Performance Analysis
              </button>
          </div>
          <SmurfLabel/>
          <OutcomesComponent/>
        </div>
        <AnalysisTable analysis={analysis}/>
        <ToastContainer/>
      </div>
      <MatchSummaryWidget playerID={userObj.playerid}/>
    </div>
  );
};

export default Profile;