// src/components/layout/Navbar.jsx
import React from 'react';
import { Bell, Settings, Search, Dumbbell, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const Navbar = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="h-16 border-b sticky top-0 z-10 bg-light-card dark:bg-dark-card border-light-border dark:border-dark-border transition-colors duration-200">
      <div className="h-full px-8 flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="rounded-lg p-2 bg-black dark:bg-white transition-colors duration-200">
            <Dumbbell className="w-6 h-6 text-white dark:text-dark-bg" />
          </div>
          <span className="font-bold text-xl text-gray-900 dark:text-text-light transition-colors duration-200">
            WE GO JIM
          </span>
        </div>

        {/* Search and Actions */}
        <div className="flex items-center space-x-6">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 rounded-lg text-sm border bg-light-card dark:bg-dark-card border-light-border dark:border-dark-border text-gray-900 dark:text-text-light transition-colors duration-200"
            />
          </div>

          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme} 
            className="p-2 rounded-lg hover:bg-light-card dark:hover:bg-dark-darker text-gray-600 dark:text-text-muted transition-colors duration-200"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <button className="p-2 rounded-lg hover:bg-light-card dark:hover:bg-dark-darker transition-colors duration-200">
            <Settings className="w-5 h-5 text-gray-600 dark:text-text-muted" />
          </button>
          
          <button className="flex items-center space-x-2 hover:bg-light-card dark:hover:bg-dark-darker rounded-lg p-1.5 transition-colors duration-200">
            <div className="w-8 h-8 rounded-full bg-text-link flex items-center justify-center text-white font-medium">
              J
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;