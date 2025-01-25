// src/components/layout/Sidebar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Dumbbell, Library, LineChart, User } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const Sidebar = () => {
  const location = useLocation();
  const { isDark } = useTheme();
  
  const navigation = [
    { name: 'Dashboard', icon: Home, path: '/' },
    { name: 'Workouts', icon: Dumbbell, path: '/workouts' },
    { name: 'Exercises', icon: Library, path: '/exercises' },
    { name: 'Stats', icon: LineChart, path: '/stats' },
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-light-card dark:bg-dark-darker border-r border-light-border dark:border-dark-border transition-colors duration-200">
      <nav className="mt-20 px-3">
        {navigation.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center px-3 py-2.5 my-1 text-sm font-medium rounded-lg transition-all ${
                isActive 
                  ? 'bg-dark-darker dark:bg-black text-text-light'
                  : 'text-gray-600 dark:text-text-muted hover:bg-light-card dark:hover:bg-dark-card'
              }`}
            >
              <item.icon className={`w-5 h-5 mr-3 ${
                isActive ? 'text-text-light' : 'text-gray-600 dark:text-text-muted'
              }`} />
              {item.name}
            </Link>
          );
        })}
      </nav>
      
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="border-t border-light-border dark:border-dark-border pt-4">
          <Link 
            to="/profile"
            className="flex items-center px-3 py-2.5 text-sm text-gray-600 dark:text-text-muted hover:bg-light-card dark:hover:bg-dark-card rounded-lg transition-colors duration-200"
          >
            <User className="w-5 h-5 mr-3" />
            Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;