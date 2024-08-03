import MatchSummaryWidget from "../components/MatchSummaryWidget";

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
  return (
    <div className='container mx-auto p-4'>
      <div className='text-4xl font-bold'>Profile</div>
      This is a player profile page
      <MatchSummaryWidget matches={matches} />
    </div>

  );
};

export default Profile;
