import React from 'react';
import logo from './logo.svg';
import './App.css';
import HomePage from './pages/home/HomePage';
import TheoryPage from './pages/theory/TheoryPage';

import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import MainMenu from './components/navigation/Menu';
import TrainerPage from './pages/trainer/TrainerPage';
import Constructor from './pages/interact/Constructor';
import Login from './pages/login/Login';
import Profile from './pages/account/Profile';

function RedirectToHome() {
  let navigate = useNavigate();
  useEffect(() => {
    navigate('/home');
  }, [navigate]);

  return null; // Возвращает ничего, пока происходит перенаправление
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
          <Route path="/login" element={<Login></Login>} />
          <Route path="/profile" element={<Profile></Profile>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
