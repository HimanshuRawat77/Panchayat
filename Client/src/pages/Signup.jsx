import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Phone, Mail, Lock, Home, Grid, Flag, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import Navbar from '../Components/Navbar';
import API_BASE_URL from '../config';


const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    password: '',
    role: 'resident',
    houseNumber: '',
    block: '',
    nationality: 'Indian'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || 'Registration successful!');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        toast.error(data.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      toast.error('Network Error. Please check if the server is running.');
      console.error('Signup error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFF] dark:bg-slate-950 selection:bg-blue-100 dark:selection:bg-blue-900 transition-colors duration-300 overflow-hidden relative">
      <Toaster position="top-center" reverseOrder={false} />
      <Navbar />
      
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/10 dark:bg-purple-600/10 blur-[100px] rounded-full -z-10 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 dark:bg-blue-600/10 blur-[100px] rounded-full -z-10 animate-pulse transition-all"></div>

      <div className="pt-32 pb-20 px-4 flex items-center justify-center min-h-screen">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-2xl bg-white dark:bg-slate-900/50 backdrop-blur-xl p-10 md:p-14 rounded-[3rem] shadow-2xl shadow-blue-500/5 dark:shadow-blue-900/10 border border-slate-100 dark:border-slate-800 relative overflow-hidden"
        >
          <div className="text-center mb-10">
            <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Create Account</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">Join your smart society community today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8 relative">
            <div className="grid md:grid-cols-2 gap-6">

              {/* Full Name */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Full Name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 dark:text-slate-500 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors">
                    <User className="w-5 h-5" />
                  </div>
                  <input 
                    name="fullName"
                    type="text" 
                    value={formData.fullName}
                    onChange={handleChange}
                    className="block w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white font-medium focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-all"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Phone Number</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 dark:text-slate-500 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors">
                    <Phone className="w-5 h-5" />
                  </div>
                  <input 
                    name="phoneNumber"
                    type="tel" 
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="block w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white font-medium focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-all"
                    placeholder="+91 98765 43210"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 dark:text-slate-500 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input 
                    name="email"
                    type="email" 
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white font-medium focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-all"
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 dark:text-slate-500 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input 
                    name="password"
                    type="password" 
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white font-medium focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-all"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {/* House */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">House Number</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 dark:text-slate-500 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors">
                    <Home className="w-5 h-5" />
                  </div>
                  <input 
                    name="houseNumber"
                    type="text" 
                    value={formData.houseNumber}
                    onChange={handleChange}
                    className="block w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white font-medium focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-all"
                    placeholder="E-402"
                    required
                  />
                </div>
              </div>

              {/* Block */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Block / Wing</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 dark:text-slate-500 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors">
                    <Grid className="w-5 h-5" />
                  </div>
                  <input 
                    name="block"
                    type="text" 
                    value={formData.block}
                    onChange={handleChange}
                    className="block w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white font-medium focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-all"
                    placeholder="Block A"
                    required
                  />
                </div>
              </div>

              {/* Nationality */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Nationality</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 dark:text-slate-500 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors">
                    <Flag className="w-5 h-5" />
                  </div>
                  <select 
                    name="nationality"
                    value={formData.nationality}
                    onChange={handleChange}
                    className="block w-full pl-12 pr-10 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white font-medium focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 outline-none appearance-none transition-all"
                    required
                  >
                    <option value="Indian">Indian</option>
                    <option value="Non-Resident">Non-Resident Indian (NRI)</option>
                    <option value="Other">Other</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Role */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Role</label>
                <div className="relative group">
                  <select 
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="block w-full pl-4 pr-10 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white font-medium focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 outline-none appearance-none transition-all"
                    required
                  >
                    <option value="resident">Resident</option>
                    <option value="admin">Admin</option>
                  </select>

                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

            </div>

            <motion.button 
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className={`w-full py-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-2xl font-black text-xl shadow-2xl shadow-blue-500/20 dark:shadow-blue-900/30 hover:shadow-blue-500/40 transition-all flex items-center justify-center gap-3 group mt-4 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              type="submit"
            >
              {loading ? 'Creating Account...' : 'Create Account'} <ArrowRight className="w-6 h-6 group-hover:translate-x-1.5 transition-transform" />
            </motion.button>
          </form>

          <p className="mt-12 text-center text-slate-500 dark:text-slate-400 font-medium tracking-tight">
            Already have an account? <Link to="/login" className="text-blue-600 dark:text-blue-400 font-black hover:text-blue-700 dark:hover:text-blue-300 hover:underline transition-all">Sign In</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;