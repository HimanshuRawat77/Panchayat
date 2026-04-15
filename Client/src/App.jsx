import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import UserDashboard from './pages/UserDashboard';
import Profile from './pages/Profile';
import AboutPage from './pages/AboutPage';
import ComplaintPage from './pages/complaintPage';

const Features = () => <div className="min-h-screen flex items-center justify-center bg-slate-50 text-3xl font-bold text-slate-400">Features Page Coming Soon...</div>;

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/features" element={<Features />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/complaints" element={<ComplaintPage />} />
      </Routes>
    </Router>
  );
}

export default App;
