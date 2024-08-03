import './App.css';
import NavBar from './components/NavBar.tsx';
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.tsx';
import Shop from './pages/Shop.tsx';
import InventoryGrid from './pages/InventoryGrid.tsx';
import Profile from './pages/Profile.tsx';
import Match from './pages/Match.tsx';
import Login from './pages/Login.tsx';

function App() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  return (
    <Router>
      <NavBar isLoggedIn={isLoggedIn} />
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/inventory" element={<InventoryGrid />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Home />} />
          <Route path='/match/:matchID' element={<Match />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
