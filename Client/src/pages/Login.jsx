import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import Navbar from '../Components/Navbar';

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Login successful!');
        
        // Store token and user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        setTimeout(() => navigate('/dashboard'), 1500);
      } else {
        toast.error(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      toast.error('Network Error. Please check if the server is running.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFF] dark:bg-slate-950 selection:bg-blue-100 dark:selection:bg-blue-900 transition-colors duration-300 overflow-hidden relative">
      <Toaster position="top-center" />
      <Navbar />
      
      {/* Decorative Background for dark mode */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 dark:bg-blue-600/10 blur-[100px] rounded-full -z-10 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 dark:bg-purple-600/10 blur-[100px] rounded-full -z-10 animate-pulse"></div>

      <div className="pt-32 pb-20 px-4 flex items-center justify-center min-h-[90vh]">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md bg-white dark:bg-slate-900/50 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-2xl shadow-blue-500/5 dark:shadow-blue-900/10 border border-slate-100 dark:border-slate-800 relative overflow-hidden"
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">Welcome Back</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Log in to manage your society matters</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 relative">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 dark:text-slate-500 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white font-medium focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-all"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Password</label>
                <a href="#" className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">Forgot Password?</a>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 dark:text-slate-500 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white font-medium focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-all"
                  placeholder="••••••••••"
                  required
                />
              </div>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className={`w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-500/20 dark:shadow-blue-900/30 hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2 group ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              type="submit"
            >
              {loading ? 'Signing In...' : 'Sign In'} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>

          </form>

          <p className="mt-10 text-center text-slate-500 dark:text-slate-400 font-medium tracking-tight">
            Don't have an account? <Link to="/signup" className="text-blue-600 dark:text-blue-400 font-black hover:text-blue-700 dark:hover:text-blue-300 hover:underline transition-all">Sign Up Free</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
