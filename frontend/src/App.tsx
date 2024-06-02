import React from 'react';
import logo from './logo.svg';
import './App.css';
import HomePage from './components/pages/home/HomePage';
import TheoryPage from './components/pages/theory/TheoryPage';

import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import ConstructorPage from './components/pages/constructor/ConstructorPage';
import LoginPage from './components/pages/login/LoginPage';
import Profile from './components/pages/profile/Profile';
import AdminPage from './components/pages/admin/AdminPanel';
import PracticePage from './components/pages/practice/PracticePage';
import MainMenu from './components/navigation/Menu';
import { AuthProvider } from './context/AuthContext';
import RegisterPage from './components/pages/reg/RegisterPage';
import PrivateRoute from './routes/PrivateRoute';
import PublicRoute from './routes/PublicRoute';

function RedirectToHome() {
  let navigate = useNavigate();
  useEffect(() => {
    navigate('/home');
  }, [navigate]);

  return null;
}

function App() {
  return (
    <div className="App bg-warning-subtle">
      <AuthProvider>
        <Router>
          <MainMenu />
          <Routes>
            <Route path="/home" element={<HomePage title='math trainer' />} />
            <Route path="/" element={<RedirectToHome />} />
            <Route path="/constructor" element={<ConstructorPage />} />
            <Route path="/login" element={<PublicRoute component={LoginPage} />} />
            <Route path="/register" element={<PublicRoute component={RegisterPage} />} />
            <Route path="/logout" element={<PrivateRoute component={LoginPage} />} />
            <Route path="/profile" element={<PrivateRoute component={Profile} />} />
            <Route path="/admin" element={<PrivateRoute component={AdminPage} />} />
            <Route path="/theory" element={<PrivateRoute component={TheoryPage} />} />
            <Route path="/exercices" element={<PrivateRoute component={PracticePage} />} />
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
