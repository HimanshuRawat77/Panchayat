import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import UserDashboard from './pages/UserDashboard';
import Profile from './pages/Profile';
import AboutPage from './pages/AboutPage';
import ComplaintPage from './pages/complaintPage';
import Community from './pages/Community';
import Analytics from './pages/Analytics';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';

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
        <Route path="/community" element={<Community />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin-users" element={<AdminUsers />} />
      </Routes>
    </Router>
  );
}

export default App;
