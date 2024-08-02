import './App.css';
import NavBar from './components/NavBar.tsx';
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.tsx';
import Shop from './pages/Shop.tsx';
import Inventory from './pages/Inventory.tsx';
import Profile from './pages/Profile.tsx';
import Login from './pages/Login.tsx';

function App() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  return (
    <Router>
      <NavBar isLoggedIn={isLoggedIn} />
      <div>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/shop' element={<Shop />} />
          <Route path='/inventory' element={<Inventory />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/login' element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
