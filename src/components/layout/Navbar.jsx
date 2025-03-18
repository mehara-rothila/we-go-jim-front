// src/components/layout/Navbar.jsx
import React from 'react';
import { Bell, Settings, Search, Dumbbell, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import ThemeToggle from '../ui/ThemeToggle';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const { theme } = useTheme();

  return (
    <header className={`fixed-navbar border-b transition-colors duration-200 ${
      theme === 'dark' 
        ? 'bg-dark-card border-dark-border text-text-light' 
        : 'bg-light-card border-light-border text-gray-800'
    }`}>
      <div className="h-full w-full px-4 md:px-8 flex items-center justify-between" style={{ maxWidth: '1600px', margin: '0 auto' }}>
        {/* Logo - Fixed size and positioning */}
        <Link to="/" className="flex items-center space-x-3 hover:opacity-90 transition-opacity" style={{ minWidth: '160px' }}>
          <div className={`rounded-lg p-2 ${
            theme === 'dark' ? 'bg-zinc-800' : 'bg-black'
          } transition-colors duration-200`} style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Dumbbell className="w-6 h-6 text-white" />
          </div>
          <span className={`font-bold text-xl ${
            theme === 'dark' ? 'text-text-light' : 'text-gray-900'
          } transition-colors duration-200 whitespace-nowrap`}>
            WE GO JIM
          </span>
        </Link>

        {/* Search and Actions - Fixed size containers */}
        <div className="flex items-center" style={{ minWidth: '300px', justifyContent: 'flex-end' }}>
          <div className="relative max-w-md w-64 hidden md:block mr-4">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
              theme === 'dark' ? 'text-text-muted' : 'text-gray-400'
            }`} />
            <input
              type="text"
              placeholder="Search..."
              className={`w-full pl-10 pr-4 py-2 rounded-lg text-sm border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 ${
                theme === 'dark' 
                  ? 'bg-dark-darker border-dark-border text-text-light placeholder-text-muted' 
                  : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
              }`}
            />
          </div>

          <div className="flex items-center space-x-3" style={{ minWidth: '100px' }}>
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Settings */}
            <button className={`p-2 rounded-full transition-colors duration-200 ${
              theme === 'dark' 
                ? 'hover:bg-dark-darker text-text-muted hover:text-text-light' 
                : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
            }`} style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Settings className="w-5 h-5" />
            </button>
            
            {/* User Profile */}
            <Link to="/profile" style={{ width: '36px', height: '36px' }}>
              <div className="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center text-white font-medium shadow-sm hover:shadow-md transition-shadow">
                {theme === 'dark' ? 'U' : 'U'}
              </div>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;