// src/components/layout/Sidebar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Dumbbell, Library, LineChart, User, LogOut } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const { theme } = useTheme();
  const { logout } = useAuth();
  
  const navigation = [
    { name: 'Dashboard', icon: Home, path: '/' },
    { name: 'Workouts', icon: Dumbbell, path: '/workouts' },
    { name: 'Exercises', icon: Library, path: '/exercises' },
    { name: 'Stats', icon: LineChart, path: '/stats' },
  ];

  return (
    <aside className={`fixed-sidebar transition-colors duration-200 border-r hidden sm:block ${
      theme === 'dark' 
        ? 'bg-dark-card border-dark-border' 
        : 'bg-light-card border-light-border'
    }`}>
      <div className="h-full flex flex-col overflow-y-auto" style={{ paddingBottom: '16px' }}>
        <nav className="flex-1 px-3 py-4">
          {navigation.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-4 py-3 my-1 text-sm font-medium rounded-xl transition-all duration-200 ${
                  isActive 
                    ? theme === 'dark'
                      ? 'bg-zinc-800/80 border border-zinc-700 text-white'
                      : 'bg-black text-white'
                    : theme === 'dark'
                      ? 'text-text-muted hover:bg-dark-darker hover:text-text-light'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
                style={{ height: '46px', display: 'flex', alignItems: 'center' }}
              >
                <item.icon className={`w-5 h-5 mr-3 ${
                  isActive 
                    ? 'text-white'
                    : theme === 'dark' ? 'text-text-muted' : 'text-gray-500'
                }`} />
                <span className="whitespace-nowrap">{item.name}</span>
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 mt-auto">
          <div className={`border-t pt-4 ${
            theme === 'dark' ? 'border-dark-border' : 'border-light-border'
          }`}>
            <Link 
              to="/profile"
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                theme === 'dark'
                  ? 'text-text-muted hover:bg-dark-darker hover:text-text-light'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
              style={{ height: '46px', display: 'flex', alignItems: 'center' }}
            >
              <User className="w-5 h-5 mr-3" />
              <span className="whitespace-nowrap">Profile</span>
            </Link>
            
            <button 
              onClick={logout}
              className={`w-full flex items-center px-4 py-3 mt-2 text-sm font-medium rounded-xl transition-all duration-200 ${
                theme === 'dark'
                  ? 'text-red-400 hover:bg-red-900/20 hover:border-red-900/30'
                  : 'text-red-600 hover:bg-red-50'
              }`}
              style={{ height: '46px', display: 'flex', alignItems: 'center' }}
            >
              <LogOut className="w-5 h-5 mr-3" />
              <span className="whitespace-nowrap">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;