import React from 'react';
import { motion as Motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Building2, Moon, Sun } from 'lucide-react';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-slate-200/70 bg-white/75 backdrop-blur-xl transition-colors duration-300 dark:border-slate-800/80 dark:bg-slate-950/75">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 md:py-4">
        <Motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45 }}
        >
          <Link
            to="/"
            className="group flex items-center gap-2.5 text-slate-900 transition dark:text-white"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/25 transition group-hover:shadow-lg group-hover:shadow-indigo-500/30">
              <Building2 className="h-[1.15rem] w-[1.15rem]" strokeWidth={2} />
            </span>
            <span className="text-lg font-bold tracking-tight">Panchayat</span>
          </Link>
        </Motion.div>

        <div className="flex items-center gap-1 sm:gap-2">
          <Link
            to="/about"
            className="hidden rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 sm:inline dark:text-slate-400 dark:hover:bg-slate-800/80 dark:hover:text-white"
          >
            About
          </Link>
          <a
            href="/#flow"
            className="hidden rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 sm:inline dark:text-slate-400 dark:hover:bg-slate-800/80 dark:hover:text-white"
          >
            Flow
          </a>
          <a
            href="/#pricing"
            className="hidden rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 sm:inline dark:text-slate-400 dark:hover:bg-slate-800/80 dark:hover:text-white"
          >
            Prices
          </a>


          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-xl border border-slate-200/90 bg-white/80 p-2.5 text-slate-600 transition hover:border-slate-300 hover:bg-white dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-800"
            aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            {theme === 'light' ? <Moon className="h-5 w-5" strokeWidth={2} /> : <Sun className="h-5 w-5" strokeWidth={2} />}
          </button>

          <div className="ml-1 flex items-center gap-2 border-l border-slate-200 pl-3 dark:border-slate-700 sm:ml-2 sm:pl-4">
            <Link to="/login">
              <span className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/80">
                Sign in
              </span>
            </Link>
            <Link to="/signup">
              <span className="inline-flex items-center rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition hover:shadow-lg hover:shadow-indigo-500/30">
                Sign up
              </span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
