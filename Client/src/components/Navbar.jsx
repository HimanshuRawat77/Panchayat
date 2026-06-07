import React from 'react';
import { motion as Motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Moon, Sun } from 'lucide-react';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();

  let user = null;
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) user = JSON.parse(userStr);
  } catch (e) {
    // Ignore error
  }

  return (
    <Motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 z-50 w-full border-b border-slate-200/70 bg-white/80 backdrop-blur-xl transition-colors duration-300 dark:border-[#6B4F3A]/20 dark:bg-[#151210]/90"
    >
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-4 py-4 md:px-12">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <img src="/Panchayat.png" alt="Panchayat" className="h-8 w-8 rounded-lg" />
          <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-[#F5F1EA]">Panchayat</span>
        </Link>

        {/* Center Nav */}
        <div className="hidden items-center gap-8 md:flex">
          <a href="/#features" className="text-sm font-medium text-slate-600 transition-colors duration-200 hover:text-slate-900 dark:text-[#B8AEA3] dark:hover:text-[#F5F1EA]">Solutions</a>
          <a href="/#stats" className="text-sm font-medium text-slate-600 transition-colors duration-200 hover:text-slate-900 dark:text-[#B8AEA3] dark:hover:text-[#F5F1EA]">Communities</a>
          <a href="/#pricing" className="text-sm font-medium text-slate-600 transition-colors duration-200 hover:text-slate-900 dark:text-[#B8AEA3] dark:hover:text-[#F5F1EA]">Pricing</a>
          <Link to="/about" className="text-sm font-medium text-slate-600 transition-colors duration-200 hover:text-slate-900 dark:text-[#B8AEA3] dark:hover:text-[#F5F1EA]">About</Link>
        </div>
        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 transition-all hover:border-slate-300 hover:bg-slate-50 dark:border-[#6B4F3A]/30 dark:bg-[#221C18] dark:text-[#B8AEA3] dark:hover:border-[#C8A45D]/40 dark:hover:text-[#F5F1EA]"
            aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            {theme === 'light' ? <Moon className="h-4 w-4" strokeWidth={2} /> : <Sun className="h-4 w-4" strokeWidth={2} />}
          </button>

          {user ? (
            <Link to="/dashboard" className="rounded-lg bg-[#C8A45D] px-5 py-2.5 text-sm font-semibold text-[#151210] shadow-md shadow-[#C8A45D]/20 transition-all duration-200 hover:bg-[#E0C27A] hover:shadow-lg hover:shadow-[#C8A45D]/30">
              Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="hidden text-sm font-medium text-slate-600 transition-colors duration-200 hover:text-slate-900 dark:text-[#B8AEA3] dark:hover:text-[#F5F1EA] sm:inline">
                Log in
              </Link>
              <Link to="/signup" className="rounded-lg bg-[#C8A45D] px-5 py-2.5 text-sm font-semibold text-[#151210] shadow-md shadow-[#C8A45D]/20 transition-all duration-200 hover:bg-[#E0C27A] hover:shadow-lg hover:shadow-[#C8A45D]/30">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </Motion.nav>
  );
};

export default Navbar;
