// src/components/stats/MetricCard.jsx
import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const MetricCard = ({ title, value, change, icon: Icon, tooltip, iconColor = 'zinc' }) => {
  const { theme } = useTheme();

  // Determine the color for change values
  const getChangeColor = (changeValue) => {
    if (!changeValue) return '';
    return changeValue.startsWith('+') ? 'text-emerald-500' : 'text-red-500';
  };
  
  // Dynamic color classes based on theme and iconColor prop
  const iconColorClass = {
    zinc: theme === 'dark' ? 'text-gray-400' : 'text-gray-500',
    black: theme === 'dark' ? 'text-gray-300' : 'text-gray-900',
    green: theme === 'dark' ? 'text-emerald-400' : 'text-emerald-500',
    orange: theme === 'dark' ? 'text-orange-400' : 'text-orange-500'
  };
  
  const iconBgClass = {
    zinc: theme === 'dark' ? 'bg-gray-400/10' : 'bg-gray-500/10',
    black: theme === 'dark' ? 'bg-gray-300/10' : 'bg-gray-900/10',
    green: theme === 'dark' ? 'bg-emerald-400/10' : 'bg-emerald-500/10',
    orange: theme === 'dark' ? 'bg-orange-400/10' : 'bg-orange-500/10'
  };
  
  return (
    <div className={`rounded-xl p-5 transition-all duration-200 hover:shadow-md ${
      theme === 'dark' 
        ? 'bg-dark-card border border-dark-border hover:border-gray-500/30' 
        : 'bg-light-card border border-light-border hover:border-gray-500/30'
    }`}>
      <div className="flex flex-col">
        <div className="flex items-center mb-3">
          <span className={`text-sm font-medium ${
            theme === 'dark' ? 'text-text-muted' : 'text-gray-500'
          }`}>{title}</span>
          <div className={`ml-auto p-2 rounded-full ${iconBgClass[iconColor]}`}>
            <Icon className={`w-4 h-4 ${iconColorClass[iconColor]}`} />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className={`text-2xl font-bold ${
            theme === 'dark' ? 'text-text-light' : 'text-gray-900'
          }`}>{value}</span>
          {change && (
            <span className={`text-xs font-medium ${getChangeColor(change)}`}>{change}</span>
          )}
        </div>
        {tooltip && (
          <span className={`text-xs mt-1 ${
            theme === 'dark' ? 'text-text-muted' : 'text-gray-500'
          }`}>{tooltip}</span>
        )}
      </div>
    </div>
  );
};

export default MetricCard;