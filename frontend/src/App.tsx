import './App.css';
import NavBar from './components/NavBar.tsx';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home.tsx';
import Shop from './pages/Shop.tsx';
import InventoryGrid from './pages/InventoryGrid.tsx';
import Profile from './pages/Profile.tsx';
import Match from './pages/Match.tsx';
import Login from './pages/Login.tsx';
import AuthScreen from './pages/AuthScreen.tsx';
import LoginForm from './pages/LoginForm.tsx';
import RegisterForm from './pages/RegisterForm.tsx';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(localStorage.getItem('user') !== null);

  useEffect(() => {
    const checkLoginStatus = () => {
      const user = localStorage.getItem('user');
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();
    window.addEventListener('storage', checkLoginStatus);

    return () => {
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <NavBar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <div>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/shop' element={isLoggedIn ? <Shop /> : <Navigate to="/login" />} />
          <Route path='/inventory' element={isLoggedIn ? <InventoryGrid /> : <Navigate to="/login" />} />
          <Route path='/profile' element={isLoggedIn ? <Profile /> : <Navigate to="/login" />} />
          <Route path='/profile/:name' element={isLoggedIn ? <Profile /> : <Navigate to="/login" />} />
          <Route path='/login' element={isLoggedIn ? <Navigate to="/profile" /> : <Login onLogin={handleLogin} />} />
          <Route path="/logout" element={<Home />} />
          <Route path='/match/:matchID' element={<Match />} />
          <Route path='/auth' element={<AuthScreen />} />
          <Route path='/lform' element={<LoginForm onLogin={handleLogin} />} />
          <Route path='/rform' element={<RegisterForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;