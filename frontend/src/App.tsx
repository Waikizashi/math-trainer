import React from 'react';
import logo from './logo.svg';
import './App.css';
import HomePage from './components/pages/home/HomePage';
import TheoryPage from './components/pages/theory/TheoryPage';

import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import MainMenu from './components/navigation/Menu';
import TrainerPage from './components/pages/trainer/TrainerPage';
import Constructor from './components/pages/constructor/Constructor';
import LoginPage from './components/pages/login/LoginPage';
import Profile from './components/pages/profile/Profile';

function RedirectToHome() {
  let navigate = useNavigate();
  useEffect(() => {
    navigate('/home');
  }, [navigate]);

  return null;
}

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/home" element={<HomePage title='math trainer'></HomePage>} />
          <Route path="/" element={<RedirectToHome />} />
          <Route path="/theory" element={<TheoryPage></TheoryPage>} />
          <Route path="/exercices" element={<TrainerPage></TrainerPage>} />
          <Route path="/constructor" element={<Constructor></Constructor>} />
          <Route path="/login" element={<LoginPage></LoginPage>} />
          <Route path="/profile" element={<Profile></Profile>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
